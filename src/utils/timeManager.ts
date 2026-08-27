import { format, isSameDay, parse } from "date-fns";

import { WEEK_DAYS } from "@/constants/other";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";

type ConstructorArgs = {
  slots?: TTimeSlot[];
  slotsAlreadyUsed?: TTimeSlot[];
  services?: TService[];
};

export class TimeManager {
  readonly SLOTS: TTimeSlot[];
  readonly SLOTS_ALREADY_USED: TTimeSlot[];
  readonly SERVICES: TService[];
  readonly SLOT_DURATION_IN_MINUTES = 15;

  constructor({
    slots = TIME_SLOTS,
    slotsAlreadyUsed = [],
    services = [],
  }: ConstructorArgs = {}) {
    this.SLOTS = slots;
    this.SLOTS_ALREADY_USED = slotsAlreadyUsed;
    this.SERVICES = services;
  }

  getDefaultSlots = () => this.SLOTS;

  getSlotsInRange = (from: number, to: number) => {
    if (from > to) return [];

    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
  };

  getFullSlotsInRange = (from: number, to: number) =>
    this.SLOTS.filter((slot) => slot.slot >= from && slot.slot <= to);

  getFullSlots = (slots: number[]): TTimeSlot[] => {
    const slotIds = new Set(slots);

    return this.SLOTS.filter((slot) => slotIds.has(slot.slot)).sort(
      (left, right) => left.slot - right.slot
    );
  };

  getFullSlotsFromArr = (slots: number[]) => this.getFullSlots(slots);

  /**
   * Shift workingSlots/breakSlots contain the end boundary as their last item.
   * Booking.slots do not: every booking slot is an occupied 15-minute interval.
   */
  getIntervalSlots = (rangeSlots: number[]) => {
    const sortedSlots = Array.from(new Set(rangeSlots)).sort(
      (left, right) => left - right
    );

    return sortedSlots.length > 1 ? sortedSlots.slice(0, -1) : [];
  };

  getBreakIntervalSlots = (breakSlots: number[]) => this.getIntervalSlots(breakSlots);

  getServicesDuration = (options: TServiceOption[]) =>
    options.reduce((duration, option) => duration + option.duration, 0);

  getSlotsCountForServices = (services: TServiceAndSelectedOption[]) =>
    Math.ceil(
      services.reduce(
        (duration, service) => duration + service.selectedOption.duration,
        0
      ) / this.SLOT_DURATION_IN_MINUTES
    );

  getFreeSlots = (slots: number[]) => {
    const numberSlots = slots.filter((slot) => !this.isAlreadyUsed(slot));

    return {
      fullSlots: this.getFullSlots(numberSlots),
      numberSlots,
    };
  };

  isAlreadyUsed = (slot: number) =>
    this.SLOTS_ALREADY_USED.some((usedSlot) => usedSlot.slot === slot);

  getAlreadyUsedSlotsInBookings<ReturnFullSlots extends boolean = false>({
    bookings,
    date,
    staffId,
    returnFullSlots,
  }: {
    bookings: TBooking[] | TBookingMin[] | TApiBooking[] | TApiBookingMin[];
    date: Date;
    staffId?: TSpecialist["id"];
    returnFullSlots?: ReturnFullSlots;
  }): ReturnFullSlots extends true ? TTimeSlot[] : number[] {
    const filteredBookings = bookings.filter((booking) => {
      if (!isSameDay(parse(booking.date, "yyyy-MM-dd", new Date()), date)) {
        return false;
      }

      if (!staffId) return true;

      const specialist = booking.specialist as unknown as {
        id?: string | number;
        _id?: string | number;
      };
      return String(specialist.id ?? specialist._id) === String(staffId);
    });

    const slots = Array.from(
      new Set(filteredBookings.flatMap((booking) => booking.slots))
    ).sort((left, right) => left - right);

    if (returnFullSlots) {
      return this.getFullSlots(slots) as ReturnFullSlots extends true
        ? TTimeSlot[]
        : number[];
    }

    return slots as ReturnFullSlots extends true ? TTimeSlot[] : number[];
  }

