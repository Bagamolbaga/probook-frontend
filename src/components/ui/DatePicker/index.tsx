/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { DayPicker } from "react-day-picker";
import ArrowSecondaryDownIcon from "../icons/ArrowSecondaryDown";
import { cn } from "@/utils/cn";
import { useRef } from "react";

export type DatePickerProps = React.ComponentProps<typeof DayPicker>;

type Props = {
  _forBookingCreationPage?: boolean;
};

function DatePicker({
  className,
  classNames,
  showOutsideDays = true,
  _forBookingCreationPage,
  ...props
}: DatePickerProps & Props) {
  const ref = useRef(null);

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("pb-2 rounded-lg overflow-hidden shadow-primary", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: cn("relative py-4 flex justify-center items-center", {
          "mx-4 pb-4 mb-4 justify-between border-b border-greyOutlineSecondary": _forBookingCreationPage,
        }),
        caption_label: cn("text-base font-bold", {}),
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          "size-7 p-0 flex justify-center items-center bg-transparent opacity-50 hover:opacity-100",
          {
            "size-9": _forBookingCreationPage,
          }
        ),
        nav_button_previous: cn("absolute left-1", {
          relative: _forBookingCreationPage,
        }),
        nav_button_next: cn("absolute right-1", {
          relative: _forBookingCreationPage,
        }),
        table: "w-full !mt-0 px-5 border-collapse space-y-1",
        head_row: "px-2 flex justify-between",
        head_cell: cn("text-greyPrimary rounded-md w-8 font-normal text-[0.8rem]", {
          "text-[14px]": _forBookingCreationPage,
        }),
        row: cn("w-full mt-2 px-2 flex justify-between", {}),
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20"
        ),
        day: cn(
          "h-8 w-8 p-0 rounded-[6px] font-semibold aria-selected:opacity-100 hover:bg-purplePrimary/80 hover:text-white",
          {
            "size-10 rounded-full": _forBookingCreationPage,
          }
        ),
        day_range_start: "day-range-start rounded-r-none",
        day_range_end: "day-range-end rounded-l-none",
        day_selected: cn("bg-purplePrimary text-white hover:!bg-purplePrimary"),
        // day_selected: cn({
        //   "bg-purplePrimary text-white": props.mode === "range",
        //   "bg-purplePrimary text-white": props.mode !== "range",
        // }),
        day_today: cn({
          "bg-purplePrimary text-white": props.mode === "range",
          "bg-purplePrimary/40 text-white": props.mode !== "range",
          "bg-[white] border border-greyOutlineSecondary !text-darkPrimary":
            props.mode !== "range" && _forBookingCreationPage,
        }),
        // day_today: "bg-purplePrimary/40 text-white",
        day_outside:
          "day-outside text-greyPrimary/50 !font-normal aria-selected:bg-purplePrimary/50 aria-selected:text-greyPrimary aria-selected:opacity-30", //другой месяц
        day_disabled: "!text-greyPrimary/50 !font-normal",
        day_range_middle: cn(
          "bg-purplePrimary/20 !text-purplePrimary rounded-none hover:bg-purplePrimary/50 hover:text-white focus:bg-purplePrimary/40 focus:text-purplePrimary"
        ),
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ArrowSecondaryDownIcon
            className={cn("size-5 rotate-90", {
              "size-6": _forBookingCreationPage,
            })}
          />
        ),
        IconRight: ({ ...props }) => (
          <ArrowSecondaryDownIcon
            className={cn("size-5 -rotate-90", {
              "size-6": _forBookingCreationPage,
            })}
          />
        ),
      }}
      {...props}
    />
  );
}
DatePicker.displayName = "DatePicker";

export default DatePicker;
