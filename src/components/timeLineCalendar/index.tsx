/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Button from "@/components/ui/button";
import DatePicker from "@/components/ui/DatePicker";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CalendarIcon from "@/components/ui/icons/Calendar";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/utils/cn";
import { Grid } from "@mui/material";
import { addDays, differenceInHours, format, isSameHour, setHours } from "date-fns";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { VerticalTimeLine } from "./components/VerticalTimeLine";
import Shift from "./components/Shift";
import { DATE_FNS_LOCALES, useLocale, useTranslations } from "@/i18n";
import { FormattedDataItem } from "@/scenes/main/bookingManagement/components/timeLineCalendar";
import BookingDetailsModal from "./components/BookingDetailsModal";
import { BreakTime } from "./components/BreakTime/index.";
import { TimeManager } from "@/utils/timeManager";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import { useGetBookingsQuery } from "@/api/queries/booking";
import { useGetCompanyShiftsForDateRangeQuery } from "@/api/queries/company/shift";
import { NotWorkingTime } from "./components/NotWorkingTime";
import { FullDayOff } from "./components/FullDayOff";

type Props = {
  companyId: string;
  specialistIds: TSpecialist["id"][];
  onStopLoading: (val: boolean) => void;
};

const TimeLineCalendar = ({ companyId, specialistIds, onStopLoading }: Props) => {
  const t = useTranslations();
  const locale = useLocale() as keyof typeof DATE_FNS_LOCALES;

  const datePickerContainer = useRef<HTMLDivElement>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDateIsOffDay, setSelectedDateIsOffDay] = useState(false);

  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<TApiBooking>();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({
    companyId,
  });
  const getBookingsQuery = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: addDays(selectedDate, -5),
      end_date: addDays(selectedDate, 5),
    },
  });
  const getCompanyShiftsForDateRangeQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: selectedDate,
    end: selectedDate,
  });

  const isLoaded = Boolean(
    getCompanyDetailsQuery.data &&
    getCompanySpecialistsQuery.data &&
    getBookingsQuery.data &&
    getCompanyShiftsForDateRangeQuery.data
  );

  useEffect(() => {
    if (isLoaded) onStopLoading(false);
  }, [isLoaded, onStopLoading]);

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

  const data: FormattedDataItem[] = useMemo(() => {
    if (
      !getCompanySpecialistsQuery.data ||
      !getBookingsQuery.data ||
      !getCompanyShiftsForDateRangeQuery.data
    ) {
      return [];
    }

    let data: FormattedDataItem[] = [];

    getCompanySpecialistsQuery.data.results.forEach((s) => {
      if (specialistIds.includes(s.id)) {
        data.push({
          id: s.id,
          company: s.company || companyId,
          specialist: s,
          shifts: [],
          revalidateQueries: revalidateQueriesHandler,
        });
      }
    });

    getBookingsQuery.data.results.forEach((item) => {
      const findedIdx = data.findIndex((i) => i?.id === item.specialist?.id);

      if (findedIdx >= 0) {
        data[findedIdx]._booking = item;
        data[findedIdx].shifts.push({
          id: item.id,
          customer: item.customer,
          slots: item.slots,
          date: item.date,
          status: item.status,
          updatedAt: item.updatedAt,
          services: item.services,
        });
      }
    });

    data = data.map((i) => {
      const findedCustomShift = getCompanyShiftsForDateRangeQuery.data.results.find(
        (entry) => entry.specialist.id === i.specialist.id
      );

      const effectiveShift =
        findedCustomShift?.shifts.find((shift) => shift.kind === "override") ||
        findedCustomShift?.defaultShift ||
        undefined;

      if (effectiveShift) {
        return { ...i, customWorkingShift: effectiveShift };
      }

      return i;
    });

    return data.map((i) => ({
      ...i,
      shifts: i.shifts.filter((i) => i.date === format(selectedDate, "yyyy-MM-dd")),
    }));
  }, [
    getCompanySpecialistsQuery.data,
    getBookingsQuery.data,
    getCompanyShiftsForDateRangeQuery.data,
    companyId,
    selectedDate,
    specialistIds,
    revalidateQueriesHandler,
  ]);

  const { HEADER_TIMES, COMPANY_SLOTS } = useMemo(() => {
    const slotManager = new TimeManager();

    const workingSchedule = getCompanyDetailsQuery?.data?.workingSchedule;

    if (workingSchedule) {
      const currWorkingTime = slotManager.getCompanyWorkingScheduleSlotsByWeekDay({
        workingSchedule,
        date: selectedDate,
      });

      let slots: TTimeSlot[] = [];

      if (currWorkingTime && currWorkingTime.slots.length) {
        slots = currWorkingTime.slots.filter((s) => s.minute === 0) || [];

        setSelectedDateIsOffDay(false);
      } else {
        //if current day is OFF day for company, but specialist could have custom working shift
        slots = slotManager.getWorkingTimeSlotsCompany(workingSchedule);

        if (slots.length) {
          slots = slots.filter((s) => s.minute === 0);

          setSelectedDateIsOffDay(true);

          return {
            HEADER_TIMES: slots.slice(0, -1),
            COMPANY_SLOTS: slots,
          };
        }

        setSelectedDateIsOffDay(true);

        return {
          HEADER_TIMES: slotManager
            .getFullSlotsInRange(32, 88)
            .slice(0, -1)
            .filter((s) => s.minute === 0),
          COMPANY_SLOTS: slotManager
            .getFullSlotsInRange(32, 88)
            .filter((s) => s.minute === 0),
        };
      }

      return {
        HEADER_TIMES: slots.slice(0, -1),
        COMPANY_SLOTS: slots,
      };
    }

    return {
      HEADER_TIMES: slotManager.getFullSlotsInRange(32, 88).slice(0, -1),
      COMPANY_SLOTS: slotManager.getFullSlotsInRange(32, 88),
    };
  }, [getCompanyDetailsQuery.data, selectedDate]);

  const closeDatePickerHandler = () => {
    setIsOpenDatePicker(false);
  };

  const toggleDatePickerHandler = () => {
    setIsOpenDatePicker((p) => !p);
  };

  const selectNextDayHandler = () => {
    setSelectedDate((prev) => addDays(prev, 1));
  };

  const selectPrevDayHandler = () => {
    setSelectedDate((prev) => addDays(prev, -1));
  };

  const selectBookingHandler = (rowData: FormattedDataItem) => {
    if (rowData._booking) {
      setSelectedBooking(rowData._booking);
    }
  };

  useClickOutside(datePickerContainer, closeDatePickerHandler);

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

  const colIsEqualCurrentTime = (col: number) => {
    const startSlot = HEADER_TIMES[col].slot;

    const startTime = TIME_SLOTS.find((s) => s.slot === startSlot)?.hour || null;

    if (startTime) {
      const startDate = setHours(new Date(), startTime);
      const currDate = new Date();

      return isSameHour(startDate, currDate);
    }

    return false;
  };

  return (
    <>
      {selectedBooking && getCompanyDetailsQuery.data && (
        <BookingDetailsModal
          isOpen={Boolean(selectedBooking)}
          company={getCompanyDetailsQuery.data}
          booking={selectedBooking}
          handleClose={() => setSelectedBooking(undefined)}
        />
      )}
      <div className="w-full h-full flex-1 flex flex-col rounded-xl bg-white">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">{format(selectedDate, "MMMM d, yyyy")}</div>
          <div className="flex items-center">
            <div ref={datePickerContainer} className="relative">
              <Button
                className="w-12 !p-2"
                variant="resting-active"
                onClick={toggleDatePickerHandler}
              >
                <CalendarIcon className="" />
              </Button>

              {isOpenDatePicker && (
                <div className="absolute z-[55] top-0 right-[calc(100%+8px)]">
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
          </div>
        </div>
        <div className="w-full h-full flex-1 flex flex-col justify-between">
          <div className="flex mt-9 rounded-xl overflow-hidden border border-greyOutlineSecondary">
            <div className="max-w-[140px] w-fit h-full flex flex-col overflow-hidden">
              <div className="w-full py-5 text-sm text-greyPrimary border-b border-greyOutlineSecondary bg-greyBackgroundLight">
                <div className="invisible">1</div>
              </div>
              {data.map((item) => (
                <div
                  key={item.specialist.id}
                  className="w-full h-[48.8px] px-1 flex justify-start items-center text-left border-b last:border-b-0 text-sm text-greyPrimary border-greyOutlineSecondary"
                >
                  {item.specialist.fullName}
                </div>
              ))}
            </div>
            <div className="w-full flex flex-col overflow-auto">
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
                {Array.from<number>(Array(data.length))
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
                                  row === data.length - 1 && colIsEqualCurrentTime(col),
                                // "border-b border-purplePrimary":
                                //   row === data.length - 1 &&
                                //   colIsEqualCurrentTime(col),
                                // "border-t": row === 0,
                                // "border-r": rowarr.length - 1 === col,
                              }
                            )}
                          >
                            <Shift
                              row={row}
                              col={col}
                              data={data}
                              headerTimes={HEADER_TIMES}
                              handleOpenBookingDetails={selectBookingHandler}
                            />
                          </div>
                        </Grid>
                      ))}
                      <FullDayOff
                        row={row}
                        data={data}
                        selectedDate={selectedDate}
                        selectedDateIsOffDay={selectedDateIsOffDay}
                      />
                      <NotWorkingTime
                        row={row}
                        data={data}
                        headerTimes={HEADER_TIMES}
                        companySlots={COMPANY_SLOTS}
                        selectedDate={selectedDate}
                      />
                      <BreakTime
                        row={row}
                        data={data}
                        headerTimes={HEADER_TIMES}
                        selectedDate={selectedDate}
                        selectedDateIsOffDay={selectedDateIsOffDay}
                      />
                    </Grid>
                  ))}

                <VerticalTimeLine headerTimes={HEADER_TIMES} />
              </div>
            </div>
          </div>

          <div className="w-full mb-6 flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-purplePrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">Walk-in / Direct Contact</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-[#2CE5F6]">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">SMS Booking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-yellowPrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">Email Booking</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-greenPrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">Email Booking - Confirmed</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-3 flex items-center justify-center rounded-full bg-greyPrimary">
                <div className="size-1 rounded-full bg-white" />
              </div>
              <p className="text-sm">Off</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeLineCalendar;
