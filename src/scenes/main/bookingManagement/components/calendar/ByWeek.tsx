import { eachDayOfInterval, endOfWeek, format, startOfWeek } from "date-fns";
import { cn } from "@/utils/cn";
import { DATE_FORMAT } from "@/constants/other";

import BookingItem from "./BookingItem";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { TimeManager } from "@/utils/timeManager";
import { useEffect, useMemo, useState } from "react";
import { TTimeSlot } from "@/constants/timeSlots";

const BOOKING_ITEM_FIX_MARGIN = 4;
export const BOOKING_ITEM_FIX_WIDTH = 140;

const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 = понедельник
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return eachDayOfInterval({ start, end });
};

const getSlotsFromMinAndMax = (
  value: Record<
    string,
    {
      slots: TTimeSlot[];
      break: TTimeSlot[];
    }
  >
) => {
  let allSlots: number[] = [];

  Object.values(value).forEach((slots) => {
    allSlots = [...allSlots, ...slots.slots.map((s) => s.slot)];
  });

  const sorted = allSlots.sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];

  return new TimeManager().getFullSlotsInRange(min, max);
};

type Props = {
  bookings: TApiBooking[];
  staffs: TSpecialist[];
  dateRange: {
    from: Date;
    to: Date;
  };
  handleBookingClick: (b: TApiBooking) => void;
};

