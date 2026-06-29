import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { format } from "date-fns";
import { TimeManager } from "./timeManager";

type ConstructorArgs = {
  slots?: TTimeSlot[];
  slotsAlreadyUsed?: TTimeSlot[];
  services?: TService[];
};

export class TimeSlotsManager {
  SLOTS: TTimeSlot[];
  SLOTS_ALREADY_USED: TTimeSlot[];
  SERVICES: TService[] = [];

  constructor(
    args: ConstructorArgs = {
      slots: TIME_SLOTS,
      slotsAlreadyUsed: [],
      services: [],
    }
  ) {
    this.SLOTS = args.slots || TIME_SLOTS;
    this.SERVICES = args.services || [];
    this.SLOTS_ALREADY_USED = args.slotsAlreadyUsed || [];
  }

  getDefaultSlots = () => {
    return this.SLOTS;
  };

  getFreeSlots = (slots: number[]) => {
    const freeSlots = slots.filter((s) => !this.isAlreadyUsed(s));

    return {
      fullSlots: freeSlots.map((s) => this.SLOTS.find((sl) => sl.slot === s)!),
      numberSlots: freeSlots,
    };
  };

  getServicesDuration = (options: TServiceOption[]) => {
    return options.reduce((acc, c) => (acc += c.duration), 0);
  };

  getSlotsInRange = (a: number, b: number) => {
    const arr: number[] = [];

    for (let i = a; i <= b; i++) {
      arr.push(i);
    }

    return arr;
  };

  getFullSlotsInRange = (a: number, b: number) => {
    return this.SLOTS.filter((s) => s.slot >= a && s.slot <= b);
  };

  getSlotsFromCompanyWorkRange = (
    date: Date,
    workingSchedule: TCompany["working_schedule"]
  ): TTimeSlot[] => {
    const weekDay = format(date, "EEEE") as keyof TCompany["working_schedule"];

    let slots: TTimeSlot[] = [];

    workingSchedule[weekDay].times.forEach((time) => {
      const [start, end] = time.split("-");
      const startSlot = TIME_SLOTS.find((s) => s.label === start);
      const endSlot = TIME_SLOTS.find((s) => s.label === end);

      if (startSlot && endSlot) {
        const rangeSlots = TIME_SLOTS.filter(
          (s) => s.slot >= startSlot.slot && s.slot <= endSlot.slot
        );
        slots = [...slots, ...rangeSlots];
      }
    });

    return slots.sort((a, b) => a.slot - b.slot);
  };

  getWorkingTimeSlotsCompany = (
    workingSchedule: TCompany["working_schedule"]
  ): TTimeSlot[] => {
    const weekDayS = Object.keys(workingSchedule);

    let slots: TTimeSlot[] = [];

    for (let i = 0; i < weekDayS.length; i++) {
      const weekDay = weekDayS[i] as keyof TCompany["working_schedule"];

      if (workingSchedule[weekDay].times) {
        workingSchedule[weekDay].times.forEach((time) => {
          const [start, end] = time.split("-");
          const startSlot = TIME_SLOTS.find((s) => s.label === start);
          const endSlot = TIME_SLOTS.find((s) => s.label === end);

          if (startSlot && endSlot) {
            const rangeSlots = TIME_SLOTS.filter(
              (s) => s.slot >= startSlot.slot && s.slot <= endSlot.slot
            );
            slots = [...slots, ...rangeSlots];
          }
        });

        if (slots.length) {
          break;
        }
      }
    }

    return slots.sort((a, b) => a.slot - b.slot);
  };

  getTimeBreakSlotCompany = (workingSchedule: TCompany["working_schedule"]) => {
    const weekDayS = Object.keys(workingSchedule);

    let slot: TTimeSlot | undefined = undefined;

    for (let i = 0; i < weekDayS.length; i++) {
      const weekDay = weekDayS[i] as keyof TCompany["working_schedule"];

      if (workingSchedule[weekDay].breaks.length) {
        const breakStr = workingSchedule[weekDay].breaks[0];

        const fromTime = breakStr.split("-")[0] || "";
        const fromHour = fromTime.split(":")[0] || "";
        const fromMin = fromTime.split(":")[1] || "";

        slot = this.SLOTS.find(
          (s) => s.hour === Number(fromHour) && s.minute === Number(fromMin)
        );

        if (slot) {
          break;
        }
      }
    }

    return slot;
  };

  getTimeBreakSlotCompanyV2 = (workingSchedule: TCompany["working_schedule"]) => {
    const weekDayS = Object.keys(workingSchedule);

    let slots: TTimeSlot[] = [];

    for (let i = 0; i < weekDayS.length; i++) {
      const weekDay = weekDayS[i] as keyof TCompany["working_schedule"];

      if (workingSchedule[weekDay].breaks.length) {
        const breakStr = workingSchedule[weekDay].breaks[0];

        const [start, end] = breakStr.split("-");
        const startSlot = TIME_SLOTS.find((s) => s.label === start);
        const endSlot = TIME_SLOTS.find((s) => s.label === end);

        if (startSlot && endSlot) {
          const rangeSlots = TIME_SLOTS.filter(
            (s) => s.slot >= startSlot.slot && s.slot <= endSlot.slot
          );
          slots = [...rangeSlots];
        }
      }
    }

    return slots;
  };

