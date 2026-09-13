"use client";

import type { CustomerBooking } from "@/api/entities/customer";
import { Link, useLocale, useTranslations } from "@/i18n";

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
  PENDING: "bg-yellowExtraLight text-[#7A6500]",
  CONFIRMED: "bg-greenExtraLight text-[#2D7410]",
  COMPLETED: "bg-greyBackground text-greyPrimary",
  CANCELLED: "bg-redExtraLight text-redPrimary",
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

  return (
    <Link
      href={`/cabinet/bookings/${booking.id}`}
      className="group block rounded-[24px] outline-none focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-4"
    >
      <article
        className={`relative grid h-full overflow-hidden rounded-[24px] border border-greyOutlineSecondary bg-white transition-[border-color,transform,box-shadow] duration-200 group-hover:-translate-y-0.5 group-hover:border-purplePrimary/40 group-hover:shadow-[0_16px_36px_rgba(28,29,33,0.08)] ${
          featured ? "grid-cols-[150px_1fr] sm:grid-cols-1" : "grid-cols-[104px_1fr]"
        }`}
      >
        <div
          className={`relative flex flex-col justify-between border-r border-dashed border-purplePrimary/25 bg-purpleExtraLight ${
            featured ? "min-h-[248px] p-6 sm:min-h-0 sm:p-5" : "p-5"
          }`}
        >
          <span className="text-sm font-bold text-purplePrimary">{weekday}</span>
          <div>
            <span
              className={`block font-[Georgia,serif] leading-none text-darkPrimary ${
                featured ? "text-[64px] sm:text-[52px]" : "text-[46px]"
              }`}
            >
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

        <div className={`flex min-w-0 flex-col ${featured ? "p-7 sm:p-5" : "p-5"}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[booking.status]}`}
            >
              {t(`status.${booking.status}`)}
            </span>
            <span className="font-bold tabular-nums">{price}</span>
          </div>

          <h3
            className={`mt-5 text-darkPrimary ${
              featured
                ? "font-[Georgia,serif] text-[34px] leading-[1.1] sm:text-[28px]"
                : "text-xl leading-6"
            }`}
          >
            {booking.company.name}
          </h3>
          <p className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-darkPrimary">
            {booking.services.map((service) => service.name).join(", ")}
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
