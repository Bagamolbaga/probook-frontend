export const TIME_SLOTS__OLD = [
  { label: "00:00", hour: 0, minute: 0, slot: 0 }, //00:00 - 00:30
  { label: "00:30", hour: 0, minute: 30, slot: 1 }, //00:30 - 01:00
  { label: "01:00", hour: 1, minute: 0, slot: 2 }, //01:00 - 01:30
  { label: "01:30", hour: 1, minute: 30, slot: 3 }, //01:30 - 02:00
  { label: "02:00", hour: 2, minute: 0, slot: 4 }, //02:00 - 02:30
  { label: "02:30", hour: 2, minute: 30, slot: 5 }, //02:30 - 03:00
  { label: "03:00", hour: 3, minute: 0, slot: 6 }, //03:00 - 03:30
  { label: "03:30", hour: 3, minute: 30, slot: 7 }, //03:30 - 04:00
  { label: "04:00", hour: 4, minute: 0, slot: 8 }, //04:00 - 04:30
  { label: "04:30", hour: 4, minute: 30, slot: 9 }, //04:30 - 05:00
  { label: "05:00", hour: 5, minute: 0, slot: 10 }, //05:00 - 05:30
  { label: "05:30", hour: 5, minute: 30, slot: 11 }, //05:30 - 06:00
  { label: "06:00", hour: 6, minute: 0, slot: 12 }, //06:00 - 06:30
  { label: "06:30", hour: 6, minute: 30, slot: 13 }, //06:30 - 07:00
  { label: "07:00", hour: 7, minute: 0, slot: 14 }, //07:00 - 07:30
  { label: "07:30", hour: 7, minute: 30, slot: 15 }, //07:30 - 08:00
  { label: "08:00", hour: 8, minute: 0, slot: 16 }, //08:00 - 08:30
  { label: "08:30", hour: 8, minute: 30, slot: 17 }, //08:30 - 09:00
  { label: "09:00", hour: 9, minute: 0, slot: 18 }, //09:00 - 09:30
  { label: "09:30", hour: 9, minute: 30, slot: 19 }, //09:30 - 10:00
  { label: "10:00", hour: 10, minute: 0, slot: 20 }, //10:00 - 10:30
  { label: "10:30", hour: 10, minute: 30, slot: 21 }, //10:30 - 11:00
  { label: "11:00", hour: 11, minute: 0, slot: 22 }, //11:00 - 11:30
  { label: "11:30", hour: 11, minute: 30, slot: 23 }, //11:30 - 12:00
  { label: "12:00", hour: 12, minute: 0, slot: 24 }, //12:00 - 12:30
  { label: "12:30", hour: 12, minute: 30, slot: 25 }, //12:30 - 13:00
  { label: "13:00", hour: 13, minute: 0, slot: 26 }, //13:00 - 13:30
  { label: "13:30", hour: 13, minute: 30, slot: 27 }, //13:30 - 14:00
  { label: "14:00", hour: 14, minute: 0, slot: 28 }, //14:00 - 14:30
  { label: "14:30", hour: 14, minute: 30, slot: 29 }, //14:30 - 15:00
  { label: "15:00", hour: 15, minute: 0, slot: 30 }, //15:00 - 15:30
  { label: "15:30", hour: 15, minute: 30, slot: 31 }, //15:30 - 16:00
  { label: "16:00", hour: 16, minute: 0, slot: 32 }, //16:00 - 16:30
  { label: "16:30", hour: 16, minute: 30, slot: 33 }, //16:30 - 17:00
  { label: "17:00", hour: 17, minute: 0, slot: 34 }, //17:00 - 17:30
  { label: "17:30", hour: 17, minute: 30, slot: 35 }, //17:30 - 18:00
  { label: "18:00", hour: 18, minute: 0, slot: 36 }, //18:00 - 18:30
  { label: "18:30", hour: 18, minute: 30, slot: 37 }, //18:30 - 19:00
  { label: "19:00", hour: 19, minute: 0, slot: 38 }, //19:00 - 19:30
  { label: "19:30", hour: 19, minute: 30, slot: 39 }, //19:30 - 20:00
  { label: "20:00", hour: 20, minute: 0, slot: 40 }, //20:00 - 20:30
  { label: "20:30", hour: 20, minute: 30, slot: 41 }, //20:30 - 21:00
  { label: "21:00", hour: 21, minute: 0, slot: 42 }, //21:00 - 21:30
  { label: "21:30", hour: 21, minute: 30, slot: 43 }, //21:30 - 22:00
  { label: "22:00", hour: 22, minute: 0, slot: 44 }, //22:00 - 22:30
  { label: "22:30", hour: 22, minute: 30, slot: 45 }, //22:30 - 23:00
  { label: "23:00", hour: 23, minute: 0, slot: 46 }, //23:00 - 23:30
  { label: "23:30", hour: 23, minute: 30, slot: 47 }, //23:30 - 00:00
];

