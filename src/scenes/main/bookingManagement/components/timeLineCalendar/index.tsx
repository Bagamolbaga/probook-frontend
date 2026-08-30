/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import {
  addDays,
  differenceInHours,
  format,
  parse,
  isSameHour,
  setHours,
  differenceInMinutes,
  isToday,
} from "date-fns";
import { Player } from "@lottiefiles/react-lottie-player";
import { useLocale, useTranslations } from "next-intl";
import { DATE_FNS_LOCALES, Link } from "@/i18n";

import { useGetBookingsQuery } from "@/api/queries/booking";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import { useGetCompanyShiftsForDateRangeQuery } from "@/api/queries/company/shift";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import UpdateBookingModal from "./components/UpdateBookingModal";
import TimeLineBreakItem from "./components/TimeLineBreakItem";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import Button from "@/components/ui/button";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { cn } from "@/utils/cn";

import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import ListIsEmptyPlaceholderImage from "@/assets/staffManagement/SpecialistListEmptyOverlay.svg";
import { TimeManager } from "@/utils/timeManager";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import DatePicker from "@/components/ui/DatePicker";
import CalendarIcon from "@/components/ui/icons/Calendar";
import { useClickOutside } from "@/hooks/useClickOutside";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import type { FormattedDataItem, UpdateBookingForm } from "../components/types";
export type { FormattedDataItem } from "../components/types";

