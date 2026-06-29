/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useMemo, useRef, useState } from "react";
import {
  addWeeks,
  differenceInWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  getMonth,
  isBefore,
  isSameDay,
  setHours,
  startOfWeek,
} from "date-fns";

import Button from "@/components/ui/button";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { cn } from "@/utils/cn";
import { useGetCompanyShiftsForDateRangeQuery } from "@/api/queries/company/shift";
import { useGetBookingsMinQuery } from "@/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import DaysOfWeekList from "./ui/DaysOfWeekList";
import TimeSlots from "./ui/TimeSlots";
import { TimeSlotsManager } from "@/utils/timeSlotManager";
import { useTranslations } from "next-intl";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import { TimeManager } from "@/utils/timeManager";
import DatePicker from "@/components/ui/DatePicker";
import { useClickOutside } from "@/hooks/useClickOutside";

const WEEK_STARTS_ON = 1;

const DEFAULT_WORKING_SCHEDULE = {
  Monday: {
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ],
    breaks: [48, 49, 50, 51],
  },
  Tuesday: {
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ],
    breaks: [48, 49, 50, 51],
  },
  Wednesday: {
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ],
    breaks: [48, 49, 50, 51],
  },
  Thursday: {
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ],
    breaks: [48, 49, 50, 51],
  },
  Friday: {
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ],
    breaks: [48, 49, 50, 51],
  },
  Saturday: { slots: [], breaks: [] },
  Sunday: { slots: [], breaks: [] },
};

