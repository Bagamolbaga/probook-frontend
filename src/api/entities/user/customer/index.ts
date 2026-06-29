import { ApiClientCore } from "@/api/core";
import { format } from "date-fns";

type SendOTPCodeArgs = {
  bookingId: number;
  otp: number;
};

type ResendOTPCode = {
  bookingId: number;
}

export type TGetCustomersArgs = {
  companyId: number;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: OrderingFields<TCustomer>;
    search?: string
  };
};

export type TCreateCustomerArgs = {
  companyId: number;
  data:
    | {
        first_name: string;
        last_name: string;
        phone: string;
      }
    | {
        first_name: string;
        last_name: string;
        email: string;
      };
};

export type TGetCustomerDetailsArgs = {
  companyId: number;
  customerId: number;
};

export type TGetCustomerBookingHistoryArgs = {
  customerId: number;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: OrderingFields<TGetCustomerBookingHistoryRes[number]>;
  };
};

export type TGetCustomerBookingHistoryRes = (Omit<TBooking, "company"> & {
  company: TCompany;
})[];

export class ApiClientCustomerUser extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
  }

  async sendCreateBookingOTPCode({ bookingId, otp }: SendOTPCodeArgs) {
    const data = {
      otp,
      redirect_url: process.env.NEXT_PUBLIC_FRONTEND_URL || "",
    };

    const res = await this.instance.post(`/bookings/otp/${bookingId}/`, data);

    return res;
  }
  
  async resendBookingOTPCode({ bookingId}: ResendOTPCode) {
    const res = await this.instanceWithoutAuth.post(`/bookings/resend-otp/${bookingId}/`);

    return res;
  }

  async getCustomers({ companyId, queryParams }: TGetCustomersArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instanceWithoutAuth.get<TGetResponse<TCustomer[]>>(
      `/companies/${companyId}/customers?${params.toString()}`
    );
  }

  async createCustomer({ companyId, data }: TCreateCustomerArgs) {
    return this.instance.post<TCustomer>(`/users/${companyId}/customer-create/`, data);
  }

  async getCustomerDetails({ companyId, customerId }: TGetCustomerDetailsArgs) {
    return this.instance.get<TCustomer>(`/users/${companyId}/customers/${customerId}/`);
  }
  
  async getCustomerBookingsHistory({ customerId }: TGetCustomerBookingHistoryArgs) {
    return this.instance.get<TGetResponse<TGetCustomerBookingHistoryRes>>(
      `/companies/customers/${customerId}/bookings/`
    );
  }
}
