"use client";

import { FC, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLocale } from "next-intl";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import CloseIcon from "@/components/ui/icons/Close";
import EmailIcon from "@/components/ui/icons/Email";
import MoneyIcon from "@/components/ui/icons/Money";
import PersonIcon from "@/components/ui/icons/Person";
import StoreIcon from "@/components/ui/icons/Store";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import type { UpdateBookingForm } from "./types";

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
  { label: string; containerClassName: string; dotClassName: string }
> = {
  BLOCKED: {
    label: "Blocked",
    containerClassName: "bg-redExtraLight text-redPrimary",
    dotClassName: "bg-redPrimary",
  },
  PENDING: {
    label: "Awaiting confirmation",
    containerClassName: "bg-yellowExtraLight text-darkPrimary",
    dotClassName: "bg-yellowPrimary",
  },
  COMPLETED: {
    label: "Completed",
    containerClassName: "bg-greenExtraLight text-greenPrimary",
    dotClassName: "bg-greenPrimary",
  },
  OFF: {
    label: "Cancelled",
    containerClassName: "bg-greyBackgroundLight text-greyPrimary",
    dotClassName: "bg-greyPrimary",
  },
  CONFIRMED: {
    label: "Confirmed",
    containerClassName: "bg-greenExtraLight text-greenPrimary",
    dotClassName: "bg-greenPrimary",
  },
};

const Section = ({ icon, title, children }: SectionProps) => (
  <section className="rounded-xl border border-greyOutline bg-white p-5 sm:p-4">
    <div className="mb-4 flex items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purpleExtraLight [&_svg]:size-5 [&_svg]:stroke-purplePrimary">
        {icon}
      </div>
      <h3 className="font-bold text-darkPrimary">{title}</h3>
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
  <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-purpleExtraLight text-sm font-bold uppercase text-purplePrimary">
    {firstName.charAt(0)}
    {lastName.charAt(0)}
  </div>
);

const UpdateBookingModal: FC<Props> = ({ isOpen, updateBookingForm, handleClose }) => {
  const booking = updateBookingForm.getValues();
  const locale = useLocale();
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

  return (
    <Modal isOpen={isOpen} enableMobile handleClose={handleClose}>
      <div className="w-[720px] max-w-[calc(100vw-40px)] sm:w-full sm:max-w-none">
        <header className="flex items-start justify-between gap-4 border-b border-greyOutline px-6 py-5 sm:px-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-darkPrimary">
                Booking #{booking.bookingId}
              </h2>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold",
                  status.containerClassName
                )}
              >
                <span className={cn("size-2 rounded-full", status.dotClassName)} />
                {status.label}
              </div>
            </div>
            <p className="mt-2 text-sm capitalize text-greyPrimary">
              {formattedDate} · {booking.time?.start || "—"}–{booking.time?.end || "—"}
            </p>
          </div>
          <Button
            aria-label="Close booking details"
            className="size-9 shrink-0 p-0"
            variant="resting-active"
            onClick={handleClose}
          >
            <CloseIcon className="size-5" />
          </Button>
        </header>

        <div className="max-h-[calc(100vh-180px)] overflow-y-auto bg-greyBackground/50 px-6 py-5 sm:px-4">
          <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-1">
            <div className="rounded-xl bg-blueExtraLight p-4">
              <p className="text-xs text-greyPrimary">Time</p>
              <p className="mt-1 font-bold text-darkPrimary">
                {booking.time?.start || "—"}–{booking.time?.end || "—"}
              </p>
            </div>
            <div className="rounded-xl bg-greenExtraLight p-4">
              <p className="text-xs text-greyPrimary">Duration</p>
              <p className="mt-1 font-bold text-darkPrimary">{totalDuration} min</p>
            </div>
            <div className="rounded-xl bg-yellowExtraLight p-4">
              <p className="text-xs text-greyPrimary">Total</p>
              <p className="mt-1 font-bold text-darkPrimary">
                {formatCurrency(booking.totalPrice)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Section icon={<PersonIcon />} title="Customer">
              <div className="flex items-center gap-3">
                <Initials
                  firstName={booking.customer.firstName}
                  lastName={booking.customer.lastName}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-darkPrimary">
                    {booking.customer.firstName} {booking.customer.lastName}
                  </p>
                  <p className="mt-1 flex items-center gap-2 truncate text-sm text-greyPrimary">
                    <EmailIcon className="size-4 shrink-0 stroke-greyPrimary" />
                    {booking.customer.email || "Not provided"}
                  </p>
                </div>
              </div>
            </Section>

            <Section icon={<PersonIcon />} title="Specialist">
              {booking.assignee ? (
                <div className="flex items-center gap-3">
                  <Initials
                    firstName={booking.assignee.firstName}
                    lastName={booking.assignee.lastName}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-darkPrimary">
                      {booking.assignee.fullName}
                    </p>
                    <p className="mt-1 flex items-center gap-2 truncate text-sm text-greyPrimary">
                      <EmailIcon className="size-4 shrink-0 stroke-greyPrimary" />
                      {booking.assignee.email || "Not provided"}
                    </p>
                    {booking.assignee.specialties.length ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {booking.assignee.specialties.map((specialty) => (
                          <span
                            className="rounded-full bg-greyBackgroundLight px-2.5 py-1 text-xs text-greyPrimary"
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
                <p className="text-sm text-greyPrimary">Not assigned</p>
              )}
            </Section>

            <Section icon={<StoreIcon />} title="Services">
              {booking.services.length ? (
                <div className="divide-y divide-greyOutline">
                  {booking.services.map((service) => (
                    <div
                      className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0"
                      key={service.id}
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-darkPrimary">{service.name}</p>
                        <p className="mt-1 text-xs text-greyPrimary">
                          {[service.category?.name, service.selectedOption.name]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                        <p className="mt-1 text-xs text-greyPrimary">
                          {service.selectedOption.duration} min
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-darkPrimary">
                        {formatCurrency(service.selectedOption.price)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-greyPrimary">No services</p>
              )}
            </Section>

            <Section icon={<CalendarIcon />} title="Booking information">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-1">
                <Detail icon={<CalendarIcon />} label="Date" value={formattedDate} />
                <Detail
                  icon={<ClockIcon />}
                  label="Time"
                  value={`${booking.time?.start || "—"}–${booking.time?.end || "—"}`}
                />
                <Detail
                  icon={<MoneyIcon />}
                  label="Total"
                  value={formatCurrency(booking.totalPrice)}
                />
                <Detail label="Reference" value={`#${booking.bookingId}`} />
                <Detail label="Created" value={formatDateTime(booking.createdAt)} />
                <Detail label="Last updated" value={formatDateTime(booking.updatedAt)} />
              </div>
            </Section>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateBookingModal;
