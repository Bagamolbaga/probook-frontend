import { useMemo } from "react";
import { differenceInHours, setHours } from "date-fns";
import { TTimeSlot } from "@/constants/timeSlots";

type Props = {
  date?: Date;
  time?: TTimeSlot;
};

export const useUpdateBookingLinkOverdue = ({ date, time }: Props) => {
  const hoursBeforeStartBooking = useMemo(() => {
    if (date && time) {
      const bookingDate = setHours(date, time.hour).setMinutes(time.minute);

      return differenceInHours(bookingDate, new Date());
    }

    return null;
  }, [date, time]);

  return hoursBeforeStartBooking;
};
