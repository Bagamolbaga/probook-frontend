"use client";

import axios from "axios";
import {
  Activity,
  ArrowLeft,
  CalendarPlus,
  CircleQuestionMark,
  Clock3,
  HeartPulse,
  Info,
  Languages,
  Mail,
  MapPin,
  Phone,
  Star,
  WalletCards,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import {
  useCancelCustomerBookingMutation,
  useCustomerBookingQuery,
  useCustomerBookingReviewQuery,
} from "@/src/api/queries/customer";
import { Button } from "@/src/components/ui/button";
import ConfirmationModal from "@/src/components/ui/modal/ConfirmationModal";
import { toaster } from "@/src/components/ui/toaster";
import {
  DATE_FNS_LOCALES,
  Link,
  useLocale,
  useRouter,
  useTranslations,
} from "@/src/i18n";
import { formatBookingTime } from "./components/BookingCard";
import QueryState from "./components/QueryState";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getYandexMapsUrl } from "@/src/utils/getYandexMapsUrl";
import RescheduleModal from "./components/RescheduleModal";
import { format } from "date-fns";
import { CustomerBookingStatus } from "@/src/api/entities/customer";
import BookingStatusBadge from "./components/BookingStatusBadge";

const timeFromSlot = (slot: number) => {
  const minutes = slot * 15;
  return `${Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0")}:${(minutes % 60).toString().padStart(2, "0")}`;
};

const statusStyles = {
  PENDING: "bg-yellowPrimary text-white",
  CONFIRMED: "bg-greenPrimary text-white",
  COMPLETED: "bg-purplePrimary text-white",
  CANCELLED: "bg-[#D800271A] text-[#D80027]",
} as const;

