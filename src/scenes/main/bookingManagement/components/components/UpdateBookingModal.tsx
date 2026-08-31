/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FC, ReactNode, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLocale, useTranslations } from "next-intl";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import CloseIcon from "@/components/ui/icons/Close";
import EmailIcon from "@/components/ui/icons/Email";
import MoneyIcon from "@/components/ui/icons/Money";
import PersonIcon from "@/components/ui/icons/Person";
import StoreIcon from "@/components/ui/icons/Store";
import { BOOKING_STATUS_STYLES } from "@/constants/bookingStatuses";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import type { UpdateBookingForm } from "./types";
import BookingEditForm from "./BookingEditForm";

type Props = {
  isOpen: boolean;
  updateBookingForm: UseFormReturn<UpdateBookingForm>;
  handleClose: () => void;
};

type SectionProps = {
  icon: ReactNode;
  title: string;
  children: ReactNode;
};

type DetailProps = {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
};

const statusConfig: Record<
  UpdateBookingForm["status"],
  { labelKey: string; containerClassName: string; dotClassName: string }
> = {
  BLOCKED: {
    labelKey: "blocked",
    containerClassName: BOOKING_STATUS_STYLES.BLOCKED.badgeClassName,
    dotClassName: BOOKING_STATUS_STYLES.BLOCKED.dotClassName,
  },
  PENDING: {
    labelKey: "pending",
    containerClassName: BOOKING_STATUS_STYLES.PENDING.badgeClassName,
    dotClassName: BOOKING_STATUS_STYLES.PENDING.dotClassName,
  },
  COMPLETED: {
    labelKey: "completed",
    containerClassName: BOOKING_STATUS_STYLES.COMPLETED.badgeClassName,
    dotClassName: BOOKING_STATUS_STYLES.COMPLETED.dotClassName,
  },
  OFF: {
    labelKey: "cancelled",
    containerClassName: BOOKING_STATUS_STYLES.OFF.badgeClassName,
    dotClassName: BOOKING_STATUS_STYLES.OFF.dotClassName,
  },
  CONFIRMED: {
    labelKey: "confirmed",
    containerClassName: BOOKING_STATUS_STYLES.CONFIRMED.badgeClassName,
    dotClassName: BOOKING_STATUS_STYLES.CONFIRMED.dotClassName,
  },
};

const Section = ({ icon, title, children }: SectionProps) => (
  <section className="rounded-lg border border-greyOutline bg-white p-4">
    <div className="mb-3 flex items-center gap-2">
      <div className="flex size-7 shrink-0 items-center justify-center [&_svg]:size-[18px] [&_svg]:stroke-purplePrimary">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-darkPrimary">{title}</h3>
    </div>
    {children}
  </section>
);

const Detail = ({ icon, label, value }: DetailProps) => (
  <div className="min-w-0">
    <p className="mb-1 text-xs text-greyPrimary">{label}</p>
    <div className="flex min-w-0 items-center gap-2 text-sm font-bold text-darkPrimary [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-greyPrimary">
      {icon}
      <div className="min-w-0 break-words">{value}</div>
    </div>
  </div>
);

const Initials = ({ firstName, lastName }: { firstName: string; lastName: string }) => (
  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purpleExtraLight text-xs font-bold uppercase text-purplePrimary">
    {firstName.charAt(0)}
    {lastName.charAt(0)}
  </div>
);

