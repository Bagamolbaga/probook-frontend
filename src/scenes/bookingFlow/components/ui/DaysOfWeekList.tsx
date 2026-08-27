import { format, isBefore, isSameDay } from "date-fns";
import { cn } from "@/utils/cn";

type Props = {
  selectedDate: Date;
  days: Date[];
  company?: TCompany;
  isWorkingDay?: (date: Date) => boolean;
  selectDateHandler: (date: Date) => void;
};

const DaysOfWeekList = ({
  selectedDate,
  days,
  company,
  isWorkingDay: isWorkingDayProp,
  selectDateHandler,
}: Props) => {
  const isBeforeDay = (date: Date) => isBefore(date, new Date());
  const isWorkingDay = (date: Date) => {
    if (isWorkingDayProp) return isWorkingDayProp(date);

    if (company?.workingSchedule) {
      const ws = company?.workingSchedule;
      const weekDay = format(date, "EEEE") as keyof TCompany["workingSchedule"];

      if (ws[weekDay].workingSlots.length) {
        return true;
      }
    }

    return false;
  };

  return (
    <>
      {days.map((d) => (
        <div
          key={d.toISOString()}
          className={cn(
            "flex-1 flex flex-col items-center rounded-lg cursor-pointer border transition-all border-transparent hover:border-purplePrimary",
            {
              "text-white border-purplePrimary bg-purplePrimary": isSameDay(
                d,
                selectedDate
              ),
              "cursor-default text-greyPrimary hover:border-transparent":
                (isBeforeDay(d) && !isSameDay(d, new Date())) || !isWorkingDay(d),
            }
          )}
          onClick={() =>
            (!isBeforeDay(d) || isSameDay(d, new Date())) &&
            isWorkingDay(d) &&
            selectDateHandler(d)
          }
        >
          <p className="text-xl font-bold text-[inherit] sm:text-sm">{format(d, "dd")}</p>
          <p className="text-sm text-[inherit] sm:text-xs">{format(d, "EEE")}</p>
        </div>
      ))}
    </>
  );
};

export default DaysOfWeekList;
