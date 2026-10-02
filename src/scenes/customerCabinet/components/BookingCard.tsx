"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CircleCheck,
  Clock3,
  MapPin,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import type { CustomerBooking } from "@/src/api/entities/customer";
import { Link, useLocale, useTranslations } from "@/src/i18n";
import RescheduleModal from "./RescheduleModal";
import { cn } from "@/src/utils/cn";
import BookingStatusBadge from "./BookingStatusBadge";

const timeFromSlot = (slot: number) => {
  const minutes = slot * 15;
  return `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
};

export const formatBookingTime = (booking: CustomerBooking) => {
  const first = Math.min(...booking.slots);
  const last = Math.max(...booking.slots) + 1;
  return `${timeFromSlot(first)}–${timeFromSlot(last)}`;
};

const statusStyles: Record<CustomerBooking["status"], string> = {
  PENDING: "bg-[#FCDA00] text-darkPrimary",
  CONFIRMED: "bg-[#7CE7AC] text-darkPrimary",
  COMPLETED: "bg-greyBackground text-greyPrimary",
  CANCELLED: "bg-[#D800271A] text-[#D80027]",
};

const statusIcons = {
  PENDING: Clock3,
  CONFIRMED: CircleCheck,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

export default function BookingCard({
  booking,
  featured = false,
}: {
  booking: CustomerBooking;
  featured?: boolean;
}) {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const bookingDate = new Date(`${booking.date}T12:00:00`);
  const day = new Intl.DateTimeFormat(locale, { day: "2-digit" }).format(bookingDate);
  const month = new Intl.DateTimeFormat(locale, { month: "short" }).format(bookingDate);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" }).format(
    bookingDate
  );
  const year = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(bookingDate);
  const price = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: booking.company.currency,
  }).format(booking.totalPrice);
  const StatusIcon = statusIcons[booking.status];
  const serviceNames = booking.services.map((service) => service.name).join(", ");
  const location = [booking.company.address, booking.company.city]
    .filter(Boolean)
    .join(" · ");
  const shortMonth = month.replace(".", "").toUpperCase();

  if (featured) {
    return (
      <Link
        href={`/cabinet/bookings/${booking.id}`}
        className="group block rounded-[24px] outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-4"
      >
        <article className="relative grid h-full grid-cols-[150px_1fr] overflow-hidden rounded-[24px] border border-greyOutlineSecondary bg-white transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:border-purplePrimary/40 group-hover:shadow-[0_16px_36px_rgba(28,29,33,0.08)] sm:grid-cols-1">
          <div className="relative flex min-h-[248px] flex-col justify-between border-r border-dashed border-purplePrimary/25 bg-purpleExtraLight p-6 sm:min-h-0 sm:p-5">
            <span className="text-sm font-bold text-purplePrimary">{weekday}</span>
            <div>
              <span className="font-funnel block text-[64px] leading-none text-darkPrimary sm:text-[52px]">
                {day}
              </span>
              <span className="mt-1 block text-sm font-bold text-darkPrimary">
                {month} {year}
              </span>
            </div>
            <span className="font-bold tabular-nums text-purplePrimary">
              {formatBookingTime(booking)}
            </span>
          </div>
          <div className="flex min-w-0 flex-col p-7 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}
              >
                {t(`status.${booking.status}`)}
              </span>
              <span className="font-bold tabular-nums">{price}</span>
            </div>
            <h3 className="font-funnel mt-5 text-[34px] leading-[1.1] text-white sm:text-[28px]">
              {booking.company.name}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-white">
              {serviceNames}
            </p>
            <p className="mt-1 text-sm text-greyPrimary">{booking.specialist.fullName}</p>
            <span className="mt-auto pt-6 text-sm font-bold text-purplePrimary underline-offset-4 group-hover:underline">
              {t("bookings.details")}
            </span>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <>
      <article
        className={cn(
          "relative flex flex-col gap-1 border-b border-greyOutline px-[22px] py-5 last:border-b-0",
          "sm:p-3"
        )}
      >
        <div className="flex items-start justify-between">
          <BookingStatusBadge status={booking.status} />
          <div className="">
            <p className="font-funnel flex items-center gap-[7px] text-base font-bold">
              <Clock3 className="size-[15px] text-purplePrimary" />
              {formatBookingTime(booking)}
            </p>
            <p className="mt-1 text-right text-[9px] text-greyPrimary">
              {booking.company.timezone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 md:gap-4 sm:gap-3">
          <div
            className={cn(
              "flex p-3 shrink-0 flex-col items-center justify-center gap-0.5 rounded-[14px] bg-greyOutline",
              "sm:h-auto sm:w-auto sm:p-3 sm:rounded-lg"
            )}
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.8px] text-greyPrimary">
              {weekday}
            </span>
            <span className="font-funnel text-[32px] font-bold leading-none sm:text-2xl">
              {day}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-purplePrimary">
              {shortMonth}
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-[7px]">
            <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.25] sm:text-xs">
              {serviceNames}
            </h3>
            <p className="flex items-center gap-[7px] truncate text-[11px] text-grey-800 sm:text-[9px] sm:text-greyPrimary">
              <Building2 className="size-3.5 shrink-0 text-greyPrimary " />
              {booking.company.name} · {booking.specialist.fullName}
            </p>
            {location && (
              <p className="flex items-center gap-[7px] truncate text-[10px] text-ellipsis text-wrap text-greyPrimary ">
                <MapPin className="size-3.5 shrink-0" />
                {location}
              </p>
            )}
          </div>
          <span className="font-funnel text-base font-bold sm:hidden">{price}</span>
        </div>

        <div className="flex items-center justify-end sm:justify-between sm:mt-2">
          <span className="hidden font-funnel text-base font-bold sm:block">{price}</span>

          <div className="flex items-center gap-2 sm:gap-[7px]">
            {booking.allowedActions.reschedule && (
              <button
                type="button"
                onClick={() => setRescheduleOpen(true)}
                className="flex h-9 items-center justify-center rounded-full border border-greyOutline px-3 text-[11px] font-semibold outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary sm:h-[34px] sm:px-[11px] sm:text-[10px]"
              >
                {t("detail.reschedule")}
              </button>
            )}
            <Link
              href={`/cabinet/bookings/${booking.id}`}
              aria-label={t("bookings.details")}
              className="flex size-9 items-center justify-center rounded-full bg-purplePrimary text-white outline-none hover:bg-purplePrimary_hover focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2 sm:size-[34px]"
            >
              <ArrowRight className="size-[15px]" />
            </Link>
          </div>
        </div>

        {/*  */}
        {/*  */}
        {/*  */}
        {/* <div
          className={cn(
            "flex h-[106px] w-[78px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-[14px] bg-greyOutline",
            "sm:h-auto sm:w-auto sm:p-3"
          )}
        >
          <span className="text-[9px] font-bold uppercase tracking-[0.8px] text-greyPrimary">
            {weekday}
          </span>
          <span className="font-funnel text-[32px] font-bold leading-none sm:text-2xl">
            {day}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.7px] text-purplePrimary">
            {shortMonth}
          </span>
        </div> */}

        {/* <div className="hidden items-center justify-between">
          <span className="font-funnel text-base font-bold">
            {day} {shortMonth} · {timeFromSlot(Math.min(...booking.slots))}
          </span>
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-[5px] text-[9px] font-bold ${statusStyles[booking.status]}`}
          >
            <StatusIcon className="size-[11px]" />
            {t(`statusCompact.${booking.status}`)}
          </span>
        </div> */}

        {/* <div className="flex min-w-0 flex-1 flex-col gap-2 sm:gap-[7px]">
          <div className="flex items-center justify-between ">
            <span
              className={`flex items-center gap-1.5 rounded-full px-[9px] py-1.5 text-[10px] font-bold ${statusStyles[booking.status]}`}
            >
              <StatusIcon className="size-[13px]" />
              {t(`status.${booking.status}`)}
            </span>
            <span className="font-funnel text-base font-bold">{price}</span>
          </div>
          <h3 className="line-clamp-2 text-[15px] font-bold leading-[1.25] sm:text-xs">
            {serviceNames}
          </h3>
          <p className="flex items-center gap-[7px] truncate text-[11px] text-grey-800 sm:text-[9px] sm:text-greyPrimary">
            <Building2 className="size-3.5 shrink-0 text-greyPrimary " />
            {booking.company.name} · {booking.specialist.fullName}
          </p>
          {location && (
            <p className="flex items-center gap-[7px] truncate text-[10px] text-ellipsis text-wrap text-greyPrimary ">
              <MapPin className="size-3.5 shrink-0" />
              {location}
            </p>
          )}
        </div> */}

        {/* <div className="flex h-full _w-48 shrink-0 flex-col items-end justify-between ">
          <div className="">
            <p className="font-funnel flex items-center gap-[7px] text-base font-bold">
              <Clock3 className="size-[15px] text-purplePrimary" />
              {formatBookingTime(booking)}
            </p>
            <p className="mt-1 text-right text-[9px] text-greyPrimary">
              {booking.company.timezone}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-[7px]">
            {booking.allowedActions.reschedule && (
              <button
                type="button"
                onClick={() => setRescheduleOpen(true)}
                className="flex h-9 items-center justify-center rounded-full border border-greyOutline px-3 text-[11px] font-semibold outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary sm:h-[34px] sm:px-[11px] sm:text-[10px]"
              >
                {t("detail.reschedule")}
              </button>
            )}
            <Link
              href={`/cabinet/bookings/${booking.id}`}
              aria-label={t("bookings.details")}
              className="flex size-9 items-center justify-center rounded-full bg-purplePrimary text-white outline-none hover:bg-purplePrimary_hover focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2 sm:size-[34px]"
            >
              <ArrowRight className="size-[15px]" />
            </Link>
          </div>
        </div> */}
      </article>
      {rescheduleOpen && (
        <RescheduleModal
          booking={booking}
          isOpen={rescheduleOpen}
          onClose={() => setRescheduleOpen(false)}
        />
      )}
    </>
  );
}
