"use client";

import Image from "next/image";
import { useMemo } from "react";
import { eachDayOfInterval, format } from "date-fns";
import { useTranslations } from "next-intl";

import { useGetBookingsQuery } from "@/api/queries/booking";
import { useGetCompanyShiftsForDateRangeQuery } from "@/api/queries/company/shift";
import PersonIcon from "@/components/ui/icons/Person";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { TimeManager } from "@/utils/timeManager";
import type { BookingManagementPeriod } from "../../types";
import { getBookingManagementDateRange } from "../../utils";

type Props = {
  period: BookingManagementPeriod;
  date: Date;
};

const ACTIVE_STATUSES = new Set<TApiBooking["status"]>([
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
]);

const timeManager = new TimeManager();

export const StaffWorkloadWidget = ({ period, date }: Props) => {
  const t = useTranslations("bookingManagement.sidebar.staffWorkload");
  const { companyId } = useGetCompanyId();
  const dateRange = useMemo(
    () => getBookingManagementDateRange(period, date),
    [date, period]
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
  const shiftsQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: dateRange.start,
    end: dateRange.end,
  });

  const workloads = useMemo(() => {
    const bookings = (bookingsQuery.data?.results ?? []).filter((booking) =>
      ACTIVE_STATUSES.has(booking.status)
    );
    const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });

    return (shiftsQuery.data?.results ?? [])
      .map((entry) => {
        let capacity = 0;

        days.forEach((day) => {
          const date = format(day, "yyyy-MM-dd");
          const shift =
            entry.shifts.find((item) => item.kind === "override" && item.date === date) ??
            entry.defaultShift;

          if (!shift) return;

          const breakSlots = new Set(timeManager.getBreakIntervalSlots(shift.breakSlots));
          capacity += timeManager
            .getIntervalSlots(shift.workingSlots)
            .filter((slot) => !breakSlots.has(slot)).length;
        });

        const specialistBookings = bookings.filter(
          (booking) => booking.specialist.id === entry.specialist.id
        );
        const bookedSlots = specialistBookings.reduce(
          (total, booking) => total + booking.slots.length,
          0
        );

        return {
          specialist: entry.specialist,
          bookingsCount: specialistBookings.length,
          capacity,
          percentage: capacity
            ? Math.min(100, Math.round((bookedSlots / capacity) * 100))
            : 0,
        };
      })
      .sort((left, right) => right.percentage - left.percentage);
  }, [bookingsQuery.data?.results, dateRange.end, dateRange.start, shiftsQuery.data]);

  const isPending = bookingsQuery.isPending || shiftsQuery.isPending;

  return (
    <section className="flex-none rounded-xl border border-greyOutlineSecondary p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold">{t("title")}</h3>
        {!isPending && workloads.length ? (
          <span className="text-xs text-greyPrimary">
            {t("employees", { count: workloads.length })}
          </span>
        ) : null}
      </div>

      {bookingsQuery.isError || shiftsQuery.isError ? (
        <p className="mt-4 text-xs text-redPrimary">{t("error")}</p>
      ) : isPending ? (
        <div className="mt-4 flex flex-col gap-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-lg bg-greyBackgroundLight"
            />
          ))}
        </div>
      ) : workloads.length ? (
        <div className="mt-4 flex flex-col gap-4">
          {workloads.slice(0, 5).map((item) => (
            <div key={item.specialist.id}>
              <div className="flex items-center gap-3">
                <div className="size-9 flex-none overflow-hidden rounded-md bg-greyBackgroundLight">
                  {item.specialist.avatar ? (
                    <Image
                      src={item.specialist.avatar}
                      alt={item.specialist.fullName}
                      width={36}
                      height={36}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <PersonIcon className="size-6 stroke-greyPrimary" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-bold">
                      {item.specialist.fullName}
                    </p>
                    <span className="text-xs font-bold">{item.percentage}%</span>
                  </div>
                  <p className="mt-0.5 text-xs text-greyPrimary">
                    {item.capacity
                      ? t("bookings", { count: item.bookingsCount })
                      : t("noSchedule")}
                  </p>
                </div>
              </div>
              <div className="ml-12 mt-2 h-1 overflow-hidden rounded-full bg-greyOutline">
                <div
                  className="h-full rounded-full bg-purplePrimary"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-xs text-greyPrimary">{t("empty")}</p>
      )}
    </section>
  );
};
