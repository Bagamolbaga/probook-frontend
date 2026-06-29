import { TimeManager } from "@/utils/timeManager";
import { cn } from "@/utils/cn";
import { CSSProperties, useState } from "react";
import { BOOKING_ITEM_FIX_WIDTH } from "./ByWeek";

type Props = {
  booking: TBooking;
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

  const [isHover, setIsHover] = useState(false);

  const renderTime = (show?: boolean) => {
    if (show) {
      return `${slots[0].label} - ${slots.at(-1)?.label}`;
    }

    return null;
  };

  const getPrice = () => {
    return booking.services.reduce((acc, i) => (acc += i.service_option?.price || 0), 0);
  };

  const containerStyles = {
    confirmed: "bg-[#edfae7] hover:bg-[#dbf5d1]",
    walkin: "bg-[#efebfd] hover:bg-[#dfd9fc]",
    pending: "bg-[#fffbe5] hover:bg-[#fef8cc]",
    blocked: "bg-[#fee9e7] hover:bg-[#fed4d1]",
    off: "bg-[#f2f2f6] hover:bg-[#e6e6ed]",
    byPhone: "bg-[#40E1FA1A]/10 hover:bg-[#40E1FA1A]",
  };

  const textStyles = {
    confirmed: "text-greenPrimary",
    walkin: "text-purplePrimary",
    pending: "text-yellowPrimary",
    blocked: "text-redPrimary",
    off: "text-greyPrimary",
    byPhone: "text-[#2CE5F6]",
  };

  const popupStyles = {
    confirmed: "border-greenPrimary",
    walkin: "border-purplePrimary",
    pending: "border-yellowPrimary",
    blocked: "border-redPrimary",
    off: "border-greyPrimary",
    byPhone: "border-[#2CE5F6]",
  };

  const containerClasses = {
    [containerStyles.walkin]:
      (!booking.client.phone && !booking.client.email) || booking.status === "WALK_IN",
    [containerStyles.byPhone]: booking.client.phone?.length,
    [containerStyles.confirmed]:
      booking.status === "COMPLETED" || booking.status === "CONFIRMED",
    [containerStyles.pending]: booking.status === "PENDING",
    [containerStyles.blocked]: booking.status === "BLOCKED",
    [containerStyles.off]: booking.status === "OFF",
  };

  const textClasses = {
    [textStyles.walkin]:
      (!booking.client.phone && !booking.client.email) || booking.status === "WALK_IN",
    [textStyles.byPhone]: booking.client.phone?.length,
    [textStyles.confirmed]:
      booking.status === "COMPLETED" || booking.status === "CONFIRMED",
    [textStyles.pending]: booking.status === "PENDING",
    [textStyles.blocked]: booking.status === "BLOCKED",
    [textStyles.off]: booking.status === "OFF",
  };

  const popupClasses = {
    [popupStyles.walkin]:
      (!booking.client.phone && !booking.client.email) || booking.status === "WALK_IN",
    [popupStyles.byPhone]: booking.client.phone?.length,
    [popupStyles.confirmed]:
      booking.status === "COMPLETED" || booking.status === "CONFIRMED",
    [popupStyles.pending]: booking.status === "PENDING",
    [popupStyles.blocked]: booking.status === "BLOCKED",
    [popupStyles.off]: booking.status === "OFF",
  };

  return (
    <>
      {isHover && withHover && (
        <div
          className={cn(
            "absolute z-20 bottom-[calc(100%)] left-1",
            "w-[calc(100%-8px)] h-[100px] py-2 px-3 border rounded-md cursor-pointer",
            containerClasses,
            popupClasses
          )}
          style={
            withShowMore
              ? { width: `${BOOKING_ITEM_FIX_WIDTH}px`, left: style?.left }
              : {}
          }
          onClick={handleClick}
        >
          <p className={cn("text-sm font-bold", textClasses)}>
            {booking.client.first_name} {booking.client.last_name}
          </p>
          <p className={cn("mt-[2px] text-xs", textClasses)}>{renderTime(true)}</p>
          <p className={cn("mt-[2px] text-xs", textClasses)}>{`฿ ${getPrice()}`}</p>
        </div>
      )}

      <div
        style={style}
        className={cn(
          "group relative h-full w-full py-2 px-3 rounded-md cursor-pointer overflow-hidden",
          className,
          containerClasses
        )}
        onClick={handleClick}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <p className={cn("text-sm font-bold", textClasses)}>
          {booking.client.first_name} {booking.client.last_name}
        </p>
        <p className={cn("mt-[2px] text-xs", textClasses)}>{renderTime(withTime)}</p>
      </div>
    </>
  );
};

export default BookingItem;
