import { ApiClientCore } from "@/api/core";

export type TGetCustomersArgs = {
  companyId: number;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: OrderingFields<TCustomer>;
    search?: string
  };
};

export type TGetAdminAllCustomersArgs = Omit<TGetCustomersArgs, "companyId">;
export type TGetAdminCustomersArgs = TGetCustomersArgs;

export type TGetCustomerBookingHistoryArgs = {
  customerId: number;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: OrderingFields<TBooking>;
  };
};

export type TGetCustomerDetailsArgs = {
  companyId: number;
  customerId: number;
};

export type TGetCustomerDetailsByIdArgs = {
  customerId: number;
};

export type TCreateCustomerArgs = {
  companyId: number;
  data:
    | {
        first_name: string;
        last_name: string;
        phone?: string;
      }
    | {
        first_name: string;
        last_name: string;
        email?: string;
      };
};

export type TGetAdminAllCustomersRes = (TCustomer & { total_bookings: number })[];

export type TGetCustomerBookingHistoryRes = (Omit<TBooking, "company"> & {
  company: TCompany;
})[];

export type TGetCustomerDeatailsRes = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  bookings_count: number;
  money_spent: string;
};

export class ApiClientAdminCustomer extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async getAllCustomers({ queryParams }: TGetAdminAllCustomersArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TGetAdminAllCustomersRes>>(
      `/superuser/companies/all-customers?${params.toString()}`
    );
  }

  async getCustomers({ companyId, queryParams }: TGetCustomersArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TCustomer[]>>(
      `/superuser/users/${companyId}/customers?${params.toString()}`
    );
  }

  async getCompanyCustomers({ companyId, queryParams }: TGetAdminCustomersArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TCustomer[]>>(
      `/superuser/users/${companyId}/customers?${params.toString()}`
    );
  }

  async getCustomerBookingHistory({
    customerId,
    queryParams,
  }: TGetCustomerBookingHistoryArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TGetCustomerBookingHistoryRes>>(
      `/superuser/companies/customers/${customerId}/bookings?${params.toString()}`
    );
  }

  async getCustomerDetails({ customerId, companyId }: TGetCustomerDetailsArgs) {
    return this.instance.get<TGetCustomerDeatailsRes>(
      `/superuser/users/${companyId}/customers/${customerId}/`
    );
  }
  
  async getCustomerDetailsById({ customerId }: TGetCustomerDetailsByIdArgs) {
    return this.instance.get<TGetCustomerDeatailsRes>(
      `/superuser/users/customers/${customerId}/`
    );
  }

  async createCustomer({ companyId, data }: TCreateCustomerArgs) {
    return this.instance.post<TCustomer>(
      `/superuser/users/${companyId}/customers/`,
      data
    );
  }
}
