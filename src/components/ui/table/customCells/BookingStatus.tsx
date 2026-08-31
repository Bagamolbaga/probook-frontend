"use client";

import { useTranslations } from "next-intl";

import { BOOKING_STATUS_STYLES } from "@/constants/bookingStatuses";
import { cn } from "@/utils/cn";

const BookingStatusCell = ({ value }: { value: BookingStatus }) => {
  const t = useTranslations("bookingManagement.status");
  const styles = BOOKING_STATUS_STYLES[value];

  return (
    <div className="h-full px-5 flex flex-col items-center justify-center">
      <div
        className={cn(
          "w-full mx-3 py-2 flex justify-center rounded-lg text-base",
          styles.badgeClassName
        )}
      >
        <p className={cn("text-sm font-bold", styles.textClassName)}>{t(value)}</p>
      </div>
    </div>
  );
};

export default BookingStatusCell;