type Props = {
  companyId: number;

  selectedServices: TServiceAndSelectedOption[];
  selectedDate: Date;
  selectedTime?: TTimeSlot;
  selectedSpecialist?: TSpecialist | "ANY";
  selectDateHandler: (date: Date) => void;
  selectTimeHandler: (time?: TTimeSlot) => void;
  selectSpecialistHandler: (staff?: TSpecialist) => void;
};
const TimeSelection: FC<Props> = ({
  companyId,
  selectedServices,
  selectedDate,
  selectedTime,
  selectedSpecialist,
  selectDateHandler,
  selectTimeHandler,
  selectSpecialistHandler,
}) => {
  const t = useTranslations();
  const [firstDayOnWeek, setFirstDayOnWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON })
  );

  const dayPickerContainerRef = useRef<HTMLDivElement>(null);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);

  const week = useMemo(() => {
    const startOfWeekDate = startOfWeek(firstDayOnWeek, { weekStartsOn: WEEK_STARTS_ON });
    const endOfWeekDate = endOfWeek(firstDayOnWeek, { weekStartsOn: WEEK_STARTS_ON });
    const daysOfWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });

    return { startOfWeekDate, endOfWeekDate, daysOfWeek };
  }, [firstDayOnWeek]);

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });

  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({ companyId });

  const getCompanyShiftsForDateRangeQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: firstDayOnWeek,
    end: addWeeks(firstDayOnWeek, 1),
  });

  const getBookingsMinQuery = useGetBookingsMinQuery({
    companyId,
    queryParams: {
      specialist_id:
        selectedSpecialist === "ANY" ? undefined : selectedSpecialist?.id.toString(),
      start_date: week.startOfWeekDate,
      end_date: week.endOfWeekDate,
    },
  });

  const dateStringBySelectedWeek = useMemo(() => {
    const firstDay = week.daysOfWeek.at(0);
    const lastDay = week.daysOfWeek.at(-1);

    if (firstDay && lastDay) {
      if (getMonth(firstDay) === getMonth(lastDay)) {
        return `${format(firstDay, "MMMM d")} - ${format(lastDay, "d, yyyy")}`;
      } else {
        return `${format(firstDay, "MMMM d")} - ${format(lastDay, "MMMM d, yyyy")}`;
      }
    }
  }, [week.daysOfWeek]);

  const activeBookings: TBookingMin[] = useMemo(
    () => getBookingsMinQuery.data?.results || [],
    [getBookingsMinQuery.data]
  );

  const selectNextWeekHandler = () => {
    setFirstDayOnWeek((prev) => addWeeks(prev, 1));
  };

  const selectPrevWeekHandler = () => {
    setFirstDayOnWeek((prev) => addWeeks(prev, -1));
  };

  const openDatePickerHandler = () => {
    setIsShowDatePicker(true);
  };

  const closeDatePickerHandler = () => {
    setIsShowDatePicker(false);
  };

  useClickOutside(dayPickerContainerRef, closeDatePickerHandler);

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (date) {
      const startWeekDayOfSelectedDay = startOfWeek(date, {
        weekStartsOn: WEEK_STARTS_ON,
      });
      const addWeekCount = differenceInWeeks(startWeekDayOfSelectedDay, firstDayOnWeek);
      setFirstDayOnWeek((prev) => addWeeks(prev, addWeekCount));

      selectDateHandler(date);
      selectTimeHandler(undefined);
    }
  };

  const selectDateHandlerLocal = (date: Date) => {
    // form.setValue("selectedDate", date);
    // form.setValue("selectedTime", undefined);
    selectDateHandler(date);
    selectTimeHandler(undefined);
  };

  const getOptimalSpecialist = (staffIds: number[] = []) => {
    const staffs = getCompanySpecialistsQuery.data?.results.filter((s) =>
      staffIds.includes(s.id)
    );

    if (staffs) {
      if (staffs.length === 1) {
        return staffs[0];
      }

      const staffsWithBookingsCount: Record<string, number> = {};

      staffIds.forEach((staffId) => {
        const count =
          activeBookings.filter(
            (b) =>
              b.date === format(selectedDate, "yyyy-MM-dd") && b.specialist.id === staffId
          ).length || 0;

        staffsWithBookingsCount[staffId] = count;
      });

      const sortedStaffsWithBookingsCount = Object.entries(staffsWithBookingsCount).sort(
        (a, b) => a[1] - b[1]
      );

      return staffs.find((s) => s.id === Number(sortedStaffsWithBookingsCount[0][0]));
    }
  };

  const selectTimeHandlerLocal = (
    time: (typeof TIME_SLOTS)[0]["slot"],
    fullSlot: {
      slot: number;
      hour: number;
      minute: number;
      label: string;
      staffIds: number[];
    }
  ) => {
    const alreadySelectedTime = selectedTime;
    const timeSlot = TIME_SLOTS.find((s) => s.slot === time);

    if (timeSlot) {
      if (!alreadySelectedTime) {
        // form.setValue("selectedTime", timeSlot);
        selectTimeHandler(timeSlot);
      } else if (alreadySelectedTime.slot === timeSlot.slot) {
        // form.setValue("selectedTime", undefined);
        selectTimeHandler(undefined);
      } else {
        // form.setValue("selectedTime", timeSlot);
        selectTimeHandler(timeSlot);
      }
    }

    const staff = getOptimalSpecialist(fullSlot.staffIds);
    staff && selectSpecialistHandler(staff);
  };

  const isCurrentWeek = isSameDay(
    week.startOfWeekDate,
    startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON })
  );

  const staffShiftInSelectedDate:
    | {
        slots: number[];
        breaks: number[];
      }
    | undefined = useMemo(() => {
    if (selectedSpecialist === "ANY") {
      const staffCanSelectIds = selectedServices.reduce<number[]>(
        (acc, s) => (acc = [...acc, ...s.specialists]),
        []
      );

      const shifts = getCompanyShiftsForDateRangeQuery.data?.results;

      let allShiftsSlots: number[] = [];

      shifts?.forEach((s) => {
        if (s.shifts.length) {
          const finded = s.shifts.find(
            (s) => s.date === format(selectedDate, "yyyy-MM-dd")
          );

          if (finded) {
            const fslots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
              workingSchedule: finded.working_schedule,
              date: selectedDate,
            });

            allShiftsSlots = [
              ...allShiftsSlots,
              ...(fslots?.slots.map((s) => s.slot) || []),
            ];
          }
        }

        const slots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
          workingSchedule: s.default_shift.working_schedule,
          date: selectedDate,
        });

        allShiftsSlots = [...allShiftsSlots, ...(slots?.slots.map((s) => s.slot) || [])];
      });

      //@ts-ignore
      const uniqSlots = allShiftsSlots
        .sort((a, b) => a - b)
        .reduce<number[]>((acc, i) => {
          if (!acc.includes(i)) {
            acc.push(i);
          }

          return acc;
        }, []);

      return shifts?.length
        ? {
            slots: uniqSlots,
            breaks: [],
          }
        : {
            slots: uniqSlots,
            breaks: [],
          };
    } else {
      const slots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
        workingSchedule: DEFAULT_WORKING_SCHEDULE,
        date: selectedDate,
      });

      return {
        slots: slots?.slots.map((s) => s.slot) || [],
        breaks: slots?.breaks.map((s) => s.slot) || [],
      };

      const shift = getCompanyShiftsForDateRangeQuery.data?.results.find(
        (s) => s.id === selectedSpecialist?.id
      );

      if (shift) {
        if (shift.shifts.length) {
          const finded = shift.shifts.find(
            (s) => s.date === format(selectedDate, "yyyy-MM-dd")
          );

          if (finded) {
            const slots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
              workingSchedule: finded.working_schedule,
              date: selectedDate,
            });

            return {
              slots: slots?.slots.map((s) => s.slot) || [],
              breaks: slots?.breaks.map((s) => s.slot) || [],
            };
          }
        }

        const slots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
          workingSchedule: shift.default_shift.working_schedule,
          date: selectedDate,
        });

        return {
          slots: slots?.slots.map((s) => s.slot) || [],
          breaks: slots?.breaks.map((s) => s.slot) || [],
        };
      }
    }
  }, [getCompanyShiftsForDateRangeQuery.data, selectedSpecialist, selectedDate]);

  const isBeforeSlot = (slot: TTimeSlot) => {
    const slotDate = setHours(selectedDate, slot.hour).setMinutes(slot.minute);

    return isBefore(slotDate, new Date());
  };

  console.log({activeBookings});
  const renderSlotsV2 = useMemo(() => {
    if (
      !staffShiftInSelectedDate ||
      getBookingsMinQuery.isPending ||
      !getCompanyDetailsQuery.data ||
      !selectedSpecialist ||
      selectedSpecialist === "ANY"
    )
      return [];

    const tm = new TimeManager();
    const timeSlotsAlreadyUsed = tm.getAlreadyUsedSlotsInBookings({
      bookings: activeBookings,
      date: selectedDate,
      staffId: selectedSpecialist.id,
    });

    const timeSlotsAlreadyUsedWithTimeBreaks = [
      ...timeSlotsAlreadyUsed,
      ...staffShiftInSelectedDate.breaks.slice(0, -1),
    ].sort((a, b) => a - b);

    const needSlotsForServices = tm.getSlotsCountForServices(selectedServices);

    const freeSlots = tm.getAvailableSlotsForService(
      staffShiftInSelectedDate.slots,
      timeSlotsAlreadyUsedWithTimeBreaks,
      needSlotsForServices
    );

    return tm
      .getFullSlotsInRange(
        staffShiftInSelectedDate.slots[0],
        staffShiftInSelectedDate.slots[staffShiftInSelectedDate.slots.length - 1]
      )
      .filter((s) => s.minute === 0 || s.minute === 30)
      .map((s) => ({
        ...s,
        isDisabled: !freeSlots.includes(s.slot) || isBeforeSlot(s),
        isColorHighlight:
          selectedTime &&
          s.slot >= selectedTime.slot &&
          (s.slot === selectedTime.slot ||
            s.slot - selectedTime.slot <= needSlotsForServices),
      }));
  }, [
    staffShiftInSelectedDate,
    getBookingsMinQuery.isPending,
    activeBookings,
    getCompanyDetailsQuery.data,
    selectedSpecialist,
    selectedServices,
    selectedDate,
    selectedTime,
  ]);

  const renderAnySpecialistSlots = useMemo(() => {
    if (
      getBookingsMinQuery.isPending ||
      !getCompanyDetailsQuery.data ||
      !selectedSpecialist ||
      !getCompanySpecialistsQuery.data ||
      !getCompanyShiftsForDateRangeQuery.data
    )
      return [];

    const staffCanSelectIds = selectedServices.reduce<number[]>(
      (acc, s) => (acc = [...acc, ...s.specialists]),
      []
    );

    const shifts = getCompanyShiftsForDateRangeQuery.data?.results.filter((s) =>
      staffCanSelectIds.includes(s.id)
    );

    let shiftsSlotsWithStaffId: {
      slots: {
        slot: number;
        hour: number;
        minute: number;
        label: string;
      }[];
      staffId: number;
    }[] = [];

    shifts.forEach((s) => {
      const staffId =
        getCompanySpecialistsQuery.data.results.find(
          (staff) => staff.specialist_details.username === s.specialist.username
        )?.id || -1;

      let shift: TShift;
      let slotsNumber: number[] = [];

      if (s.shifts.length) {
        const finded = s.shifts.find(
          (s) => s.date === format(selectedDate, "yyyy-MM-dd")
        );

        if (finded) {
          const slots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
            workingSchedule: finded.working_schedule,
            date: selectedDate,
          });

          shift = finded;
          slotsNumber = slots?.slots.map((s) => s.slot) || [];
        }
      } else {
        const slots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
          workingSchedule: s.default_shift.working_schedule,
          date: selectedDate,
        });

        shift = s.default_shift;
        slotsNumber = slots?.slots.map((s) => s.slot) || [];
      }

      const slots = slotsNumber.map((slot) => TIME_SLOTS.find((ts) => ts.slot === slot)!);

      const staffBookingsUsedSlots = activeBookings
        .filter(
          (b) =>
            b.date === format(selectedDate, "yyyy-MM-dd") && b.specialist.id === staffId
        )
        .reduce<number[]>((acc, b) => (acc = [...acc, ...b.slots]), []);

      const timeSlotsManager = new TimeSlotsManager({
        services: selectedServices,
        slotsAlreadyUsed: staffBookingsUsedSlots.map(
          (slot) => TIME_SLOTS.find((ts) => ts.slot === slot)!
        ),
      });

      shiftsSlotsWithStaffId = [
        ...shiftsSlotsWithStaffId,
        {
          staffId,
          slots: slots
            .filter((s) => s.minute === 0 || s.minute === 30)
            .filter((sl) => !staffBookingsUsedSlots.includes(sl.slot))
            .filter(
              (sl) =>
                !timeSlotsManager.isNotEnoughTimeForNextSlot({
                  options: selectedServices.map((s) => s.selectedOption),
                  slot: sl.slot,
                })
            )
            .filter(
              (sl) =>
                !timeSlotsManager.isNotEnoughTime({
                  options: selectedServices.map((s) => s.selectedOption),
                  slot: sl.slot,
                  staffShift: {
                    name: "",
                    slots: slotsNumber,
                  },
                  slotsInWorkRange: slots,
                })
            ),
        },
      ];
    });

    const workingSchedule = getCompanyDetailsQuery.data.working_schedule;

    const timeSlotsManager = new TimeSlotsManager({
      services: selectedServices,
      // slotsAlreadyUsed: timeSlotsAlreadyUsed,
    });

    const selectedServicesAllDuration = selectedServices.reduce(
      (acc, c) => (acc += c.selectedOption.duration),
      0
    );

    let timeSlotsInWorkRange = [];

    timeSlotsInWorkRange = timeSlotsInWorkRange
      .map((i) => {
        const findedIds = shiftsSlotsWithStaffId
          .filter((s) => s.slots.some((sl) => sl.slot === i.slot))
          .map((s) => s.staffId);

        if (findedIds.length) {
          return {
            ...i,
            staffIds: findedIds,
          };
        }

        return i;
      })
      .filter((i) => i);

    return timeSlotsInWorkRange
      .filter((s) => s.minute === 0 || s.minute === 30)
      .map((s) => ({
        ...s,
        // isNotEnoughTimeForNextSlot: timeSlotsManager.isNotEnoughTimeForNextSlot(s.slot),
        // isAlreadyUsed: timeSlotsManager.isAlreadyUsed(s.slot),
        isDisabled: !s.staffIds || isBeforeSlot(s),
        // isNotInShiftRange: timeSlotsManager.isNotInShiftRange(
        //   s.slot,
        //   staffShiftInSelectedDate
        // ),
        // isNotEnoughTime: timeSlotsManager.isNotEnoughTime(
        //   s.slot,
        //   staffShiftInSelectedDate,
        //   timeSlotsInWorkRange
        // ),
        isColorHighlight:
          selectedTime &&
          s.slot >= selectedTime.slot &&
          (s.slot === selectedTime.slot ||
            s.slot - selectedTime.slot <= selectedServicesAllDuration / 15),
      }));
  }, [
    getBookingsMinQuery.isPending,
    getCompanyDetailsQuery.data,
    activeBookings,
    selectedSpecialist,
    getCompanySpecialistsQuery.data,
    getCompanyShiftsForDateRangeQuery.data,
    selectedServices,
    selectedDate,
    selectedTime,
  ]);

  return (
    <div className="w-2/3 min-h-[590px] h-[calc(100vh-124px-100px-52px)] pr-6 flex flex-col gap-6 border-r border-greyOutlineSecondary sm:w-full sm:border-none sm:pr-0 1sm:pb-[40px]">
      <p className="text-sm font-bold text-greyPrimary">
        {t("booking.timeStep.selectTime")}
      </p>

      <div className="w-full flex items-center">
        <p className="ml-2 flex-1 text-base font-bold">{dateStringBySelectedWeek}</p>
        <div className="relative flex items-center gap-1">
          <Button
            variant="resting-active"
            className="size-10 !p-0 !rounded-full border border-greyOutlineSecondary"
            onClick={openDatePickerHandler}
          >
            <CalendarIcon className="stroke-darkPrimary" />
          </Button>

          {isShowDatePicker && (
            <div ref={dayPickerContainerRef} className="absolute right-0 top-12 z-[50]">
              <DatePicker
                className="py-2 px-2 border rounded-lg border-greyOutlineSecondary bg-white"
                _forBookingCreationPage
                mode={"single"}
                selected={selectedDate}
                disabled={(d) => isBefore(d, new Date()) && !isSameDay(d, new Date())}
                onSelect={handleDayPickerSelect}
              />
            </div>
          )}
        </div>
      </div>
      <div className={cn("w-full flex justify-between gap-2")}>
        <Button
          disabled={isCurrentWeek}
          variant="resting-active"
          className="!p-0 !rounded !border-none"
          onClick={selectPrevWeekHandler}
        >
          <ArrowSecondaryDownIcon className="rotate-90" />
        </Button>
        <DaysOfWeekList
          selectedDate={selectedDate}
          days={week.daysOfWeek}
          company={getCompanyDetailsQuery.data}
          selectDateHandler={selectDateHandler}
        />
        <Button
          variant="resting-active"
          className="!p-0 !rounded !border-none"
          onClick={selectNextWeekHandler}
        >
          <ArrowSecondaryDownIcon className="-rotate-90" />
        </Button>
      </div>
      {staffShiftInSelectedDate?.slots.length === 0 ? (
        <div className="mt-10 flex justify-center">
          <h5>
            Professional{" "}
            <span className="text-purplePrimary">
              {typeof selectedSpecialist === "object" ? selectedSpecialist.full_name : ""}
            </span>{" "}
            does not work on the selected day
          </h5>
        </div>
      ) : (
        //TODO use height with vh
        <div className="w-full max-h-[520px] flex flex-col gap-2 overflow-auto">
          <TimeSlots
            selectedSlot={selectedTime}
            slots={renderSlotsV2}
            selectTimeHandler={selectTimeHandlerLocal}
          />
        </div>
      )}
    </div>
  );
};

export default TimeSelection;