  isNotEnoughTimeForNextSlot = ({options, slot}:{
    options: TServiceOption[]
    slot: number
  }) => {
    const needSlots = this.getServicesDuration(options) / 15;
    const firstNextUsedSlot = this.SLOTS_ALREADY_USED.find((s) => s.slot > slot);

    if (!firstNextUsedSlot) {
      return false;
    }

    return firstNextUsedSlot.slot - slot <= needSlots - 1;
  };

  isNotEnoughTime = ({options, slot, slotsInWorkRange, staffShift}: {options: TServiceOption[], slot: number, staffShift: {name: string, slots: number[]}, slotsInWorkRange: TTimeSlot[]}) => {
    const countSlots = this.getServicesDuration(options) / 15;

    if (staffShift.name === "FULL_DAY") {
      const lastSlots = slotsInWorkRange
        .slice(slotsInWorkRange.length - countSlots, slotsInWorkRange.length)
        .map((s) => s.slot);

      return lastSlots.includes(slot);
    }

    const lastSlots = staffShift.slots.slice(
      staffShift.slots.length - countSlots,
      staffShift.slots.length
    );

    return lastSlots.includes(slot);
  };

  isNotInShiftRange = (slot: number, staffShift: {name: string, slots: number[]}) => {
    if (staffShift.name === "FULL_DAY") {
      return false;
    }

    return !staffShift.slots.find((sl) => sl === slot);
  };

  isAlreadyUsed = (slot: number) => {
    return !!this.SLOTS_ALREADY_USED.find((s) => s.slot === slot);
  };

  getDoubledSlots = (
    slots: TTimeSlot[],
    shift: {name: string, slots: number[], breaks: number[]},
    durationStep: number = 30,
    bookings: TBooking[]
  ) => {
    const slotsForStart: number[] = [];
    const slotsForEnd: number[] = [];
    let freeSlots = [...shift.slots];

    bookings.forEach((b) => {
      const start = b.slots[0];
      const end = b.slots.at(-1) as number;

      freeSlots = freeSlots.filter((s) => !b.slots.includes(s));
      slotsForStart.push(end);
      slotsForEnd.push(start);
    });

    freeSlots = [...freeSlots, ...slotsForStart, ...slotsForEnd].sort((a, b) => a - b);

    const DURATION_STEP = Math.ceil(durationStep / 15);
    const BREAK_SLOT = shift.breaks;
    const doubleSlots: [TTimeSlot, TTimeSlot][] = [];


    // const filteredSlots = slots.sort((a, b) => a.slot - b.slot);
    // const slotsForStart = filteredSlots;
    // // .filter(
    // //   (s) => s.slot !== BREAK_SLOT && s.slot !== BREAK_SLOT + 1
    // // );
    // const slotsForEnd = [...filteredSlots]
    //   // .filter((s) => s.slot !== BREAK_SLOT + 1 && s.slot !== BREAK_SLOT + 2)
    //   .sort((a, b) => a.slot - b.slot);

    // for (let i = 0; i < filteredSlots.length; i = i + 1) {
    //   const f = slotsForStart[i];
    //   const l = slotsForEnd[i + DURATION_STEP];

    //   if (f && l) {
    //     if (START_BREAK_SLOTS.includes(f.slot)) {
    //       continue;
    //     }

    //     if (END_BREAK_SLOTS.includes(l.slot)) {
    //       continue;
    //     }

    //     if (f.slot <= START_BREAK_SLOTS[4] && l.slot >= END_BREAK_SLOTS[1]) {
    //       continue;
    //     }

    //     doubleSlots.push([f, l]);
    //   }
    // }

    return doubleSlots;
  };

  getDoubledSlotsV2 = ({
    options,
    shift,
    staffBookingsUsedSlots,
    duration = 30,
  }: {
    options: TServiceOption[]
    shift: {name: string, slots: number[], breaks: number[]};
    staffBookingsUsedSlots: number[];
    duration: number;
  }) => {
    const DURATION_STEP = Math.ceil(duration / 15);
    const BREAK_SLOTS = shift.breaks.slice(0, -1);

    const slots = shift.slots.map((slot) => TIME_SLOTS.find((ts) => ts.slot === slot)!);

    const res = slots
      .filter((s) => s.minute === 0 || s.minute === 30)
      .filter((sl) => !staffBookingsUsedSlots.includes(sl.slot))
      .filter((sl) => !this.isNotEnoughTimeForNextSlot({options, slot: sl.slot}))
      .filter((sl) => !this.isNotEnoughTime({options, slot: sl.slot, staffShift:shift, slotsInWorkRange:slots}))
      .map((sl) => {
        const end = TIME_SLOTS.find((s) => s.slot === sl.slot + DURATION_STEP);

        if (end) {
          return [sl, end];
        }
      })
      .filter((i) => {
        if (i) {
          const start = i[0];
          const end = i[1];

          if (
            BREAK_SLOTS.includes(start.slot)
          ) {
            return false;
          }

          return true;
        }

        return false;
      });

    return res as {
      slot: number;
      hour: number;
      minute: number;
      label: string;
    }[][];
  };
}
