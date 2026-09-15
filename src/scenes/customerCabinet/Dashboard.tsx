"use client";

import {
  ArrowRight,
  CheckCircle2,
  CircleCheck,
  Clock3,
  MapPin,
  XCircle,
} from "lucide-react";
import type { CustomerBooking } from "@/api/entities/customer";
import { useCustomerDashboardQuery } from "@/api/queries/customer";
import { useAppSession } from "@/hooks/useAppSession";
import { Link, useLocale, useTranslations } from "@/i18n";
import { formatBookingTime } from "./components/BookingCard";
import QueryState from "./components/QueryState";

const statusTone: Record<CustomerBooking["status"], string> = {
  PENDING: "bg-yellowPrimary text-darkPrimary",
  CONFIRMED: "bg-[#7CE7AC] text-darkPrimary",
  COMPLETED: "bg-greyOutline text-greyPrimary",
  CANCELLED: "bg-redExtraLight text-redPrimary",
};

const statusIcon = {
  PENDING: Clock3,
  CONFIRMED: CircleCheck,
  COMPLETED: CheckCircle2,
  CANCELLED: XCircle,
};

const formatDate = (date: string, locale: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(locale, options).format(new Date(`${date}T12:00:00`));

const formatPrice = (booking: CustomerBooking, locale: string) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency: booking.company.currency,
  }).format(booking.totalPrice);

