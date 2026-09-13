"use client";

import { useCustomerDashboardQuery } from "@/api/queries/customer";
import { Link, useLocale, useTranslations } from "@/i18n";
import BookingCard from "./components/BookingCard";
import QueryState from "./components/QueryState";

export default function CustomerDashboardScene() {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
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

  return (
    <div className="space-y-12 sm:space-y-9">
      <header className="max-w-[720px]">
        <h1 className="font-[Georgia,serif] text-[48px] font-normal leading-[1.08] tracking-[-0.025em] text-darkPrimary sm:text-[38px]">
          {t("dashboard.title")}
        </h1>
        <p className="mt-3 max-w-[580px] text-lg leading-7 text-greyPrimary sm:text-base sm:leading-6">
          {t("dashboard.subtitle")}
        </p>
      </header>

      <section
        className="grid grid-cols-[auto_auto_1fr] items-stretch overflow-hidden rounded-[22px] border border-greyOutlineSecondary bg-white sm:grid-cols-2"
        aria-label={t("dashboard.title")}
      >
        <div className="min-w-[150px] border-r border-greyOutlineSecondary px-6 py-5 sm:min-w-0 sm:px-4">
          <p className="text-sm text-greyPrimary">{t("dashboard.upcomingCount")}</p>
          <p className="mt-1 font-[Georgia,serif] text-[36px] leading-none tabular-nums">
            {dashboard.stats.upcomingCount}
          </p>
        </div>
        <div className="min-w-[150px] border-r border-greyOutlineSecondary px-6 py-5 sm:min-w-0 sm:border-r-0 sm:px-4">
          <p className="text-sm text-greyPrimary">{t("dashboard.completedCount")}</p>
          <p className="mt-1 font-[Georgia,serif] text-[36px] leading-none tabular-nums">
            {dashboard.stats.completedCount}
          </p>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-5 bg-darkPrimary px-7 py-5 text-white sm:col-span-2 sm:px-4">
          <p className="text-sm text-white/65">{t("dashboard.spent")}</p>
          <div className="flex flex-wrap justify-end gap-x-5 gap-y-1">
            {dashboard.stats.completedSpendByCurrency.length ? (
              dashboard.stats.completedSpendByCurrency.map((item) => (
                <p
                  key={item.currency}
                  className="font-[Georgia,serif] text-2xl text-white tabular-nums"
                >
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: item.currency,
                  }).format(item.total)}
                </p>
              ))
            ) : (
              <p className="font-[Georgia,serif] text-2xl text-white">—</p>
            )}
          </div>
        </div>
      </section>

      {dashboard.nextBooking ? (
        <section>
          <h2 className="mb-5 text-xl font-bold">{t("dashboard.nextBooking")}</h2>
          <div className="max-w-[860px]">
            <BookingCard booking={dashboard.nextBooking} featured />
          </div>
        </section>
      ) : (
        <section className="flex items-center justify-between gap-6 rounded-[24px] border border-dashed border-purplePrimary/35 bg-white p-8 sm:flex-col sm:items-start sm:p-6">
          <p className="text-greyPrimary">{t("common.empty")}</p>
          <Link
            href="/search"
            className="inline-flex rounded-xl bg-purplePrimary px-5 py-3 text-sm font-bold text-white outline-none transition-colors hover:bg-purplePrimary_hover focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2"
          >
            {t("common.findService")}
          </Link>
        </section>
      )}

      {dashboard.upcomingBookings.length > 0 ? (
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="text-xl font-bold">{t("dashboard.upcoming")}</h2>
            <Link
              href="/cabinet/bookings"
              className="rounded-md text-sm font-bold text-purplePrimary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-purplePrimary"
            >
              {t("bookings.title")}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
            {dashboard.upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recentHistory.length > 0 ? (
        <section>
          <h2 className="mb-5 text-xl font-bold">{t("dashboard.history")}</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
            {dashboard.recentHistory.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