export type TTimeSlot = typeof TIME_SLOTS[0]

export const TIME_SLOTS = [
  { slot: 0, hour: 0, minute: 0, label: "00:00" },
  { slot: 1, hour: 0, minute: 15, label: "00:15" },
  { slot: 2, hour: 0, minute: 30, label: "00:30" },
  { slot: 3, hour: 0, minute: 45, label: "00:45" },
  { slot: 4, hour: 1, minute: 0, label: "01:00" },
  { slot: 5, hour: 1, minute: 15, label: "01:15" },
  { slot: 6, hour: 1, minute: 30, label: "01:30" },
  { slot: 7, hour: 1, minute: 45, label: "01:45" },
  { slot: 8, hour: 2, minute: 0, label: "02:00" },
  { slot: 9, hour: 2, minute: 15, label: "02:15" },
  { slot: 10, hour: 2, minute: 30, label: "02:30" },
  { slot: 11, hour: 2, minute: 45, label: "02:45" },
  { slot: 12, hour: 3, minute: 0, label: "03:00" },
  { slot: 13, hour: 3, minute: 15, label: "03:15" },
  { slot: 14, hour: 3, minute: 30, label: "03:30" },
  { slot: 15, hour: 3, minute: 45, label: "03:45" },
  { slot: 16, hour: 4, minute: 0, label: "04:00" },
  { slot: 17, hour: 4, minute: 15, label: "04:15" },
  { slot: 18, hour: 4, minute: 30, label: "04:30" },
  { slot: 19, hour: 4, minute: 45, label: "04:45" },
  { slot: 20, hour: 5, minute: 0, label: "05:00" },
  { slot: 21, hour: 5, minute: 15, label: "05:15" },
  { slot: 22, hour: 5, minute: 30, label: "05:30" },
  { slot: 23, hour: 5, minute: 45, label: "05:45" },
  { slot: 24, hour: 6, minute: 0, label: "06:00" },
  { slot: 25, hour: 6, minute: 15, label: "06:15" },
  { slot: 26, hour: 6, minute: 30, label: "06:30" },
  { slot: 27, hour: 6, minute: 45, label: "06:45" },
  { slot: 28, hour: 7, minute: 0, label: "07:00" },
  { slot: 29, hour: 7, minute: 15, label: "07:15" },
  { slot: 30, hour: 7, minute: 30, label: "07:30" },
  { slot: 31, hour: 7, minute: 45, label: "07:45" },
  { slot: 32, hour: 8, minute: 0, label: "08:00" },
  { slot: 33, hour: 8, minute: 15, label: "08:15" },
  { slot: 34, hour: 8, minute: 30, label: "08:30" },
  { slot: 35, hour: 8, minute: 45, label: "08:45" },
  { slot: 36, hour: 9, minute: 0, label: "09:00" },
  { slot: 37, hour: 9, minute: 15, label: "09:15" },
  { slot: 38, hour: 9, minute: 30, label: "09:30" },
  { slot: 39, hour: 9, minute: 45, label: "09:45" },
  { slot: 40, hour: 10, minute: 0, label: "10:00" },
  { slot: 41, hour: 10, minute: 15, label: "10:15" },
  { slot: 42, hour: 10, minute: 30, label: "10:30" },
  { slot: 43, hour: 10, minute: 45, label: "10:45" },
  { slot: 44, hour: 11, minute: 0, label: "11:00" },
  { slot: 45, hour: 11, minute: 15, label: "11:15" },
  { slot: 46, hour: 11, minute: 30, label: "11:30" },
  { slot: 47, hour: 11, minute: 45, label: "11:45" },
  { slot: 48, hour: 12, minute: 0, label: "12:00" },
  { slot: 49, hour: 12, minute: 15, label: "12:15" },
  { slot: 50, hour: 12, minute: 30, label: "12:30" },
  { slot: 51, hour: 12, minute: 45, label: "12:45" },
  { slot: 52, hour: 13, minute: 0, label: "13:00" },
  { slot: 53, hour: 13, minute: 15, label: "13:15" },
  { slot: 54, hour: 13, minute: 30, label: "13:30" },
  { slot: 55, hour: 13, minute: 45, label: "13:45" },
  { slot: 56, hour: 14, minute: 0, label: "14:00" },
  { slot: 57, hour: 14, minute: 15, label: "14:15" },
  { slot: 58, hour: 14, minute: 30, label: "14:30" },
  { slot: 59, hour: 14, minute: 45, label: "14:45" },
  { slot: 60, hour: 15, minute: 0, label: "15:00" },
  { slot: 61, hour: 15, minute: 15, label: "15:15" },
  { slot: 62, hour: 15, minute: 30, label: "15:30" },
  { slot: 63, hour: 15, minute: 45, label: "15:45" },
  { slot: 64, hour: 16, minute: 0, label: "16:00" },
  { slot: 65, hour: 16, minute: 15, label: "16:15" },
  { slot: 66, hour: 16, minute: 30, label: "16:30" },
  { slot: 67, hour: 16, minute: 45, label: "16:45" },
  { slot: 68, hour: 17, minute: 0, label: "17:00" },
  { slot: 69, hour: 17, minute: 15, label: "17:15" },
  { slot: 70, hour: 17, minute: 30, label: "17:30" },
  { slot: 71, hour: 17, minute: 45, label: "17:45" },
  { slot: 72, hour: 18, minute: 0, label: "18:00" },
  { slot: 73, hour: 18, minute: 15, label: "18:15" },
  { slot: 74, hour: 18, minute: 30, label: "18:30" },
  { slot: 75, hour: 18, minute: 45, label: "18:45" },
  { slot: 76, hour: 19, minute: 0, label: "19:00" },
  { slot: 77, hour: 19, minute: 15, label: "19:15" },
  { slot: 78, hour: 19, minute: 30, label: "19:30" },
  { slot: 79, hour: 19, minute: 45, label: "19:45" },
  { slot: 80, hour: 20, minute: 0, label: "20:00" },
  { slot: 81, hour: 20, minute: 15, label: "20:15" },
  { slot: 82, hour: 20, minute: 30, label: "20:30" },
  { slot: 83, hour: 20, minute: 45, label: "20:45" },
  { slot: 84, hour: 21, minute: 0, label: "21:00" },
  { slot: 85, hour: 21, minute: 15, label: "21:15" },
  { slot: 86, hour: 21, minute: 30, label: "21:30" },
  { slot: 87, hour: 21, minute: 45, label: "21:45" },
  { slot: 88, hour: 22, minute: 0, label: "22:00" },
  { slot: 89, hour: 22, minute: 15, label: "22:15" },
  { slot: 90, hour: 22, minute: 30, label: "22:30" },
  { slot: 91, hour: 22, minute: 45, label: "22:45" },
  { slot: 92, hour: 23, minute: 0, label: "23:00" },
  { slot: 93, hour: 23, minute: 15, label: "23:15" },
  { slot: 94, hour: 23, minute: 30, label: "23:30" },
  { slot: 95, hour: 23, minute: 45, label: "23:45" },
  { slot: 96, hour: 24, minute: 0, label: "24:00" },
];

export const MORNING_RANGE_TIME_SLOTS = {
  from: { label: "09:00", hour: 9, minute: 0, slot: 36 },
  to: { label: "14:00", hour: 14, minute: 0, slot: 56 },
};

export const AFTERNOON_RANGE_TIME_SLOTS = {
  from: { label: "14:00", hour: 14, minute: 0, slot: 56 },
  to: { label: "18:00", hour: 18, minute: 0, slot: 72 },
};

export const EVENING_RANGE_TIME_SLOTS = {
  from: { label: "18:00", hour: 18, minute: 0, slot: 72 },
  to: { label: "23:30", hour: 23, minute: 30, slot: 95 },
};
