import { ApiClientCore } from "@/api/core";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { format } from "date-fns";

export type TGetServicesTypesRes = Record<string, string>;

export type TGetCompanyServicesArgs = {
  companyId: number;
  queryParams?: {
    limit?: string;
    offset?: string;
  };
};

export type TSearchCompanyServicesArgs = {
  companyId?: number;
  query: {
    search?: string;
    service_type?: string;
    date?: Date;
    start_time?: (typeof TIME_SLOTS)[0];
    end_time?: (typeof TIME_SLOTS)[0];
    country?: string;
    _limit?: number;
    _offset?: number;
  };
};

export type TGetCompanyServiceTypesArgs = {
  companyId: number;
  queryParams?: {
    limit?: string;
    offset?: string;
  };
};

export type TCreateCompanyServiceArgs = {
  companyId: number;
  data: Omit<TService, "id" | "image" | "created_at" | "updated_at">;
};

export type TUpdateCompanyServiceArgs = {
  companyId: number;
  serviceId: number;
  data: Omit<TService, "id" | "image" | "created_at" | "updated_at">;
};

export type TDeleteCompanyServiceArgs = {
  companyId: number;
  serviceId: number;
};

export type TUploadServiceImageArgs = {
  companyId: number;
  serviceId: number;
  data: {
    file: File;
  };
};

export type TCreateServicesTypeArgs = {
  companyId: number;
  data: {
    name: TServiceType_new["name"];
  };
};

export type TUpdateServicesTypeArgs = { serviceTypeId: number } & TCreateServicesTypeArgs;
export type TDeleteServicesTypeArgs = { serviceTypeId: number } & Omit<
  TCreateServicesTypeArgs,
  "data"
>;

export class ApiClientAdminServices extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getCompanyServices({ companyId, queryParams }: TGetCompanyServicesArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TService[]>>(
      `/superuser/companies/${companyId}/services/?${params.toString()}`
    );
  }

  async searchCompanyServices({ companyId, query }: TSearchCompanyServicesArgs) {
    const params = new URLSearchParams();

    if (query.search) {
      params.set("search", query.search);
    }
    if (query.service_type) {
      params.set("service_type", query.service_type);
    }
    if (query.date) {
      params.set("date", format(query.date, "yyyy-MM-dd"));
    }
    if (query.start_time) {
      params.set("start_time", query.start_time.label);
    }
    if (query.end_time) {
      params.set("end_time", query.end_time.label);
    }
    if (query.country) {
      params.set("country", query.country);
    }

    if (query._limit) {
      params.set("limit", query._limit.toString());
    }

    if (query._offset) {
      params.set("offset", query._offset.toString());
    }

    if (!companyId) {
      return this.instance.get<TGetResponse<TService[]>>(
        `/superuser/companies/${companyId}/services?${params.toString()}`
      );
    }

    return this.instance.get<TGetResponse<TService[]>>(
      `/superuser/companies/${companyId}/services/${companyId}?${params.toString()}`
    );
  }

  async createCompanyService({ companyId, data }: TCreateCompanyServiceArgs) {
    return this.instance.post<TService>(`/superuser/companies/${companyId}/services/`, data);
  }

  async updateCompanyService({ companyId, serviceId, data }: TUpdateCompanyServiceArgs) {
    return this.instance.patch<TService>(`/superuser/companies/${companyId}/services/${serviceId}/`, data);
  }

  async deleteCompanyService({ companyId, serviceId }: TDeleteCompanyServiceArgs) {
    return this.instance.delete<TService>(`/superuser/companies/${companyId}/services/${serviceId}/`);
  }

  async getServicesTypes({companyId, queryParams}: TGetCompanyServiceTypesArgs) {
    const params = new URLSearchParams(queryParams);

    return this.instance.get<TGetResponse<TServiceType_new[]>>(`/superuser/companies/${companyId}/services/types/?${params.toString()}`);
  }

  async getNewestServices() {
    return this.instance.get<TGetResponse<TService[]>>(
      `/superuser/companies/services/?latest=true`
    );
  }

  async uploadServiceImage(inputDto: TUploadServiceImageArgs) {
    const formData = new FormData();
    formData.append("image", inputDto.data.file);

    const res = await this.instance.patch<TService>(
      `/superuser/companies/${inputDto.companyId}/services/${inputDto.serviceId}/`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res;
  }

  async createServicesType({ companyId, data }: TCreateServicesTypeArgs) {
    return this.instance.post<TServiceType_new>(
      `/superuser/companies/${companyId}/services/types/`,
      data
    );
  }

  async updateServicesType({ companyId, serviceTypeId, data }: TUpdateServicesTypeArgs) {
    return this.instance.patch<TServiceType_new>(
      `/superuser/companies/${companyId}/services/types/${serviceTypeId}/`,
      data
    );
  }

  async deleteServicesType({ companyId, serviceTypeId }: TDeleteServicesTypeArgs) {
    return this.instance.delete<unknown>(
      `/superuser/companies/${companyId}/services/types/${serviceTypeId}/`
    );
  }
}
