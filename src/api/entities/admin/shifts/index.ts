import { ApiClientCore } from "@/api/core";
import { format } from "date-fns";

export type TGetCompanyShifts = {
  companyId: number;
  queryParams?: {
    limit?: string;
    offset?: string;
  };
};

export type TGetCompanyShiftById = {
  companyId: number;
  shiftId: number;
};

export type TCreateCompanyShift = {
  companyId: number;
  body: {
    name: string;
    description: string;
    description_thai: string;
    working_schedule: WorkingSchedule;
    color: string
    is_default?: boolean;
    date?: Date
    specialist?: number
  };
};

export type TUpdateCompanyShift = {
  companyId: number;
  shiftId: number;
  body: Partial<TCreateCompanyShift["body"]>;
};

export type TDeleteCompanyShift = {
  companyId: number;
  shiftId: number;
};

export type TGetCompanyShiftsForDateRangeArgs = {
  companyId: number;
  start: Date;
  end: Date;
};

export type TCreateCustomShiftForDateArgs = {
  companyId: TCompany["id"];
  specialistId: TSpecialist["specialist_details"]["id"];
  data: {
    name: TDefaultShiftsNameId;
    description: string;
    description_thai: string;
    date: Date | null;
    slots: number[];
    daily_break: number[];
  };
};

export type TUpdateCustomShiftForDateArgs = {
  companyId: TCompany["id"];
  shiftId: TShift["id"];
  data: {
    name?: TDefaultShiftsNameId;
    description?: string;
    description_thai?: string;
    date?: Date;
    slots?: number[];
    daily_break?: number[];
  };
};

export type TGetCompanyShiftsForDateRangeRes = Omit<TSpecialist, "specialist_details"> & {
  specialist: TSpecialist["specialist_details"]
  shifts: TShift[];
};

export class ApiClientAdminCompanyShifts extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  getUrl = (companyId: number) => `/superuser/companies/${companyId}/shifts/`;

  async getCompanyShifts({ companyId }: TGetCompanyShifts) {
    return this.instance.get<TGetResponse<TShift[]>>(`/superuser/companies/${companyId}/shifts/`);
  }

  async getCompanyShiftById({ companyId, shiftId }: TGetCompanyShiftById) {
    return this.instance.get<TShift>(`/superuser/companies/${companyId}/shifts/${shiftId}/`);
  }

  async createCompanyShift({ companyId, body }: TCreateCompanyShift) {
    const data = {
      ...body,
      date: body?.date ? format(body.date, "yyyy-MM-dd") : null
    }

    return this.instance.post<{shift: TShift}>(`/superuser/companies/${companyId}/shifts/`, data);
  }

  async updateCompanyShift({ companyId, shiftId, body }: TUpdateCompanyShift) {
    const data = {
      ...body,
      date: body?.date ? format(body.date, "yyyy-MM-dd") : null
    }

    return this.instance.patch<{shift: TShift}>(`/superuser/companies/${companyId}/shifts/${shiftId}/`, data);
  }
  
  async deleteCompanyShift({ companyId, shiftId }: TDeleteCompanyShift) {
    return this.instance.delete(`/superuser/companies/${companyId}/shifts/${shiftId}/`);
  }

  async getCompanyShiftsForDateRange({
      companyId,
      start,
      end,
    }: TGetCompanyShiftsForDateRangeArgs) {
      const s = format(start, "yyyy-MM-dd");
      const e = format(end, "yyyy-MM-dd");
      return this.instanceWithoutAuth.get<TGetResponse<TGetCompanyShiftsForDateRangeRes[]>>(
        `/companies/${companyId}/specialists/shifts`
      );
    }
  
    async createCustomShiftForDate({ specialistId, data }: TCreateCustomShiftForDateArgs) {
      const formattedData = {
        ...data,
        date: data.date ? format(data.date, "yyyy-MM-dd") : null,
      };
  
      return this.instance.post<TShift>(
        `/superuser/companies/specialists/shifts/${specialistId}/`,
        formattedData
      );
    }
  
    async updateCustomShiftForDate({ shiftId, data }: TUpdateCustomShiftForDateArgs) {
      const formattedData = {
        ...data,
        ...(data.date && { date: format(data.date, "yyyy-MM-dd") }),
      };
  
      return this.instance.patch<TShift>(
        `/superuser/companies/specialists/shift/${shiftId}/`,
        formattedData
      );
    }
}
