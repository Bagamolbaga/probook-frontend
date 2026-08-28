import { ApiClientCore } from "@/api/core";

type SendOTPCodeArgs = {
  bookingId: number;
  otp: number;
};

type ResendOTPCode = {
  bookingId: number;
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
  status: Exclude<BookingStatus, "WALK_IN">;
  createdAt: string;
  updatedAt?: string;
};

export type TGetCustomerBookingHistoryRes = TCustomerBookingHistoryItem[];

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

  async resendBookingOTPCode({ bookingId }: ResendOTPCode) {
    const res = await this.instanceWithoutAuth.post(`/bookings/resend-otp/${bookingId}/`);

    return res;
  }

  async getCustomers({ companyId, queryParams }: TGetCustomersArgs) {
    const formattedQueryParams = {
      ...queryParams,
    };

    const params = new URLSearchParams(formattedQueryParams);

    return this.instanceWithoutAuth.get<TGetResponse<TBookingCustomerListItem[]>>(
      `/companies/${companyId}/customers?${params.toString()}`
    );
  }

  async createCustomer({ companyId, data }: TCreateCustomerArgs) {
    return this.instance.post<TCustomer>(`/users/${companyId}/customer-create/`, data);
  }

  async getCustomerDetails({ companyId, customerId }: TGetCustomerDetailsArgs) {
    return this.instanceWithoutAuth.get<TBookingCustomerDetails>(
      `/companies/${companyId}/customers/${customerId}`
    );
  }

  async getCustomerBookingsHistory({
    companyId,
    customerId,
    queryParams,
  }: TGetCustomerBookingHistoryArgs) {
    const params = new URLSearchParams(queryParams);

    return this.instanceWithoutAuth.get<TGetResponse<TGetCustomerBookingHistoryRes>>(
      `/companies/${companyId}/customers/${customerId}/bookings?${params.toString()}`
    );
  }
}
