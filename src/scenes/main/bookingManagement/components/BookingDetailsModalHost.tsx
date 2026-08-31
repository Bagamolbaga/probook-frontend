"use client";

import { parse } from "date-fns";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { useGetBookingQuery } from "@/api/queries/booking";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { useBookingDetailsModalStore } from "@/stores/bookingDetailsModal";
import UpdateBookingModal from "./components/UpdateBookingModal";
import type { UpdateBookingForm } from "./components/types";

type ContentProps = {
  booking: TApiBooking;
  companyId: string;
  onClose: () => void;
};

const BookingDetailsModalContent = ({ booking, companyId, onClose }: ContentProps) => {
  const hasTimeSlots = booking.slots.length > 0;
  const firstSlot = hasTimeSlots ? Math.min(...booking.slots) : -1;
  const lastSlot = hasTimeSlots ? Math.max(...booking.slots) + 1 : -1;
  const updateBookingForm = useForm<UpdateBookingForm>({
    defaultValues: {
      companyId,
      bookingId: booking.id,
      status: booking.status,
      totalPrice: booking.totalPrice,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      assignee: booking.specialist,
      customer: booking.customer,
      time: hasTimeSlots
        ? {
            start: TIME_SLOTS.find((slot) => slot.slot === firstSlot)?.label || "",
            end:
              lastSlot === TIME_SLOTS.length
                ? "24:00"
                : TIME_SLOTS.find((slot) => slot.slot === lastSlot)?.label || "",
            slots: booking.slots,
          }
        : null,
      date: parse(booking.date, "yyyy-MM-dd", new Date()),
      location: "",
      servicesId: booking.services.map((service) => service.id),
      services: booking.services,
    },
  });

  return (
    <UpdateBookingModal
      isOpen
      updateBookingForm={updateBookingForm}
      handleClose={onClose}
    />
  );
};

const BookingDetailsModalHost = () => {
  const t = useTranslations("bookingManagement.detailModal");
  const { companyId } = useGetCompanyId();
  const selectedBookingId = useBookingDetailsModalStore(
    (state) => state.selectedBookingId
  );
  const closeBookingDetails = useBookingDetailsModalStore(
    (state) => state.closeBookingDetails
  );
  const bookingQuery = useGetBookingQuery({
    companyId,
    bookingId: selectedBookingId || "",
  });

  if (!selectedBookingId) {
    return null;
  }

  if (bookingQuery.isPending) {
    return (
      <Modal isOpen enableMobile handleClose={closeBookingDetails}>
        <div className="flex w-[360px] max-w-[calc(100vw-40px)] flex-col items-center px-6 py-10 sm:w-full">
          <span className="size-8 animate-spin rounded-full border-2 border-purpleExtraLight border-t-purplePrimary" />
          <p className="mt-4 text-sm font-bold text-darkPrimary">{t("loading")}</p>
        </div>
      </Modal>
    );
  }

  if (bookingQuery.isError || !bookingQuery.data) {
    return (
      <Modal isOpen enableMobile handleClose={closeBookingDetails}>
        <div className="w-[360px] max-w-[calc(100vw-40px)] px-6 py-8 text-center sm:w-full">
          <p className="text-sm font-bold text-darkPrimary">{t("loadError")}</p>
          <Button className="mt-5 w-full" variant="primary" onClick={closeBookingDetails}>
            {t("dismiss")}
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <BookingDetailsModalContent
      key={bookingQuery.data.id}
      booking={bookingQuery.data}
      companyId={companyId.toString()}
      onClose={closeBookingDetails}
    />
  );
};

export default BookingDetailsModalHost;
