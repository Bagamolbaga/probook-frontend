import { operationHours } from "./operationHours";
import { staffList } from "./staffList";

export const staffManagement = {
  title: "Staff Management",
  tabs: {
    staff_list: "Staff list",
    shift_management: "Shift management",
  },
  staffList,
  operationHours,
  shiftManagement: {
    addShift: "Add shift"
  }
};
