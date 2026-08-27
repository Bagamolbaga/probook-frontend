import { SHIFT_COLORS } from "@/constants/shiftColors";
import { cn } from "@/utils/cn";
import { TIME_SLOTS } from "@/constants/timeSlots";

type Props = {
  shiftPresets: TShift[];
  currentShift: TShift;
};

const TableDefaultShift = ({ currentShift, shiftPresets }: Props) => {
  const isPreset = shiftPresets
    .filter((shift) => shift.kind === "default" && shift.name !== "CUSTOM")
    .find((shift) => String(shift.id) === String(currentShift.id));

  const getName = () => {
    if (currentShift.name === "CUSTOM") {
      const firstSlot = TIME_SLOTS.find(
        (slot) => slot.slot === currentShift.workingSlots[0]
      );
      const lastSlot = TIME_SLOTS.find(
        (slot) => slot.slot === currentShift.workingSlots.at(-1)
      );

      return firstSlot && lastSlot ? `${firstSlot.label} - ${lastSlot.label}` : "Custom";
    }

    return currentShift.name;
  };

  const getColor = () => {
    if (currentShift.name === "CUSTOM") {
      return SHIFT_COLORS.at(-1)!;
    }

    return currentShift.color || "#8181a5";
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className={cn(
          "w-full py-2 flex justify-center items-center rounded overflow-hidden cursor-pointer bg-opacity-10",
          {
            "bg-greyPrimary": !isPreset,
          }
        )}
        style={{
          backgroundColor: `${getColor()}20`,
        }}
      >
        <p className={cn("text-sm font-bold")} style={{ color: getColor() }}>
          {getName()}
        </p>
      </div>
    </div>
  );
};

export default TableDefaultShift;
