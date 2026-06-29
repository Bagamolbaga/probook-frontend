import { ApiClientCore } from "@/api/core";
import { format } from "date-fns";

export type TGetCompanyShifts = {
  companyId: string;
  asAdmin?: boolean;
  queryParams?: {
    limit?: string;
    offset?: string;
    ordering?: OrderingFields<TShift>;
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
    color: string;
    is_default?: boolean;
    date?: Date;
    specialist?: number;
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

export class ApiClientCompanyShifts extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  getUrl = (companyId: number) => `/companies/${companyId}/shifts/`;

  async getCompanyShifts({ companyId, queryParams }: TGetCompanyShifts) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TShift[]>>(
      `/companies/${companyId}/shifts/${params.toString()}`
    );
  }

  async getCompanyShiftById({ companyId, shiftId }: TGetCompanyShiftById) {
    return this.instance.get<TShift>(`/companies/${companyId}/shifts/${shiftId}/`);
  }

  async createCompanyShift({ companyId, body }: TCreateCompanyShift) {
    const data = {
      ...body,
      date: body?.date ? format(body.date, "yyyy-MM-dd") : null,
    };

    return this.instance.post<{shift: TShift}>(`/companies/${companyId}/shifts/`, data);
  }

  async updateCompanyShift({ companyId, shiftId, body }: TUpdateCompanyShift) {
    const data = {
      ...body,
      date: body?.date ? format(body.date, "yyyy-MM-dd") : null,
    };

    return this.instance.patch<{shift: TShift}>(
      `/companies/${companyId}/shifts/${shiftId}/`,
      data
    );
  }

  async deleteCompanyShift({ companyId, shiftId }: TDeleteCompanyShift) {
    return this.instance.delete(`/companies/${companyId}/shifts/${shiftId}/`);
  }
}
