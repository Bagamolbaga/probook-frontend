type TDefaultShiftsNameId = "FULL_DAY" | "AFTERNOON" | "MORNING" | "CUSTOM" | "OFF";

type ShiftKind = "default" | "override";

type TShift = {
  id: string | number;
  companyId: string;
  specialistId: string | null;
  kind: ShiftKind;
  name: string;
  description?: string;
  color: string;
  date: string | null;
  workingSlots: number[];
  breakSlots: number[];
  createdAt?: string;
  updatedAt?: string;

  // Transitional aliases used by the existing calendar UI.
  specialist: string | null;
  is_default: boolean;
  working_schedule: WorkingSchedule;
  daily_break: number[];
  created_at?: string;
  updated_at?: string;
};

type WorkingScheduleDay = {
  slots: number[];
  breaks: number[];
};

type WorkingSchedule = {
  Friday: WorkingScheduleDay;
  Monday: WorkingScheduleDay;
  Sunday: WorkingScheduleDay;
  Tuesday: WorkingScheduleDay;
  Saturday: WorkingScheduleDay;
  Thursday: WorkingScheduleDay;
  Wednesday: WorkingScheduleDay;
};

type WorkingScheduleTimeRange = {
  from?: TTimeSlot;
  to?: TTimeSlot;
};

type WorkingScheduleWithTimeSlots = {
  Friday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
  Monday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
  Sunday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
  Tuesday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
  Saturday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
  Thursday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
  Wednesday: { slots: WorkingScheduleTimeRange; breaks: WorkingScheduleTimeRange };
};
