import { operationHours } from "./operationHours";
import { staffList } from "./staffList";

export const staffManagement = {
  title: "Staff Management",
  tabs: {
    staff_list: "Staff list",
    shift_management: "Shift management",
    operation_hours: "Operation hours",
  },
  staffList,
  operationHours,
  shiftManagement: {
    addShift: "Add shift",
    selectCustomTime: "Select custom time",
    workingTime: "Working Time",
    breakTime: "Break Time",
  }
};
