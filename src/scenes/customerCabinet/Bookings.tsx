"use client";

import { ArrowRight, ArrowUpDown, Building2, Info, Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type {
  CustomerBookingStatus,
  CustomerBookingsView,
} from "@/src/api/entities/customer";
import { useCustomerBookingsQuery } from "@/src/api/queries/customer";
import { Button } from "@/src/components/ui/button";
import AppSelect from "@/src/components/ui/inputs/AppSelect";
import { Link, useLocale, useTranslations } from "@/src/i18n";
import CustomScrollbar from "@/src/styles/scrollbar.module.sass";
import BookingCard, { formatBookingTime } from "./components/BookingCard";
import BookingsCalendar, { toDateKey } from "./components/BookingsCalendar";
import QueryState from "./components/QueryState";
import { cn } from "@/src/utils/cn";

const views: CustomerBookingsView[] = ["upcoming", "past", "cancelled"];

const statusColors: Record<CustomerBookingStatus, string> = {
  PENDING: "#FCDA00",
  CONFIRMED: "#7CE7AC",
  COMPLETED: "#4CCE18",
  CANCELLED: "#FCE5E9",
};

type CompanyFilterOption = { id: string; name: string };

export default function CustomerBookingsScene() {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const [view, setView] = useState<CustomerBookingsView>("upcoming");
  const companyFilterForm = useForm<{ company: CompanyFilterOption }>({
    defaultValues: { company: { id: "", name: "" } },
  });
  const selectedCompany = useWatch({
    control: companyFilterForm.control,
    name: "company",
  });
  const companyId = selectedCompany?.id || "";
  const [ascending, setAscending] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(toDateKey(new Date()));
  const bookingsListRef = useRef<HTMLDivElement>(null);
  const bookingsScrollTrackRef = useRef<HTMLDivElement>(null);
  const bookingsScrollThumbRef = useRef<HTMLDivElement>(null);
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
  const companyOptions = useMemo<CompanyFilterOption[]>(
    () => [
      { id: "", name: t("bookings.allCompanies") },
      ...companies.map(([id, name]) => ({ id, name })),
    ],
    [companies, t]
  );
  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const aTime = new Date(`${a.date}T00:00:00`).getTime() + Math.min(...a.slots);
        const bTime = new Date(`${b.date}T00:00:00`).getTime() + Math.min(...b.slots);
        return ascending ? aTime - bTime : bTime - aTime;
      }),
    [ascending, items]
  );
  const effectiveSelectedDate = selectedDate || sortedItems[0]?.date || null;
  const selectedDayBookings = useMemo(
    () =>
      effectiveSelectedDate
        ? sortedItems.filter((booking) => booking.date === effectiveSelectedDate)
        : [],
    [effectiveSelectedDate, sortedItems]
  );
  const updateBookingsScrollbar = useCallback(() => {
    const list = bookingsListRef.current;
    const track = bookingsScrollTrackRef.current;
    const thumb = bookingsScrollThumbRef.current;

    if (!list || !track || !thumb) return;

    const scrollableHeight = list.scrollHeight - list.clientHeight;
    const trackHeight = track.clientHeight;

    if (scrollableHeight <= 0 || trackHeight <= 0) {
      track.style.display = "none";
      return;
    }

    const thumbHeight = Math.max(
      32,
      Math.min(trackHeight, (list.clientHeight / list.scrollHeight) * trackHeight)
    );
    const thumbOffset = (list.scrollTop / scrollableHeight) * (trackHeight - thumbHeight);

    track.style.display = "block";
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${thumbOffset}px)`;
  }, []);

  useEffect(() => {
    const list = bookingsListRef.current;

    if (!list) return;

    const observer = new ResizeObserver(updateBookingsScrollbar);
    observer.observe(list);
    updateBookingsScrollbar();

    return () => observer.disconnect();
  }, [sortedItems, updateBookingsScrollbar]);

  return (
    <div className="h-full min-h-0 flex-1 flex flex-col gap-6 sm:gap-4">
      <header className="flex items-end justify-between gap-6 sm:items-center">
        <div>
          <h1 className="font-funnel text-[32px] font-bold leading-none tracking-[-0.7px] text-darkPrimary sm:text-[26px]">
            {t("bookings.title")} | {window.innerWidth}
          </h1>
          <p className="mt-1.5 text-sm text-greyPrimary sm:text-[10px]">
            <span className="sm:hidden">{t("bookings.subtitle")}</span>
            <span className="hidden sm:inline">
              {t("bookings.loadedCount", { count: items.length })}
            </span>
          </p>
        </div>
        <Link
          href="/search"
          aria-label={t("bookings.newBooking")}
          className="flex h-11 items-center gap-2 rounded-full bg-purplePrimary px-[18px] text-[13px] font-bold text-white outline-none hover:bg-purplePrimary_hover focus-visible:ring-2 focus-visible:ring-purplePrimary focus-visible:ring-offset-2 sm:size-[42px] sm:justify-center sm:p-0"
        >
          <Plus className="size-[18px]" />
          <span className="sm:hidden">{t("bookings.newBooking")}</span>
        </Link>
      </header>

      <div className="flex h-[58px] items-center justify-between gap-6 rounded-[14px] border border-greyOutline bg-white px-[14px] sm:h-auto sm:flex-col sm:items-stretch sm:gap-3 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="flex h-[42px] rounded-[10px] bg-greyOutline p-1" role="tablist">
          {views.map((item) => {
            const active = view === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                className={`flex h-[34px] items-center justify-center gap-2 rounded-lg px-[13px] text-xs outline-none transition-colors focus-visible:ring-2 focus-visible:ring-purplePrimary sm:min-w-0 sm:flex-1 sm:px-2 sm:text-[10px] ${active ? "bg-white font-bold text-darkPrimary shadow-[0_1px_3px_#0000000A]" : "font-medium text-greyPrimary hover:text-darkPrimary"}`}
                onClick={() => {
                  setView(item);
                  companyFilterForm.setValue("company", {
                    id: "",
                    name: t("bookings.allCompanies"),
                  });
                }}
              >
                {t(`bookings.${item}`)}
                {active && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-purpleExtraLight text-[9px] font-bold text-purplePrimary sm:hidden">
                    {items.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <AppSelect
            id="company"
            options={companyOptions}
            selectedOption={selectedCompany}
            setValue={companyFilterForm.setValue}
            renderLeftIcon={() => <Building2 className="size-[15px] text-greyPrimary" />}
            renderOption={(option) => <span className="text-[11px]">{option.name}</span>}
            renderOptionSelected={(option) => (
              <span className="text-[11px] font-semibold text-darkPrimary">
                {option?.name || t("bookings.allCompanies")}
              </span>
            )}
            classNames={{
              container:
                "!h-[38px] !min-w-[155px] !rounded-full !border-greyOutline !bg-white !py-0 sm:!h-10 sm:!flex-1 sm:!rounded-xl",
              selectContainer: "min-w-[180px]",
            }}
          />
          <button
            type="button"
            aria-label={t("bookings.sort")}
            aria-pressed={!ascending}
            onClick={() => setAscending((value) => !value)}
            className="flex size-[38px] shrink-0 items-center justify-center rounded-full border border-greyOutline bg-white outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary sm:hidden"
          >
            <ArrowUpDown className="size-4" />
          </button>
        </div>
      </div>

      <QueryState
        loading={query.isLoading}
        error={query.isError}
        empty={!query.isLoading && !query.isError && items.length === 0}
        onRetry={() => void query.refetch()}
      />

      {items.length > 0 ? (
        <section className="flex flex-1 min-h-0 gap-3 md:flex-col-reverse sm:flex-col-reverse">
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between sm:hidden">
              <h2 className="font-funnel text-xl font-bold">{t("bookings.nearest")}</h2>
              <p className="text-[11px] text-greyPrimary">
                {t("bookings.timezoneNotice")}
              </p>
            </div>

            <div className="relative flex min-h-0 mt-2 py-2 pr-2 rounded-2xl bg-white">
              <div
                ref={bookingsListRef}
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto rounded-2xl bg-white pr-3",
                  "md:max-h-[527px]",
                  "sm:max-h-[527px]",
                  CustomScrollbar.BookingsScrollbar
                )}
                onScroll={updateBookingsScrollbar}
              >
                {sortedItems.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-2.5 rounded-[14px] bg-purpleExtraLight px-4 py-[13px] text-[11px] text-grey-800 sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-[9px]">
              <span className="flex size-[30px] shrink-0 items-center justify-center rounded-full bg-white sm:size-auto sm:bg-transparent">
                <Info className="size-[15px] text-purplePrimary" />
              </span>
              {t("bookings.changeNotice")}
            </div>
          </div>

          <div className="mt-7 w-[420px] flex flex-col gap-3 md:w-full md:mt-0 sm:w-full sm:mt-0">
            <BookingsCalendar
              key={`${view}-${companyId}-${effectiveSelectedDate}`}
              bookings={items}
              selectedDate={effectiveSelectedDate}
              onSelectDate={setSelectedDate}
            />

            {effectiveSelectedDate && (
              <div className="rounded-2xl border border-greyOutline bg-white p-4 sm:rounded-xl sm:p-3">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="font-funnel text-lg font-bold text-darkPrimary sm:text-base">
                    {t("bookings.calendar.selectedDay", {
                      date: new Intl.DateTimeFormat(locale, {
                        day: "numeric",
                        month: "long",
                      }).format(new Date(`${effectiveSelectedDate}T12:00:00`)),
                    })}
                  </h2>
                  <span className="rounded-full bg-purpleExtraLight px-2.5 py-1 text-[10px] font-bold text-purplePrimary">
                    {t("bookings.calendar.count", { count: selectedDayBookings.length })}
                  </span>
                </div>
                {selectedDayBookings.length ? (
                  <div className="flex flex-col gap-2">
                    {selectedDayBookings.map((booking) => (
                      <Link
                        key={booking.id}
                        href={`/cabinet/bookings/${booking.id}`}
                        className="flex items-center gap-3 rounded-xl bg-greyBackgroundLight px-3 py-2.5 outline-none transition-colors hover:bg-purpleExtraLight focus-visible:ring-2 focus-visible:ring-purplePrimary"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: statusColors[booking.status] }}
                        ></span>
                        <span className="shrink-0 font-funnel text-xs font-bold tabular-nums text-purplePrimary">
                          {formatBookingTime(booking)}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs font-bold text-darkPrimary">
                          {booking.services.map((service) => service.name).join(", ")}
                        </span>
                        <span className="truncate text-[10px] text-greyPrimary sm:hidden">
                          {booking.company.name}
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-purplePrimary" />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-greyPrimary">
                    {t("bookings.calendar.emptyDay")}
                  </p>
                )}
              </div>
            )}
          </div>
        </section>
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
