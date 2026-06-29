import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getMonth,
  getYear,
  isSameMonth,
  setYear,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { cn } from "@/utils/cn";
import { DATE_FORMAT } from "@/constants/other";

import BookingItem from "./BookingItem";
import CustomScroll from "@/styles/scrollbar.module.sass";

const MONTHS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getMonthGrid = (year: number, monthIndex: number) => {
  // Создаём дату первого числа месяца
  const date = new Date(year, monthIndex, 1);
  const start = startOfMonth(date); // первое число месяца
  const end = endOfMonth(date); // последнее число месяца

  // Начало и конец сетки (с понедельника по воскресенье)
  const gridStart = startOfWeek(start, { weekStartsOn: 1 }); // 1 = понедельник
  const gridEnd = endOfWeek(end, { weekStartsOn: 1 }); // последнее воскресенье

  // Получаем все дни от начала до конца сетки
  const allDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  type DayObj = {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
  };
  // Формируем сетку 6x7
  const grid: DayObj[][] = [];

  let week: DayObj[] = [];

  allDays.forEach((day) => {
    const dayObj = {
      day: day.getDate(),
      month: day.getMonth(),
      year: day.getFullYear(),
      isCurrentMonth: isSameMonth(day, date),
    };
    week.push(dayObj);

    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  });

  return grid;
};

type Props = {
  bookings: TBooking[];
  dateRange: {
    from: Date;
    to: Date;
  };
  handleBookingClick: (b: TBooking) => void;
};

const ByMonth = ({ bookings, dateRange, handleBookingClick }: Props) => {
  const year = getYear(dateRange.from);
  const month = getMonth(dateRange.from);

  const monthGridWithBookings = getMonthGrid(year, month).map((row) =>
    row.map((d) => {
      const day = setYear(new Date(), d.year).setMonth(d.month, d.day);
      const formatDay = format(day, DATE_FORMAT);
      const books = bookings.filter((b) => b.date === formatDay);

      return {
        ...d,
        bookings: books,
      };
    })
  );

  return (
    <div className="w-full rounded-lg overflow-hidden border border-[#eee]">
      <div className="w-full grid grid-cols-7 bg-greyBackgroundLight">
        {MONTHS.map((m) => (
          <span
            key={m}
            className="col-span-1 flex items-center justify-center py-5 text-sm text-greyPrimary"
          >
            {m}
          </span>
        ))}
      </div>

      <div>
        {monthGridWithBookings.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="w-full grid grid-cols-7 border-b last:border-b-0 border-[#eee]"
          >
            {row.map((d) => (
              <div
                key={`${rowIdx}-${d.day}`}
                className={cn(
                  "col-span-1 min-h-[130px] p-2 text-sm border-r last:border-r-0 border-[#eee]"
                )}
              >
                <p
                  className={cn("text-right text-black", {
                    "text-greyPrimary": !d.isCurrentMonth,
                  })}
                >
                  {d.day}
                </p>
                {d.bookings.length > 0 ? (
                  <div
                    className={cn(
                      CustomScroll.CustomScrollbar,
                      "mt-2 flex flex-col gap-1"
                    )}
                  >
                    {d.bookings.map((b) => (
                      <BookingItem
                        withTime
                        className="min-h-[80px] h-[80px]"
                        key={b.id}
                        booking={b}
                        handleClick={() => handleBookingClick(b)}
                      />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ByMonth;
