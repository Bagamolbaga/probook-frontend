import { cn } from "@/utils/cn";
import { TTimeSlot } from "@/constants/timeSlots";
import { ClockAlert, Coffee, Lock } from "lucide-react";

type Props = {
  compact?: boolean;
  selectedSlot?: TTimeSlot;
  slots: {
    isColorHighlight?: boolean;
    isDisabled?: boolean;
    slot: number;
    hour: number;
    minute: number;
    label: string;
    unavailableReason?: "busy" | "break" | "not_enough_time";
  }[];
  selectTimeHandler: (slot: number, fullSlot: any) => void;
};

const TimeSlots = ({ compact, selectedSlot, slots, selectTimeHandler }: Props) => {
  return (
    <>
      {slots.map((s) => (
        <div
          key={s.slot}
          className={cn(
            "h-[45px] py-3 px-4 flex items-center justify-start gap-2 text-sm rounded-lg border transition-all border-greyOutlineSecondary",
            {
              "h-[40px]": compact,
              "font-bold text-purplePrimary border-purplePrimary":
                selectedSlot?.slot === s.slot,
              "hover:border-purplePrimary cursor-pointer": !s.isDisabled,

              "text-greyPrimary": s.isDisabled,
              "!border-[#F3B65A] !bg-[#FFF4E5] !text-[#A45C00]":
                s.unavailableReason === "break",
              "!bg-purplePrimary/10": s.isColorHighlight,
            }
          )}
          data-slot-status={s.unavailableReason || "free"}
          onClick={() => !s.isDisabled && selectTimeHandler(s.slot, s)}
        >
          <span className="size-4">
            {s.unavailableReason === "break" && <Coffee className="w-full h-full" />}
            {s.unavailableReason === "busy" && <Lock className="w-full h-full" />}
            {s.unavailableReason === "not_enough_time" && (
              <ClockAlert className="w-full h-full" />
            )}
          </span>
          {s.label}
        </div>
      ))}
    </>
  );
};

export default TimeSlots;
