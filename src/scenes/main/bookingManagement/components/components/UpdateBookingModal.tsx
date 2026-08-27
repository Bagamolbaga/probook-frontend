"use client";

import { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import type { UpdateBookingForm } from "./types";

type Props = {
  isOpen: boolean;
  updateBookingForm: UseFormReturn<UpdateBookingForm>;
  handleClose: () => void;
};

const UpdateBookingModal: FC<Props> = ({ isOpen, updateBookingForm, handleClose }) => {
  const booking = updateBookingForm.getValues();

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="w-[560px] max-w-full p-6 sm:w-full">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Booking details</h2>
            <p className="mt-1 text-sm text-greyPrimary">{booking.status}</p>
          </div>
          <Button variant="resting-active" onClick={handleClose}>
            Close
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-[140px_1fr] gap-x-4 gap-y-3 text-sm">
          <dt className="text-greyPrimary">Customer</dt>
          <dd>
            {booking.customer.first_name} {booking.customer.last_name}
          </dd>

          <dt className="text-greyPrimary">Email</dt>
          <dd>{booking.customer.email}</dd>

          <dt className="text-greyPrimary">Professional</dt>
          <dd>{booking.assignee?.fullName || "—"}</dd>

          <dt className="text-greyPrimary">Date</dt>
          <dd>{booking.date ? format(booking.date, "MMMM d, yyyy") : "—"}</dd>

          <dt className="text-greyPrimary">Time</dt>
          <dd>{booking.time ? `${booking.time.start} – ${booking.time.end}` : "—"}</dd>

          <dt className="text-greyPrimary">Services</dt>
          <dd>
            {booking.services.length
              ? booking.services.map((service) => service.name).join(", ")
              : "—"}
          </dd>
        </dl>
      </div>
    </Modal>
  );
};

export default UpdateBookingModal;
