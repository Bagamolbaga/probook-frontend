import { operationHours } from "./operationHours";
import { staffList } from "./staffList";

export const staffManagement = {
  title: "Персонал",
  tabs: {
    staff_list: "Сотрудники",
    shift_management: "Управление сменами",
    operation_hours: "Рабочие часы",
  },
  staffList,
  operationHours,
  shiftManagement: {
    addShift: "Добавить смену",
    selectCustomTime: "Выбрать другое время",
    workingTime: "Рабочее время",
    breakTime: "Перерыв",
  },
};
