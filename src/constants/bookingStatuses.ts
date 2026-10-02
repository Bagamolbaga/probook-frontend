import {
  Ban,
  CircleCheck,
  CircleDashedCheck,
  CircleX,
  Clock,
  LucideIcon,
} from "lucide-react";

export enum BOOKING_STATUS {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
  CANCELLED = "CANCELLED",
}

export const BOOKING_STATUSES = Object.values(
  BOOKING_STATUS
) satisfies readonly TApiBooking["status"][];

export const SPECIALIST_BOOKING_STATUS_TRANSITIONS: Partial<
  Record<TApiBooking["status"], readonly TApiBooking["status"][]>
> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
};

export const getSpecialistBookingStatusTransitions = (status: TApiBooking["status"]) =>
  SPECIALIST_BOOKING_STATUS_TRANSITIONS[status] || [];

type BookingStatusStyle = {
  timelineClassName: string;
  textClassName: string;
  badgeClassName: string;
  borderClassName: string;
  dotClassName: string;
};

export const BOOKING_STATUS_ICONS: Record<BookingStatus, LucideIcon> = {
  PENDING: Clock,
  CONFIRMED: CircleDashedCheck,
  COMPLETED: CircleCheck,
  CANCELLED: CircleX,
  BLOCKED: Ban,
};

export const BOOKING_STATUS_STYLES = {
  PENDING: {
    timelineClassName:
      "bg-yellowPrimary/30 border-yellowPrimary hover:bg-yellowPrimary/20",
    textClassName: "text-yellowPrimary",
    badgeClassName: "bg-yellowExtraLight text-darkPrimary",
    borderClassName: "border-yellowPrimary",
    dotClassName: "bg-yellowPrimary",
  },
  CONFIRMED: {
    timelineClassName: "bg-greenPrimary/10 hover:bg-greenPrimary/20",
    textClassName: "text-greenPrimary",
    badgeClassName: "bg-greenExtraLight text-greenPrimary",
    borderClassName: "border-greenPrimary",
    dotClassName: "bg-greenPrimary",
  },
  COMPLETED: {
    timelineClassName: "bg-purplePrimary/20 hover:bg-purplePrimary/30",
    textClassName: "text-purplePrimary",
    badgeClassName: "bg-purpleExtraLight text-purplePrimary",
    borderClassName: "border-purplePrimary",
    dotClassName: "bg-purplePrimary",
  },
  BLOCKED: {
    timelineClassName: "bg-redExtraLight hover:bg-redExtraLight/80",
    textClassName: "text-redPrimary",
    badgeClassName: "bg-redExtraLight text-redPrimary",
    borderClassName: "border-redPrimary",
    dotClassName: "bg-redPrimary",
  },
  CANCELLED: {
    timelineClassName: "bg-greyPrimary/10 hover:bg-greyPrimary/20",
    textClassName: "text-greyPrimary",
    badgeClassName: "bg-greyBackgroundLight text-greyPrimary",
    borderClassName: "border-greyPrimary",
    dotClassName: "bg-greyPrimary",
  },
} satisfies Record<TApiBooking["status"], BookingStatusStyle>;
