"use client";

import axios from "axios";
import { format } from "date-fns";
import { Activity, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CustomerBooking } from "@/api/entities/customer";
import { useRescheduleCustomerBookingMutation } from "@/api/queries/customer";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { toaster } from "@/components/ui/toaster";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { useLocale, useTranslations } from "@/i18n";
import TimeSelection from "../../bookingFlow/components/TimeSelection";
import { formatBookingTime } from "./BookingCard";

type Props = {
  booking: CustomerBooking;
  isOpen: boolean;
  onClose: () => void;
};

export default function RescheduleModal({ booking, isOpen, onClose }: Props) {
  const t = useTranslations("customerCabinet");
  const locale = useLocale();
  const rescheduleMutation = useRescheduleCustomerBookingMutation();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState<number[]>([]);
  const [rescheduleDate, setRescheduleDate] = useState(new Date());
  const timeSelectionServices = useMemo(
    () =>
      booking.services.map(
        (service) =>
          ({
            ...service,
            company: booking.company._id,
            category: "",
            options: [service.selectedOption],
            specialists: [booking.specialist],
            selectedOption: {
              ...service.selectedOption,
              id: Number(service.selectedOption.id),
            },
          }) as unknown as TServiceAndSelectedOption
      ),
    [booking]
  );
  const durationSlots = Math.max(1, booking.slots.length);
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${booking.date}T12:00:00`));

  useEffect(() => {
    if (!isOpen) return;

    setDate(booking.date);
    setRescheduleDate(new Date(`${booking.date}T12:00:00`));
    setSlots([]);
  }, [booking.date, isOpen]);

  const submit = async () => {
    try {
      await rescheduleMutation.mutateAsync({ bookingId: booking.id, date, slots });
      onClose();
    } catch (error) {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined;
      toaster.error(
        status === 409
          ? t("detail.conflict")
          : status === 422
            ? t("detail.cutoff")
            : t("common.error")
      );
    }
  };

  return (
    <Modal isOpen={isOpen} handleClose={onClose}>
      <section
        className="w-[620px] max-w-[calc(100vw-40px)] p-6 sm:w-full sm:max-w-full sm:p-5"
        aria-labelledby="reschedule-heading"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id="reschedule-heading" className="font-funnel text-2xl font-bold">
              {t("detail.reschedule")}
            </h2>
            <p className="mt-1 text-xs text-greyPrimary">{t("detail.newDate")}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-greyOutline outline-none hover:bg-greyBackground focus-visible:ring-2 focus-visible:ring-purplePrimary"
            aria-label={t("detail.back")}
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-greyOutline p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-purplePrimary text-white">
            <Activity className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {booking.services[0]?.name} · {booking.specialist.fullName}
            </p>
            <p className="mt-0.5 text-xs text-greyPrimary">
              {formattedDate} · {formatBookingTime(booking)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex max-h-[450px] overflow-y-hidden rounded-xl bg-greyBackgroundLight p-3">
          <TimeSelection
            compact
            companyId={booking.company.id}
            selectedServices={timeSelectionServices}
            selectedDate={rescheduleDate}
            selectedTime={TIME_SLOTS.find((slot) => slot.slot === slots[0])}
            selectedSpecialist={booking.specialist as unknown as TSpecialist}
            availabilityBookingId={booking.id}
            selectDateHandler={(selectedDate) => {
              setRescheduleDate(selectedDate);
              setDate(format(selectedDate, "yyyy-MM-dd"));
              setSlots([]);
            }}
            selectTimeHandler={(selectedTime) => {
              setSlots(
                selectedTime
                  ? Array.from(
                      { length: durationSlots },
                      (_, index) => selectedTime.slot + index
                    )
                  : []
              );
            }}
            selectSpecialistHandler={() => undefined}
          />
        </div>

        <footer className="mt-6 flex justify-end gap-3 sm:flex-col-reverse">
          <Button variant="resting" onClick={onClose}>
            {t("detail.back")}
          </Button>
          <Button
            variant="primary"
            disabled={!date || slots.length === 0 || rescheduleMutation.isPending}
            onClick={() => void submit()}
          >
            {t("detail.save")}
          </Button>
        </footer>
      </section>
    </Modal>
  );
}
