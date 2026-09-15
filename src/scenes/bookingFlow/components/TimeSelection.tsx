import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
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

import { useGetBookingAvailabilitiesQuery } from "@/api/queries/booking";
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
import { DATE_FNS_LOCALES, useLocale } from "@/i18n";

const WEEK_STARTS_ON = 1;
type Props = {
  companyId: string;
  selectedServices: TServiceAndSelectedOption[];
  selectedDate: Date;
  selectedTime?: TTimeSlot;
  selectedSpecialist?: TSpecialist | "ANY";
  selectDateHandler: (date: Date) => void;
  selectTimeHandler: (time?: TTimeSlot) => void;
  selectSpecialistHandler: (staff?: TSpecialist) => void;
  availabilityBookingId?: string;
  compact?: boolean;
};

const getSpecialistId = (specialist: string | { id: string }) =>
  typeof specialist === "string" ? specialist : specialist.id;

const getTimeZoneLabel = (timeZone: string) => {
  const city = timeZone.split("/").at(-1)?.replaceAll("_", " ") || timeZone;
  const localizedCity = city === "Moscow" ? "Москва" : city;

  try {
    const offset = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "longOffset",
    })
      .formatToParts(new Date())
      .find((part) => part.type === "timeZoneName")
      ?.value.replace("GMT", "UTC")
      .replace(":00", "");

    return offset ? `${localizedCity} (${offset})` : localizedCity;
  } catch {
    return timeZone;
  }
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
  availabilityBookingId,
  compact = false,
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const [firstDayOnWeek, setFirstDayOnWeek] = useState(
    startOfWeek(selectedDate, { weekStartsOn: WEEK_STARTS_ON })
  );
  const dayPickerContainerRef = useRef<HTMLDivElement>(null);
  const [isShowDatePicker, setIsShowDatePicker] = useState(false);

  useEffect(() => {
    setFirstDayOnWeek(startOfWeek(selectedDate, { weekStartsOn: WEEK_STARTS_ON }));
  }, [selectedDate]);

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
  const companyTimeZone = companyQuery.data?.timezone || "Europe/Moscow";
  const timeZoneLabel = getTimeZoneLabel(companyTimeZone);
  const specialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const shiftsQuery = useGetCompanyShiftsQuery({ companyId });
  const shifts = useMemo(() => shiftsQuery.data?.results || [], [shiftsQuery.data]);

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

  const availabilityQueries = useGetBookingAvailabilitiesQuery(
    specialistIdsToCheck.map((specialistId) => ({
      companyId,
      bookingId: availabilityBookingId,
      specialistId,
      date: format(selectedDate, "yyyy-MM-dd"),
      queryOptions: {
        refetchInterval: 1000 * 60,
        refetchOnWindowFocus: true,
      },
    }))
  );

  const availabilityBySpecialist = useMemo(
    () =>
      new Map(
        specialistIdsToCheck.flatMap((specialistId, index) => {
          const availability = availabilityQueries[index]?.data;
          return availability ? [[specialistId, availability] as const] : [];
        })
      ),
    [availabilityQueries, specialistIdsToCheck]
  );

  const slotsForSelectedDate = useMemo(() => {
    const timeManager = new TimeManager();
    const slotsNeeded = Math.ceil(timeManager.getSlotsCountForServices(selectedServices));
    const specialistsByStartSlot = new Map<number, string[]>();
    const workingSlots = new Set<number>();

    specialistIdsToCheck.forEach((specialistId) => {
      const availability = availabilityBySpecialist.get(specialistId);
      if (!availability) return;

      availability.slots.forEach(({ slot }) => workingSlots.add(slot));
      const availableSlots = new Set(availability.availableSlots);

      availability.availableSlots.forEach((slot) => {
        const hasFullDuration = Array.from(
          { length: slotsNeeded },
          (_, index) => slot + index
        ).every((value) => availableSlots.has(value));
        if (hasFullDuration) {
          specialistsByStartSlot.set(slot, [
            ...(specialistsByStartSlot.get(slot) || []),
            specialistId,
          ]);
        }
      });
    });

    return {
      specialistsByStartSlot,
      workingSlots: Array.from(workingSlots),
      slotsNeeded,
    };
  }, [availabilityBySpecialist, selectedServices, specialistIdsToCheck]);

  const renderedSlots = useMemo(() => {
    if (!slotsForSelectedDate.workingSlots.length) return [];

    const firstSlot = Math.min(...slotsForSelectedDate.workingSlots);
    const lastSlot = Math.max(...slotsForSelectedDate.workingSlots) + 1;

    return TIME_SLOTS.filter(
      (slot) => slot.slot >= firstSlot && slot.slot <= lastSlot
    ).map((slot) => {
      const staffIds = slotsForSelectedDate.specialistsByStartSlot.get(slot.slot) || [];
      const statuses = specialistIdsToCheck.flatMap((specialistId) => {
        const availability = availabilityBySpecialist.get(specialistId);
        const status = availability?.slots.find(
          (item) => item.slot === slot.slot
        )?.status;
        return status ? [status] : [];
      });
      const unavailableReason: "busy" | "break" | "not_enough_time" | undefined =
        !staffIds.length
          ? !statuses.length
            ? "not_enough_time"
            : statuses.every((status) => status === "break")
              ? "break"
              : statuses.every((status) => status === "busy")
                ? "busy"
                : "not_enough_time"
          : undefined;

      return {
        ...slot,
        staffIds,
        unavailableReason,
        isDisabled:
          !staffIds.length ||
          isBefore(setHours(selectedDate, slot.hour).setMinutes(slot.minute), new Date()),
        isColorHighlight: Boolean(
          selectedTime &&
          slot.slot >= selectedTime.slot &&
          slot.slot <= selectedTime.slot + slotsForSelectedDate.slotsNeeded
        ),
      };
    });
  }, [
    availabilityBySpecialist,
    selectedDate,
    selectedTime,
    slotsForSelectedDate,
    specialistIdsToCheck,
  ]);

  useEffect(() => {
    if (
      !selectedTime ||
      availabilityQueries.some((query) => query.isPending) ||
      !availabilityQueries.length
    ) {
      return;
    }

    if (!slotsForSelectedDate.specialistsByStartSlot.has(selectedTime.slot)) {
      selectTimeHandler(undefined);
    }
  }, [availabilityQueries, selectTimeHandler, selectedTime, slotsForSelectedDate]);

  const dateStringBySelectedWeek = useMemo(() => {
    const firstDay = week.daysOfWeek.at(0);
    const lastDay = week.daysOfWeek.at(-1);
    if (!firstDay || !lastDay) return "";

    return getMonth(firstDay) === getMonth(lastDay)
      ? `${format(firstDay, "d", {locale: DATE_FNS_LOCALES[locale]})} - ${format(lastDay, "d, MMMM yyyy", {locale: DATE_FNS_LOCALES[locale]})}`
      : `${format(firstDay, "d MMMM", {locale: DATE_FNS_LOCALES[locale]})} - ${format(lastDay, "d MMMM, yyyy", {locale: DATE_FNS_LOCALES[locale]})}`;
  }, [locale, week.daysOfWeek]);

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
    shiftsQuery.isPending ||
    specialistsQuery.isPending ||
    availabilityQueries.some((query) => query.isPending);

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        compact
          ? "w-full min-h-0 h-auto border-none p-0 gap-4"
          : "w-2/3 min-h-[590px] h-[calc(100vh-124px-100px-52px)] border-r border-greyOutlineSecondary pr-6 sm:w-full sm:border-none sm:pr-0 1sm:pb-[40px]"
      )}
    >
      {!compact && (<div className="flex flex-col gap-2">
        <p className="text-[10px] font-bold tracking-[0.5px] text-purplePrimary">
          {t("booking.timeStep.stepLabel" as any)}
        </p>
        <h2 className="font-funnel text-[32px] font-bold leading-tight text-darkPrimary sm:text-[26px]">
          {t("booking.timeStep.title" as any)}
        </h2>
        <p className="text-[13px] text-greyPrimary">
          {t("booking.timeStep.description" as any, { timezone: timeZoneLabel })}
        </p>
      </div>)}
      <div className="w-full flex items-center">
        <p className={cn("ml-2 flex-1 text-base font-bold", {
          "text-sm": compact
        })}>{dateStringBySelectedWeek}</p>
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
      <div className={cn("w-full flex items-center justify-between gap-2")}>
        <Button
          disabled={isCurrentWeek}
          variant="resting-active"
          className="!p-0 !rounded !border-none !size-7"
          onClick={() => setFirstDayOnWeek((current) => addWeeks(current, -1))}
        >
          <ArrowSecondaryDownIcon className="rotate-90" />
        </Button>
        <DaysOfWeekList
          compact={compact}
          selectedDate={selectedDate}
          days={week.daysOfWeek}
          isWorkingDay={isWorkingDay}
          selectDateHandler={handleDateSelect}
        />
        <Button
          variant="resting-active"
          className="!p-0 !rounded !border-none !size-7"
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
            compact={compact}
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
