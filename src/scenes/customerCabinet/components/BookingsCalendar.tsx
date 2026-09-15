"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import type { CustomerBooking, CustomerBookingStatus } from "@/api/entities/customer";
import { DATE_FNS_LOCALES, useLocale, useTranslations } from "@/i18n";

const statusColors: Record<CustomerBookingStatus, string> = {
  PENDING: "#FCDA00",
  CONFIRMED: "#7CE7AC",
  COMPLETED: "#EEEFF3",
  CANCELLED: "#FCE5E9",
};

const statusMarkerColors: Record<CustomerBookingStatus, string> = {
  ...statusColors,
  CANCELLED: "#D80027",
};

const statusPriority: Record<CustomerBookingStatus, number> = {
  CONFIRMED: 4,
  PENDING: 3,
  COMPLETED: 2,
  CANCELLED: 1,
};

const toDate = (date: string) => new Date(`${date}T12:00:00`);
export const toDateKey = (date: Date) => format(date, "yyyy-MM-dd");

type Props = {
  bookings: CustomerBooking[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

export default function BookingsCalendar({
  bookings,
  selectedDate,
  onSelectDate,
}: Props) {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const dateLocale = DATE_FNS_LOCALES[locale];
  const initialMonth = selectedDate ? toDate(selectedDate) : new Date();
  const [month, setMonth] = useState(startOfMonth(initialMonth));

  const currentDate = useMemo(() => toDateKey(new Date()), [])

  const bookingsByDate = useMemo(
    () =>
      bookings.reduce<Record<string, CustomerBooking[]>>((result, booking) => {
        (result[booking.date] ||= []).push(booking);
        return result;
      }, {}),
    [bookings]
  );
  const calendarDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
        end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }),
      }),
    [month]
  );
  const weekdays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) =>
        format(new Date(2024, 0, index + 1), "EEEEEE", { locale: dateLocale })
      ),
    [dateLocale]
  );

  return (
    <section className="rounded-2xl border border-greyOutline bg-white p-[18px] shadow-[0_8px_24px_rgba(41,38,74,0.04)]">
      <div className="flex h-6 items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-purplePrimary" />
          <h2 className="font-funnel text-base font-bold text-darkPrimary">
            {t("bookings.calendar.title")}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={t("bookings.calendar.previousMonth")}
            className="flex size-6 items-center justify-center rounded-md text-greyPrimary outline-none hover:bg-purpleExtraLight hover:text-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
            onClick={() => setMonth((value) => subMonths(value, 1))}
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <button
            type="button"
            aria-label={t("bookings.calendar.nextMonth")}
            className="flex size-6 items-center justify-center rounded-md text-greyPrimary outline-none hover:bg-purpleExtraLight hover:text-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
            onClick={() => setMonth((value) => addMonths(value, 1))}
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-center text-[13px] font-bold text-darkPrimary">
        {format(month, "LLLL yyyy", { locale: dateLocale })}
      </p>
      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((day) => (
          <span key={day} className="h-5 text-[9px] font-bold text-greyPrimary">
            {day}
          </span>
        ))}
        {calendarDays.map((day) => {
          const dateKey = toDateKey(day);
          const dayBookings = bookingsByDate[dateKey] || [];
          const statuses = dayBookings.map((booking) => booking.status)
          const primaryStatus = statuses.sort(
            (left, right) => statusPriority[right] - statusPriority[left]
          )[0];
          const inCurrentMonth = isSameMonth(day, month);
          const isCurrent = dateKey === currentDate;
          const selected = selectedDate ? isSameDay(day, toDate(selectedDate)) : false;
          const singleStatus = statuses.length === 1 ? primaryStatus : undefined;

          return (
            <button
              key={dateKey}
              type="button"
              disabled={!inCurrentMonth}
              aria-label={t("bookings.calendar.selectDate", {
                date: format(day, "d MMMM", { locale: dateLocale }),
                count: dayBookings.length,
              })}
              aria-pressed={selected}
              onClick={() => onSelectDate(dateKey)}
              className={`relative flex min-h-[34px] flex-col items-center justify-center rounded-lg text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-purplePrimary ${inCurrentMonth ? "text-darkPrimary hover:bg-purpleExtraLight" : "cursor-default text-greyOutline"} ${selected ? "ring-2 ring-inset ring-purplePrimary" : ""}`}
              style={{
                ...(singleStatus ? { backgroundColor: statusColors[singleStatus] } : {}),
                ...(isCurrent && !singleStatus ? { backgroundColor: "#603FEF1A" } : {}),
              }}
            >
              <span className={singleStatus ? "font-bold" : undefined}>
                {format(day, "d")}
              </span>
              {statuses.length > 1 && (
                <span className="mt-0.5 flex items-center gap-0.5" aria-hidden="true">
                  {statuses.slice(0, 3).map((status) => (
                    <span
                      key={status}
                      className="size-1.5 rounded-full"
                      style={{ backgroundColor: statusMarkerColors[status] }}
                    />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className="ml-0.5 text-[8px] font-bold text-greyPrimary">
                      +{dayBookings.length - 3}
                    </span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[9px] text-greyPrimary">
        {(Object.keys(statusColors) as CustomerBookingStatus[]).map((status) => (
          <span key={status} className="flex items-center gap-1">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: statusMarkerColors[status] }}
            />
            {t(`statusCompact.${status}`)}
          </span>
        ))}
      </div>
    </section>
  );
}