export default function CustomerBookingDetailScene({ bookingId }: { bookingId: string }) {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingQuery = useCustomerBookingQuery(bookingId);
  const reviewQuery = useCustomerBookingReviewQuery(bookingId);
  const cancelMutation = useCancelCustomerBookingMutation();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const booking = bookingQuery.data;
  const review = reviewQuery.data;
  const shouldOpenReschedule = searchParams.get("reschedule") === "true";

  useEffect(() => {
    if (shouldOpenReschedule && booking?.allowedActions.reschedule) {
      setRescheduleOpen(true);
    }
  }, [booking?.allowedActions.reschedule, shouldOpenReschedule]);

  if (bookingQuery.isLoading || bookingQuery.isError || !booking) {
    return (
      <QueryState
        loading={bookingQuery.isLoading}
        error={bookingQuery.isError}
        onRetry={() => void bookingQuery.refetch()}
      />
    );
  }

  const currency = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: booking.company.currency,
  });
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${booking.date}T12:00:00`));
  const createdAt = new Intl.DateTimeFormat(locale, {
    minute: "2-digit",
    hour: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(booking.createdAt));
  const updatedAt = new Intl.DateTimeFormat(locale, {
    minute: "2-digit",
    hour: "2-digit",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(booking.updatedAt));
  const reviewCreatedAt =
    review &&
    new Intl.DateTimeFormat(locale, {
      minute: "2-digit",
      hour: "2-digit",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(review.createdAt));

  const duration = booking.services.reduce(
    (total, service) => total + service.selectedOption.duration,
    0
  );
  const reference = booking.id.slice(-8).toUpperCase();
  const specialistInitials = booking.specialist.fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

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

  const openReschedule = () => {
    setRescheduleOpen(true);
  };

  const closeReschedule = () => {
    setRescheduleOpen(false);
  };

  const repeatHref = `/company/${booking.company._id}/booking-creation?services=${booking.services
    .map((service) => service.id)
    .join(",")}&options=${booking.services
    .map((service) => service.selectedOption.id)
    .join(",")}&repeat=1`;

  const actionsCard = (
    <>
      <h2 className="font-funnel text-lg font-bold sm:text-[15px]">
        {t("detail.management")}
      </h2>
      <p className="mt-2 text-[11px] leading-4 text-greyPrimary ">
        {t("detail.managementDescription")}
      </p>
      <div className="mt-4 space-y-2.5 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
        {booking.allowedActions.reschedule && (
          <button
            type="button"
            onClick={rescheduleOpen ? closeReschedule : openReschedule}
            className="w-full rounded-xl bg-purplePrimary px-4 py-3 text-sm font-bold text-white hover:bg-purplePrimary_hover sm:order-1 sm:px-3 sm:py-[11px]"
          >
            {t("detail.reschedule")}
          </button>
        )}
        {booking.allowedActions.cancel && (
          <button
            type="button"
            onClick={() => setCancelOpen(true)}
            className="w-full rounded-xl border border-[#D80027] px-4 py-3 text-sm font-bold text-[#D80027] hover:bg-[#D800271A] sm:order-3 sm:col-span-2 sm:px-3 sm:py-[11px]"
          >
            {t("detail.cancel")}
          </button>
        )}
        {booking.allowedActions.repeat && (
          <Link
            href={repeatHref}
            className="block w-full rounded-xl bg-greyOutline px-4 py-3 text-center text-sm font-bold hover:bg-greyBackground sm:order-2 sm:px-3 sm:py-[11px]"
          >
            {t("detail.repeat")}
          </Link>
        )}
      </div>
    </>
  );

  const completedCard = (
    <>
      <span className="flex size-12 items-center justify-center rounded-[14px] bg-purpleExtraLight text-purplePrimary">
        <Star className="size-[22px]" />
      </span>
      <h2 className="font-funnel mt-3.5 text-[19px] font-bold">
        {t("review.entryTitle")}
      </h2>
      <p className="mt-2 text-[11px] leading-[1.45] text-greyPrimary">
        {t("review.entryDescription")}
      </p>
      {booking.allowedActions.review ? (
        <>
          <Link
            href={`/cabinet/bookings/${booking.id}/review`}
            className="mt-3.5 block w-full rounded-xl bg-purplePrimary px-4 py-3 text-center text-[13px] font-bold text-white outline-none hover:bg-purplePrimary_hover focus-visible:ring-2 focus-visible:ring-purplePrimary"
          >
            {t("review.leave")}
          </Link>
          <p className="mt-2 text-center text-[9px] text-greyPrimary">
            {t("review.linkedToBooking")}
          </p>
        </>
      ) : (
        <p className="mt-3 text-[11px] text-greyPrimary">
          {t("review.alreadySubmitted")}
        </p>
      )}
    </>
  );

  const reviewCard = review && (
    <>
      <h2 className="font-funnel text-lg font-bold sm:text-[15px]">Спасибо за отзыв</h2>
      <div className="mt-2 flex items-center gap-1">
        {Array.from({ length: review.rating }).map((_, idx) => (
          <span
            key={`colored_${idx}`}
            className="flex size-10 items-center justify-center rounded-[14px] bg-purpleExtraLight text-purplePrimary"
          >
            <Star className="size-[20px]" />
          </span>
        ))}
        {Array.from({ length: 5 - review.rating }).map((_, idx) => (
          <span
            key={`colored_${idx}`}
            className="flex size-10 items-center justify-center rounded-[14px] bg-greyOutlineSecondary text-greyPrimary"
          >
            <Star className="size-[20px]" />
          </span>
        ))}
      </div>
      <p className="mt-3 p-2 rounded-md text-sm text-darkPrimary bg-purpleExtraLight">
        {review.comment}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs font-semibold text-greyPrimary">Отзыв опубликован</p>
        <p className="text-xs text-greyPrimary">
          {format(review.createdAt, "dd MMMM yyyy", { locale: DATE_FNS_LOCALES[locale] })}
        </p>
      </div>
    </>
  );

  const infoCard = ({
    icon,
    title,
    text,
  }: {
    icon?: ReactNode;
    title?: string;
    text: string;
  }) => (
    <section className="rounded-[14px] bg-purpleExtraLight p-4 sm:order-last sm:rounded-xl sm:px-[11px] sm:py-[9px]">
      <h2 className="flex items-center gap-2 text-xs font-bold text-darkPrimary">
        {icon}
        <span>{title}</span>
      </h2>
      <p className="mt-2 text-[10px] leading-[1.45] text-grey-800 sm:mt-0 sm:flex sm:items-center sm:gap-2 sm:text-[8px] sm:leading-[1.3]">
        {text}
      </p>
    </section>
  );

  const renderCard = () => {
    if (review) return reviewCard;
    if (booking.status === "COMPLETED") return completedCard;

    return actionsCard;
  };

  return (
    <div className="flex flex-1 min-h-full flex-col gap-6 sm:gap-3">
      <header className="flex items-center justify-between gap-5 sm:gap-2">
        <div className="flex min-w-0 items-center gap-3 sm:gap-2">
          <Link
            href="/cabinet/bookings"
            className="flex size-[42px] shrink-0 items-center justify-center rounded-full border border-greyOutline bg-white text-lg outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary sm:size-[38px]"
            aria-label={t("detail.back")}
          >
            <ArrowLeft className="size-[18px]" />
          </Link>
          <div className="min-w-0">
            <h1 className="font-funnel truncate text-[29px] font-bold leading-tight tracking-[-0.02em] sm:text-lg">
              {t("detail.title")}
            </h1>
            <p className="mt-1 text-[11px] text-greyPrimary sm:mt-0.5 sm:text-[9px]">
              {t("detail.reference", { reference })}
            </p>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_330px] gap-6 md:grid-cols-1 sm:grid-cols-1">
        <div className="flex min-w-0 flex-col gap-[18px]">
          <section className="flex h-44 min-h-[176px] flex-col justify-between rounded-[18px] bg-[#1C1D21] p-6 sm:h-[135px] sm:min-h-[135px] sm:rounded-2xl sm:p-4">
            <div className="flex items-start justify-between gap-6 sm:gap-3">
              <div className="min-w-0">
                <h2 className="font-funnel truncate text-[31px] font-bold leading-none text-white sm:text-[23px]">
                  {formattedDate}
                </h2>
                <p className="mt-1 text-[13px] font-medium text-[#8181A5] sm:text-[10px] sm:font-normal">
                  {formatBookingTime(booking)} · {booking.company.timezone}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <BookingStatusBadge status={booking.status} />
                <>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.8px] text-[#8181A5]">
                    {t("detail.total")}
                  </p>
                  <p className="font-funnel mt-1 text-[22px] font-bold leading-none text-white sm:mt-0 sm:text-[15px]">
                    {currency.format(booking.totalPrice)}
                  </p>
                </>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-[11px] sm:gap-2">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-[#603FEF] text-white sm:size-8 sm:rounded-[10px]">
                {booking.company.logo ? (
                  <Image
                    alt={booking.company.name}
                    src={booking.company.logo}
                    width={40}
                    height={40}
                  />
                ) : (
                  <Activity className="size-[19px]" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-bold leading-none text-white sm:text-[11px]">
                  {booking.company.name}
                </p>
                <p className="mt-[3px] truncate text-[10px] leading-none text-[#8181A5] sm:text-[8px]">
                  {booking.company.address || booking.company.city}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-greyOutline bg-white p-5 sm:rounded-[14px] sm:p-[13px]">
            <div className="flex items-center justify-between">
              <h2 className="font-funnel text-lg font-bold sm:text-[15px]">
                {t("detail.services")}
              </h2>

              <span className="text-[10px] text-greyPrimary ">
                {t("detail.serviceCount", { count: booking.services.length })}
              </span>
            </div>
            <div className="mt-4 space-y-4 sm:mt-2 sm:space-y-3">
              {booking.services.map((service) => (
                <div key={service._id} className="flex items-center gap-3.5 sm:flex-wrap">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-[13px] overflow-hidden bg-purpleExtraLight text-lg text-purplePrimary ">
                    {service.image ? (
                      <Image
                        alt={service.name}
                        src={service.image}
                        width={48}
                        height={48}
                      />
                    ) : (
                      <HeartPulse className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold sm:whitespace-normal sm:text-[11px] sm:leading-[1.25]">
                      {service.name}
                    </p>
                    <p className="mt-1 text-[11px] text-greyPrimary sm:text-[9px]">
                      {service.selectedOption.name || t("detail.serviceOption")} ·{" "}
                      {service.selectedOption.duration} {t("detail.minutes")}
                    </p>
                  </div>
                  <span className="shrink-0 text-[13px] font-bold ">
                    {currency.format(service.selectedOption.price)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-greyOutline bg-white p-5 sm:rounded-[14px] sm:p-[13px]">
            <h2 className="font-funnel text-lg font-bold sm:text-[15px]">
              {t("detail.specialist")}
            </h2>
            <div className="mt-4 flex items-center justify-between gap-3.5 sm:mt-2">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-[13px] overflow-hidden bg-purpleExtraLight text-lg text-purplePrimary ">
                {booking.specialist.avatar ? (
                  <Image
                    alt={booking.specialist.fullName}
                    src={booking.specialist.avatar}
                    width={48}
                    height={48}
                  />
                ) : (
                  specialistInitials
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="mt-1 text-sm font-bold sm:mt-0.5 sm:text-[11px]">
                  {booking.specialist.fullName}
                </p>
                <p className="mt-1 truncate text-[10px] text-greyPrimary ">
                  {booking.specialist.specialties.join(", ")}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-1.5">
                {booking.company.phone && (
                  <a
                    href={`tel:${booking.company.phone}`}
                    className="flex size-[38px] items-center justify-center rounded-full border border-greyOutline outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary sm:size-[34px] sm:border-0 sm:bg-greyOutline"
                    aria-label={booking.company.phone}
                  >
                    <Phone className="size-[18px]" />
                  </a>
                )}
                <a
                  href={`mailto:${booking.company.contactEmail}`}
                  className="flex size-[38px] items-center justify-center rounded-full border border-greyOutline outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary "
                  aria-label={booking.company.contactEmail}
                >
                  <Mail className="size-[18px]" />
                </a>
                {booking.company.pos && (
                  <a
                    href={getYandexMapsUrl(booking.company.pos)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex size-[38px] items-center justify-center rounded-full border border-greyOutline outline-none hover:border-purplePrimary focus-visible:ring-2 focus-visible:ring-purplePrimary sm:size-[34px] sm:border-0 sm:bg-greyOutline"
                    aria-label={t("detail.openMap")}
                  >
                    <MapPin className="size-[18px]" />
                  </a>
                )}
              </div>
            </div>
          </section>
        </div>

        <aside className="flex flex-col gap-[18px] sm:gap-3">
          <section className="rounded-2xl border border-greyOutline bg-white p-5">
            {renderCard()}
          </section>

          {(["PENDING", "CONFIRMED"] as CustomerBookingStatus[]).includes(
            booking.status
          ) &&
            infoCard({
              icon: <Info className="size-4 text-purplePrimary" />,
              title: t("detail.changeTerms"),
              text: t("detail.cutoff"),
            })}

          <section className="rounded-2xl border border-greyOutline bg-white p-5 ">
            <h2 className="font-funnel text-[17px] font-bold">{t("detail.details")}</h2>
            <dl className="mt-4 space-y-4 text-xs">
              <div className="flex gap-3">
                <span className="flex size-8 items-center justify-center rounded-[10px] bg-greyOutline">
                  <CalendarPlus className="size-4" />
                </span>
                <div>
                  <dt className="text-[9px] text-greyPrimary">{t("detail.created")}</dt>
                  <dd className="mt-0.5 font-bold">{createdAt}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex size-8 items-center justify-center rounded-[10px] bg-greyOutline">
                  <CalendarPlus className="size-4" />
                </span>
                <div>
                  <dt className="text-[9px] text-greyPrimary">{t("detail.updated")}</dt>
                  <dd className="mt-0.5 font-bold">{updatedAt}</dd>
                </div>
              </div>
              {reviewCreatedAt && (
                <div className="flex gap-3">
                  <span className="flex size-8 items-center justify-center rounded-[10px] bg-greyOutline">
                    <CalendarPlus className="size-4" />
                  </span>
                  <div>
                    <dt className="text-[9px] text-greyPrimary">Оставлен отзыв</dt>
                    <dd className="mt-0.5 font-bold">{reviewCreatedAt}</dd>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <span className="flex size-8 items-center justify-center rounded-[10px] bg-greyOutline">
                  <Languages className="size-4" />
                </span>
                <div>
                  <dt className="text-[9px] text-greyPrimary">
                    {t("detail.notificationLanguage")}
                  </dt>
                  <dd className="mt-0.5 font-bold">
                    {booking.customerLocale.toUpperCase()}
                  </dd>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex size-8 items-center justify-center rounded-[10px] bg-greyOutline">
                  <WalletCards className="size-4" />
                </span>
                <div>
                  <dt className="text-[9px] text-greyPrimary">{t("detail.payment")}</dt>
                  <dd className="mt-0.5 font-bold">{t("detail.paymentAtCompany")}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex size-8 items-center justify-center rounded-[10px] bg-greyOutline">
                  <Clock3 className="size-4" />
                </span>
                <div>
                  <dt className="text-[9px] text-greyPrimary">{t("detail.duration")}</dt>
                  <dd className="mt-0.5 font-bold">
                    {duration} {t("detail.minutes")}
                  </dd>
                </div>
              </div>
            </dl>
          </section>

          {!booking.allowedActions.cancel &&
            !booking.allowedActions.reschedule &&
            infoCard({
              icon: <CircleQuestionMark className="size-4 text-purplePrimary" />,
              title: "Есть вопросы?",
              text: t("common.contactCompany"),
            })}
        </aside>
      </div>

      <ConfirmationModal
        isOpen={cancelOpen}
        title={t("detail.confirmCancel")}
        subTitle={t("detail.cancelDescription")}
        negativeLabel={t("detail.back")}
        positiveLabel={t("detail.cancel")}
        negativeHandler={() => setCancelOpen(false)}
        pozitiveHandler={() => void cancel()}
      />

      <RescheduleModal
        booking={booking}
        isOpen={rescheduleOpen}
        onClose={closeReschedule}
      />
    </div>
  );
}