function Status({
  booking,
  compact = false,
}: {
  booking: CustomerBooking;
  compact?: boolean;
}) {
  const t = useTranslations("customerCabinet");
  const StatusIcon = statusIcon[booking.status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full font-bold ${statusTone[booking.status]} ${compact ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"}`}
    >
      <StatusIcon className={compact ? "size-[11px]" : "size-[13px]"} aria-hidden />
      {t(`status.${booking.status}`)}
    </span>
  );
}

function UpcomingRow({ booking }: { booking: CustomerBooking }) {
  const locale = useLocale();
  return (
    <Link
      href={`/cabinet/bookings/${booking.id}`}
      className="group flex min-h-[92px] items-center gap-4 border-b border-greyOutline px-[18px] outline-none last:border-0 hover:bg-greyBackgroundLight focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purplePrimary"
    >
      <span className="flex size-[58px] shrink-0 flex-col items-center justify-center rounded-xl bg-greyOutline">
        <span className="text-[9px] font-bold uppercase tracking-[0.07em] text-greyPrimary">
          {formatDate(booking.date, locale, { weekday: "short" })}
        </span>
        <span className="font-secondary text-[23px] font-bold leading-none">
          {formatDate(booking.date, locale, { day: "2-digit" })}
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-bold uppercase tracking-[0.05em] text-greyPrimary">
          {formatDate(booking.date, locale, { month: "long" })} ·{" "}
          {formatBookingTime(booking)}
        </span>
        <span className="mt-1 block truncate text-sm font-bold">
          {booking.services.map((service) => service.name).join(", ")}
        </span>
        <span className="mt-1 block truncate text-[11px] text-greyPrimary">
          {booking.company.name} · {booking.specialist.fullName}
        </span>
      </span>
      <Status booking={booking} compact />
      <span className="text-lg text-greyPrimary transition-transform group-hover:translate-x-0.5">
        ›
      </span>
    </Link>
  );
}

function HistoryRow({ booking }: { booking: CustomerBooking }) {
  const locale = useLocale();
  return (
    <Link
      href={`/cabinet/bookings/${booking.id}`}
      className="flex min-h-[67px] items-center gap-3 border-b border-greyOutline px-5 outline-none last:border-0 hover:bg-greyBackgroundLight focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purplePrimary"
    >
      <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-greyOutline text-sm font-bold text-purplePrimary">
        ✓
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-bold">
          {booking.services.map((service) => service.name).join(", ")}
        </span>
        <span className="mt-1 block truncate text-[10px] text-greyPrimary">
          {booking.company.name} ·{" "}
          {formatDate(booking.date, locale, { day: "2-digit", month: "short" })}
        </span>
      </span>
      <span className="shrink-0 text-[11px] font-bold text-grey-800">
        {formatPrice(booking, locale)}
      </span>
    </Link>
  );
}

export default function CustomerDashboardScene() {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const { data: session } = useAppSession();
  const query = useCustomerDashboardQuery();

  if (query.isLoading || query.isError) {
    return (
      <QueryState
        loading={query.isLoading}
        error={query.isError}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const dashboard = query.data;
  if (!dashboard) return null;
  const next = dashboard.nextBooking;
  const spend = dashboard.stats.completedSpendByCurrency;
  const firstName = session?.user?.firstName;
  const nextDuration =
    next?.services.reduce(
      (total, service) => total + service.selectedOption.duration,
      0
    ) ?? 0;
  const nextImage = next?.specialist.avatar || next?.company.logo;
  const nextLocation = next
    ? [next.company.address, next.company.city].filter(Boolean).join(" · ")
    : "";

  return (
    <div className="flex min-h-full flex-col gap-6">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="font-secondary text-[32px] font-bold leading-tight tracking-[-0.02em] sm:text-[26px]">
            {firstName
              ? t("dashboard.greeting", { name: firstName })
              : t("dashboard.title")}
          </h1>
          <p className="mt-1 text-sm text-greyPrimary">
            {t("dashboard.plannedSubtitle")}
          </p>
        </div>
        <Link
          href="/cabinet/profile"
          className="flex size-10 items-center justify-center rounded-full border border-greyOutline bg-white text-lg outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
          aria-label={t("navigation.profile")}
        >
          ♙
        </Link>
      </header>

      <section
        className="grid min-h-[104px] grid-cols-4 gap-2.5 rounded-2xl border border-greyOutline p-4 md:grid-cols-2 sm:grid-cols-1"
        aria-label={t("dashboard.summary")}
      >
        {[
          [
            t("dashboard.nextBooking"),
            next ? formatDate(next.date, locale, { day: "numeric", month: "long" }) : "—",
            "bg-purpleExtraLight text-purplePrimary",
            "text-lg",
          ],
          [
            t("dashboard.upcomingCount"),
            t("dashboard.bookingCount", { count: dashboard.stats.upcomingCount }),
            "bg-bluePrimary/10 text-bluePrimary",
            "text-[21px]",
          ],
          [
            t("dashboard.completedCount"),
            t("dashboard.bookingCount", { count: dashboard.stats.completedCount }),
            "bg-greenExtraLight text-greenPrimary",
            "text-[21px]",
          ],
          [
            t("dashboard.spent"),
            spend.length
              ? spend
                  .map((item) =>
                    new Intl.NumberFormat(locale, {
                      style: "currency",
                      currency: item.currency,
                    }).format(item.total)
                  )
                  .join(" · ")
              : "—",
            "bg-yellowExtraLight text-[#B29A00]",
            "text-[21px]",
          ],
        ].map(([label, value, tone, size]) => (
          <div
            key={label}
            className={`flex min-w-0 flex-col justify-center gap-2 rounded-[14px] px-4 py-3 ${tone}`}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
              {label}
            </span>
            <strong
              className={`truncate font-secondary font-bold leading-none text-darkPrimary ${size}`}
            >
              {value}
            </strong>
          </div>
        ))}
      </section>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_354px] gap-6 md:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-5">
          {next ? (
            <article className="grid h-[328px] grid-cols-[minmax(0,1fr)_224px] overflow-hidden rounded-[18px] bg-darkPrimary text-white sm:h-auto sm:min-h-[239px] sm:grid-cols-1">
              <div className="flex min-w-0 flex-col justify-between p-[26px] sm:min-h-[239px] sm:p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8AF1B9]">
                    {t("dashboard.nextBooking")}
                  </span>
                  <Status booking={next} />
                </div>
                <div>
                  <p className="font-funnel text-[35px] font-bold leading-none tracking-[-0.7px] text-white sm:text-[28px]">
                    {formatDate(next.date, locale, { day: "numeric", month: "long" })}
                  </p>
                  <p className="mt-1 text-sm font-medium text-greyPrimary sm:text-xs">
                    {formatBookingTime(next)} · {next.company.timezone}
                  </p>
                </div>
                <div>
                  <p className="line-clamp-2 text-sm font-bold leading-5 text-white">
                    {next.services.map((service) => service.name).join(", ")}
                  </p>
                  <p className="mt-1 text-xs text-greyPrimary">
                    {next.specialist.fullName} · {nextDuration} {t("detail.minutes")} ·{" "}
                    {formatPrice(next, locale)}
                  </p>
                </div>
                <div className="flex gap-2.5">
                  <Link
                    href={`/cabinet/bookings/${next.id}`}
                    className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-bold text-darkPrimary outline-none hover:bg-greyOutline focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2 focus-visible:ring-offset-darkPrimary"
                  >
                    {t("dashboard.openBooking")}
                    <ArrowRight className="size-[15px]" />
                  </Link>
                  {nextLocation && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(nextLocation)}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={t("detail.openMap")}
                      className="flex size-10 items-center justify-center rounded-full border border-white/30 outline-none hover:border-white focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <MapPin className="size-[17px]" />
                    </a>
                  )}
                </div>
              </div>
              <div
                className={`bg-cover bg-center sm:hidden ${nextImage ? "" : "bg-gradient-to-br from-purplePrimary via-bluePrimary to-[#8AF1B9]"}`}
                style={nextImage ? { backgroundImage: `url(${nextImage})` } : undefined}
                role={nextImage ? "img" : undefined}
                aria-label={nextImage ? next.specialist.fullName : undefined}
              >
                {!nextImage && (
                  <span className="block size-full bg-[radial-gradient(circle_at_68%_28%,rgba(255,255,255,0.35),transparent_32%)]" />
                )}
              </div>
            </article>
          ) : (
            <div className="flex min-h-[220px] items-center justify-between gap-6 rounded-[18px] border border-dashed border-purplePrimary/40 bg-white p-8 sm:flex-col sm:items-start">
              <p className="text-greyPrimary">{t("common.empty")}</p>
              <Link
                href="/search"
                className="rounded-full bg-purplePrimary px-5 py-3 text-sm font-bold text-white"
              >
                {t("common.findService")}
              </Link>
            </div>
          )}

          {dashboard.upcomingBookings.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-greyOutline bg-white">
              <div className="flex items-center justify-between px-[18px] py-4">
                <div>
                  <h2 className="font-secondary text-lg font-bold">
                    {t("dashboard.upcoming")}
                  </h2>
                  <p className="mt-0.5 text-xs text-greyPrimary">
                    {t("dashboard.upcomingSubtitle")}
                  </p>
                </div>
                <Link
                  href="/cabinet/bookings"
                  className="text-xs font-bold text-purplePrimary hover:underline"
                >
                  {t("dashboard.allBookings")}
                </Link>
              </div>
              {dashboard.upcomingBookings.slice(0, 2).map((booking) => (
                <UpcomingRow key={booking.id} booking={booking} />
              ))}
            </section>
          )}
        </div>

        <aside className="flex min-w-0 flex-col gap-5">
          {dashboard.recentHistory.length > 0 && (
            <section className="overflow-hidden rounded-2xl border border-greyOutline bg-white">
              <div className="border-b border-greyOutline px-5 py-4">
                <h2 className="font-secondary text-[19px] font-bold">
                  {t("dashboard.history")}
                </h2>
                <p className="mt-1 text-xs text-greyPrimary">
                  {t("dashboard.historySubtitle")}
                </p>
              </div>
              {dashboard.recentHistory.slice(0, 5).map((booking) => (
                <HistoryRow key={booking.id} booking={booking} />
              ))}
            </section>
          )}
          <section className="flex min-h-[190px] flex-1 flex-col justify-between rounded-2xl bg-purpleExtraLight p-5">
            <div>
              <span className="flex size-9 items-center justify-center rounded-xl bg-white text-purplePrimary">
                ✦
              </span>
              <h2 className="mt-3 font-secondary text-lg font-bold">
                {t("dashboard.discoveryTitle")}
              </h2>
              <p className="mt-2 text-[11px] leading-4 text-grey-800">
                {t("dashboard.discoveryDescription")}
              </p>
            </div>
            <Link
              href="/search"
              className="mt-5 w-fit rounded-full bg-purplePrimary px-4 py-3 text-xs font-bold text-white hover:bg-purplePrimary_hover"
            >
              {t("dashboard.browseServices")} <span className="ml-1">→</span>
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
