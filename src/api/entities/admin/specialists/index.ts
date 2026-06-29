import { ApiClientCore } from "@/api/core";

export type TGetCompanySpecialistsArgs = {
  companyId: number;
  queryParams?: {
    limit?: string;
    offset?: string;
  };
};

export type TCreateCompanySpecialistsArgs = {
  companyId: number;
  data:
    | {
        full_name: string;
        email?: string;
        phone?: string;
        default_shift: number;
        services: number[];
      }
    | {
        full_name: string;
        email?: string;
        phone?: string;
        services: number[];
        slots: number[];
        daily_break: number[];
      };
};

export type TCreateCompanySpecialistsRes = {
  message: string;
  specialist: TSpecialist["specialist_details"];
  profile: TSpecialist;
};

export type TUpdateCompanySpecialistsArgs = {
  companyId: number;
  specialistId: number;
  data:
    | {
        full_name: string;
        email?: string;
        phone?: string;
        default_shift: number;
      }
    | {
        full_name: string;
        email?: string;
        phone?: string;
        slots: number[];
        daily_break: number[];
      };
};

export type TDeleteCompanySpecialistsArgs = {
  companyId: number;
  specialistId: number;
};

export class ApiClientAdminSpecialists extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getCompanySpecialists({ companyId, queryParams }: TGetCompanySpecialistsArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TSpecialist[]>>(
      `/superuser/companies/${companyId}/specialists/?${params.toString()}`
    );
  }

  async createCompanySpecialist({ companyId, data }: TCreateCompanySpecialistsArgs) {
    return this.instance.post<TCreateCompanySpecialistsRes>(
      `/superuser/users/company/${companyId}/create-specialist/`,
      data
    );
  }

  async updateCompanySpecialist({
    companyId,
    specialistId,
    data,
  }: TUpdateCompanySpecialistsArgs) {
    return this.instance.patch<TSpecialist>(
      `/superuser/users/company/${companyId}/specialist/${specialistId}/`,
      data
    );
  }

  async deleteCompanySpecialist({
    companyId,
    specialistId,
  }: TDeleteCompanySpecialistsArgs) {
    return this.instance.delete<TSpecialist>(
      `/superuser/users/company/${companyId}/specialist/${specialistId}/`
    );
  }
}
