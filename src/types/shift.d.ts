type TDefaultShiftsNameId = "FULL_DAY" | "AFTERNOON" | "MORNING" | "CUSTOM" | "OFF";

type TShift = TDefaultShift | TOneDayShift;

type TShiftCore = {
  id: number;
  name: string;
  description: string;
  color: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
  working_schedule: WorkingSchedule;
};

type TDefaultShift = TShiftCore & {
  date: null;
  specialist: null;
};

type TOneDayShift = TShiftCore & {
  date: string;
  specialist: number;
};

type WorkingSchedule = {
  Friday: {
    slots: number[];
    breaks: number[];
  };
  Monday: {
    slots: number[];
    breaks: number[];
  };
  Sunday: {
    slots: number[];
    breaks: number[];
  };
  Tuesday: {
    slots: number[];
    breaks: number[];
  };
  Saturday: {
    slots: number[];
    breaks: number[];
  };
  Thursday: {
    slots: number[];
    breaks: number[];
  };
  Wednesday: {
    slots: number[];
    breaks: number[];
  };
};

type WorkingScheduleWithTimeSlots = {
  Friday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
  Monday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
  Sunday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
  Tuesday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
  Saturday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
  Thursday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
  Wednesday: {
    slots: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
    breaks: {
      from?: TTimeSlot;
      to?: TTimeSlot;
    };
  };
};
