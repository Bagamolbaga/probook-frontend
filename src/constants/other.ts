export const HORS_BEFORE_UPDATE_LINK_IS_OVERDUE = 3;
export const DATE_FORMAT = "yyyy-MM-dd"

export const WEEK_DAYS: { id: keyof WorkingSchedule; text: string, shortText: string, order: number }[] = [
  {
    id: "Monday",
    text: "Monday",
    shortText: "Mon",
    order: 1
  },
  {
    id: "Tuesday",
    text: "Tuesday",
    shortText: "Tue",
    order: 2
  },
  {
    id: "Wednesday",
    text: "Wednesday",
    shortText: "Wed",
    order: 3
  },
  {
    id: "Thursday",
    text: "Thursday",
    shortText: "Thu",
    order: 4
  },
  {
    id: "Friday",
    text: "Friday",
    shortText: "Fri",
    order: 5
  },
  {
    id: "Saturday",
    text: "Saturday",
    shortText: "Sat",
    order: 6
  },
  {
    id: "Sunday",
    text: "Sunday",
    shortText: "Sun",
    order: 7
  },
];