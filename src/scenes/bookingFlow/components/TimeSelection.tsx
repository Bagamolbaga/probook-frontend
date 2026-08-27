import { FC, useCallback, useMemo, useRef, useState } from "react";
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
import { useTranslations } from "next-intl";

import { useGetBookingsMinQuery } from "@/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyShiftsQuery } from "@/api/queries/company/shift";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import Button from "@/components/ui/button";
import DatePicker from "@/components/ui/DatePicker";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CalendarIcon from "@/components/ui/icons/Calendar";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";
import { TimeManager } from "@/utils/timeManager";
import DaysOfWeekList from "./ui/DaysOfWeekList";
import TimeSlots from "./ui/TimeSlots";

const WEEK_STARTS_ON = 1;
const BUSY_BOOKING_STATUSES = new Set(["BLOCKED", "PENDING", "CONFIRMED"]);

type Props = {
  companyId: string;
  selectedServices: TServiceAndSelectedOption[];
  selectedDate: Date;
  selectedTime?: TTimeSlot;
  selectedSpecialist?: TSpecialist | "ANY";
  selectDateHandler: (date: Date) => void;
  selectTimeHandler: (time?: TTimeSlot) => void;
  selectSpecialistHandler: (staff?: TSpecialist) => void;
};

const getSpecialistId = (specialist: string | { id: string }) =>
  typeof specialist === "string" ? specialist : specialist.id;

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
    const startOfWeekDate = startOfWeek(firstDayOnWeek, {
      weekStartsOn: WEEK_STARTS_ON,
    });
    const endOfWeekDate = endOfWeek(firstDayOnWeek, {
      weekStartsOn: WEEK_STARTS_ON,
    });

    return {
      startOfWeekDate,
      endOfWeekDate,
      daysOfWeek: eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate }),
    };
  }, [firstDayOnWeek]);

  const companyQuery = useGetCompanyDetailsQuery({ companyId });
  const specialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const shiftsQuery = useGetCompanyShiftsQuery({ companyId });
  const bookingsQuery = useGetBookingsMinQuery({
    companyId,
    queryParams: {
      start_date: week.startOfWeekDate,
      end_date: week.endOfWeekDate,
    },
  });

  const shifts = useMemo(() => shiftsQuery.data?.results || [], [shiftsQuery.data]);
  const activeBookings = useMemo(
    () => bookingsQuery.data?.results || [],
    [bookingsQuery.data]
  );

  const eligibleSpecialistIds = useMemo(() => {
    if (!selectedServices.length) return [];

    const idsByService = selectedServices.map(
      (service) => new Set(service.specialists.map(getSpecialistId))
    );
    const [firstIds, ...restIds] = idsByService;

    return Array.from(firstIds).filter((id) => restIds.every((ids) => ids.has(id)));
  }, [selectedServices]);

  const getEffectiveSchedule = useCallback(
    (specialistId: string, date: Date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const override = shifts.find(
        (shift) =>
          shift.kind === "override" &&
          shift.specialistId === specialistId &&
          shift.date === formattedDate
      );
      if (override) return override;

      const specialistDefault = shifts.find(
        (shift) =>
          shift.kind === "default" &&
          shift.specialistId === specialistId &&
          shift.date === null
      );
      if (specialistDefault) return specialistDefault;

      const specialist = specialistsQuery.data?.results.find(
        (item) => item.id === specialistId
      );
      if (specialist?.defaultShift && typeof specialist.defaultShift === "object") {
        return specialist.defaultShift;
      }

      return shifts.find(
        (shift) =>
          shift.kind === "default" && shift.specialistId === null && shift.date === null
      );
    },
    [shifts, specialistsQuery.data]
  );

  const getWorkingDay = useCallback(
    (specialistId: string, date: Date) => {
      const shift = getEffectiveSchedule(specialistId, date);
      if (shift) {
        return { workingSlots: shift.workingSlots, breakSlots: shift.breakSlots };
      }

      const weekDay = format(date, "EEEE") as WorkingScheduleWeekDays;
      return (
        companyQuery.data?.workingSchedule?.[weekDay] || {
          workingSlots: [],
          breakSlots: [],
        }
      );
    },
    [companyQuery.data, getEffectiveSchedule]
  );

  const specialistIdsToCheck = useMemo(() => {
    if (selectedSpecialist && selectedSpecialist !== "ANY") {
      return [selectedSpecialist.id];
    }

    return eligibleSpecialistIds;
  }, [eligibleSpecialistIds, selectedSpecialist]);

  const slotsForSelectedDate = useMemo(() => {
    const timeManager = new TimeManager();
    const slotsNeeded = Math.ceil(timeManager.getSlotsCountForServices(selectedServices));
    const specialistsByStartSlot = new Map<number, string[]>();
    const workingSlots = new Set<number>();

    specialistIdsToCheck.forEach((specialistId) => {
      const schedule = getWorkingDay(specialistId, selectedDate);
      schedule.workingSlots.forEach((slot) => workingSlots.add(slot));

      const busySlots = timeManager.getAlreadyUsedSlotsInBookings({
        bookings: activeBookings.filter((booking) =>
          BUSY_BOOKING_STATUSES.has(booking.status)
        ),
        date: selectedDate,
        staffId: specialistId,
      });

      timeManager
        .getAvailableStartSlots({
          workingSlots: schedule.workingSlots,
          breakSlots: schedule.breakSlots,
          busySlots,
          slotsNeeded,
        })
        .forEach((slot) => {
          specialistsByStartSlot.set(slot, [
            ...(specialistsByStartSlot.get(slot) || []),
            specialistId,
          ]);
        });
    });

    return {
      specialistsByStartSlot,
      workingSlots: Array.from(workingSlots),
      slotsNeeded,
    };
  }, [
    activeBookings,
    getWorkingDay,
    selectedDate,
    selectedServices,
    specialistIdsToCheck,
  ]);

  const renderedSlots = useMemo(() => {
    if (!slotsForSelectedDate.workingSlots.length) return [];

    const firstSlot = Math.min(...slotsForSelectedDate.workingSlots);
    const lastSlot = Math.max(...slotsForSelectedDate.workingSlots);

    return TIME_SLOTS.filter(
      (slot) =>
        slot.slot >= firstSlot &&
        slot.slot <= lastSlot &&
        (slot.minute === 0 || slot.minute === 30)
    ).map((slot) => ({
      ...slot,
      staffIds: slotsForSelectedDate.specialistsByStartSlot.get(slot.slot) || [],
      isDisabled:
        !slotsForSelectedDate.specialistsByStartSlot.has(slot.slot) ||
        isBefore(setHours(selectedDate, slot.hour).setMinutes(slot.minute), new Date()),
      isColorHighlight: Boolean(
        selectedTime &&
        slot.slot >= selectedTime.slot &&
        slot.slot <= selectedTime.slot + slotsForSelectedDate.slotsNeeded
      ),
    }));
  }, [selectedDate, selectedTime, slotsForSelectedDate]);

  const dateStringBySelectedWeek = useMemo(() => {
    const firstDay = week.daysOfWeek.at(0);
    const lastDay = week.daysOfWeek.at(-1);
    if (!firstDay || !lastDay) return "";

    return getMonth(firstDay) === getMonth(lastDay)
      ? `${format(firstDay, "MMMM d")} - ${format(lastDay, "d, yyyy")}`
      : `${format(firstDay, "MMMM d")} - ${format(lastDay, "MMMM d, yyyy")}`;
  }, [week.daysOfWeek]);

  const isWorkingDay = useCallback(
    (date: Date) =>
      specialistIdsToCheck.some(
        (specialistId) => getWorkingDay(specialistId, date).workingSlots.length > 0
      ),
    [getWorkingDay, specialistIdsToCheck]
  );

  const handleDateSelect = (date: Date) => {
    selectDateHandler(date);
    selectTimeHandler(undefined);
  };

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) return;

    const selectedWeekStart = startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });
    setFirstDayOnWeek((current) =>
      addWeeks(current, differenceInWeeks(selectedWeekStart, current))
    );
    handleDateSelect(date);
  };

  const handleTimeSelect = (slot: number, fullSlot: { staffIds: string[] }) => {
    const timeSlot = TIME_SLOTS.find((item) => item.slot === slot);
    if (!timeSlot) return;

    selectTimeHandler(selectedTime?.slot === slot ? undefined : timeSlot);

    if (selectedSpecialist === "ANY") {
      const specialist = specialistsQuery.data?.results.find(
        (item) => item.id === fullSlot.staffIds[0]
      );
      if (specialist) selectSpecialistHandler(specialist);
    }
  };

  useClickOutside(dayPickerContainerRef, () => setIsShowDatePicker(false));

  const isCurrentWeek = isSameDay(
    week.startOfWeekDate,
    startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON })
  );
  const isLoading =
    bookingsQuery.isPending || shiftsQuery.isPending || specialistsQuery.isPending;

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
            onClick={() => setIsShowDatePicker(true)}
          >
            <CalendarIcon className="stroke-darkPrimary" />
          </Button>
          {isShowDatePicker && (
            <div ref={dayPickerContainerRef} className="absolute right-0 top-12 z-[50]">
              <DatePicker
                className="py-2 px-2 border rounded-lg border-greyOutlineSecondary bg-white"
                _forBookingCreationPage
                mode="single"
                selected={selectedDate}
                disabled={(date) =>
                  (isBefore(date, new Date()) && !isSameDay(date, new Date())) ||
                  !isWorkingDay(date)
                }
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
          onClick={() => setFirstDayOnWeek((current) => addWeeks(current, -1))}
        >
          <ArrowSecondaryDownIcon className="rotate-90" />
        </Button>
        <DaysOfWeekList
          selectedDate={selectedDate}
          days={week.daysOfWeek}
          isWorkingDay={isWorkingDay}
          selectDateHandler={handleDateSelect}
        />
        <Button
          variant="resting-active"
          className="!p-0 !rounded !border-none"
          onClick={() => setFirstDayOnWeek((current) => addWeeks(current, 1))}
        >
          <ArrowSecondaryDownIcon className="-rotate-90" />
        </Button>
      </div>
      {!isLoading && !slotsForSelectedDate.workingSlots.length ? (
        <div className="mt-10 flex justify-center">
          <h5>
            Professional{" "}
            <span className="text-purplePrimary">
              {typeof selectedSpecialist === "object" ? selectedSpecialist.fullName : ""}
            </span>{" "}
            does not work on the selected day
          </h5>
        </div>
      ) : (
        <div className="w-full max-h-[520px] flex flex-col gap-2 overflow-auto">
          <TimeSlots
            selectedSlot={selectedTime}
            slots={renderedSlots}
            selectTimeHandler={handleTimeSelect}
          />
        </div>
      )}
    </div>
  );
};

export default TimeSelection;
