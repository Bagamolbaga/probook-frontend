import { cn } from "@/utils/cn";
import { TTimeSlot } from "@/constants/timeSlots";

type Props = {
  selectedSlot?: TTimeSlot;
  slots: {
    isColorHighlight?: boolean;
    isDisabled?: boolean;
    slot: number;
    hour: number;
    minute: number;
    label: string;
  }[];
  selectTimeHandler: (slot: number, fullSlot: any) => void;
};

const TimeSlots = ({ selectedSlot, slots, selectTimeHandler }: Props) => {
  return (
    <>
      {slots.map((s) => (
        <div
          key={s.slot}
          className={cn(
            "h-[45px] py-3 px-4 flex items-center justify-start text-sm rounded-lg border transition-all border-greyOutlineSecondary",
            {
              "font-bold text-purplePrimary border-purplePrimary":
                selectedSlot?.slot === s.slot,
              "hover:border-purplePrimary cursor-pointer": !s.isDisabled,

              "text-greyPrimary": s.isDisabled,
              "!bg-purplePrimary/10": s.isColorHighlight,
            }
          )}
          onClick={() => !s.isDisabled && selectTimeHandler(s.slot, s)}
        >
          {s.label}
        </div>
      ))}
    </>
  );
};

export default TimeSlots;
