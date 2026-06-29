import { ApiClientCore } from "@/api/core";
import {
  TGetCompaniesArgs,
  TGetCompanySalesAndCustomerStat,
  TGetCompanySalesAndCustomerStatRes,
  TGetCompanySpecialistsArgs,
} from "../../company";
import { format } from "date-fns";

export type TGetAdminCompaniesArgs = TGetCompaniesArgs;
export type TGetAdminCompanySpecialistsArgs = TGetCompanySpecialistsArgs;
export type TGetAdminCompanyDetailsArgs = {
  companyId: number;
};

export type TDeleteCompanyArgs = {
  companyId: number;
};

export type TGetAdminCompaniesRes = (TCompany & {
  email: string;
  staff_count: number;
  life_time_revenue: number;
  customer_count: number;
  subscription_plan: string;
})[];

export type TGetAdminCompanyDetailsRes = TCompany & {
  email: string | null;
  revenue: number;
};

export type TGetAdminBackboneStatisticRes = {
  statistics: {
    stores: {
      total: number;
      paid: number;
      free: number;
    };
    customers: {
      total: number;
      sms: number;
      facebook: number;
      google: number;
      walk_in: number;
    };
  };
};

export type TUpdateCompanyArgs = {
  companyId: number;
  data: Partial<TCompany>;
};

export class ApiClientAdminCompany extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getCompanies(queryParams: TGetAdminCompaniesArgs["queryParams"]) {
    const formattedQueryParams = {
      ...Object.fromEntries(Object.entries(queryParams || {}).filter(([_, value]) => value)),
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TGetAdminCompaniesRes>>(
      `/superuser/companies?${params.toString()}`
    );
  }

  async getCompanySpecialists({
    companyId,
    queryParams,
  }: TGetAdminCompanySpecialistsArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TSpecialist[]>>(
      `/superuser/companies/${companyId}/specialists/?${params.toString()}`
    );
  }

  async getCompanyDetails({ companyId }: TGetAdminCompanyDetailsArgs) {
    return this.instance.get<TGetAdminCompanyDetailsRes>(
      `/superuser/companies/${companyId}/`
    );
  }

  async getBackboneStatistic() {
    return this.instance.get<TGetAdminBackboneStatisticRes>(
      `/superuser/companies/backbone/statistics`
    );
  }

  async getCompanySalesAndCustomerStat({
    companyId,
    startDate,
    endDate,
  }: TGetCompanySalesAndCustomerStat) {
    const formattedQueryParams = {
      start_date: format(startDate, "yyyy-MM-dd"),
      end_date: format(endDate, "yyyy-MM-dd"),
    };

    const params = new URLSearchParams(formattedQueryParams);
    return await this.instance.get<TGetCompanySalesAndCustomerStatRes>(
      `/superuser/companies/${companyId}/sales-report?${params.toString()}`
    );
  }

  async updateCompany({ companyId, data }: TUpdateCompanyArgs) {
    return this.instance.patch<TCompany>(`/superuser/companies/${companyId}/`, data);
  }

  async deleteCompany({ companyId }: TDeleteCompanyArgs) {
    return this.instance.delete<unknown>(`/superuser/companies/${companyId}/`);
  }
}
