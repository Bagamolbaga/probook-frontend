"use client";

import { useMemo, useState } from "react";
import { addDays, format } from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight, Coffee, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { useGetBookingsQuery } from "@/src/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/src/api/queries/company";
import { useGetCompanyShiftsForDateRangeQuery } from "@/src/api/queries/company/shift";
import { useGetCompanySpecialistsQuery } from "@/src/api/queries/company/specialists";
import { Button } from "@/src/components/ui/button";
import DatePicker from "@/src/components/ui/DatePicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { Slider } from "@/src/components/ui/slider";
import {
  BOOKING_STATUS,
  BOOKING_STATUSES,
  BOOKING_STATUS_STYLES,
} from "@/src/constants/bookingStatuses";
import { TIME_SLOTS } from "@/src/constants/timeSlots";
import { useGetCompanyId } from "@/src/hooks/useGetCompanyId";
import { DATE_FNS_LOCALES } from "@/src/i18n";
import { useBookingDetailsModalStore } from "@/src/stores/bookingDetailsModal";
import { cn } from "@/src/utils/cn";
import {
  Timeline,
  TimelineCurrentTime,
  TimelineGrid,
  TimelineHeader,
  TimelineProvider,
  TimelineRow,
  type TimelineRowData,
  TimelineSlot,
  TimelineSlotContent,
  type TimelineSlotData,
  TimelineSlotLabel,
} from "./source";
import BreakTimePopover from "./BreakTimePopover";

type BookingTimelineRow = TimelineRowData & {
  specialist: TSpecialist;
  bookingCount: number;
};

type BookingTimelineSlot = TimelineSlotData & {
  kind: "booking";
  booking: TApiBooking;
  endTime: string;
};

type BreakTimelineSlot = TimelineSlotData & {
  kind: "break";
  endTime: string;
  specialist: TSpecialist;
  effectiveShift?: TShift;
  workingSlots: number[];
  breakSlots: number[];
};

type NotWorkingTimelineSlot = TimelineSlotData & {
  kind: "not-working";
  endTime: string;
};

type ProBookTimelineSlot =
  BookingTimelineSlot | BreakTimelineSlot | NotWorkingTimelineSlot;

const getSpecialistName = (
  specialist: Pick<TSpecialist, "firstName" | "lastName" | "fullName">
) => specialist.fullName || `${specialist.firstName} ${specialist.lastName}`.trim();

const getCustomerName = (customer: TApiBooking["customer"]) =>
  `${customer.firstName} ${customer.lastName}`.trim() || customer.email;

