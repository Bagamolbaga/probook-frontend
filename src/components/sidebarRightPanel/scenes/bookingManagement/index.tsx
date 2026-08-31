"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/button";
import DatePicker from "@/components/ui/DatePicker";
import CalendarIcon from "@/components/ui/icons/Calendar";
import { useClickOutside } from "@/hooks/useClickOutside";
import { BookingOverviewWidget } from "../../widgets/bookingOverview";
import { StaffWorkloadWidget } from "../../widgets/staffWorkload";
import { UpcomingBookingsWidget } from "../../widgets/upcomingBookings";
import type { BookingManagementPeriod } from "../../types";

const PERIODS: BookingManagementPeriod[] = ["day", "week", "month"];

export const BookingManagementSidebar = () => {
  const t = useTranslations("bookingManagement.sidebar");
  const [period, setPeriod] = useState<BookingManagementPeriod>("day");
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerContainer = useRef<HTMLDivElement>(null);

  const closeDatePicker = useCallback(() => setIsDatePickerOpen(false), []);
  useClickOutside(datePickerContainer, closeDatePicker);

  return (
    <div className="flex h-full flex-col gap-3 overflow-x-hidden overflow-y-auto">
      <div ref={datePickerContainer} className="relative flex w-full items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {PERIODS.map((item) => (
            <Button
              key={item}
              variant={period === item ? "resting-active" : "resting"}
              className="min-w-0 flex-1 px-2 py-2"
              onClick={() => setPeriod(item)}
            >
              {t(`periods.${item}`)}
            </Button>
          ))}
        </div>

        <Button
          variant={isDatePickerOpen ? "outline" : "resting-active"}
          className="size-[38px] flex-none p-0"
          aria-label={t("selectDate")}
          title={t("selectDate")}
          onClick={() => setIsDatePickerOpen((isOpen) => !isOpen)}
        >
          <CalendarIcon className="size-5" />
        </Button>

        {isDatePickerOpen ? (
          <div className="absolute right-0 top-[calc(100%+8px)] z-50 rounded-lg border border-greyOutlineSecondary bg-white">
            <DatePicker
              mode="single"
              selected={selectedDate}
              defaultMonth={selectedDate}
              onSelect={(date) => {
                if (!date) return;

                setSelectedDate(date);
                closeDatePicker();
              }}
            />
          </div>
        ) : null}
      </div>

      <BookingOverviewWidget period={period} date={selectedDate} />
      <StaffWorkloadWidget period={period} date={selectedDate} />
      <UpcomingBookingsWidget period={period} date={selectedDate} />
    </div>
  );
};
