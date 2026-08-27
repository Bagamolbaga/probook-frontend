import { ApiClientCore } from "@/api/core";
import { format } from "date-fns";

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type BackendShift = {
  id: string;
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
};

export type TGetCompanyShifts = {
  companyId: string;
  queryParams?: {
    limit?: string;
    offset?: string;
    ordering?: OrderingFields<TShift>;
  };
};

export type TGetCompanyShiftById = {
  companyId: string;
  shiftId: TShift["id"];
};

export type TCreateCompanyShift = {
  companyId: string;
  body: {
    name: string;
    description?: string;
    description_thai?: string;
    color?: string;
    workingSlots?: number[];
    breakSlots?: number[];
    specialistId?: string;
    specialist?: string | number;
    working_schedule?: WorkingSchedule;
    is_default?: boolean;
    date?: Date | string | null;
  };
};

export type TUpdateCompanyShift = {
  companyId: string;
  shiftId: TShift["id"];
  body: Partial<TCreateCompanyShift["body"]>;
};

export type TDeleteCompanyShift = {
  companyId: string;
  shiftId: TShift["id"];
};

const createWorkingSchedule = (shift: BackendShift): WorkingSchedule => {
  const selectedDay = shift.date
    ? (format(new Date(`${shift.date}T00:00:00`), "EEEE") as keyof WorkingSchedule)
    : null;

  return Object.fromEntries(
    WEEK_DAYS.map((day) => {
      const useShift = !selectedDay || selectedDay === day;
      return [
        day,
        {
          slots: useShift ? shift.workingSlots : [],
          breaks: useShift ? shift.breakSlots : [],
        },
      ];
    })
  ) as WorkingSchedule;
};

export const toFrontendShift = (shift: BackendShift): TShift => ({
  ...shift,
  specialist: shift.specialistId,
  is_default: shift.kind === "default",
  working_schedule: createWorkingSchedule(shift),
  daily_break: shift.breakSlots,
  created_at: shift.createdAt,
  updated_at: shift.updatedAt,
});

const formatShiftDate = (date: Date | string | null | undefined) => {
  if (!date) return null;
  return date instanceof Date ? format(date, "yyyy-MM-dd") : date.slice(0, 10);
};

const getWorkingScheduleDay = (
  workingSchedule: WorkingSchedule | undefined,
  date: Date | string | null | undefined
) => {
  if (!workingSchedule) return null;

  const formattedDate = formatShiftDate(date);
  const dateWeekDay = formattedDate
    ? (format(new Date(`${formattedDate}T00:00:00`), "EEEE") as keyof WorkingSchedule)
    : null;

  if (dateWeekDay && workingSchedule[dateWeekDay]) {
    return workingSchedule[dateWeekDay];
  }

  return Object.values(workingSchedule).find((day) => day.slots.length > 0) || null;
};

const toBackendShiftPayload = (body: TCreateCompanyShift["body"]) => {
  const scheduleDay = getWorkingScheduleDay(body.working_schedule, body.date);
  const specialistId =
    body.specialistId ||
    (body.specialist !== undefined && body.specialist !== null
      ? String(body.specialist)
      : undefined);

  return {
    name: body.name,
    description: body.description,
    color: body.color,
    workingSlots: body.workingSlots || scheduleDay?.slots || [],
    breakSlots: body.breakSlots || scheduleDay?.breaks || [],
    ...(specialistId ? { specialistId } : {}),
    ...(body.date ? { date: formatShiftDate(body.date) } : {}),
  };
};

export class ApiClientCompanyShifts extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  getUrl = (companyId: string) => `/companies/${companyId}/shifts`;

  async getCompanyShifts({ companyId }: TGetCompanyShifts) {
    const response = await this.instanceWithoutAuth.get<BackendShift[]>(
      this.getUrl(companyId)
    );

    return {
      ...response,
      data: {
        count: response.data.length,
        next: null,
        previous: null,
        results: response.data.map(toFrontendShift),
      } satisfies TGetResponse<TShift[]>,
    };
  }

  async getCompanyShiftById({ companyId, shiftId }: TGetCompanyShiftById) {
    const response = await this.instanceWithoutAuth.get<BackendShift[]>(
      this.getUrl(companyId)
    );
    const shift = response.data.find((item) => item.id === String(shiftId));

    if (!shift) {
      throw new Error("Shift not found");
    }

    return { ...response, data: toFrontendShift(shift) };
  }

  async createCompanyShift({ companyId, body }: TCreateCompanyShift) {
    const response = await this.instance.post<BackendShift>(
      this.getUrl(companyId),
      toBackendShiftPayload(body)
    );

    return { ...response, data: { shift: toFrontendShift(response.data) } };
  }

  async updateCompanyShift({ companyId, shiftId, body }: TUpdateCompanyShift) {
    const scheduleDay = getWorkingScheduleDay(body.working_schedule, body.date);
    const payload = {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(body.color !== undefined ? { color: body.color } : {}),
      ...(body.workingSlots !== undefined
        ? { workingSlots: body.workingSlots }
        : scheduleDay
          ? { workingSlots: scheduleDay.slots }
          : {}),
      ...(body.breakSlots !== undefined
        ? { breakSlots: body.breakSlots }
        : scheduleDay
          ? { breakSlots: scheduleDay.breaks }
          : {}),
    };
    const response = await this.instance.put<BackendShift>(
      `${this.getUrl(companyId)}/${shiftId}`,
      payload
    );

    return { ...response, data: { shift: toFrontendShift(response.data) } };
  }

  async deleteCompanyShift({ companyId, shiftId }: TDeleteCompanyShift) {
    return this.instance.delete(`${this.getUrl(companyId)}/${shiftId}`);
  }
}
