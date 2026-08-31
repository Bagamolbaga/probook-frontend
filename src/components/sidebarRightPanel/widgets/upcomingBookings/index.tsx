"use client";

import { useMemo } from "react";
import { format, parse, setHours, setMinutes } from "date-fns";
import { useLocale, useTranslations } from "next-intl";

import { useGetBookingsQuery } from "@/api/queries/booking";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { DATE_FNS_LOCALES } from "@/i18n";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { useBookingDetailsModalStore } from "@/stores/bookingDetailsModal";
import type { BookingManagementPeriod } from "../../types";
import {
  formatBookingManagementDateRange,
  getBookingManagementDateRange,
} from "../../utils";

type Props = {
  period: BookingManagementPeriod;
  date: Date;
};

const UPCOMING_STATUSES = new Set<TApiBooking["status"]>(["PENDING", "CONFIRMED"]);

const STATUS_STYLES: Record<
  "PENDING" | "CONFIRMED",
  { badge: string; dot: string; label: "pending" | "confirmed" }
> = {
  PENDING: {
    badge: "bg-yellowExtraLight text-darkPrimary",
    dot: "bg-yellowPrimary",
    label: "pending",
  },
  CONFIRMED: {
    badge: "bg-greenExtraLight text-greenPrimary",
    dot: "bg-greenPrimary",
    label: "confirmed",
  },
};

const getBookingStart = (booking: TApiBooking) => {
  const slot = TIME_SLOTS.find((item) => item.slot === booking.slots[0]);
  const date = parse(booking.date, "yyyy-MM-dd", new Date());

  if (!slot) return date;

  return setMinutes(setHours(date, slot.hour), slot.minute);
};

const getBookingTime = (booking: TApiBooking) => {
  const firstSlot = Math.min(...booking.slots);
  const lastSlot = Math.max(...booking.slots) + 1;
  const start = TIME_SLOTS.find((slot) => slot.slot === firstSlot)?.label;
  const end =
    lastSlot === TIME_SLOTS.length
      ? "24:00"
      : TIME_SLOTS.find((slot) => slot.slot === lastSlot)?.label;

  return [start, end].filter(Boolean).join("–");
};

const getInitials = (name: string) => {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "C"
  );
};

export const UpcomingBookingsWidget = ({ period, date }: Props) => {
  const t = useTranslations("bookingManagement.sidebar.upcoming");
  const locale = useLocale() as keyof typeof DATE_FNS_LOCALES;
  const { companyId } = useGetCompanyId();
  const openBookingDetails = useBookingDetailsModalStore(
    (state) => state.openBookingDetails
  );
  const dateRange = useMemo(
    () => getBookingManagementDateRange(period, date),
    [date, period]
  );
  const rangeLabel = useMemo(
    () => formatBookingManagementDateRange(period, date, DATE_FNS_LOCALES[locale]),
    [date, locale, period]
  );

  const bookingsQuery = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: dateRange.start,
      end_date: dateRange.end,
      offset: "0",
      limit: "1000",
    },
  });

  const upcomingBookings = useMemo(() => {
    const now = new Date();

    return (bookingsQuery.data?.results ?? [])
      .filter(
        (booking) =>
          UPCOMING_STATUSES.has(booking.status) &&
          booking.slots.length > 0 &&
          getBookingStart(booking) >= now
      )
      .sort(
        (left, right) =>
          getBookingStart(left).getTime() - getBookingStart(right).getTime()
      )
      .slice(0, 4);
  }, [bookingsQuery.data?.results]);

  return (
    <section className="flex-none rounded-xl border border-greyOutlineSecondary p-4">
      <h3 className="text-sm font-bold">{t("title")}</h3>
      <p className="mt-1 text-xs text-greyPrimary">{rangeLabel}</p>

      {bookingsQuery.isError ? (
        <p className="mt-4 text-xs text-redPrimary">{t("error")}</p>
      ) : bookingsQuery.isPending ? (
        <div className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-[148px] animate-pulse rounded-xl bg-greyBackgroundLight"
            />
          ))}
        </div>
      ) : upcomingBookings.length ? (
        <div className="mt-3 flex flex-col gap-2.5">
          {upcomingBookings.map((booking) => {
            const start = getBookingStart(booking);
            const customerName = [booking.customer.firstName, booking.customer.lastName]
              .filter(Boolean)
              .join(" ");
            const status = booking.status as "PENDING" | "CONFIRMED";
            const statusStyle = STATUS_STYLES[status];
            const serviceNames = booking.services.map((service) => service.name);
            const serviceLabel = serviceNames[0] || t("noServices");
            const extraServicesCount = Math.max(0, serviceNames.length - 1);

            return (
              <button
                key={booking.id}
                type="button"
                aria-label={t("openDetails", {
                  name: customerName || t("customer"),
                })}
                className="relative w-full cursor-pointer overflow-hidden rounded-xl border border-greyOutlineSecondary bg-white p-3.5 text-left transition-colors hover:border-purplePrimary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purplePrimary"
                onClick={() => openBookingDetails(booking.id)}
              >
                <div className={cn("absolute inset-y-0 left-0 w-1", statusStyle.dot)} />

                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-darkPrimary">
                      <CalendarIcon className="size-4 shrink-0 stroke-purplePrimary" />
                      <span className="whitespace-nowrap">
                        {format(start, "d MMM", {
                          locale: DATE_FNS_LOCALES[locale],
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-darkPrimary">
                      <ClockIcon className="size-4 shrink-0 stroke-purplePrimary" />
                      <span className="whitespace-nowrap">{getBookingTime(booking)}</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold",
                      statusStyle.badge
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", statusStyle.dot)} />
                    {t(`statuses.${statusStyle.label}`)}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-purplePrimary text-xs font-bold text-white">
                    {getInitials(customerName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {customerName || t("customer")}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-greyPrimary">
                      {t("withSpecialist", { name: booking.specialist.fullName })}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-end justify-between gap-3 border-t border-greyOutlineSecondary pt-2.5">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wide text-greyPrimary">
                      {t("service")}
                    </p>
                    <p
                      className="mt-0.5 truncate text-xs font-bold"
                      title={serviceNames.join(", ")}
                    >
                      {serviceLabel}
                      {extraServicesCount
                        ? ` ${t("moreServices", { count: extraServicesCount })}`
                        : ""}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] uppercase tracking-wide text-greyPrimary">
                      {t("total")}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-purplePrimary">
                      {formatCurrency(booking.totalPrice)}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="mt-4 text-xs text-greyPrimary">{t("empty")}</p>
      )}
    </section>
  );
};
