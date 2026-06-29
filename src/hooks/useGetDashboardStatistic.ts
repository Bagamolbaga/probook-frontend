"use client";

import {
  useGetAllBookingsQuery,
  useGetCompanySalesAndCustomerStatQuery,
} from "@/api/queries/booking";
import { useAppSession } from "@/hooks/useAppSession";
import {
  endOfMonth,
  endOfWeek,
  getYear,
  parse,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useGetCompanyId } from "./useGetCompanyId";

const WEEK_STARTS_ON = 1;

export type TRange = "day" | "week" | "month";

export const useGetDashboardStatistic = (companyId?: number) => {
  const { data: session } = useAppSession();
  const {companyId: companyIdLocal} = useGetCompanyId()

  const [selectedRange, setSelectedRange] = useState<TRange>("day");
  const [selectedDates, setSelectedDates] = useState(() => {
    const firstDayOnWeek = startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON });
    const startOfWeekDate = startOfWeek(firstDayOnWeek, { weekStartsOn: WEEK_STARTS_ON });
    const endOfWeekDate = endOfWeek(firstDayOnWeek, { weekStartsOn: WEEK_STARTS_ON });

    return {
      start: startOfWeekDate,
      end: endOfWeekDate,
    };
  });

  const [selectedDatesPrev, setSelectedDatesPrev] = useState(() => {
    const currentDate = new Date();
    const startOfWeekDate = startOfWeek(currentDate, {
      weekStartsOn: WEEK_STARTS_ON,
    });
    const endOfWeekDate = endOfWeek(currentDate, {
      weekStartsOn: WEEK_STARTS_ON,
    });

    const prevStartDate = subWeeks(startOfWeekDate, 1);
    const prevEndDate = subWeeks(endOfWeekDate, 1);

    return {
      start: prevStartDate,
      end: prevEndDate,
    };
  });

  const getCompanySalesAndCustomerStatQuery = useGetCompanySalesAndCustomerStatQuery({
    companyId: companyIdLocal,
    startDate: selectedDates.start,
    endDate: selectedDates.end,
  });

  const getCompanySalesAndCustomerStatPrevQuery = useGetCompanySalesAndCustomerStatQuery({
    companyId: companyIdLocal,
    startDate: selectedDatesPrev.start,
    endDate: selectedDatesPrev.end,
  });

  const getAllBookingsQuery = useGetAllBookingsQuery({
    companyId: companyIdLocal,
    queryParams: {
      start_date: selectedDates.start,
      end_date: selectedDates.end,
      limit: 50,
      offset: 0,
    },
  });

  const allBookings = useMemo(() => {
    let arr: TBooking[] = [];

    getAllBookingsQuery.forEach((q) => {
      if (q.data?.results) {
        arr = [...arr, ...q.data.results];
      }
    });

    return arr;
  }, [getAllBookingsQuery]);

  useEffect(() => {
    if (selectedRange === "day") {
      const currentDate = new Date();
      const startOfWeekDate = startOfWeek(currentDate, {
        weekStartsOn: WEEK_STARTS_ON,
      });
      const endOfWeekDate = endOfWeek(currentDate, {
        weekStartsOn: WEEK_STARTS_ON,
      });

      const prevStartDate = subWeeks(startOfWeekDate, 1);
      const prevEndDate = subWeeks(endOfWeekDate, 1);

      setSelectedDates({ start: startOfWeekDate, end: endOfWeekDate });
      setSelectedDatesPrev({ start: prevStartDate, end: prevEndDate });
    }

    if (selectedRange === "week") {
      const currentDate = new Date();

      const startOfMonthDate = startOfMonth(currentDate);
      const endOfMonthDate = endOfMonth(currentDate);

      const prevStartDate = subMonths(startOfMonthDate, 1);
      const prevEndDate = subMonths(endOfMonthDate, 1);

      setSelectedDates({ start: startOfMonthDate, end: endOfMonthDate });
      setSelectedDatesPrev({ start: prevStartDate, end: prevEndDate });
    }

    if (selectedRange === "month") {
      const currentDate = new Date();
      const startOfYear = parse(
        `${getYear(currentDate)}-01-01`,
        "yyyy-MM-dd",
        new Date()
      );
      const endOfYear = parse(`${getYear(currentDate)}-12-31`, "yyyy-MM-dd", new Date());

      const prevStartDate = subYears(startOfYear, 1);
      const prevEndDate = subYears(endOfYear, 1);

      setSelectedDates({ start: startOfYear, end: endOfYear });
      setSelectedDatesPrev({ start: prevStartDate, end: prevEndDate });
    }
  }, [selectedRange]);

  return {
    getCompanySalesAndCustomerStatQuery,
    getCompanySalesAndCustomerStatPrevQuery,
    allBookings,
    selectedDates,
    selectedRange,
    setSelectedRange,
    getAllBookingsQuery,
  };
};
