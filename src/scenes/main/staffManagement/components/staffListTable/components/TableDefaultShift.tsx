import { SHIFT_COLORS } from "@/constants/shiftColors";
import { cn } from "@/utils/cn";
import { TimeManager } from "@/utils/timeManager";

type Props = {
  shiftPresets: TShift[];
  currentShift: TShift;
};

const TableDefaultShift = ({ currentShift, shiftPresets }: Props) => {
  const isPreset = shiftPresets
    .filter((s) => s.is_default && !s.specialist && s.name !== "CUSTOM")
    .find((s) => s.id === currentShift.id);

  const getName = () => {
    return "Custom"
    if (currentShift.name === "CUSTOM") {
      const tm = new TimeManager();
      const from = tm.getWorkingScheduleFirstWeekDaySlots(currentShift.working_schedule)

      return `${from.workings[0].label} - ${from.workings.at(-1)?.label}`;
    }

    return currentShift.name;
  };
  
  const getColor = () => {
    return SHIFT_COLORS[0];
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
        <p
          className={cn("text-sm font-bold")}
          style={{ color: getColor() }}
        >
          {getName()}
        </p>
      </div>
    </div>
  );
};

export default TableDefaultShift;
