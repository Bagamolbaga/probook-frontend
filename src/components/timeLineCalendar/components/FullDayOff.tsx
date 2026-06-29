import { FormattedDataItem } from "@/scenes/main/bookingManagement/components/timeLineCalendar";
import TimeLineBreakItem from "./BreakTime/TimeLineBreakItem";
import { TimeManager } from "@/utils/timeManager";

export const FullDayOff = ({
  data,
  row,
  selectedDate,
  selectedDateIsOffDay,
}: {
  row: number;
  data: FormattedDataItem[];
  selectedDate: Date;
  selectedDateIsOffDay?: boolean;
}) => {
  const rowData = data[row];

  let defaultSlots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
    workingSchedule: rowData.specialist.default_shift.working_schedule,
    date: selectedDate,
  });
  rowData.customWorkingShift &&
    (defaultSlots = new TimeManager().getWorkingScheduleSlotsByWeekDay({
      workingSchedule: rowData.customWorkingShift.working_schedule,
      date: selectedDate,
    }));

  const width = 100;
  const paddingRight = 6;
  const paddingLeft = 0;

  if (!defaultSlots?.slots.length) {
    return (
      <TimeLineBreakItem
        key={`${rowData.id}-fullDayOff`}
        type="fullDayOff"
        row={rowData}
        currentDate={selectedDate}
        width={width}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
      />
    );
  }

  //if selected day is OFF day, but staff could have custom shift
  if (selectedDateIsOffDay && !rowData.customWorkingShift) {
    return (
      <TimeLineBreakItem
        key={`${rowData.id}-fullDayOff`}
        type="fullDayOff"
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
