import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { FormattedDataItem } from "@/scenes/main/bookingManagement/components/timeLineCalendar";
import TimeLineBreakItem from "./TimeLineBreakItem";
import { TimeManager } from "@/utils/timeManager";

export const BreakTime = ({
  data,
  row,
  headerTimes,
  selectedDateIsOffDay,
  selectedDate,
}: {
  data: FormattedDataItem[];
  row: number;
  headerTimes: TTimeSlot[];
  selectedDateIsOffDay?: boolean;
  selectedDate: Date;
}) => {
  const rowData = data[row];

  const workingSlots = rowData.customWorkingShift
    ? new TimeManager().getFullSlots(rowData.customWorkingShift.workingSlots)
    : [];

  if (!workingSlots.length) return null;

  const defaultBreakSlot = rowData.customWorkingShift
    ? new TimeManager().getFullSlots(rowData.customWorkingShift.breakSlots)
    : [];

  const slots = defaultBreakSlot.map((slot) => slot.slot);

  const fullSlots = headerTimes.filter((s) => slots.includes(s.slot));
  const allFullSlots = TIME_SLOTS.filter(
    (s) => slots.includes(s.slot) && (s.minute === 0 || s.minute === 30)
  );

  const slotsBeforeBreak = headerTimes.filter((s) => s.slot < slots[0]);

  const lastSlotIsNotFullHour = allFullSlots[allFullSlots.length - 1]?.minute === 30;
  // const firstWorkingSlotIsNotFullHour = allFullSlots[0].minute === 30;

  const width =
    (100 / headerTimes.length) *
    (fullSlots.length === 1
      ? fullSlots.length
      : fullSlots.length - 1 + (lastSlotIsNotFullHour ? 0.5 : 0));

  const paddingLeft = (100 / headerTimes.length) * slotsBeforeBreak.length;

  const paddingRight = 6;

  if (!selectedDateIsOffDay && defaultBreakSlot.length) {
    return (
      <TimeLineBreakItem
        key={`${rowData.id}-dailyBreak`}
        type="dailyBreak"
        label="Break"
        row={rowData}
        currentDate={selectedDate}
        width={width}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
      />
    );
  }

  //if selected day is OFF day, but staff could have custom shift
  if (selectedDateIsOffDay && rowData.customWorkingShift) {
    return (
      <TimeLineBreakItem
        key={`${rowData.id}-dailyBreak`}
        type="dailyBreak"
        label="Break"
        row={rowData}
        currentDate={selectedDate}
        width={width}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
      />
    );
  }

  return null;
};
