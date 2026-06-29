import { WEEK_DAYS } from "@/constants/other";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { format, isSameDay, parse } from "date-fns";

type ConstructorArgs = {
  slots?: TTimeSlot[];
  slotsAlreadyUsed?: TTimeSlot[];
  services?: TService[];
};

export class TimeManager {
  SLOTS: TTimeSlot[];
  SLOTS_ALREADY_USED: TTimeSlot[];
  SERVICES: TService[] = [];
  SLOT_DURATION_IN_MINUTS = 15;

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

  getFullSlotsFromArr = (slots: number[]): TTimeSlot[] => {
    return this.SLOTS.filter((s) => slots.includes(s.slot));
  };

  getSlotsCountForServices(services: TServiceAndSelectedOption[]) {
    return services.reduce<number>(
      (acc, service) =>
        (acc += service.selectedOption.duration / this.SLOT_DURATION_IN_MINUTS),
      0
    );
  }

  /**
   * Возвращает список временных слотов, которые уже заняты в указанный день для конкретного сотрудника.
   *
   * @param {Object} params - Параметры функции.
   * @param {TBooking[]} params.bookings - Массив бронирований, в которых нужно искать занятые слоты.
   * @param {Date} params.date - Дата, для которой проверяются занятые слоты.
   * @param {TSpecialist["id"]} params.staffId - Идентификатор сотрудника. Если не указан, возвращаются слоты для всех сотрудников.
   *
   * @returns {Array} Массив временных слотов, которые уже заняты в указанный день.
   */
  getAlreadyUsedSlotsInBookings<ReturnFullSlots extends boolean = false>({
    bookings,
    date,
    staffId,
    returnFullSlots,
  }: {
    bookings: TBooking[] | TBookingMin[];
    date: Date;
    staffId?: TSpecialist["id"];
    returnFullSlots?: ReturnFullSlots;
  }): ReturnFullSlots extends true ? TTimeSlot[] : number[] {
    let filteredBookings = bookings.filter((b) =>
      isSameDay(parse(b.date, "yyyy-MM-dd", new Date()), date)
    );

    if (staffId) {
      filteredBookings = filteredBookings.filter((b) => b.specialist._id === staffId);
    }

    const slots = filteredBookings
      .reduce<number[]>((acc, b) => {
        const arr = [...b.slots.slice(0, -1)];
        return [...acc, ...arr];
      }, [])
      .sort((a, b) => a - b);

    if (returnFullSlots) {
      return this.getFullSlotsFromArr(slots) as ReturnFullSlots extends true
        ? TTimeSlot[]
        : number[];
    }

    return slots as ReturnFullSlots extends true ? TTimeSlot[] : number[];
  }

  /**
   * Get free slots for srvice
   * @param allSlots - Staff free slots
   * @param usedSlots - Already used slots
   * @param needSlotsCount - Slots count for service
   * @return Slots can select for service
   */
  getAvailableSlotsForService(
    allSlots: number[],
    usedSlots: number[],
    needSlotsCount: number
  ): number[] {
    // const dailyBreaksWithoutLastSlot = usedSlots.slice(0, -1)
    // Фильтруем свободные слоты, исключая перерывы
    const availableSlots = allSlots.filter((slot) => !usedSlots.includes(slot));

    // Массив для хранения подходящих слотов
    const suitableSlots: number[] = [];

    // Проверяем каждый слот на возможность начала услуги
    for (let i = 0; i <= availableSlots.length - needSlotsCount; i++) {
      const startSlot = availableSlots[i];
      let isSuitable = true;

      // Проверяем, есть ли достаточно последовательных слотов
      for (let j = 1; j < needSlotsCount; j++) {
        if (availableSlots[i + j] !== startSlot + j) {
          isSuitable = false;
          break;
        }
      }

      // Если слоты подходят, добавляем начальный слот в результат
      if (isSuitable) {
        suitableSlots.push(startSlot);
      }
    }

    return suitableSlots;
  }

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

