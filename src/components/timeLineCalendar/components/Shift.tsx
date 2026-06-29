import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { FormattedDataItem } from "@/scenes/main/bookingManagement/components/timeLineCalendar";
import { cn } from "@/utils/cn";

type Props = {
  row: number;
  col: number;
  data: FormattedDataItem[];
  headerTimes: TTimeSlot[];
  handleOpenBookingDetails: (
    rowData: FormattedDataItem,
    shift: FormattedDataItem["shifts"][number]
  ) => void;
};

const Shift = ({ data, row, col, headerTimes, handleOpenBookingDetails }: Props) => {
  const rowData = data[row];

  const colSlot = TIME_SLOTS.find((s) => s.slot === headerTimes[col].slot)!;
  const shift = rowData.shifts.filter(
    (s) => TIME_SLOTS.find((ts) => ts.slot === s.slots[0])?.hour === colSlot.hour
  );

  if (!shift.length) {
    return null;
  }

  return shift.map((shift) => {
    const findedSlot = TIME_SLOTS.find((s) => s.slot === shift.slots[0])!;

    const paddingsLeft = {
      [60 / 0]: "0%",
      [60 / 15]: "25%",
      [60 / 30]: "50%",
      [60 / 45]: "75%",
    };

    const minShiftLength = (((shift.slots.length - 1) * 15) / 60) * 100;

    const firstSlotIsEven = shift.slots[0] % 2 === 0;
    const lastSlotIsEven = shift.slots.at(-1) && shift.slots.at(-1)! % 2 === 0;

    const status = shift.status;
    const content = (
      <div
        key={shift.client.username}
        className={cn("absolute z-[5] top-0 left-0 h-full py-[6px]", {
          "pl-[6px] pr-[3px]": shift.slots.length === 1 && firstSlotIsEven,
          "pl-[3px] pr-[6px]": shift.slots.length === 1 && !firstSlotIsEven,

          "pl-[6px] ": shift.slots.length !== 1 && firstSlotIsEven,
          "pl-[3px] ": shift.slots.length !== 1 && !firstSlotIsEven,
          "pr-[6px] ": shift.slots.length !== 1 && lastSlotIsEven,
          "pr-[3px] ": shift.slots.length !== 1 && !lastSlotIsEven,
        })}
        style={{
          left: `calc(${paddingsLeft[60 / findedSlot.minute]})`,
          width: `calc(${minShiftLength}%)`,
        }}
        onClick={() => handleOpenBookingDetails(rowData, shift)}
      >
        <div className="w-full h-full bg-white">
          <div
            className={cn(
              "w-full h-full px-[6px] flex items-center rounded overflow-hidden cursor-pointer ",
              {
                "bg-purplePrimary/10 hover:bg-purplePrimary/20":
                  (!shift.client.phone && !shift.client.email) || status === "WALK_IN",
                "bg-[#40E1FA1A]/10 hover:bg-[#40E1FA1A]": shift.client.phone?.length,
                "bg-yellowPrimary/10 hover:bg-yellowPrimary/20":
                  !shift.client.phone?.length &&
                  shift.client.email &&
                  status === "PENDING",
                "bg-greenPrimary/10 hover:bg-greenPrimary/20":
                  !shift.client.phone?.length &&
                  shift.client.email &&
                  status === "COMPLETED",
                "bg-redExtraLight/10 hover:bg-redExtraLight/20": status === "BLOCKED",
                // "bg-blueExtraLight/10 hover:bg-blueExtraLight/20": status === "break",
                "bg-greyPrimary/10 hover:bg-greyPrimary/20": status === "OFF",
              }
            )}
          >
            <p
              className={cn(
                "text-sm font-bold text-nowrap text-ellipsis overflow-hidden",
                {
                  "text-purplePrimary":
                    (!shift.client.phone && !shift.client.email) || status === "WALK_IN",
                  "text-[#2CE5F6]": shift.client.phone?.length,
                  "text-yellowPrimary":
                    !shift.client.phone?.length &&
                    shift.client.email &&
                    status === "PENDING",
                  "text-greenPrimary":
                    !shift.client.phone?.length &&
                    shift.client.email &&
                    status === "COMPLETED",
                  "text-redPrimary": status === "BLOCKED",
                  "text-greyPrimary": status === "OFF",
                }
              )}
            >
              {shift.client.first_name} {shift.client.last_name}
            </p>
          </div>
        </div>
      </div>
    );

    return content;
  });
};

export default Shift;
