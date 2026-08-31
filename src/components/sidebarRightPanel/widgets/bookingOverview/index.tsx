"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useGetBookingsQuery } from "@/api/queries/booking";
import { DATE_FNS_LOCALES } from "@/i18n";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import type { BookingManagementPeriod } from "../../types";
import {
  formatBookingManagementDateRange,
  getBookingManagementDateRange,
} from "../../utils";

type Props = {
  period: BookingManagementPeriod;
  date: Date;
};

const BOOKING_STATUSES = new Set<TApiBooking["status"]>([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
]);

export const BookingOverviewWidget = ({ period, date }: Props) => {
  const t = useTranslations("bookingManagement.sidebar.overview");
  const locale = useLocale() as keyof typeof DATE_FNS_LOCALES;
  const { companyId } = useGetCompanyId();
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

  const stats = useMemo(() => {
    const bookings = (bookingsQuery.data?.results ?? []).filter((booking) =>
      BOOKING_STATUSES.has(booking.status)
    );

    return {
      total: bookings.length,
      confirmed: bookings.filter((booking) => booking.status === "CONFIRMED").length,
      pending: bookings.filter((booking) => booking.status === "PENDING").length,
      completed: bookings.filter((booking) => booking.status === "COMPLETED").length,
    };
  }, [bookingsQuery.data?.results]);

  const items = [
    { key: "total", value: stats.total, color: "bg-purplePrimary" },
    { key: "confirmed", value: stats.confirmed, color: "bg-greenPrimary" },
    { key: "pending", value: stats.pending, color: "bg-yellowPrimary" },
    { key: "completed", value: stats.completed, color: "bg-[#2CE5F6]" },
  ] as const;

  return (
    <section className="flex-none rounded-xl border border-greyOutlineSecondary p-4">
      <div>
        <h3 className="text-sm font-bold">{t("title")}</h3>
        <p className="mt-1 text-xs text-greyPrimary">{rangeLabel}</p>
      </div>

      {bookingsQuery.isError ? (
        <p className="mt-4 text-xs text-redPrimary">{t("error")}</p>
      ) : bookingsQuery.isPending ? (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div
              key={item.key}
              className="h-[62px] animate-pulse rounded-lg bg-greyBackgroundLight"
            />
          ))}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {items.map((item) => (
            <div key={item.key} className="rounded-lg bg-greyBackgroundLight/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xl font-bold">{item.value}</span>
                <span className={`size-2 rounded-full ${item.color}`} />
              </div>
              <p className="mt-1 text-xs text-greyPrimary">{t(item.key)}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
