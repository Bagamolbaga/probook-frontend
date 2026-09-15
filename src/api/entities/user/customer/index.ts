import { ApiClientCore } from "@/api/core";

type SendOTPCodeArgs = {
  bookingId: number;
  otp: number;
};

type ResendOTPCode = {
  bookingId: number;
};

type RequestEmailOtpArgs = {
  email: string;
  locale: "en" | "ru";
};

export type TGetCustomersArgs = {
  companyId: string;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: OrderingFields<TBookingCustomerListItem>;
    search?: string;
  };
};

export type TBookingCustomerListItem = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatar?: string | null;
  bookingsCount: number;
  lastBooking: string;
  moneySpent: number;
};

export type TCustomerLookupItem = Pick<
  TBookingCustomerListItem,
  "id" | "email" | "firstName" | "lastName" | "phone" | "avatar"
> & {
  preferredLocale?: "en" | "ru" | null;
};

export type TLookupCustomersArgs = {
  companyId: string;
  search: string;
  limit?: number;
};

export type TLookupCustomerByEmailArgs = {
  companyId: string;
  email: string;
};

export type TBookingCustomerDetails = TBookingCustomerListItem & {
  firstBooking: string;
};

export type TCreateCustomerArgs = {
  companyId: string;
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
  companyId: string;
  customerId: string;
};

export type TGetCustomerBookingHistoryArgs = {
  companyId: string;
  customerId: string;
  queryParams?: {
    offset?: string;
    limit?: string;
    ordering?: TCustomerBookingOrdering;
  };
};

export type TCustomerBookingOrdering =
  "id" | "-id" | "date" | "-date" | "createdAt" | "-createdAt";

export type TCustomerBookingHistoryItem = {
  id: string;
  company: {
    id: string;
    name: string;
    logo?: string | null;
  };
  specialist: TApiBookingSpecialist;
  services: TApiBookingService[];
  totalPrice: number;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  date: string;
  slots: number[];
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
};

export type TGetCustomerBookingHistoryRes = TCustomerBookingHistoryItem[];

export class ApiClientCustomerUser extends ApiClientCore {
  constructor(token: string, currentUserId: number, locale: "en" | "ru") {
    super(token, currentUserId, locale);
  }

  async requestEmailOtp(data: RequestEmailOtpArgs) {
    return this.instanceWithoutAuth.post<{
      accepted: true;
      resendAfterSeconds: number;
    }>("/auth/email-otp/request", data);
  }

  async sendCreateBookingOTPCode({ bookingId, otp }: SendOTPCodeArgs) {
    const data = {
      otp,
      redirect_url: process.env.NEXT_PUBLIC_FRONTEND_URL || "",
    };

    const res = await this.instance.post(`/bookings/otp/${bookingId}/`, data);

    return res;
  }

  async resendBookingOTPCode({ bookingId }: ResendOTPCode) {
    const res = await this.instanceWithoutAuth.post(`/bookings/resend-otp/${bookingId}/`);

    return res;
  }

  async getCustomers({ companyId, queryParams }: TGetCustomersArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instance.get<TGetResponse<TBookingCustomerListItem[]>>(
      `/companies/${companyId}/customers?${params.toString()}`
    );
  }

  async lookupCustomers({ companyId, search, limit = 5 }: TLookupCustomersArgs) {
    const params = new URLSearchParams({ search, limit: String(limit) });
    return this.instance.get<TGetResponse<TCustomerLookupItem[]>>(
      `/companies/${companyId}/customers/lookup?${params.toString()}`
    );
  }

  async lookupCustomerByEmail({ companyId, email }: TLookupCustomerByEmailArgs) {
    const params = new URLSearchParams({ email });
    return this.instance.get<TCustomerLookupItem | null>(
      `/companies/${companyId}/customers/lookup-by-email?${params.toString()}`
    );
  }

  async createCustomer({ companyId, data }: TCreateCustomerArgs) {
    return this.instance.post<TCustomer>(`/users/${companyId}/customer-create/`, data);
  }

  async getCustomerDetails({ companyId, customerId }: TGetCustomerDetailsArgs) {
    return this.instance.get<TBookingCustomerDetails>(
      `/companies/${companyId}/customers/${customerId}`
    );
  }

  async getCustomerBookingsHistory({
    companyId,
    customerId,
    queryParams,
  }: TGetCustomerBookingHistoryArgs) {
    const params = new URLSearchParams(queryParams);

    return this.instance.get<TGetResponse<TGetCustomerBookingHistoryRes>>(
      `/companies/${companyId}/customers/${customerId}/bookings?${params.toString()}`
    );
  }
}
