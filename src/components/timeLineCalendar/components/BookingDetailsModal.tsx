import { FC } from "react";
import { format, parse } from "date-fns";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const start = TIME_SLOTS.find((slot) => slot.slot === booking.slots[0])?.label;
  const end = TIME_SLOTS.find(
    (slot) => slot.slot === (booking.slots.at(-1) ?? -1) + 1
  )?.label;

  return (
    <Modal isOpen={isOpen} handleClose={handleClose}>
      <div className="w-[520px] max-w-full p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">
              {t("ui.components.bookingDetails.title")}
            </h2>
            <p className="mt-1 text-sm text-greyPrimary">{company.name}</p>
          </div>
          <Button variant="resting-active" onClick={handleClose}>
            {t("ui.components.bookingDetails.close")}
          </Button>
        </div>

        <dl className="mt-6 grid grid-cols-[130px_1fr] gap-x-4 gap-y-3 text-sm">
          <dt className="text-greyPrimary">
            {t("ui.components.bookingDetails.customer")}
          </dt>
          <dd>
            {booking.customer.firstName} {booking.customer.lastName}
          </dd>
          <dt className="text-greyPrimary">{t("ui.components.bookingDetails.email")}</dt>
          <dd>{booking.customer.email}</dd>
          <dt className="text-greyPrimary">
            {t("ui.components.bookingDetails.professional")}
          </dt>
          <dd>{booking.specialist.fullName}</dd>
          <dt className="text-greyPrimary">{t("ui.components.bookingDetails.date")}</dt>
          <dd>{format(parse(booking.date, "yyyy-MM-dd", new Date()), "MMMM d, yyyy")}</dd>
          <dt className="text-greyPrimary">{t("ui.components.bookingDetails.time")}</dt>
          <dd>{start && end ? `${start} – ${end}` : "—"}</dd>
          <dt className="text-greyPrimary">
            {t("ui.components.bookingDetails.services")}
          </dt>
          <dd>{booking.services.map((service) => service.name).join(", ") || "—"}</dd>
          <dt className="text-greyPrimary">{t("ui.components.bookingDetails.status")}</dt>
          <dd>{booking.status}</dd>
        </dl>
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