export const TimeLineV2 = () => {
  const t = useTranslations();
  const locale = useLocale();
  const { companyId, activeCompany } = useGetCompanyId();
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [percentageInView, setPercentageInView] = useState(80);
  const openBookingDetails = useBookingDetailsModalStore(
    (state) => state.openBookingDetails
  );

  const specialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const companyQuery = useGetCompanyDetailsQuery({ companyId });
  const shiftsQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: selectedDate,
    end: selectedDate,
  });
  const bookingsQuery = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: selectedDate,
      end_date: selectedDate,
    },
  });

  const bookings = useMemo(
    () =>
      (bookingsQuery.data?.results || []).filter(
        (booking) => booking.specialist && booking.slots.length > 0
      ),
    [bookingsQuery.data?.results]
  );

  const rows = useMemo<BookingTimelineRow[]>(() => {
    const specialists = specialistsQuery.data?.results || [];
    const visibleSpecialists = activeCompany?.roles.includes("OWNER")
      ? specialists
      : specialists.filter(
          (specialist) => specialist.id === activeCompany?.specialistProfileId
        );

    return visibleSpecialists.map((specialist) => ({
      id: String(specialist.id),
      label: getSpecialistName(specialist),
      specialist,
      bookingCount: bookings.filter(
        (booking) => String(booking.specialist.id) === String(specialist.id)
      ).length,
    }));
  }, [activeCompany, bookings, specialistsQuery.data?.results]);

  const slots = useMemo<BookingTimelineSlot[]>(
    () =>
      bookings.flatMap((booking) => {
        const sortedSlots = [...booking.slots].sort((a, b) => a - b);
        const firstSlot = sortedSlots[0];
        const lastSlot = sortedSlots.at(-1);
        const start = TIME_SLOTS.find((slot) => slot.slot === firstSlot);
        const end = TIME_SLOTS.find((slot) => slot.slot === (lastSlot ?? firstSlot) + 1);

        if (lastSlot === undefined || !start || !end) {
          return [];
        }

        return [
          {
            kind: "booking",
            id: String(booking.id),
            rowId: String(booking.specialist.id),
            startTime: start.label,
            endTime: end.label,
            duration: Math.max(15, (lastSlot - firstSlot + 1) * 15),
            booking,
          },
        ];
      }),
    [bookings]
  );

  const slotsBreaks = useMemo<BreakTimelineSlot[]>(() => {
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
    const weekDay = format(selectedDate, "EEEE") as WorkingScheduleWeekDays;
    const companyBreakSlots =
      companyQuery.data?.workingSchedule?.[weekDay]?.breakSlots || [];

    return rows.flatMap((row) => {
      const specialistShift = shiftsQuery.data?.results.find(
        (entry) => String(entry.specialist.id) === String(row.specialist.id)
      );
      const overrideShift = specialistShift?.shifts.find(
        (shift) => shift.kind === "override" && shift.date === selectedDateString
      );
      const responseDefaultShift = specialistShift?.defaultShift;
      const assignedDefaultShift =
        responseDefaultShift ||
        (typeof row.specialist.defaultShift === "object"
          ? row.specialist.defaultShift
          : undefined);
      const defaultShift =
        assignedDefaultShift?.kind === "default" ? assignedDefaultShift : undefined;
      const effectiveShift = overrideShift || defaultShift;
      const companyWorkingSlots =
        companyQuery.data?.workingSchedule?.[weekDay]?.workingSlots || [];
      const workingSlots = effectiveShift
        ? effectiveShift.workingSlots
        : companyWorkingSlots;
      const breakSlots = effectiveShift ? effectiveShift.breakSlots : companyBreakSlots;
      const sortedBreakSlots = Array.from(new Set(breakSlots)).sort(
        (left, right) => left - right
      );

      if (sortedBreakSlots.length < 2) {
        return [];
      }

      const firstSlot = sortedBreakSlots[0];
      const lastSlot = sortedBreakSlots.at(-1);
      const start = TIME_SLOTS.find((slot) => slot.slot === firstSlot);
      const end = TIME_SLOTS.find((slot) => slot.slot === lastSlot);

      if (lastSlot === undefined || !start || !end || lastSlot <= firstSlot) {
        return [];
      }

      return [
        {
          kind: "break",
          id: `break-${row.id}-${selectedDateString}`,
          rowId: row.id,
          startTime: start.label,
          endTime: end.label,
          duration: (lastSlot - firstSlot) * 15,
          specialist: row.specialist,
          effectiveShift,
          workingSlots,
          breakSlots: sortedBreakSlots,
        },
      ];
    });
  }, [companyQuery.data?.workingSchedule, rows, selectedDate, shiftsQuery.data?.results]);

  const slotsNotWorking = useMemo<NotWorkingTimelineSlot[]>(() => {
    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
    const weekDay = format(selectedDate, "EEEE") as WorkingScheduleWeekDays;
    const companyWorkingSlots = Array.from(
      new Set(companyQuery.data?.workingSchedule?.[weekDay]?.workingSlots || [])
    ).sort((left, right) => left - right);
    const companyIntervalSlots = companyWorkingSlots.slice(0, -1);

    if (!companyIntervalSlots.length) {
      return [];
    }

    return rows.flatMap((row) => {
      const specialistShift = shiftsQuery.data?.results.find(
        (entry) => String(entry.specialist.id) === String(row.specialist.id)
      );
      const overrideShift = specialistShift?.shifts.find(
        (shift) => shift.kind === "override" && shift.date === selectedDateString
      );
      const responseDefaultShift = specialistShift?.defaultShift;
      const assignedDefaultShift =
        responseDefaultShift ||
        (typeof row.specialist.defaultShift === "object"
          ? row.specialist.defaultShift
          : undefined);
      const defaultShift =
        assignedDefaultShift?.kind === "default" ? assignedDefaultShift : undefined;
      const effectiveShift = overrideShift || defaultShift;

      if (!effectiveShift) {
        return [];
      }

      const specialistWorkingSlots = new Set(
        Array.from(new Set(effectiveShift.workingSlots))
          .sort((left, right) => left - right)
          .slice(0, -1)
      );
      const unavailableSlots = companyIntervalSlots.filter(
        (slot) => !specialistWorkingSlots.has(slot)
      );
      const ranges: number[][] = [];

      unavailableSlots.forEach((slot) => {
        const currentRange = ranges.at(-1);
        if (currentRange?.at(-1) === slot - 1) {
          currentRange.push(slot);
        } else {
          ranges.push([slot]);
        }
      });

      return ranges.flatMap((range, rangeIndex) => {
        const firstSlot = range[0];
        const endBoundarySlot = (range.at(-1) ?? firstSlot) + 1;
        const start = TIME_SLOTS.find((slot) => slot.slot === firstSlot);
        const end = TIME_SLOTS.find((slot) => slot.slot === endBoundarySlot);

        if (!start || !end) {
          return [];
        }

        return [
          {
            kind: "not-working" as const,
            id: `not-working-${row.id}-${selectedDateString}-${rangeIndex}`,
            rowId: row.id,
            startTime: start.label,
            endTime: end.label,
            duration: range.length * 15,
          },
        ];
      });
    });
  }, [companyQuery.data?.workingSchedule, rows, selectedDate, shiftsQuery.data?.results]);

  const timelineSlots = useMemo<ProBookTimelineSlot[]>(
    () => [...slotsNotWorking, ...slots, ...slotsBreaks],
    [slots, slotsBreaks, slotsNotWorking]
  );

  const companyWorkingSlots = useMemo(() => {
    const weekDay = format(selectedDate, "EEEE") as WorkingScheduleWeekDays;
    const workingSlots = companyQuery.data?.workingSchedule?.[weekDay]?.workingSlots;

    if (!workingSlots?.length) {
      return [];
    }

    const slotIds = new Set(workingSlots);
    return TIME_SLOTS.filter((slot) => slotIds.has(slot.slot)).sort(
      (left, right) => left.slot - right.slot
    );
  }, [companyQuery.data?.workingSchedule, selectedDate]);

  const config = useMemo(() => {
    if (!companyWorkingSlots.length) {
      return { startHour: 8, endHour: 20, snapIntervalMinutes: 15, columnWidth: 208 };
    }

    const firstSlot = companyWorkingSlots[0];
    const lastSlot = companyWorkingSlots.at(-1) ?? firstSlot;
    const startHour = Math.max(0, Math.floor(firstSlot.hour + firstSlot.minute / 60));
    const endHour = Math.min(24, Math.ceil(lastSlot.hour + lastSlot.minute / 60));

    return {
      startHour,
      endHour: Math.max(startHour + 1, endHour),
      snapIntervalMinutes: 15,
      columnWidth: 208,
    };
  }, [companyWorkingSlots]);

  const isPending =
    companyQuery.isPending ||
    specialistsQuery.isPending ||
    shiftsQuery.isPending ||
    bookingsQuery.isPending;
  const isError =
    companyQuery.isError ||
    specialistsQuery.isError ||
    shiftsQuery.isError ||
    bookingsQuery.isError;

  const handleSlotClick = (slotId: string) => {
    const slot = timelineSlots.find((timelineSlot) => timelineSlot.id === slotId);
    if (slot?.kind === "booking") {
      openBookingDetails(slot.booking.id);
    }
  };

  return (
    <section className="min-w-0 w-full max-w-full overflow-hidden rounded-2xl border border-greyOutlineSecondary bg-white">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-greyOutlineSecondary px-5 py-4 sm:px-3">
        <div className="flex items-center gap-2 sm:flex-wrap">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("bookingManagement.timeline.previousDay")}
            onClick={() => setSelectedDate((date) => addDays(date, -1))}
          >
            <ChevronLeft />
          </Button>
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-9 min-w-[190px] justify-center rounded-lg px-3"
              >
                <CalendarDays data-icon="inline-start" />
                {format(selectedDate, "d MMMM yyyy", {
                  locale: DATE_FNS_LOCALES[locale],
                })}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DatePicker
                mode="single"
                selected={selectedDate}
                locale={DATE_FNS_LOCALES[locale]}
                onSelect={(date) => {
                  if (!date) return;
                  setSelectedDate(date);
                  setIsDatePickerOpen(false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t("bookingManagement.timeline.nextDay")}
            onClick={() => setSelectedDate((date) => addDays(date, 1))}
          >
            <ChevronRight />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="ml-1 h-9 rounded-lg px-3"
            onClick={() => setSelectedDate(new Date())}
          >
            {t("bookingManagement.today")}
          </Button>
        </div>

        <div className="flex w-[220px] items-center gap-3 sm:w-full">
          <span className="shrink-0 text-xs font-medium text-greyPrimary">
            {t("bookingManagement.timeline.zoom")}
          </span>
          <Slider
            min={50}
            max={100}
            step={5}
            value={[percentageInView]}
            onValueChange={(value: number[]) => setPercentageInView(value[0])}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 border-b border-greyOutlineSecondary px-5 py-3 sm:px-3">
        {BOOKING_STATUSES.map((status) => (
          <div key={status} className="flex items-center gap-2 text-xs text-greyPrimary">
            <span
              className={cn(
                "size-2 rounded-full",
                BOOKING_STATUS_STYLES[status].dotClassName
              )}
            />
            {t(`bookingManagement.calendar.statuses.${status}`)}
          </div>
        ))}
        <div className="flex items-center gap-2 text-xs text-greyPrimary">
          <span className="size-2 rounded-sm border border-dashed border-greyPrimary bg-greyBackground" />
          {t("bookingManagement.calendar.break")}
        </div>
        <div className="flex items-center gap-2 text-xs text-greyPrimary">
          <span className="size-2 rounded-sm bg-greyPrimary/20" />
          {t("bookingManagement.timeline.notWorking")}
        </div>
      </div>

      {isPending ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <span className="size-8 animate-spin rounded-full border-2 border-purpleExtraLight border-t-purplePrimary" />
        </div>
      ) : isError ? (
        <div className="flex min-h-[280px] items-center justify-center px-6 text-center text-sm text-redPrimary">
          {t("bookingManagement.sidebar.overview.error")}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex min-h-[280px] items-center justify-center px-6 text-center text-sm text-greyPrimary">
          {t("bookingManagement.sidebar.staffWorkload.empty")}
        </div>
      ) : (
        <TimelineProvider
          config={config}
          percentageInView={percentageInView}
          onSlotClick={handleSlotClick}
          className="min-w-0 max-w-full"
        >
          <Timeline
            slots={timelineSlots}
            rows={rows}
            className="max-h-[calc(100vh-310px)] border-0"
          >
            <TimelineGrid>
              <TimelineHeader
                columnLabel={t("bookingManagement.timeline.employees")}
                className="bg-white"
              />
              {rows.map((row) => (
                <TimelineRow
                  key={row.id}
                  row={row}
                  slots={timelineSlots}
                  className="h-[60px] bg-white text-xs"
                  renderRowHeader={(timelineRow: BookingTimelineRow) => (
                    <div className="flex flex-1 h-full min-w-0 items-center gap-3 px-4 bg-secondary">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purpleExtraLight text-xs font-bold text-purplePrimary">
                        {timelineRow.specialist.firstName?.[0]}
                        {timelineRow.specialist.lastName?.[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-darkPrimary">
                          {timelineRow.label}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-greyPrimary">
                          <UserRound className="size-3" />
                          {t("bookingManagement.sidebar.staffWorkload.bookings", {
                            count: timelineRow.bookingCount,
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                >
                  {(timelineSlot: ProBookTimelineSlot) => {
                    if (timelineSlot.kind === "not-working") {
                      return (
                        <TimelineSlot
                          slot={timelineSlot}
                          minWidth={0}
                          className="pointer-events-none flex items-center justify-center rounded-none border-0 bg-greyPrimary/10 p-0 shadow-none"
                        >
                          <TimelineSlotLabel className="px-2 text-greyPrimary/70">
                            {t("bookingManagement.timeline.notWorking")}
                          </TimelineSlotLabel>
                        </TimelineSlot>
                      );
                    }

                    if (timelineSlot.kind === "break") {
                      return (
                        <TimelineSlot
                          slot={timelineSlot}
                          className="flex cursor-default items-center border border-dashed border-greyPrimary/40 bg-greyBackground p-0 shadow-none"
                        >
                          <BreakTimePopover
                            specialist={timelineSlot.specialist}
                            effectiveShift={timelineSlot.effectiveShift}
                            workingSlots={timelineSlot.workingSlots}
                            breakSlots={timelineSlot.breakSlots}
                            bookings={bookings}
                            currentDate={selectedDate}
                          >
                            <TimelineSlotLabel className="flex items-center gap-1.5 text-greyPrimary">
                              <Coffee className="size-3" />
                              {t("bookingManagement.calendar.break")}
                            </TimelineSlotLabel>
                          </BreakTimePopover>
                        </TimelineSlot>
                      );
                    }

                    const { booking } = timelineSlot;
                    const styles = BOOKING_STATUS_STYLES[booking.status];

                    return (
                      <TimelineSlot
                        slot={timelineSlot}
                        className={cn(
                          "flex flex-col justify-center border-l-4 px-2.5 py-1.5 shadow-none",
                          {
                            "border-yellowPrimary bg-yellowPrimary/20 hover:bg-yellowPrimary/30":
                              BOOKING_STATUS.PENDING === booking.status,
                            "border-greenPrimary bg-greenPrimary/20 hover:bg-greenPrimary/30":
                              BOOKING_STATUS.CONFIRMED === booking.status,
                            "border-purplePrimary bg-purplePrimary/20 hover:bg-purplePrimary/30":
                              BOOKING_STATUS.COMPLETED === booking.status,
                            "border-redPrimary bg-redPrimary/20 hover:bg-redPrimary/30":
                              BOOKING_STATUS.BLOCKED === booking.status,
                            "border-greyPrimary bg-greyPrimary/20 hover:bg-greyPrimary/30":
                              BOOKING_STATUS.CANCELLED === booking.status,
                          }
                        )}
                      >
                        <TimelineSlotLabel className={styles.textClassName}>
                          {getCustomerName(booking.customer)}
                        </TimelineSlotLabel>
                        <TimelineSlotContent className="mt-1 flex items-center gap-1 text-[11px] text-darkPrimary/70">
                          {booking.services[0].name}
                        </TimelineSlotContent>
                      </TimelineSlot>
                    );
                  }}
                </TimelineRow>
              ))}
              <TimelineCurrentTime />
            </TimelineGrid>
          </Timeline>
        </TimelineProvider>
      )}
    </section>
  );
};