const TimeLineCalendar = () => {
  const t = useTranslations();
  const locale = useLocale() as keyof typeof DATE_FNS_LOCALES;
  const { companyId } = useGetCompanyId();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isOpenBookingDetailModal, setIsOpenBookingDetailModal] = useState(false);

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const datePickerContainer = useRef<HTMLDivElement>(null);

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
  });
  const getBookingsQuery = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: selectedDate,
      end_date: selectedDate,
    },
  });
  const getCompanyShiftsForDateRangeQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: selectedDate,
    end: selectedDate,
  });
  const updateBookingForm = useForm<UpdateBookingForm>({
    mode: "onChange",
    defaultValues: {
      location: "Store 1",
      companyId,
    },
  });

  const revalidateQueriesHandler = useCallback(
    async () =>
      Promise.all([
        getCompanyDetailsQuery.refetch(),
        getBookingsQuery.refetch(),
        getCompanySpecialistsQuery.refetch(),
        getCompanyShiftsForDateRangeQuery.refetch(),
      ]),
    [
      getBookingsQuery,
      getCompanyDetailsQuery,
      getCompanyShiftsForDateRangeQuery,
      getCompanySpecialistsQuery,
    ]
  );

  const mappedData: FormattedDataItem[] = useMemo(() => {
    if (!getCompanySpecialistsQuery.data || !getBookingsQuery.data) {
      return [];
    }

    const data: FormattedDataItem[] = [];

    getCompanySpecialistsQuery.data.results.forEach((s) => {
      data.push({
        id: s.id,
        company: s.company || companyId,
        specialist: s,
        shifts: [],
        revalidateQueries: revalidateQueriesHandler,
      });
    });

    getBookingsQuery.data.results
      // .filter((b) => b.status !== "OFF" && b.status !== "BLOCKED")
      .forEach((item) => {
        const specialistId = item.specialist.id || item.specialist._id;
        const findedIdx = data.findIndex((entry) => entry.id === specialistId);

        if (findedIdx >= 0) {
          data[findedIdx]._booking = item;
          data[findedIdx].shifts.push({
            id: item.id,
            customer: item.customer,
            slots: item.slots,
            date: item.date,
            status: item.status,
            totalPrice: item.totalPrice,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
            services: item.services,
          });
        }
      });

    const selectedDateString = format(selectedDate, "yyyy-MM-dd");
    const res = data.map((item) => {
      const specialistShift = getCompanyShiftsForDateRangeQuery.data?.results.find(
        (entry) => entry.specialist.id === item.specialist.id
      );
      const overrideShift = specialistShift?.shifts.find(
        (shift) => shift.kind === "override" && shift.date === selectedDateString
      );
      const defaultShift =
        specialistShift?.defaultShift?.kind === "default"
          ? specialistShift.defaultShift
          : undefined;
      const customWorkingShift = overrideShift || defaultShift;

      return {
        ...item,
        ...(customWorkingShift ? { customWorkingShift } : {}),
        shifts: item.shifts.filter((booking) => booking.date === selectedDateString),
      };
    });

    return res;
  }, [
    getCompanySpecialistsQuery.data,
    getCompanyShiftsForDateRangeQuery.data,
    getBookingsQuery.data,
    companyId,
    revalidateQueriesHandler,
    selectedDate,
  ]);

  const { HEADER_TIMES, COMPANY_SLOTS } = useMemo(() => {
    const slotManager = new TimeManager();
    const weekDay = format(selectedDate, "EEEE") as WorkingScheduleWeekDays;
    const daySchedule = getCompanyDetailsQuery.data?.workingSchedule?.[weekDay];
    const scheduleSlots = daySchedule?.workingSlots || [];
    const fallbackSlots = slotManager.getFullSlotsInRange(36, 72);
    const companySlots = scheduleSlots.length
      ? slotManager.getFullSlots(scheduleSlots)
      : fallbackSlots;
    const hourSlots = companySlots.filter((slot) => slot.minute === 0);

    return {
      HEADER_TIMES: hourSlots.slice(0, -1),
      COMPANY_SLOTS: companySlots,
    };
  }, [getCompanyDetailsQuery.data, selectedDate]);

  const getRowSchedule = (rowData: FormattedDataItem) => {
    if (rowData.customWorkingShift) {
      return {
        workingSlots: rowData.customWorkingShift.workingSlots,
        breakSlots: rowData.customWorkingShift.breakSlots,
      };
    }

    const weekDay = format(selectedDate, "EEEE") as WorkingScheduleWeekDays;
    return (
      getCompanyDetailsQuery.data?.workingSchedule?.[weekDay] || {
        workingSlots: [],
        breakSlots: [],
      }
    );
  };

  const renderShift = (row: number, col: number) => {
    const rowData = mappedData[row];

    const colSlot = TIME_SLOTS.find((s) => s.slot === HEADER_TIMES[col].slot)!;
    const shift = rowData.shifts.filter(
      (s) => TIME_SLOTS.find((ts) => ts.slot === s.slots[0])?.hour === colSlot.hour
    );

    if (!shift.length) {
      return null;
    }

    return shift.map((shift) => {
      const findedSlot = TIME_SLOTS.find((s) => s.slot === shift.slots[0])!;

      const paddingsLeft = {
        [60 / 0]: "0%",
        [60 / 15]: "25%",
        [60 / 30]: "50%",
        [60 / 45]: "75%",
      };

      // const shiftLengthByOnlyEvenSlots = shift.slots.filter((s) => s % 2 === 0).length;
      // const minShiftLength =
      //   (shift.slots.length - 1) * 0.25 >= 0.25 ? (shift.slots.length - 1) * 0.25 : 0.25;

      const minShiftLength = ((shift.slots.length * 15) / 60) * 100;

      const firstSlotIsEven = shift.slots[0] % 2 === 0;
      const lastSlotIsEven = shift.slots.at(-1) && shift.slots.at(-1)! % 2 === 0;

      const status = shift.status;
      const content = (
        <div
          key={shift.id}
          className={cn("absolute z-[5] top-0 left-0 h-full py-[6px]", {
            "pl-[6px] pr-[3px]": shift.slots.length === 1 && firstSlotIsEven,
            "pl-[3px] pr-[6px]": shift.slots.length === 1 && !firstSlotIsEven,

            "pl-[6px] ": shift.slots.length !== 1 && firstSlotIsEven,
            "pl-[3px] ": shift.slots.length !== 1 && !firstSlotIsEven,
            "pr-[6px] ": shift.slots.length !== 1 && lastSlotIsEven,
            "pr-[3px] ": shift.slots.length !== 1 && !lastSlotIsEven,
          })}
          style={{
            left: `calc(${paddingsLeft[60 / findedSlot.minute]})`,
            width: `calc(${minShiftLength}%)`,
          }}
          onClick={() => openBookingDetailModalHandler(rowData, shift)}
        >
          <div className="w-full h-full bg-white">
            <div
              className={cn(
                "w-full h-full px-[6px] flex items-center rounded overflow-hidden cursor-pointer ",
                {
                  "bg-purplePrimary/10 hover:bg-purplePrimary/20": !shift.customer.email,
                  "bg-yellowPrimary/10 hover:bg-yellowPrimary/20": status === "PENDING",
                  "bg-greenPrimary/10 hover:bg-greenPrimary/20":
                    status === "COMPLETED" || status === "CONFIRMED",
                  "bg-redExtraLight/10 hover:bg-redExtraLight/20": status === "BLOCKED",
                  // "bg-blueExtraLight/10 hover:bg-blueExtraLight/20": status === "break",
                  "bg-greyPrimary/10 hover:bg-greyPrimary/20": status === "OFF",
                }
              )}
            >
              <p
                className={cn(
                  "text-sm font-bold text-nowrap text-ellipsis overflow-hidden",
                  {
                    "text-purplePrimary": !shift.customer.email,
                    "text-yellowPrimary": status === "PENDING",
                    "text-greenPrimary": status === "COMPLETED" || status === "CONFIRMED",
                    "text-redPrimary": status === "BLOCKED",
                    "text-greyPrimary": status === "OFF",
                  }
                )}
              >
                {shift.customer.firstName} {shift.customer.lastName}
              </p>
            </div>
          </div>
        </div>
      );

      return content;
    });
  };

  const renderFullDayOff = (row: number) => {
    const rowData = mappedData[row];
    const { workingSlots } = getRowSchedule(rowData);

    const width = 100;
    const paddingRight = 6;
    const paddingLeft = 0;

    if (!workingSlots.length) {
      return (
        <TimeLineBreakItem
          key={`${rowData.id}-fullDayOff`}
          type="fullDayOff"
          row={rowData}
          currentDate={selectedDate}
          width={width}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
        />
      );
    }

    return null;
  };

  const renderNotWorkingTime = (row: number) => {
    const rowData = mappedData[row];

    const schedule = getRowSchedule(rowData);
    const defaultSlots = {
      slots: new TimeManager().getFullSlots(schedule.workingSlots),
      breaks: new TimeManager().getFullSlots(schedule.breakSlots),
    };

    if (!defaultSlots.slots.length) return null;

    const beforeWorkingTimeBreakSlots = HEADER_TIMES.filter(
      (s) => s.slot < defaultSlots.slots[0]?.slot
    ).map((s) => s.slot);
    const afterWorkingTimeBreakSlots = HEADER_TIMES.filter(
      (s) => s.slot >= defaultSlots.slots[defaultSlots.slots.length - 1]?.slot
    ).map((s) => s.slot);

    const allAfterWorkingTimeBreakSlots = COMPANY_SLOTS.filter(
      (s) => s.slot >= defaultSlots.slots[defaultSlots.slots.length - 1]?.slot
    ).map((s) => s.slot);

    const getContent = ({
      slots,
      type,
    }: {
      slots: number[];
      type: "beforeWorkingTime" | "afterWorkingTime";
    }) => {
      const fullSlots = HEADER_TIMES.filter((s) => slots.includes(s.slot));
      const fullWorkingSlots = TIME_SLOTS.filter((s) =>
        defaultSlots.slots.find((i) => i.slot === s.slot)
      );

      const lastWorkingSlotIsNotFullHour =
        fullWorkingSlots[fullWorkingSlots.length - 1].minute === 30;
      const firstWorkingSlotIsNotFullHour = fullWorkingSlots[0].minute === 30;

      let width = 0;
      let paddingLeft = 0;
      const paddingRight = 6;

      if (type === "beforeWorkingTime") {
        width =
          (100 / HEADER_TIMES.length) *
          (fullSlots.length - (firstWorkingSlotIsNotFullHour ? 0.5 : 0));
        paddingLeft = 0;
      }

      if (type === "afterWorkingTime") {
        width =
          (100 / HEADER_TIMES.length) *
          (fullSlots.length + (lastWorkingSlotIsNotFullHour ? 0.5 : 0));
        paddingLeft = 100 - width;
      }

      return (
        <TimeLineBreakItem
          key={`${rowData.id}-${type}`}
          type={type}
          row={rowData}
          currentDate={selectedDate}
          width={width}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
        />
      );
    };

    const contents = [];

    if (beforeWorkingTimeBreakSlots.length) {
      contents.push(
        getContent({
          slots: beforeWorkingTimeBreakSlots,
          type: "beforeWorkingTime",
        })
      );
    }

    if (
      afterWorkingTimeBreakSlots.length &&
      afterWorkingTimeBreakSlots.find((s) => HEADER_TIMES.find((ts) => ts.slot === s))
    ) {
      contents.push(
        getContent({
          slots: afterWorkingTimeBreakSlots,
          type: "afterWorkingTime",
        })
      );
    } else if (
      !afterWorkingTimeBreakSlots.length &&
      allAfterWorkingTimeBreakSlots.length
    ) {
      // The final boundary may fall outside the rendered hour headers.
    }

    if (contents.length) {
      return contents;
    }

    return null;
  };

  const renderBreakTime = (row: number) => {
    const rowData = mappedData[row];

    const schedule = getRowSchedule(rowData);
    const workingSlots = {
      slots: new TimeManager().getFullSlots(schedule.workingSlots),
      breaks: new TimeManager().getFullSlots(schedule.breakSlots),
    };

    if (!workingSlots.slots.length) return null;

    const defaultBreakSlot = workingSlots.breaks.map((s) => s.slot);

    const slots = [...defaultBreakSlot];

    const fullSlots = HEADER_TIMES.filter((s) => slots.includes(s.slot));
    const allFullSlots = TIME_SLOTS.filter(
      (s) => slots.includes(s.slot) && (s.minute === 0 || s.minute === 30)
    );

    const slotsBeforeBreak = HEADER_TIMES.filter((s) => s.slot < slots[0]);

    const lastSlotIsNotFullHour = allFullSlots[allFullSlots.length - 1]?.minute === 30;
    // const firstWorkingSlotIsNotFullHour = allFullSlots[0].minute === 30;

    const width =
      (100 / HEADER_TIMES.length) *
      (fullSlots.length === 1
        ? fullSlots.length
        : fullSlots.length - 1 + (lastSlotIsNotFullHour ? 0.5 : 0));

    const paddingLeft = (100 / HEADER_TIMES.length) * slotsBeforeBreak.length;

    const paddingRight = 6;

    if (defaultBreakSlot.length) {
      return (
        <TimeLineBreakItem
          key={`${rowData.id}-dailyBreak`}
          type="dailyBreak"
          label={t("bookingManagement.calendar.break")}
          row={rowData}
          currentDate={selectedDate}
          width={width}
          paddingLeft={paddingLeft}
          paddingRight={paddingRight}
        />
      );
    }

    return null;
  };

  const renderVerticalTimeLine = () => {
    const currTime = new Date();

    if (!isToday(selectedDate)) {
      return null;
    }

    const startWorkingTime = setHours(new Date(), HEADER_TIMES[0].hour).setMinutes(
      0,
      0,
      0
    );
    const allWorkingTimeInMinutes = HEADER_TIMES.length * 60;
    const minutesBeforeCurrentTime = differenceInMinutes(currTime, startWorkingTime);

    const paddingLeft = (100 / allWorkingTimeInMinutes) * minutesBeforeCurrentTime;

    if (
      minutesBeforeCurrentTime <= 0 ||
      minutesBeforeCurrentTime >= allWorkingTimeInMinutes - 3
    ) {
      return null;
    }

    return (
      <div
        className="absolute z-50 w-[2px] h-full bg-purplePrimary"
        style={{
          left: `${paddingLeft}%`,
        }}
      >
        <div className="relative top-[-11px] left-[-4px] w-0 h-0 rotate-[135deg] border-b-[10px] border-b-transparent border-r-[10px] border-r-purplePrimary"></div>
      </div>
    );
  };

  const getDateStringBySelectedDate = (selectedDate: Date) => {
    const current = new Date();

    const diff = Math.floor(differenceInHours(current, selectedDate) / 24);

    if (diff === 0) {
      return t("ui.dateSelectInput.today");
    }

    return format(selectedDate, "EEEE", {
      locale: DATE_FNS_LOCALES[locale],
    });
  };

  const closeDatePickerHandler = () => {
    setIsOpenDatePicker(false);
  };

  const toggleDatePickerHandler = () => {
    setIsOpenDatePicker((p) => !p);
  };

  useClickOutside(datePickerContainer, closeDatePickerHandler);

  const selectNextDayHandler = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const selectPrevDayHandler = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const openBookingDetailModalHandler = (
    booking: FormattedDataItem,
    shift: FormattedDataItem["shifts"][0]
  ) => {
    updateBookingForm.setValue("bookingId", shift.id);
    updateBookingForm.setValue("status", shift.status);
    updateBookingForm.setValue("totalPrice", shift.totalPrice);
    updateBookingForm.setValue("createdAt", shift.createdAt);
    updateBookingForm.setValue("assignee", booking.specialist);
    updateBookingForm.setValue("customer", shift.customer);
    updateBookingForm.setValue("time", {
      start: TIME_SLOTS.find((s) => s.slot === shift.slots[0])?.label || "",
      end: TIME_SLOTS.find((s) => s.slot === (shift.slots.at(-1) ?? -1) + 1)?.label || "",
      slots: shift.slots,
    });
    updateBookingForm.setValue("date", parse(shift.date, "yyyy-MM-dd", new Date()));
    updateBookingForm.setValue("updatedAt", shift.updatedAt);

    updateBookingForm.setValue("services", shift.services);
    updateBookingForm.setValue(
      "servicesId",
      shift.services.map((service) => service.id)
    );

    setIsOpenBookingDetailModal(true);
  };

  const closeBookingDetailModalHandler = () => {
    updateBookingForm.reset();
    setIsOpenBookingDetailModal(false);
    void revalidateQueriesHandler();
  };

  const colIsEqualCurrentTime = (col: number) => {
    if (!isToday(selectedDate)) {
      return false;
    }

    const startSlot = HEADER_TIMES[col].slot;

    const startTime = TIME_SLOTS.find((s) => s.slot === startSlot)?.hour || null;

    if (startTime) {
      const startDate = setHours(new Date(), startTime);
      const currDate = new Date();

      return isSameHour(startDate, currDate);
    }

    return false;
  };

  if (getCompanySpecialistsQuery.isPending) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (
    !getCompanySpecialistsQuery.isPending &&
    !getCompanySpecialistsQuery.data?.results.length
  ) {
    return (
      <div className="w-full flex flex-col items-center justify-center">
        <div>
          <Image
            src={ListIsEmptyPlaceholderImage}
            alt={t("bookingManagement.emptyBooking.title")}
          />
        </div>
        <h4 className="text-[32px] font-bold text-center">
          {t("bookingManagement.emptyBooking.title")}
        </h4>
        <p className="mt-3 text-sm text-center text-greyPrimary">
          {t.rich("bookingManagement.emptyBooking.title", {
            br: () => <br />,
          })}
        </p>
      </div>
    );
  }

  return (
    <>
      {isOpenBookingDetailModal && (
        <UpdateBookingModal
          isOpen={isOpenBookingDetailModal}
          updateBookingForm={updateBookingForm}
          handleClose={closeBookingDetailModalHandler}
        />
      )}
      <div className="w-full h-full px-7 py-10 rounded-xl bg-white sm:px-5 sm:py-6">
        <div className="flex items-center justify-between sm:flex-col sm:items-start">
          <div className="text-xl font-bold">{format(selectedDate, "MMMM d, yyyy")}</div>
          <div className="flex items-center sm:w-full sm:mt-2 sm:justify-end">
            <div ref={datePickerContainer} className="relative">
              <Button
                className="w-12 !p-2"
                variant="resting-active"
                onClick={toggleDatePickerHandler}
              >
                <CalendarIcon className="" />
              </Button>

              {isOpenDatePicker && (
                <div className="absolute z-[55] top-0 right-[calc(100%+8px)] sm:right-auto sm:top-[calc(100%+8px)] sm:left-[0px]">
                  <DatePicker
                    className="border border-greyOutlineSecondary bg-white"
                    mode="single"
                    selected={selectedDate}
                    onSelect={(d) => d && setSelectedDate(d)}
                  />
                </div>
              )}
            </div>

            <span className="ml-3 px-5 py-2 rounded-lg border border-greyOutlineSecondary text-sm font-bold text-greyPrimary">
              {getDateStringBySelectedDate(selectedDate)}
            </span>
            <Button
              className="w-12 ml-3"
              variant="resting-active"
              onClick={selectPrevDayHandler}
            >
              <ArrowSecondaryDownIcon className="rotate-90" />
            </Button>
            <Button
              className="w-12 ml-1"
              variant="resting-active"
              onClick={selectNextDayHandler}
            >
              <ArrowSecondaryDownIcon className="-rotate-90" />
            </Button>
            <Link href={`/booking-creation`} className="ml-3">
              <Button variant="primary">{t("bookingManagement.addCustomer")}</Button>
            </Link>
          </div>
        </div>
        <div className="w-full h-[calc(100%-50px)] flex flex-col justify-between sm:h-[calc(100%-75px)]">
          {" "}
          {/*h-[calc(100%-height_of_top_block_with_btns)]*/}
          <div className="flex mt-9 rounded-xl overflow-hidden border border-greyOutlineSecondary sm:mt-5">
            <div className="max-w-[140px] w-fit h-full flex flex-col overflow-hidden">
              <div className="w-full py-5 text-sm text-greyPrimary border-b border-greyOutlineSecondary bg-greyBackgroundLight">
                <div className="invisible">1</div>
              </div>
              {mappedData.map((item) => (
                <div
                  key={item.specialist.id}
                  className="w-full h-[48.8px] px-1 flex justify-start items-center text-left border-b last:border-b-0 text-sm text-greyPrimary border-greyOutlineSecondary"
                >
                  {item.specialist.fullName}
                </div>
              ))}
            </div>
            <div
              className={cn(
                CustomScrollbar.CustomScrollbar_Horizontal,
                "w-full flex flex-col overflow-auto"
              )}
            >
              <Grid
                container
                // spacing={2}
                columns={HEADER_TIMES.length}
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "fit-content",
                  m: 0,
                  flexGrow: 1,
                  flexWrap: "nowrap",
                }}
                className="border-b border-greyOutlineSecondary"
              >
                {HEADER_TIMES.map((t, col) => (
                  <Grid
                    md
                    key={t.label}
                    className="bg-greyBackgroundLight"
                    style={{
                      // minWidth: 100 / HEADER_TIMES.length + "%",
                      minWidth: "120px",
                    }}
                  >
                    <div
                      className={cn(
                        "min-w-[120px] py-5 flex justify-center items-center text-sm text-wrap text-greyPrimary",
                        {
                          "font-bold text-purplePrimary": colIsEqualCurrentTime(col),
                          // "text-greyPrimary": !colIsEqualCurrentTime(col),
                        }
                      )}
                    >
                      {t.label}
                    </div>
                  </Grid>
                ))}
              </Grid>
              <div className="relative min-w-full w-max flex flex-col rounded-br-xl border-greyOutlineSecondary">
                {Array.from<number>(Array(mappedData.length))
                  .map(() => Array.from<number>(Array(HEADER_TIMES.length)))
                  .map((_, row) => (
                    <Grid
                      container
                      columns={HEADER_TIMES.length}
                      key={row}
                      sx={{
                        position: "relative",
                        // width: "100%",
                        height: "fit-content",
                        m: 0,
                        // flexGrow: 1,
                        flexWrap: "nowrap",
                      }}
                      className="border-b last:border-b-0 border-greyOutlineSecondary"
                    >
                      {_.map((i, col) => (
                        <Grid
                          md
                          key={`${row}-${col}`}
                          style={{
                            minWidth: "120px",
                          }}
                        >
                          <div
                            className={cn(
                              "relative min-w-[120px] h-12 flex items-center justify-center border-l border-greyOutlineSecondary text-sm",
                              {
                                "border-b border-b-purplePrimary":
                                  row === mappedData.length - 1 &&
                                  colIsEqualCurrentTime(col),
                                // "border-b border-purplePrimary":
                                //   row === mappedData.length - 1 &&
                                //   colIsEqualCurrentTime(col),
                                // "border-t": row === 0,
                                // "border-r": rowarr.length - 1 === col,
                              }
                            )}
                          >
                            {renderShift(row, col)}
                          </div>
                        </Grid>
                      ))}
                      {renderFullDayOff(row)}
                      {renderNotWorkingTime(row)}
                      {renderBreakTime(row)}
                    </Grid>
                  ))}

                {renderVerticalTimeLine()}
              </div>
            </div>
          </div>
          <div className="w-full mt-5 flex items-center justify-center gap-4 sm:flex-wrap">
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-purplePrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">{t("bookingManagement.calendar.walkIn")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-[#2CE5F6]">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">{t("bookingManagement.calendar.smsBooking")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-yellowPrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">{t("bookingManagement.calendar.emailBooking")}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-greenPrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">
                {t("bookingManagement.calendar.emailBookingConfirmed")}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-greyPrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">{t("bookingManagement.calendar.off")}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeLineCalendar;
