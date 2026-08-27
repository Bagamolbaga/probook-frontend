import { FC } from "react";
import { format, parse } from "date-fns";

import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { TIME_SLOTS } from "@/constants/timeSlots";

type Props = {
  isOpen: boolean;
  company: TCompany;
  booking: TApiBooking;
  handleClose: () => void;
};

const BookingDetailsModal: FC<Props> = ({ isOpen, company, booking, handleClose }) => {
  const start = TIME_SLOTS.find((slot) => slot.slot === booking.slots[0])?.label;
  const end = TIME_SLOTS.find(
    (slot) => slot.slot === (booking.slots.at(-1) ?? -1) + 1
  )?.label;

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="w-[520px] max-w-full p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Booking details</h2>
            <p className="mt-1 text-sm text-greyPrimary">{company.name}</p>
          </div>
          <Button variant="resting-active" onClick={handleClose}>
            Close
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 text-sm">
          <dt className="text-greyPrimary">Customer</dt>
          <dd>
            {booking.customer.first_name} {booking.customer.last_name}
          </dd>
          <dt className="text-greyPrimary">Email</dt>
          <dd>{booking.customer.email}</dd>
          <dt className="text-greyPrimary">Professional</dt>
          <dd>{booking.specialist.fullName}</dd>
          <dt className="text-greyPrimary">Date</dt>
          <dd>{format(parse(booking.date, "yyyy-MM-dd", new Date()), "MMMM d, yyyy")}</dd>
          <dt className="text-greyPrimary">Time</dt>
          <dd>{start && end ? `${start} – ${end}` : "—"}</dd>
          <dt className="text-greyPrimary">Services</dt>
          <dd>{booking.services.map((service) => service.name).join(", ") || "—"}</dd>
          <dt className="text-greyPrimary">Status</dt>
          <dd>{booking.status}</dd>
        </dl>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