const ByWeek = ({ bookings, staffs, dateRange, handleBookingClick }: Props) => {
  const { companyId } = useGetCompanyId();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });

  const [showMoreDayIds, setShowMoreDayIds] = useState<number[]>([]);

  useEffect(() => {
    if (staffs.length === 1) {
      setShowMoreDayIds([]);
    }
  }, [staffs]);

  const handleSelectDayForShowMore = (dayIdx: number) => {
    if (staffs.length === 1) return;

    const finded = showMoreDayIds.includes(dayIdx);

    if (finded) {
      setShowMoreDayIds((p) => p.filter((dIdx) => dIdx !== dayIdx));
    } else {
      setShowMoreDayIds((p) => [...p, dayIdx]);
    }
  };

  const storeSlots = useMemo<
    Partial<Record<WorkingScheduleWeekDays, { slots: TTimeSlot[]; break: TTimeSlot[] }>>
  >(() => {
    if (getCompanyDetailsQuery.data?.workingSchedule) {
      const d = new TimeManager().getWorkingTimeSlotsForAllWeekDaysCompany(
        getCompanyDetailsQuery.data.workingSchedule
      );

      return d;
    }

    return {};
  }, [getCompanyDetailsQuery.data]);

  const weekDays = useMemo(() => getWeekDays(dateRange.from), [dateRange.from]);

  const sortedStaff = staffs.map((s) => s.id).sort();

  const gridSlots = useMemo(() => {
    const allSlots = getSlotsFromMinAndMax(storeSlots);

    const leftSlots = allSlots
      .filter((s) => s.minute === 0 || s.minute === 30)
      .slice(0, -1);

    type Item = {
      slot: TTimeSlot;
      date?: Date;
      bookings: TApiBooking[];
      bookingsInThisDay: TApiBooking[];
      isNotWorking?: boolean;
    };

    const grid: Item[][] = [];
    let week: Item[] = [];

    leftSlots.forEach((slot) => {
      week.push({
        slot,
        bookings: [],
        bookingsInThisDay: [],
      });

      for (let i = 0; i < weekDays.length; i++) {
        const day = weekDays[i];
        const daySlots = storeSlots[format(day, "EEEE") as WorkingScheduleWeekDays];

        const bookingsWithCurrentDayAndStartWithCurrentSlot = bookings.filter(
          (b) => b.date === format(day, DATE_FORMAT) && b.slots[0] === slot.slot
        );
        const bookingsWithCurrentDay = bookings.filter(
          (b) => b.date === format(day, DATE_FORMAT)
        );

        let books: TApiBooking[] = [];

        if (!showMoreDayIds.includes(i)) {
          //if day column is NOT `show more`

          // if (booksWithIntersection.length < 3) {
          //   books = bookingsWithCurrentDayAndStartWithCurrentSlot.slice(
          //     0,
          //     3 - booksWithIntersection.length
          //   );
          // }

          // books = bookings.filter((b) =>
          //   firstThreeStaffsWithSortByBookingsCount.includes(b.specialist.id.toString())
          // );
          books = bookingsWithCurrentDayAndStartWithCurrentSlot;
        } else {
          books = bookingsWithCurrentDayAndStartWithCurrentSlot;
        }

        week.push({
          slot,
          date: day,
          isNotWorking: !daySlots?.slots.length,
          bookings: books,
          bookingsInThisDay: bookingsWithCurrentDay,
        });
      }

      if (week.length === 8) {
        grid.push(week);
        week = [];
      }
    });

    return grid;
  }, [weekDays, storeSlots, bookings, showMoreDayIds]);

  const renderItem = ({
    booking,
    showMore,
  }: {
    booking: TApiBooking;
    showMore?: boolean;
  }) => {
    const fullSlots = new TimeManager().getFullSlotsFromArr(booking.slots);
    const slotsCount = fullSlots.length;
    // const slotsCount = fullSlots
    //   .filter((s) => s.minute === 0 || s.minute === 30)
    //   .slice(0, -1).length;

    const staffIdx = sortedStaff.findIndex(
      (staffId) => staffId === booking.specialist.id
    );

    if (staffIdx < 0) {
      return null;
    }

    const height = (36 / 2) * slotsCount - BOOKING_ITEM_FIX_MARGIN * 2; //rowHeight * slotsCount - paddingY * 2
    // let width = intersectionCount > 0 ? 100 / (intersectionCount + 1) : 100;

    let width = 100 / staffs.length;

    if (showMore) {
      return (
        <BookingItem
          style={{
            height: `${height}px`, //rowHeight * slotsCount - paddingY * 2
            width:
              staffs.length === 1
                ? `calc(100% - ${BOOKING_ITEM_FIX_MARGIN * 2}px)`
                : `calc(${BOOKING_ITEM_FIX_WIDTH}px - ${0}px)`,
            left:
              staffs.length === 1
                ? `${BOOKING_ITEM_FIX_MARGIN}px`
                : `calc(${(BOOKING_ITEM_FIX_WIDTH + BOOKING_ITEM_FIX_MARGIN) * staffIdx}px + ${BOOKING_ITEM_FIX_MARGIN}px)`,
          }}
          className={cn("absolute z-10 top-1 left-0", {})}
          booking={booking}
          withShowMore
          withTime
          withHover
          handleClick={() => handleBookingClick(booking)}
        />
      );
    }

    const itemCount = sortedStaff.length;
    const totalGaps = (itemCount + 1) * BOOKING_ITEM_FIX_MARGIN;

    width = 100 / staffs.length;
    return (
      <BookingItem
        style={{
          height: `${height}px`,
          width:
            staffs.length === 1
              ? `calc(100% - ${BOOKING_ITEM_FIX_MARGIN * 2}px)`
              : `calc((${100}% - ${totalGaps}px) / ${itemCount})`,
          left:
            staffs.length === 1
              ? `${BOOKING_ITEM_FIX_MARGIN}px`
              : `calc(${width * staffIdx}% + ${4}px)`,
        }}
        className={cn("absolute z-10 top-1 left-0", {})}
        booking={booking}
        withHover
        handleClick={() => handleBookingClick(booking)}
      />
    );

    // return (
    //   <BookingItem
    //     style={{
    //       height: `${height}px`, //rowHeight * slotsCount - paddingY * 2
    //       width: `calc(${width}% - ${intersectionCount ? BOOKING_ITEM_FIX_MARGIN * 2 : BOOKING_ITEM_FIX_MARGIN * 2}px)`,
    //       left: `calc(${leftPosition}% + 4px)`,
    //     }}
    //     className={cn("absolute z-10 top-1 left-0", {})}
    //     booking={booking}
    //     withHover
    //     handleClick={() => handleBookingClick(booking)}
    //   />
    // );
  };

  return (
    <div className="w-full rounded-lg overflow-auto border border-[#eee]">
      <div className="flex items-center">
        <span className="min-w-[100px] h-[60px] bg-greyBackgroundLight"></span>
        <div className="w-full flex items-center 1grid 1grid-cols-7 bg-greyBackgroundLight">
          {weekDays.map((d, colIdx) => (
            <span
              key={d.getTime()}
              className={cn(
                "min-w-[calc(100%/7)] 1col-span-1 flex items-center justify-center py-5 text-sm text-greyPrimary bg-greyBackgroundLight",
                {
                  "cursor-pointer transition-all hover:text-purplePrimary":
                    staffs.length > 1,
                  "text-purplePrimary": showMoreDayIds.includes(colIdx),
                }
              )}
              style={{
                minWidth: showMoreDayIds.includes(colIdx)
                  ? `calc(${BOOKING_ITEM_FIX_WIDTH * sortedStaff.length + sortedStaff.length * (BOOKING_ITEM_FIX_MARGIN + 1)}px)`
                  : undefined,
              }}
              onClick={() => handleSelectDayForShowMore(colIdx)}
            >
              {format(d, "MMM dd")}
            </span>
          ))}
        </div>
      </div>

      <div>
        {gridSlots.map(([first, ...row], rowIdx) => (
          <div key={rowIdx} className="flex items-center">
            <div
              className={cn("min-w-[100px] h-[36px] p-2 text-sm border-t border-[#eee]", {
                // "border-b-2": first.slot.minute === 30,
                "border-t-2": first.slot.minute === 0,
              })}
            >
              {first.slot.minute === 0 ? first.slot.label : null}
            </div>
            <div
              className={cn(
                "w-full h-[36px] flex items-center 1grid 1grid-cols-7 border-[#eee]",
                {
                  // "border-b-2": first.slot.minute === 30,
                }
              )}
            >
              {row.map((d, colIdx) => (
                <div
                  key={`${rowIdx}-${colIdx}`}
                  className={cn(
                    "relative min-w-[calc(100%/7)] h-[36px] p-1 1col-span-1 text-sm overflow-visible border-r border-t first:border-l last:border-r-0 border-[#eee]",
                    {
                      "border-t-2": first.slot.minute === 0,
                      "bg-greyBackgroundLight/50": d.isNotWorking,
                    }
                  )}
                  style={{
                    minWidth: showMoreDayIds.includes(colIdx)
                      ? `calc(${BOOKING_ITEM_FIX_WIDTH * sortedStaff.length + sortedStaff.length * (BOOKING_ITEM_FIX_MARGIN + 1)}px)`
                      : undefined,
                  }}
                >
                  {/* {d.date && console.log(d)} */}
                  {d.bookings.length > 0
                    ? d.bookings.map((booking) =>
                        renderItem({
                          booking,
                          showMore: showMoreDayIds.includes(colIdx),
                        })
                      )
                    : null}
                  {/* {d.bookings.length > 0 ? (
                  <div
                    className={cn(
                      CustomScroll.CustomScrollbar,
                      "mt-2 flex flex-col gap-1"
                    )}
                  >
                    {d.bookings.map((b) => (
                      <BookingItem
                        className="min-h-[80px] h-[80px]"
                        key={b.id}
                        booking={b}
                        handleClick={() => handleBookingClick(b)}
                      />
                    ))}
                  </div>
                ) : null} */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ByWeek;
