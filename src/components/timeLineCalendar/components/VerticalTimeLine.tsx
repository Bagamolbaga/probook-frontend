import { getHours } from "date-fns";
import { TTimeSlot } from "@/constants/timeSlots";

export const VerticalTimeLine = ({ headerTimes }: { headerTimes: TTimeSlot[] }) => {
  const currTime = new Date();
  const currHour = getHours(currTime);

  const slotsBeforeCurrentHour = headerTimes.filter((s) => s.hour < currHour);

  const paddingLeft = (100 / headerTimes.length) * slotsBeforeCurrentHour.length;

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