  getWorkingTimeSlotsForAllWeekDaysCompany = (
    workingSchedule: TCompany["working_schedule"]
  ) => {
    const weekDayS = Object.keys(workingSchedule) as WorkingScheduleWeekDaysArr;

    const obj: Record<
      string,
      {
        slots: TTimeSlot[];
        break: TTimeSlot[];
      }
    > = Object.fromEntries(
      weekDayS.map((d) => [
        d,
        {
          slots: [],
          break: [],
        },
      ])
    );

    for (let i = 0; i < weekDayS.length; i++) {
      const weekDay = weekDayS[i];

      if (workingSchedule[weekDay].times) {
        workingSchedule[weekDay].times.forEach((time) => {
          const [start, end] = time.split("-");
          const startSlot = TIME_SLOTS.find((s) => s.label === start);
          const endSlot = TIME_SLOTS.find((s) => s.label === end);

          if (startSlot && endSlot) {
            const rangeSlots = this.getFullSlotsInRange(startSlot.slot, endSlot.slot);

            obj[weekDay] = {
              ...obj[weekDay],
              slots: [...obj[weekDay].slots, ...rangeSlots].sort((a, b) => a.slot - b.slot),
            };
          }
        });
      }

      if (workingSchedule[weekDay].breaks) {
        workingSchedule[weekDay].breaks.forEach((time) => {
          const [start, end] = time.split("-");
          const startSlot = TIME_SLOTS.find((s) => s.label === start);
          const endSlot = TIME_SLOTS.find((s) => s.label === end);

          if (startSlot && endSlot) {
            const rangeSlots = this.getFullSlotsInRange(startSlot.slot, endSlot.slot);

            obj[weekDay] = {
              ...obj[weekDay],
              break: [...obj[weekDay].break, ...rangeSlots].sort((a, b) => a.slot - b.slot),
            };
          }
        });
      }
    }

    return obj;
  };

  getCompanyWorkingScheduleSlotsByWeekDay = ({
    workingSchedule,
    date,
  }: {
    workingSchedule: TCompany["workingSchedule"];
    date: Date;
  }) => {
    const workingSlotsForWeek =
      this.getWorkingTimeSlotsForAllWeekDaysCompany(workingSchedule);

    const currentWeekDay = format(date, "EEEE") as keyof WorkingSchedule;

    if (workingSlotsForWeek[currentWeekDay]) {
      return workingSlotsForWeek[currentWeekDay];
    }

    return null;
  };

  getWorkingScheduleSlotsByWeekDay = ({
    workingSchedule,
    date,
  }: {
    workingSchedule: WorkingSchedule;
    date: Date;
  }) => {
    const workingSlotsForWeek = workingSchedule;

    const currentWeekDay = format(date, "EEEE") as keyof WorkingSchedule;

    if (workingSlotsForWeek[currentWeekDay]) {
      const slots = this.getFullSlotsFromArr(workingSlotsForWeek[currentWeekDay].slots);
      const breaks = this.getFullSlotsFromArr(workingSlotsForWeek[currentWeekDay].breaks);
      return {
        slots,
        breaks,
      };
    }

    return null;
  };

  getWorkingScheduleTimeBreakSlots = (
    workingSchedule: TCompany["working_schedule"]
  ): TTimeSlot[] => {
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
          slots = [...slots, ...rangeSlots];
        }
      }
    }

    return slots.sort((a, b) => a.slot - b.slot);
  };

  getWorkingScheduleFirstWeekDaySlots = (workingSchedule: WorkingSchedule) => {
    const workingSlotsForWeek = workingSchedule;

    const firstWeekDayWithSlots = Object.entries(workingSlotsForWeek).find(
      ([key, value]) => value.slots.length
    );

    if (firstWeekDayWithSlots) {
      const fullWorkings = this.getFullSlotsFromArr(firstWeekDayWithSlots[1].slots);
      const fullBreaks = this.getFullSlotsFromArr(firstWeekDayWithSlots[1].breaks);

      return {
        workings: fullWorkings,
        breaks: fullBreaks,
      };
    }

    return {
      workings: [],
      breaks: [],
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
  }): WorkingSchedule => {
    const obj = Object.fromEntries(
      WEEK_DAYS.map((day) => [
        day.id,
        {
          slots: workingDays.includes(day.id) ? slots : [],
          breaks: workingDays.includes(day.id) ? breaks : [],
        },
      ])
    );

    return obj as WorkingSchedule;
  };

  getWorkingScheduleWithFromAndToPropertys = (
    workingSchedule: WorkingSchedule
  ) => {
    return Object.fromEntries(
      Object.entries(workingSchedule).map(([day, value]) => {
        const slots = {
          from: this.SLOTS.find((s) => s.slot === value.slots[0]),
          to: this.SLOTS.find((s) => s.slot === value.slots[value.slots.length - 1]),
        };

        const breaks = {
          from: this.SLOTS.find((s) => s.slot === value.breaks[0]),
          to: this.SLOTS.find((s) => s.slot === value.breaks[value.breaks.length - 1]),
        };

        return [
          day as WorkingScheduleWeekDays,
          {
            slots,
            breaks,
          },
        ];
      })
    ) as WorkingScheduleWithTimeSlots;
  };
}
