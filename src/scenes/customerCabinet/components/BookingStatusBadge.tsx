import { BOOKING_STATUS_ICONS, BOOKING_STATUS_STYLES } from "@/src/constants/bookingStatuses";
import { cn } from "@/src/utils/cn";
import { useTranslations } from "next-intl";
import React from "react";

type Props = {
  status: BookingStatus;
  size?: "sm" | "md" | "lg";
  variant?: "only-icon";
};

const BookingStatusBadge = ({ status, variant, size = "md" }: Props) => {
  const t = useTranslations("customerCabinet.statusCompact");

  const Icon = BOOKING_STATUS_ICONS[status];
  return (
    <span
      className={cn(
        "flex items-center rounded-full font-semibold text-darkPrimary",
        BOOKING_STATUS_STYLES[status].dotClassName,
        {
          "text-white": status === "COMPLETED",
          "gap-2 px-3.5 py-1.5 text-sm": size === "lg",
          "gap-1 px-3 py-1.5 text-xs": size === "md",
          "gap-1 px-2.5 py-1 text-xs": size === "sm",
          "p-2 text-sm": variant === "only-icon" && size === "lg",
          "p-1.5 text-xs": variant === "only-icon" && size === "md",
          "p-1 text-xs": variant === "only-icon" && size === "sm",
        }
      )}
    >
      <Icon
        className={cn("text-darkPrimary", {
          "text-white": status === "COMPLETED",
          "size-4": size === "lg",
          "size-3": size === "md" || size === "sm",
        })}
      />
      {variant !== "only-icon" && t(status)}
    </span>
  );
};

export default BookingStatusBadge;
