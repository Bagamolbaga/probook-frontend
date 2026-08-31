import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  format,
  type Locale,
} from "date-fns";

import type { BookingManagementPeriod } from "./types";

export const getBookingManagementDateRange = (
  period: BookingManagementPeriod,
  date = new Date()
) => {
  if (period === "week") {
    return {
      start: startOfWeek(date, { weekStartsOn: 1 }),
      end: endOfWeek(date, { weekStartsOn: 1 }),
    };
  }

  if (period === "month") {
    return {
      start: startOfMonth(date),
      end: endOfMonth(date),
    };
  }

  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
};

export const formatBookingManagementDateRange = (
  period: BookingManagementPeriod,
  date: Date,
  locale: Locale
) => {
  const range = getBookingManagementDateRange(period, date);

  if (period === "week") {
    return `${format(range.start, "d MMM", { locale })} – ${format(
      range.end,
      "d MMM yyyy",
      { locale }
    )}`;
  }

  if (period === "month") {
    return format(range.start, "LLLL yyyy", { locale });
  }

  return format(range.start, "d MMMM yyyy", { locale });
};
