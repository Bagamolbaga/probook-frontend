"use client";

import axios from "axios";
import { useState } from "react";
import { useGetBookingAvailabilityQuery } from "@/api/queries/booking";
import {
  useCancelCustomerBookingMutation,
  useCustomerBookingQuery,
  useRescheduleCustomerBookingMutation,
} from "@/api/queries/customer";
import Button from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import { toaster } from "@/components/ui/toaster";
import { Link, useLocale, useRouter, useTranslations } from "@/i18n";
import { formatBookingTime } from "./components/BookingCard";
import QueryState from "./components/QueryState";

const timeFromSlot = (slot: number) => {
  const minutes = slot * 15;
  return `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
};

export default function CustomerBookingDetailScene({ bookingId }: { bookingId: string }) {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const router = useRouter();
  const query = useCustomerBookingQuery(bookingId);
  const cancelMutation = useCancelCustomerBookingMutation();
  const rescheduleMutation = useRescheduleCustomerBookingMutation();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<number[]>([]);
  const booking = query.data;
  const availability = useGetBookingAvailabilityQuery({
    companyId: booking?.company._id || "",
    bookingId,
    specialistId: booking?.specialist._id || "",
    date,
  });

  if (query.isLoading || query.isError || !booking) {
    return (
      <QueryState
        loading={query.isLoading}
        error={query.isError}
        onRetry={() => void query.refetch()}
      />
    );
  }

  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: booking.company.currency,
  });
  const formattedDate = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${booking.date}T12:00:00`));
  const durationSlots = Math.max(1, booking.slots.length);

  const selectStart = (slot: number) => {
    const selected = Array.from({ length: durationSlots }, (_, index) => slot + index);
    if (selected.every((value) => availability.data?.availableSlots.includes(value))) {
      setSlots(selected);
    }
  };

  const mutationError = (error: unknown) => {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    toaster.error(
      status === 409
        ? t("detail.conflict")
        : status === 422
          ? t("detail.cutoff")
          : t("common.error")
    );
  };

  const cancel = async () => {
    try {
      await cancelMutation.mutateAsync(bookingId);
      setCancelOpen(false);
      router.push("/cabinet/bookings");
    } catch (error) {
      mutationError(error);
    }
  };

  const reschedule = async () => {
    try {
      await rescheduleMutation.mutateAsync({ bookingId, date, slots });
      setRescheduleOpen(false);
      setSlots([]);
    } catch (error) {
      mutationError(error);
    }
  };

  return (
    <div className="space-y-7">
      <Link
        href="/cabinet/bookings"
        className="inline-flex rounded-md text-sm font-bold text-purplePrimary outline-none underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-purplePrimary"
      >
        {t("detail.back")}
      </Link>

      <article className="overflow-hidden rounded-[26px] border border-greyOutlineSecondary bg-white">
        <div className="grid grid-cols-[240px_1fr] border-b border-greyOutlineSecondary sm:grid-cols-1">
          <div className="flex flex-col justify-between border-r border-dashed border-purplePrimary/25 bg-purpleExtraLight p-7 sm:border-b sm:border-r-0">
            <p className="font-[Georgia,serif] text-[28px] leading-tight text-darkPrimary">
              {formattedDate}
            </p>
            <p className="mt-8 text-xl font-bold tabular-nums text-purplePrimary">
              {formatBookingTime(booking)}
            </p>
          </div>
          <div className="flex min-h-[220px] flex-col p-8 sm:min-h-0 sm:p-6">
            <span className="w-fit rounded-full bg-purpleExtraLight px-3 py-1 text-xs font-bold text-purplePrimary">
              {t(`status.${booking.status}`)}
            </span>
            <h1 className="mt-5 max-w-[720px] font-[Georgia,serif] text-[44px] font-normal leading-[1.08] tracking-[-0.02em] text-darkPrimary sm:text-[34px]">
              {booking.company.name}
            </h1>
            <p className="mt-auto pt-5 text-greyPrimary">
              {booking.company.address || booking.company.city}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-12 gap-y-10 p-8 sm:grid-cols-1 sm:p-6">
          <section>
            <h2 className="text-sm font-bold text-greyPrimary">{t("detail.dateTime")}</h2>
            <p className="mt-3 text-lg font-bold">
              {formattedDate}, {formatBookingTime(booking)}
            </p>
            <p className="mt-1 text-sm text-greyPrimary">
              {t("detail.timezone", { timezone: booking.company.timezone })}
            </p>
          </section>
          <section>
            <h2 className="text-sm font-bold text-greyPrimary">
              {t("detail.specialist")}
            </h2>
            <p className="mt-3 text-lg font-bold">{booking.specialist.fullName}</p>
            <p className="mt-1 text-sm text-greyPrimary">
              {booking.specialist.specialties.join(", ")}
            </p>
          </section>
          <section className="col-span-2 sm:col-span-1">
            <h2 className="text-sm font-bold text-greyPrimary">{t("detail.services")}</h2>
            <div className="mt-3 divide-y divide-greyOutlineSecondary border-y border-greyOutlineSecondary">
              {booking.services.map((service) => (
                <div key={service._id} className="flex justify-between gap-4 py-4">
                  <div>
                    <p className="font-bold">{service.name}</p>
                    {service.selectedOption.name ? (
                      <p className="mt-1 text-sm text-greyPrimary">
                        {service.selectedOption.name} · {service.selectedOption.duration}{" "}
                        min
                      </p>
                    ) : null}
                  </div>
                  <p className="shrink-0 font-bold tabular-nums">
                    {currency.format(service.selectedOption.price)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-between gap-4">
              <span className="font-bold">{t("detail.total")}</span>
              <span className="font-[Georgia,serif] text-[28px] leading-none tabular-nums">
                {currency.format(booking.totalPrice)}
              </span>
            </div>
          </section>
          <section className="col-span-2 sm:col-span-1">
            <h2 className="text-sm font-bold text-greyPrimary">{t("detail.company")}</h2>
            <div className="mt-3 flex flex-wrap gap-x-7 gap-y-2 text-sm">
              {booking.company.phone ? (
                <a
                  className="rounded-sm font-bold outline-none hover:text-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary"
                  href={`tel:${booking.company.phone}`}
                >
                  {booking.company.phone}
                </a>
              ) : null}
              <a
                className="rounded-sm font-bold text-purplePrimary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-purplePrimary"
                href={`mailto:${booking.company.contactEmail}`}
              >
                {booking.company.contactEmail}
              </a>
            </div>
          </section>
        </div>
      </article>

      <div className="flex flex-wrap gap-3">
        {booking.allowedActions.reschedule ? (
          <Button
            className="min-w-[140px]"
            variant="primary"
            onClick={() => setRescheduleOpen((open) => !open)}
          >
            {t("detail.reschedule")}
          </Button>
        ) : null}
        {booking.allowedActions.cancel ? (
          <Button variant="red-outline" onClick={() => setCancelOpen(true)}>
            {t("detail.cancel")}
          </Button>
        ) : null}
        {booking.allowedActions.repeat ? (
          <Link
            className="inline-flex items-center rounded-lg border border-purplePrimary bg-white px-[14px] py-[14px] text-sm font-bold text-purplePrimary outline-none transition-colors hover:bg-purpleExtraLight focus-visible:ring-2 focus-visible:ring-purplePrimary sm:px-2 sm:py-2"
            href={`/company/${booking.company._id}/booking-creation?services=${booking.services
              .map((service) => service.id)
              .join(",")}&options=${booking.services
              .map((service) => service.selectedOption.id)
              .join(",")}&repeat=1`}
          >
            {t("detail.repeat")}
          </Link>
        ) : null}
      </div>

      {!booking.allowedActions.cancel && !booking.allowedActions.reschedule ? (
        <p className="rounded-xl border border-purplePrimary/20 bg-purpleExtraLight p-4 text-sm">
          {t("common.contactCompany")}
        </p>
      ) : null}

      {rescheduleOpen ? (
        <section
          className="rounded-[24px] border border-greyOutlineSecondary bg-white p-8 sm:p-6"
          aria-labelledby="reschedule-heading"
        >
          <h2
            id="reschedule-heading"
            className="font-[Georgia,serif] text-[30px] font-normal leading-tight"
          >
            {t("detail.reschedule")}
          </h2>
          <label className="mt-6 block max-w-xs text-sm font-bold">
            {t("detail.newDate")}
            <input
              className="mt-2 block w-full rounded-xl border border-greyOutlineSecondary px-4 py-3 outline-none focus:border-purplePrimary focus:ring-2 focus:ring-purpleExtraLight"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setSlots([]);
              }}
            />
          </label>
          {date && availability.isLoading ? <QueryState loading /> : null}
          {availability.data ? (
            <div
              className="mt-6 grid grid-cols-8 gap-2 md:grid-cols-5 sm:grid-cols-3"
              aria-label={t("detail.slots")}
            >
              {availability.data.availableSlots.map((slot) => {
                const selected = slots[0] === slot;
                const fullDurationAvailable = Array.from(
                  { length: durationSlots },
                  (_, index) => slot + index
                ).every((value) => availability.data.availableSlots.includes(value));

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!fullDurationAvailable}
                    aria-pressed={selected}
                    className={`rounded-xl border px-2 py-2.5 text-sm tabular-nums outline-none transition-colors focus-visible:ring-2 focus-visible:ring-purplePrimary ${
                      selected
                        ? "border-purplePrimary bg-purplePrimary font-bold text-white"
                        : "border-greyOutlineSecondary bg-white hover:border-purplePrimary disabled:pointer-events-none disabled:opacity-30"
                    }`}
                    onClick={() => selectStart(slot)}
                  >
                    {timeFromSlot(slot)}
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-3">
            <Button
              variant="primary"
              disabled={!date || slots.length === 0 || rescheduleMutation.isPending}
              onClick={() => void reschedule()}
            >
              {t("detail.save")}
            </Button>
            <Button variant="resting" onClick={() => setRescheduleOpen(false)}>
              {t("detail.back")}
            </Button>
          </div>
        </section>
      ) : null}

      <ConfirmationModal
        isOpen={cancelOpen}
        title={t("detail.confirmCancel")}
        subTitle={t("detail.cancelDescription")}
        negativeLabel={t("detail.back")}
        positiveLabel={t("detail.cancel")}
        negativeHandler={() => setCancelOpen(false)}
        pozitiveHandler={() => void cancel()}
      />
    </div>
  );
}
