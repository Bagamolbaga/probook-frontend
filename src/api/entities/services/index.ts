import { ApiClientCore } from "@/api/core";
import { removeEmptyFields } from "@/utils/removeEmptyFields";

export type TGetServicesTypesArgs = {
  companyId: string;
};

export type TCreateServicesTypeArgs = {
  companyId: string;
  data: {
    name: TServiceType_new["name"];
  };
};

export type TUpdateServicesTypeArgs = { serviceTypeId: number } & TCreateServicesTypeArgs;
export type TDeleteServicesTypeArgs = { serviceTypeId: number } & Omit<
  TCreateServicesTypeArgs,
  "data"
>;

export type TSearchServicesAndStoresArgs = {
  search?: string;
  type?: string[];
  date?: string;  //2025-07-01
  start_time?: string;  //15:00
  end_time?: string;  //16:00
};

export type TSearchServicesAndStoresRes = {
  services: TService[];
  companies: TCompany[]
}

export type TGetServicesTypesRes = TServiceType_new[];

export class ApiClientServices extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getServicesTypes({ companyId }: TGetServicesTypesArgs) {
    return this.instanceWithoutAuth.get<TGetResponse<TGetServicesTypesRes>>(
      `/companies/services/${companyId}/types/`
    );
  }

  async createServicesType({ companyId, data }: TCreateServicesTypeArgs) {
    return this.instance.post<TServiceType_new>(
      `/companies/services/${companyId}/types/`,
      data
    );
  }

  async updateServicesType({ companyId, serviceTypeId, data }: TUpdateServicesTypeArgs) {
    return this.instance.put<TServiceType_new>(
      `/companies/services/${companyId}/types/${serviceTypeId}/`,
      data
    );
  }

  async deleteServicesType({ companyId, serviceTypeId }: TDeleteServicesTypeArgs) {
    return this.instance.delete<unknown>(
      `/companies/services/${companyId}/types/${serviceTypeId}/`
    );
  }

  async getNewestServices() {
    return this.instanceWithoutAuth.get<TGetResponse<TService[]>>(
      `/companies/services/?latest=true`
    );
  }
  
  async searchServicesAndStores(query: TSearchServicesAndStoresArgs) {
    const params = new URLSearchParams();

    const safeQuery = removeEmptyFields<Record<string, string>>(query)

    Object.entries(safeQuery).forEach(([key, value]) => params.set(key, value))


    return this.instanceWithoutAuth.get<TSearchServicesAndStoresRes>(
      `/companies/services/search?${params.toString()}`
    );
  }
}
