"use client";

import { useMemo, useState } from "react";
import type { CustomerBookingsView } from "@/api/entities/customer";
import { useCustomerBookingsQuery } from "@/api/queries/customer";
import Button from "@/components/ui/button";
import { useTranslations } from "@/i18n";
import BookingCard from "./components/BookingCard";
import QueryState from "./components/QueryState";

const views: CustomerBookingsView[] = ["upcoming", "past", "cancelled"];

export default function CustomerBookingsScene() {
  const t = useTranslations("customerCabinet");
  const [view, setView] = useState<CustomerBookingsView>("upcoming");
  const [companyId, setCompanyId] = useState("");
  const query = useCustomerBookingsQuery(view, companyId || undefined);
  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.items) || [],
    [query.data?.pages]
  );
  const companies = useMemo(
    () =>
      Array.from(
        new Map(
          items.map((booking) => [booking.company._id, booking.company.name])
        ).entries()
      ),
    [items]
  );

  return (
    <div className="space-y-9">
      <header className="max-w-[720px]">
        <h1 className="font-[Georgia,serif] text-[48px] font-normal leading-[1.08] tracking-[-0.025em] text-darkPrimary sm:text-[38px]">
          {t("bookings.title")}
        </h1>
        <p className="mt-3 text-lg leading-7 text-greyPrimary sm:text-base">
          {t("bookings.subtitle")}
        </p>
      </header>

      <div className="flex items-end justify-between gap-6 border-b border-greyOutlineSecondary sm:flex-col sm:items-stretch sm:gap-4">
        <div className="flex gap-7 overflow-x-auto" role="tablist">
          {views.map((item) => {
            const active = view === item;

            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                className={`relative whitespace-nowrap pb-4 text-sm font-bold outline-none transition-colors after:absolute after:inset-x-0 after:bottom-[-1px] after:h-0.5 focus-visible:ring-2 focus-visible:ring-purplePrimary ${
                  active
                    ? "text-darkPrimary after:bg-purplePrimary"
                    : "text-greyPrimary after:bg-transparent hover:text-darkPrimary"
                }`}
                onClick={() => {
                  setView(item);
                  setCompanyId("");
                }}
              >
                {t(`bookings.${item}`)}
              </button>
            );
          })}
        </div>

        <label className="mb-2 flex items-center gap-2 text-sm text-greyPrimary sm:mb-4">
          <span className="sr-only">{t("bookings.allCompanies")}</span>
          <select
            className="w-full min-w-[190px] rounded-xl border border-greyOutlineSecondary bg-white px-4 py-2.5 font-bold text-darkPrimary outline-none transition-colors hover:border-greyPrimary focus:border-purplePrimary focus:ring-2 focus:ring-purpleExtraLight"
            value={companyId}
            onChange={(event) => setCompanyId(event.target.value)}
          >
            <option value="">{t("bookings.allCompanies")}</option>
            {companies.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <QueryState
        loading={query.isLoading}
        error={query.isError}
        empty={!query.isLoading && !query.isError && items.length === 0}
        onRetry={() => void query.refetch()}
      />

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
          {items.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </div>
      ) : null}

      {query.hasNextPage ? (
        <Button
          className="mx-auto min-w-[160px]"
          variant="outline"
          disabled={query.isFetchingNextPage}
          onClick={() => void query.fetchNextPage()}
        >
          {t("bookings.loadMore")}
        </Button>
      ) : null}
    </div>
  );
}
