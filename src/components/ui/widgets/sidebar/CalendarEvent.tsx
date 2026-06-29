import { FC } from "react";
import clsx from "clsx";

type Props = CalendarEvent;

const CalendarEvent: FC<Props> = ({ status, time, title, desc }) => {
  return (
    <div className="w-full pt-[14px] pb-4 pl-5 pr-4 flex flex-col rounded-xl cursor-pointer transition-all bg-greyBackgroundLight/40 hover:bg-greyBackgroundLight/80">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-[6px]">
          <div
            className={clsx("w-2 h-2 rounded-full", {
              "bg-purplePrimary": status === "booked",
              "bg-yellowPrimary": status === "pending",
              "bg-greenPrimary": status === "completed",
              "bg-redPrimary": status === "error",
              "bg-greyPrimary": status === "off",
            })}
          />
          <span className="text-xs font-bold text-purplePrimary">
            {time?.start}
            {time?.end && `-${time.end}`}
          </span>
        </div>
        <div>...</div>
      </div>
      <p className="text-sm font-bold">{title}</p>
      <p className="text-xs text-greyPrimary">{desc}</p>
    </div>
  );
};

export default CalendarEvent;
