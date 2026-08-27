import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { FormattedDataItem } from "@/scenes/main/bookingManagement/components/timeLineCalendar";
import TimeLineBreakItem from "./BreakTime/TimeLineBreakItem";
import { TimeManager } from "@/utils/timeManager";

export const NotWorkingTime = ({
  data,
  row,
  headerTimes,
  companySlots,
  selectedDate,
}: {
  row: number;
  data: FormattedDataItem[];
  headerTimes: TTimeSlot[];
  companySlots: TTimeSlot[];
  selectedDate: Date;
}) => {
  const rowData = data[row];

  const defaultSlots = rowData.customWorkingShift
    ? { slots: new TimeManager().getFullSlots(rowData.customWorkingShift.workingSlots) }
    : null;

  const beforeWorkingTimeBreakSlots = headerTimes
    .filter((s) => defaultSlots && s.slot < defaultSlots.slots[0].slot)
    .map((s) => s.slot);
  const afterWorkingTimeBreakSlots = headerTimes
    .filter(
      (s) =>
        defaultSlots && s.slot >= defaultSlots.slots[defaultSlots.slots.length - 1].slot
    )
    .map((s) => s.slot);

  const allAfterWorkingTimeBreakSlots = companySlots
    .filter(
      (s) =>
        defaultSlots && s.slot >= defaultSlots.slots[defaultSlots.slots.length - 1].slot
    )
    .map((s) => s.slot);

  const getContent = ({
    slots,
    type,
  }: {
    slots: number[];
    type: "beforeWorkingTime" | "afterWorkingTime";
  }) => {
    const fullSlots = headerTimes.filter((s) => slots.includes(s.slot));
    const fullWorkingSlots = TIME_SLOTS.filter((s) =>
      defaultSlots?.slots.map((s) => s.slot).includes(s.slot)
    );

    const lastWorkingSlotIsNotFullHour =
      fullWorkingSlots[fullWorkingSlots.length - 1].minute === 30;
    const firstWorkingSlotIsNotFullHour = fullWorkingSlots[0].minute === 30;

    let width = 0;
    let paddingLeft = 0;
    const paddingRight = 6;

    if (type === "beforeWorkingTime") {
      width =
        (100 / headerTimes.length) *
        (fullSlots.length - (firstWorkingSlotIsNotFullHour ? 0.5 : 0));
      paddingLeft = 0;
    }

    if (type === "afterWorkingTime") {
      width =
        (100 / headerTimes.length) *
        (fullSlots.length + (lastWorkingSlotIsNotFullHour ? 0.5 : 0));
      paddingLeft = 100 - width;
    }

    return (
      <TimeLineBreakItem
        key={`${rowData.id}-${type}`}
        type={type}
        row={rowData}
        currentDate={selectedDate}
        width={width}
        paddingLeft={paddingLeft}
        paddingRight={paddingRight}
      />
    );
  };

  const contents = [];

  if (beforeWorkingTimeBreakSlots.length) {
    contents.push(
      getContent({
        slots: beforeWorkingTimeBreakSlots,
        type: "beforeWorkingTime",
      })
    );
  }

  if (
    afterWorkingTimeBreakSlots.length &&
    afterWorkingTimeBreakSlots.find((s) => headerTimes.find((ts) => ts.slot === s))
  ) {
    contents.push(
      getContent({
        slots: afterWorkingTimeBreakSlots,
        type: "afterWorkingTime",
      })
    );
  } else if (!afterWorkingTimeBreakSlots.length && allAfterWorkingTimeBreakSlots.length) {
    //if last slot equal some hours and 30 min and it slot not in 'beforeWorkingTimeBreakSlot'`
    // contents.push(
    //   getContent({
    //     slots: [],
    //     type: "afterWorkingTime",
    //   })
    // );
  }

  if (contents.length) {
    return contents;
  }

  return null;
};
