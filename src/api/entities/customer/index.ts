import { ApiClientCore } from "@/api/core";

export type CustomerBookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export type CustomerProfile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatar: string | null;
  preferredLocale: "en" | "ru";
};

type EntitySnapshot = { _id: string; id: string };

export type CustomerBooking = {
  _id: string;
  id: string;
  company: EntitySnapshot & {
    name: string;
    description?: string;
    businessType?: string;
    phone?: string;
    address?: string;
    zipCode?: string;
    city?: string;
    pos: TCompany["pos"]
    logo?: string;
    timezone: string;
    currency: string;
    contactEmail: string;
  };
  specialist: EntitySnapshot & {
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    avatar?: string | null;
    specialties: string[];
  };
  services: Array<
    EntitySnapshot & {
      name: string;
      description?: string;
      image?: string;
      selectedOption: EntitySnapshot & {
        name?: string;
        description?: string;
        price: number;
        duration: number;
      };
    }
  >;
  totalPrice: number;
  customer: EntitySnapshot & {
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    phone?: string;
  };
  date: string;
  slots: number[];
  status: CustomerBookingStatus;
  customerLocale: "en" | "ru";
  cancelledAt?: string | null;
  cancelledBy?: "CUSTOMER" | "BUSINESS" | null;
  createdAt: string;
  updatedAt: string;
  allowedActions: {
    cancel: boolean;
    reschedule: boolean;
    repeat: boolean;
  };
};

export type CustomerDashboard = {
  stats: {
    upcomingCount: number;
    completedCount: number;
    completedSpendByCurrency: Array<{ currency: string; total: number }>;
  };
  nextBooking: CustomerBooking | null;
  upcomingBookings: CustomerBooking[];
  recentHistory: CustomerBooking[];
};

export type CustomerBookingList = {
  items: CustomerBooking[];
  nextCursor: string | null;
};

export type CustomerBookingsView = "upcoming" | "past" | "cancelled";

export class ApiClientCustomer extends ApiClientCore {
  getProfile() {
    return this.instance.get<CustomerProfile>("/customer/me");
  }

  updateProfile(data: { firstName: string; lastName: string; phone?: string }) {
    return this.instance.patch<CustomerProfile>("/customer/me", data);
  }

  updateAvatar(avatar: string) {
    return this.instance.post<CustomerProfile>("/customer/me/avatar", { avatar });
  }

  getDashboard() {
    return this.instance.get<CustomerDashboard>("/customer/me/dashboard");
  }

  getBookings(input: {
    view: CustomerBookingsView;
    companyId?: string;
    cursor?: string;
    limit?: number;
  }) {
    return this.instance.get<CustomerBookingList>("/customer/me/bookings", {
      params: input,
    });
  }

  getBooking(bookingId: string) {
    return this.instance.get<CustomerBooking>(`/customer/me/bookings/${bookingId}`);
  }

  cancelBooking(bookingId: string) {
    return this.instance.patch<CustomerBooking>(
      `/customer/me/bookings/${bookingId}/cancel`
    );
  }

  rescheduleBooking(bookingId: string, data: { date: string; slots: number[] }) {
    return this.instance.patch<CustomerBooking>(
      `/customer/me/bookings/${bookingId}/reschedule`,
      data
    );
  }
}
