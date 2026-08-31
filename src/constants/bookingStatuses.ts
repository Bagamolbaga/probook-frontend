export const BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "COMPLETED",
  "BLOCKED",
  "OFF",
] as const satisfies readonly TApiBooking["status"][];

type BookingStatusStyle = {
  timelineClassName: string;
  textClassName: string;
  badgeClassName: string;
  borderClassName: string;
  dotClassName: string;
};

export const BOOKING_STATUS_STYLES = {
  PENDING: {
    timelineClassName: "bg-yellowPrimary/10 hover:bg-yellowPrimary/20",
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
    timelineClassName: "bg-purplePrimary/10 hover:bg-purplePrimary/20",
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
  OFF: {
    timelineClassName: "bg-greyPrimary/10 hover:bg-greyPrimary/20",
    textClassName: "text-greyPrimary",
    badgeClassName: "bg-greyBackgroundLight text-greyPrimary",
    borderClassName: "border-greyPrimary",
    dotClassName: "bg-greyPrimary",
  },
} satisfies Record<TApiBooking["status"], BookingStatusStyle>;
