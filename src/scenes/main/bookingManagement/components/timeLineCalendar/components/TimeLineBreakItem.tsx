import { FC, useState } from "react";
import { cn } from "@/utils/cn";
import ChangeDailyBreakTimePopup from "./ChangeDailyBreakTimePopup";
import { FormattedDataItem } from "..";

type TimeLineBreakItemProps = {
  row: FormattedDataItem;
  width: number;
  paddingRight: number;
  paddingLeft: number;
  label?: string;
  type: "dailyBreak" | "beforeWorkingTime" | "afterWorkingTime" | "fullDayOff";
  currentDate: Date;
};

const TimeLineBreakItem: FC<TimeLineBreakItemProps> = ({
  row,
  width,
  paddingLeft,
  paddingRight,
  type,
  label,
  currentDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    void row.revalidateQueries();
    setIsOpen(false);
  };

  return (
    <>
      <ChangeDailyBreakTimePopup
        isOpen={isOpen}
        row={row}
        currentDate={currentDate}
        handleClose={closeHandler}
      />
      <div
        key={row.specialist.id + "-break"}
        data-type={type}
        className={cn("absolute z-[5] top-0 left-0 h-full py-[6px]", {
          [`pr-[${paddingRight}px]`]: true,
          [`pl-[${paddingRight}px]`]: true,
          // "z-10": type === "beforeWorkingTime" || type === "afterWorkingTime",
        })}
        style={{
          left: `calc(${paddingLeft}%)`,
          width: `calc(${width}%)`,
        }}
        onClick={() => type === "dailyBreak" && openHandler()}
      >
        <div className="w-full h-full bg-white">
          <div
            className={cn(
              "w-full h-full px-[6px] flex items-center justify-center rounded overflow-hidden bg-greyPrimary/10",
              {
                "cursor-pointer hover:bg-greyPrimary/20": type === "dailyBreak",
              }
            )}
          >
            <p
              className={cn(
                "text-sm font-bold text-center text-nowrap text-ellipsis overflow-hidden",
                {
                  "text-greyPrimary": true,
                }
              )}
            >
              {label && label}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeLineBreakItem;