const UpdateBookingModal: FC<Props> = ({ isOpen, updateBookingForm, handleClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditDirty, setIsEditDirty] = useState(false);
  const booking = updateBookingForm.getValues();
  const locale = useLocale();
  const t = useTranslations();
  const status = statusConfig[booking.status];
  const totalDuration = booking.services.reduce(
    (total, service) => total + service.selectedOption.duration,
    0
  );
  const formatDateTime = (value?: string) => {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  };

  const formattedDate = booking.date
    ? new Intl.DateTimeFormat(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(booking.date)
    : "—";
  const handleModalClose = () => {
    if (
      isEditing &&
      isEditDirty &&
      !window.confirm(t("bookingManagement.detailModal.edit.discardConfirm"))
    ) {
      return;
    }

    setIsEditing(false);
    setIsEditDirty(false);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} enableMobile handleClose={handleModalClose}>
      <div className="w-[680px] max-w-[calc(100vw-40px)] sm:w-full sm:max-w-none">
        <header className="flex items-start justify-between gap-4 border-b border-greyOutline px-5 py-4 sm:px-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-darkPrimary">
                {t("bookingManagement.detailModal.booking", { id: booking.bookingId })}
              </h2>
              <div
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold",
                  status.containerClassName
                )}
              >
                <span className={cn("size-1.5 rounded-full", status.dotClassName)} />
                {t(`bookingManagement.detailModal.statuses.${status.labelKey}` as any)}
              </div>
            </div>
            <p className="mt-1.5 text-sm capitalize text-greyPrimary">
              {formattedDate} · {booking.time?.start || "—"}–{booking.time?.end || "—"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {!isEditing ? (
              <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                {t("bookingManagement.detailModal.edit.action")}
              </Button>
            ) : null}
            <Button
              aria-label={t("bookingManagement.detailModal.close")}
              className="size-8 shrink-0 p-0"
              variant="resting-active"
              onClick={handleModalClose}
            >
              <CloseIcon className="size-4" />
            </Button>
          </div>
        </header>

        {isEditing ? (
          <BookingEditForm
            updateBookingForm={updateBookingForm}
            onCancel={() => {
              setIsEditing(false);
              setIsEditDirty(false);
            }}
            onSaved={() => {
              setIsEditing(false);
              setIsEditDirty(false);
            }}
            onDirtyChange={setIsEditDirty}
          />
        ) : (
          <div className="max-h-[calc(100vh-160px)] overflow-y-auto bg-greyBackground/30 px-5 py-4 sm:px-4">
            <div className="mb-3 grid grid-cols-3 gap-2.5 sm:grid-cols-1">
              <div className="rounded-lg border border-greenPrimary/50 bg-greenPrimary/10 p-3.5">
                <p className="text-xs text-greyPrimary">
                  {t("bookingManagement.detailModal.time")}
                </p>
                <p className="mt-1 text-sm font-bold text-darkPrimary">
                  {booking.time?.start || "—"}–{booking.time?.end || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-yellowPrimary/50 bg-yellowPrimary/10 p-3.5">
                <p className="text-xs text-greyPrimary">
                  {t("bookingManagement.detailModal.duration")}
                </p>
                <p className="mt-1 text-sm font-bold text-darkPrimary">
                  {t("bookingManagement.detailModal.minutes", { count: totalDuration })}
                </p>
              </div>
              <div className="rounded-lg border border-purplePrimary/50 bg-purplePrimary/10 p-3.5">
                <p className="text-xs text-greyPrimary">
                  {t("bookingManagement.detailModal.total")}
                </p>
                <p className="mt-1 text-sm font-bold text-darkPrimary">
                  {formatCurrency(booking.totalPrice)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Section
                icon={<PersonIcon />}
                title={t("bookingManagement.detailModal.customer")}
              >
                <div className="flex items-center gap-3">
                  <Initials
                    firstName={booking.customer.firstName}
                    lastName={booking.customer.lastName}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-darkPrimary">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </p>
                    <p className="mt-1 flex items-center gap-2 truncate text-sm text-greyPrimary">
                      <EmailIcon className="size-4 shrink-0 stroke-greyPrimary" />
                      {booking.customer.email ||
                        t("bookingManagement.detailModal.emailNotProvided")}
                    </p>
                  </div>
                </div>
              </Section>

              <Section
                icon={<PersonIcon />}
                title={t("bookingManagement.detailModal.specialist")}
              >
                {booking.assignee ? (
                  <div className="flex items-center gap-3">
                    <Initials
                      firstName={booking.assignee.firstName}
                      lastName={booking.assignee.lastName}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-darkPrimary">
                        {booking.assignee.fullName}
                      </p>
                      <p className="mt-1 flex items-center gap-2 truncate text-sm text-greyPrimary">
                        <EmailIcon className="size-4 shrink-0 stroke-greyPrimary" />
                        {booking.assignee.email ||
                          t("bookingManagement.detailModal.emailNotProvided")}
                      </p>
                      {booking.assignee.specialties.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {booking.assignee.specialties.map((specialty) => (
                            <span
                              className="rounded-full bg-greyBackgroundLight px-2 py-0.5 text-[11px] text-greyPrimary"
                              key={specialty}
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-greyPrimary">
                    {t("bookingManagement.detailModal.specialistNotAssigned")}
                  </p>
                )}
              </Section>

              <Section
                icon={<StoreIcon />}
                title={t("bookingManagement.detailModal.services")}
              >
                {booking.services.length ? (
                  <div className="divide-y divide-greyOutline">
                    {booking.services.map((service) => (
                      <div
                        className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                        key={service.id}
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-darkPrimary">
                            {service.name}
                          </p>
                          <p className="mt-1 text-xs text-greyPrimary">
                            {[service.category?.name, service.selectedOption.name]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                          <p className="mt-1 text-xs text-greyPrimary">
                            {t("bookingManagement.detailModal.minutes", {
                              count: service.selectedOption.duration,
                            })}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-darkPrimary">
                          {formatCurrency(service.selectedOption.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-greyPrimary">
                    {t("bookingManagement.detailModal.noServices")}
                  </p>
                )}
              </Section>

              <Section
                icon={<CalendarIcon />}
                title={t("bookingManagement.detailModal.bookingInformation")}
              >
                <div className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-1">
                  <Detail
                    icon={<CalendarIcon />}
                    label={t("bookingManagement.detailModal.date")}
                    value={formattedDate}
                  />
                  <Detail
                    icon={<ClockIcon />}
                    label={t("bookingManagement.detailModal.time")}
                    value={`${booking.time?.start || "—"}–${booking.time?.end || "—"}`}
                  />
                  <Detail
                    icon={<MoneyIcon />}
                    label={t("bookingManagement.detailModal.total")}
                    value={formatCurrency(booking.totalPrice)}
                  />
                  <Detail
                    label={t("bookingManagement.detailModal.reference")}
                    value={`#${booking.bookingId}`}
                  />
                  <Detail
                    label={t("bookingManagement.detailModal.created")}
                    value={formatDateTime(booking.createdAt)}
                  />
                  <Detail
                    label={t("bookingManagement.detailModal.lastUpdated")}
                    value={formatDateTime(booking.updatedAt)}
                  />
                </div>
              </Section>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UpdateBookingModal;
