export type TDefaultShifts = {
  id: number;
  nameId: TDefaultShiftsNameId;
  name: string;
  slots: number[];
};

export const DEFAULT_SHIFTS: TDefaultShifts[] = [
  {
    id: 2,
    nameId: "FULL_DAY",
    name: "Full day",
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
      57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    ],
  },
  {
    id: 3,
    nameId: "AFTERNOON",
    name: "Afternoon",
    slots: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72],
  },
  {
    id: 4,
    nameId: "MORNING",
    name: "Morning",
    slots: [
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56,
    ],
  },
  {
    id: 6,
    nameId: "CUSTOM",
    name: "Custom",
    slots: [],
  },
  {
    id: 5,
    nameId: "OFF",
    name: "Off",
    slots: [],
  },
] as const;

export const DEFAULT_SHIFTS_OBJ = {
  CUSTOM: {
    id: 6,
    name: "Custom",
    slots: [],
    break: [],
  },
  OFF: {
    id: 5,
    name: "Off",
    slots: [],
    break: [],
  },
};