  getAvailableStartSlots({
    workingSlots,
    breakSlots = [],
    busySlots = [],
    slotsNeeded,
  }: {
    workingSlots: number[];
    breakSlots?: number[];
    busySlots?: number[];
    slotsNeeded: number;
  }) {
    const workingIntervals = this.getIntervalSlots(workingSlots);
    const unavailableSlots = new Set([
      ...this.getBreakIntervalSlots(breakSlots),
      ...busySlots,
    ]);
    const availableSlots = new Set(
      workingIntervals.filter((slot) => !unavailableSlots.has(slot))
    );
    const normalizedSlotsNeeded = Math.max(1, Math.ceil(slotsNeeded));

    return workingIntervals.filter((startSlot) =>
      Array.from(
        { length: normalizedSlotsNeeded },
        (_, offset) => startSlot + offset
      ).every((slot) => availableSlots.has(slot))
    );
  }

  getAvailableSlotsForService(
    allSlots: number[],
    usedSlots: number[],
    slotsNeeded: number
  ) {
    const unavailableSlots = new Set(usedSlots);
    const availableSlots = new Set(
      allSlots.filter((slot) => !unavailableSlots.has(slot))
    );
    const normalizedSlotsNeeded = Math.max(1, Math.ceil(slotsNeeded));

    return allSlots.filter((startSlot) =>
      Array.from(
        { length: normalizedSlotsNeeded },
        (_, offset) => startSlot + offset
      ).every((slot) => availableSlots.has(slot))
    );
  }

  getSlotsFromCompanyWorkRange = (
    date: Date,
    workingSchedule: TCompany["workingSchedule"]
  ) => {
    const weekDay = format(date, "EEEE") as WorkingScheduleWeekDays;
    return this.getFullSlots(workingSchedule[weekDay]?.workingSlots ?? []);
  };

  getWorkingTimeSlotsCompany = (workingSchedule: TCompany["workingSchedule"]) => {
    const daySchedule = Object.values(workingSchedule).find(
      ({ workingSlots }) => workingSlots.length > 0
    );

    return this.getFullSlots(daySchedule?.workingSlots ?? []);
  };

  getTimeBreakSlotCompany = (workingSchedule: TCompany["workingSchedule"]) => {
    const daySchedule = Object.values(workingSchedule).find(
      ({ breakSlots }) => breakSlots.length > 0
    );

    return this.SLOTS.find((slot) => slot.slot === daySchedule?.breakSlots[0]);
  };

  getTimeBreakSlotCompanyV2 = (workingSchedule: TCompany["workingSchedule"]) => {
    const daySchedule = Object.values(workingSchedule).find(
      ({ breakSlots }) => breakSlots.length > 0
    );

    return this.getFullSlots(daySchedule?.breakSlots ?? []);
  };

  getWorkingTimeSlotsForAllWeekDaysCompany = (
    workingSchedule: TCompany["workingSchedule"]
  ) =>
    Object.fromEntries(
      Object.entries(workingSchedule).map(([day, schedule]) => [
        day,
        {
          slots: this.getFullSlots(schedule.workingSlots),
          break: this.getFullSlots(schedule.breakSlots),
        },
      ])
    ) as Record<WorkingScheduleWeekDays, { slots: TTimeSlot[]; break: TTimeSlot[] }>;

  getCompanyWorkingScheduleSlotsByWeekDay = ({
    workingSchedule,
    date,
  }: {
    workingSchedule: TCompany["workingSchedule"];
    date: Date;
  }) => {
    const weekDay = format(date, "EEEE") as WorkingScheduleWeekDays;
    const schedule = workingSchedule[weekDay];

    if (!schedule) return null;

    return {
      slots: this.getFullSlots(schedule.workingSlots),
      breaks: this.getFullSlots(schedule.breakSlots),
    };
  };

  getWorkingScheduleSlotsByWeekDay = ({
    workingSchedule,
    date,
  }: {
    workingSchedule: WorkingSchedule;
    date: Date;
  }) => {
    const weekDay = format(date, "EEEE") as keyof WorkingSchedule;
    const schedule = workingSchedule[weekDay];

    if (!schedule) return null;

    return {
      slots: this.getFullSlots(schedule.slots),
      breaks: this.getFullSlots(schedule.breaks),
    };
  };

  getWorkingScheduleTimeBreakSlots = (workingSchedule: TCompany["workingSchedule"]) => {
    const daySchedule = Object.values(workingSchedule).find(
      ({ breakSlots }) => breakSlots.length > 0
    );

    return this.getFullSlots(daySchedule?.breakSlots ?? []);
  };

