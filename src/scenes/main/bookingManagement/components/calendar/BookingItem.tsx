import { TimeManager } from "@/utils/timeManager";
import { cn } from "@/utils/cn";
import { BOOKING_STATUS_STYLES } from "@/constants/bookingStatuses";
import { CSSProperties, useState } from "react";
import { BOOKING_ITEM_FIX_WIDTH } from "./ByWeek";

type Props = {
  booking: TApiBooking;
  className?: string;
  withHover?: boolean;
  withShowMore?: boolean;
  withTime?: boolean;
  style?: CSSProperties;
  handleClick: () => void;
};

const BookingItem = (props: Props) => {
  const { booking, className, style, withHover, withShowMore, withTime, handleClick } =
    props;
  const slots = new TimeManager().getFullSlotsFromArr(booking.slots);
  const statusStyles = BOOKING_STATUS_STYLES[booking.status];

  const [isHover, setIsHover] = useState(false);

  const renderTime = (show?: boolean) => {
    if (show) {
      const end = new TimeManager().getFullSlotsFromArr([
        (booking.slots.at(-1) ?? -1) + 1,
      ])[0];
      return `${slots[0]?.label || ""} - ${end?.label || ""}`;
    }

    return null;
  };

  return (
    <>
      {isHover && withHover && (
        <div
          className={cn(
            "absolute z-20 bottom-[calc(100%)] left-1",
            "w-[calc(100%-8px)] h-[100px] py-2 px-3 border rounded-md cursor-pointer",
            statusStyles.timelineClassName,
            statusStyles.borderClassName
          )}
          style={
            withShowMore
              ? { width: `${BOOKING_ITEM_FIX_WIDTH}px`, left: style?.left }
              : {}
          }
          onClick={handleClick}
        >
          <p className={cn("text-sm font-bold", statusStyles.textClassName)}>
            {booking.customer.firstName} {booking.customer.lastName}
          </p>
          <p className={cn("mt-[2px] text-xs", statusStyles.textClassName)}>
            {renderTime(true)}
          </p>
        </div>
      )}

      <div
        style={style}
        className={cn(
          "group relative h-full w-full py-2 px-3 rounded-md cursor-pointer overflow-hidden",
          className,
          statusStyles.timelineClassName
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <p className={cn("text-sm font-bold", statusStyles.textClassName)}>
          {booking.customer.firstName} {booking.customer.lastName}
        </p>
        <p className={cn("mt-[2px] text-xs", statusStyles.textClassName)}>
          {renderTime(withTime)}
        </p>
      </div>
    </>
  );
};

export default BookingItem;
