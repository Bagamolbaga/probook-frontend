import { format } from "date-fns";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import { TTimeSlot } from "@/constants/timeSlots";
import { useMemo } from "react";

export const DateSection = ({ date }: { date: Date }) => {
  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="stroke-darkPrimary" />
      <p className="text-sm text-greyPrimary">{format(date, "EEEE d MMM")}</p>
    </div>
  );
};

export const TimeSection = ({
  slot,
  selectedServices,
}: {
  slot: TTimeSlot;
  selectedServices: TServiceAndSelectedOption[];
}) => {
  const duration = useMemo(() => {
    const mins = selectedServices.reduce((acc, s) => (acc += s.selectedOption?.duration || 0), 0);

    if (mins % 60 === 0) {
      return mins / 60;
    }

    return (mins / 60).toFixed(1);
  }, [selectedServices]);

  return (
    <div className="mt-2 flex items-center gap-2">
      <ClockIcon className="stroke-darkPrimary" />
      <p className="text-sm text-greyPrimary">
        {slot.label} ({duration} hr duration)
      </p>
    </div>
  );
};
