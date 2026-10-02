import { cn } from "@/src/utils/cn";
import { TTimeSlot } from "@/src/constants/timeSlots";
import { ClockAlert, Coffee, Lock, UserLock } from "lucide-react";
import { TBookingAvailability } from "@/src/api/entities/booking";

type TSlot = TTimeSlot & {
  staffIds: string[];
  isColorHighlight?: boolean;
  isDisabled?: boolean;
  status?: TBookingAvailability["slots"][number]["status"] | "not_enough_time";
  booking?: TBookingAvailability["slots"][number]["booking"];
};

type TBookingSlotGroup = {
  kind: "booking";
  booking: NonNullable<TSlot["booking"]>;
  slots: TSlot[];
  status: "customer_busy";
  isDisabled: true;
};

export type TRenderedSlot = TSlot | TBookingSlotGroup;

type Props = {
  compact?: boolean;
  selectedSlot?: TTimeSlot;
  slots: TRenderedSlot[];
  selectTimeHandler: (slot: number, fullSlot: TSlot) => void;
};

const TimeSlots = ({ compact, selectedSlot, slots, selectTimeHandler }: Props) => {
  return (
    <>
      {slots.map((s) => {
        if ("kind" in s) {
          const firstSlot = s.slots[0];
          const lastSlot = s.slots.at(-1);
          const services = s.booking.services.map((service) => service.name).join(", ");

          return (
            <div
              key={s.booking.id}
              className={cn(
                "flex min-h-[45px] flex-col justify-center gap-0.5 rounded-lg border border-purplePrimary/30 bg-purplePrimary/10 px-4 py-2 text-sm text-purplePrimary"
              )}
              data-slot-status={s.status}
            >
              <span className="flex items-center gap-2 font-semibold">
                <UserLock className="size-4" />
                {`${firstSlot.label} – ${lastSlot?.label}`}
                <span>{services}</span>
              </span>
              {s.booking.specialist && (
                <span className="ml-[24px] text-xs text-greyPrimary">
                  {s.booking.specialist.fullName}
                </span>
              )}
            </div>
          );
        }

        return (
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
                "!border-[#F3B65A] !bg-[#FFF4E5] !text-[#A45C00]": s.status === "break",
                "!bg-purplePrimary/10": s.isColorHighlight,
              }
            )}
            data-slot-status={s.status || "free"}
            onClick={() => !s.isDisabled && selectTimeHandler(s.slot, s)}
          >
            <span className="size-4">
              {s.status === "break" && <Coffee className="w-full h-full" />}
              {s.status === "busy" && <Lock className="w-full h-full" />}
              {s.status === "not_enough_time" && <ClockAlert className="w-full h-full" />}
              {s.status === "customer_busy" && <UserLock className="w-full h-full" />}
            </span>
            {s.label}
          </div>
        );
      })}
    </>
  );
};

export default TimeSlots;