  getWorkingScheduleFirstWeekDaySlots = (workingSchedule: WorkingSchedule) => {
    const firstWorkingDay = Object.values(workingSchedule).find(
      ({ slots }) => slots.length > 0
    );

    return {
      workings: this.getFullSlots(firstWorkingDay?.slots ?? []),
      breaks: this.getFullSlots(firstWorkingDay?.breaks ?? []),
    };
  };

  createWorkingScheduleFromSlots = ({
    workingDays,
    slots,
    breaks,
  }: {
    workingDays: (typeof WEEK_DAYS)[number]["id"][];
    slots: number[];
    breaks: number[];
  }): WorkingSchedule =>
    Object.fromEntries(
      WEEK_DAYS.map((day) => [
        day.id,
        {
          slots: workingDays.includes(day.id) ? slots : [],
          breaks: workingDays.includes(day.id) ? breaks : [],
        },
      ])
    ) as WorkingSchedule;

  getWorkingScheduleWithFromAndToPropertys = (workingSchedule: WorkingSchedule) =>
    Object.fromEntries(
      Object.entries(workingSchedule).map(([day, schedule]) => [
        day,
        {
          slots: {
            from: this.SLOTS.find((slot) => slot.slot === schedule.slots[0]),
            to: this.SLOTS.find(
              (slot) => slot.slot === schedule.slots[schedule.slots.length - 1]
            ),
          },
          breaks: {
            from: this.SLOTS.find((slot) => slot.slot === schedule.breaks[0]),
            to: this.SLOTS.find(
              (slot) => slot.slot === schedule.breaks[schedule.breaks.length - 1]
            ),
          },
        },
      ])
    ) as WorkingScheduleWithTimeSlots;

  isNotEnoughTimeForNextSlot = ({
    options,
    slot,
  }: {
    options: TServiceOption[];
    slot: number;
  }) => {
    const slotsNeeded = Math.ceil(
      this.getServicesDuration(options) / this.SLOT_DURATION_IN_MINUTES
    );
    const firstNextUsedSlot = this.SLOTS_ALREADY_USED.find(
      (usedSlot) => usedSlot.slot > slot
    );

    return firstNextUsedSlot ? firstNextUsedSlot.slot - slot < slotsNeeded : false;
  };

  isNotEnoughTime = ({
    options,
    slot,
    staffShift,
  }: {
    options: TServiceOption[];
    slot: number;
    staffShift: { name: string; slots: number[] };
    slotsInWorkRange: TTimeSlot[];
  }) => {
    const slotsNeeded = Math.ceil(
      this.getServicesDuration(options) / this.SLOT_DURATION_IN_MINUTES
    );
    const availableWorkingSlots = new Set(this.getIntervalSlots(staffShift.slots));

    return !Array.from({ length: slotsNeeded }, (_, offset) => slot + offset).every(
      (requiredSlot) => availableWorkingSlots.has(requiredSlot)
    );
  };

  isNotInShiftRange = (slot: number, staffShift: { name: string; slots: number[] }) =>
    !this.getIntervalSlots(staffShift.slots).includes(slot);

  getDoubledSlotsV2 = ({
    options,
    shift,
    staffBookingsUsedSlots,
    duration,
  }: {
    options: TServiceOption[];
    shift: { name: string; slots: number[]; breaks: number[] };
    staffBookingsUsedSlots: number[];
    duration: number;
  }) => {
    const durationMinutes = duration || this.getServicesDuration(options);
    const slotsNeeded = Math.ceil(durationMinutes / this.SLOT_DURATION_IN_MINUTES);
    const constructorBusySlots = this.SLOTS_ALREADY_USED.map((slot) => slot.slot);
    const startSlots = this.getAvailableStartSlots({
      workingSlots: shift.slots,
      breakSlots: shift.breaks,
      busySlots: [...constructorBusySlots, ...staffBookingsUsedSlots],
      slotsNeeded,
    });

    return startSlots
      .map((startSlot) => {
        const start = this.SLOTS.find((slot) => slot.slot === startSlot);
        const end = this.SLOTS.find((slot) => slot.slot === startSlot + slotsNeeded);

        return start && end ? [start, end] : null;
      })
      .filter((range): range is [TTimeSlot, TTimeSlot] => Boolean(range));
  };
}
