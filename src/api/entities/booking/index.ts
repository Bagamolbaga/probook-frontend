import { format } from "date-fns";
import { ApiClientCore } from "@/api/core";
import { removeEmptyFields } from "@/utils/removeEmptyFields";

export type TGetBookingsArgs<T = unknown> = {
  companyId: string | number;
  queryParams?: {
    start_date: Date;
    end_date: Date;
    offset?: string;
    limit?: string;
  } & T;
};

export type TGetBookingByTokenArgs = {
  token: string;
};

export type TGetBookingArgs = {
  companyId: string | number;
  bookingId: string;
};

export type TGetBookingAvailabilityArgs = TGetBookingArgs & {
  specialistId: string;
  date: string;
};

export type TBookingAvailability = {
  companyId: string;
  specialistId: string;
  date: string;
  shiftId: string | null;
  source: string;
  workingSlots: number[];
  breakSlots: number[];
  busySlots: number[];
  availableSlots: number[];
  slots: Array<{
    slot: number;
    available: boolean;
    reason?: "outside_shift" | "break" | "busy" | "not_enough_time";
  }>;
};

export type TUpdateApiBookingArgs = TGetBookingArgs & {
  data: {
    specialistId: string;
    services: Array<{
      serviceId: string;
      optionId: string;
    }>;
    date: string;
    slots: number[];
    status: TApiBooking["status"];
  };
};

export type TRescheduleOwnBookingArgs = TGetBookingArgs & {
  data: { date: string; slots: number[] };
};

export type TCreateBookingArgs = {
  companyId: string;
  data: {
    services: Array<{
      serviceId: string;
      optionId: string;
    }>;
    specialist: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    date: Date;
    slots: number[];
    status?: TApiBooking["status"];
  };
};

export type TUpdateBookingByTokenArgs = {
  token: string;
  data: {
    services: { id: number; option_id: number }[];
    specialist: number;
    date: Date;
    slots: number[];
  };
};

export type TUpdateBookingByAdminArgs = {
  data: {
    bookingId: number;
    services: { id: number; option_id: number }[];
    specialist: number;
    date: Date;
    slots: number[];
  };
};

export type TUpdateBookingsArgs = {
  companyId: number;
};

export type TDeleteBookingsArgs = {
  companyId: number;
  bookingId: number;
};

export type TCancelBookingArgs = {
  token: string;
};

export type TConfirmBookingArgs = TCancelBookingArgs;

export type TGetBookingComments = {
  bookingId: number;
};

export type TCreateBookingComment = {
  bookingId: number;
  data: {
    body: string;
    body_thai: string;
  };
};

export type TUpdateBookingComment = {
  commentId: number;
  data: {
    body: string;
    body_thai: string;
  };
};

export type TDeleteBookingComment = {
  commentId: number;
  bookingId: number;
};

export class ApiClientBookings extends ApiClientCore {
  private isAuth = false;

  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);

    if (token.length) {
      this.isAuth = true;
    }
  }

  async getBookings({
    companyId,
    queryParams = { start_date: new Date(), end_date: new Date() },
  }: TGetBookingsArgs) {
    const formattedQueryParams = {
      ...queryParams,
      start_date: format(queryParams.start_date, "yyyy-MM-dd"),
      end_date: format(queryParams.end_date, "yyyy-MM-dd"),
    };

    const params = new URLSearchParams(formattedQueryParams);

    const instance = this.isAuth ? this.instance : this.instanceWithoutAuth;
    return instance.get<TGetResponse<TApiBooking[]>>(
      `/companies/${companyId}/bookings?${params.toString()}`
    );
  }

  async getBookingsMin({
    companyId,
    queryParams = { start_date: new Date(), end_date: new Date() },
  }: TGetBookingsArgs<{ specialist_id?: string }>) {
    const formattedQueryParams = {
      ...removeEmptyFields(queryParams),
      start_date: format(queryParams.start_date, "yyyy-MM-dd"),
      end_date: format(queryParams.end_date, "yyyy-MM-dd"),
    };

    const params = new URLSearchParams(formattedQueryParams);

    let instance = this.instanceWithoutAuth;

    if (this.isAuth) {
      instance = this.instance;
    }

    return instance.get<TGetResponse<TApiBookingMin[]>>(
      `/companies/${companyId}/bookings/min?${params.toString()}`
    );
  }

  async getBooking({ companyId, bookingId }: TGetBookingArgs) {
    const instance = this.isAuth ? this.instance : this.instanceWithoutAuth;
    return instance.get<TApiBooking>(`/companies/${companyId}/bookings/${bookingId}`);
  }

  async getBookingAvailability({
    companyId,
    bookingId,
    specialistId,
    date,
  }: TGetBookingAvailabilityArgs) {
    const params = new URLSearchParams({
      date,
      excludeBookingId: bookingId,
    });

    return this.instanceWithoutAuth.get<TBookingAvailability>(
      `/companies/${companyId}/specialists/${specialistId}/availability?${params.toString()}`
    );
  }

  async updateBooking({ companyId, bookingId, data }: TUpdateApiBookingArgs) {
    return this.instance.patch<TApiBooking>(
      `/companies/${companyId}/bookings/${bookingId}`,
      data
    );
  }

  async rescheduleOwnBooking({ companyId, bookingId, data }: TRescheduleOwnBookingArgs) {
    return this.instance.patch<TApiBooking>(
      `/companies/${companyId}/my/bookings/${bookingId}/reschedule`,
      data
    );
  }

  async getBookingByToken({ token }: TGetBookingByTokenArgs) {
    return this.instanceWithoutAuth.post<TBooking>(`/bookings/get-booking/`, { token });
  }

  async createBooking({ companyId, data }: TCreateBookingArgs) {
    const formattedDate = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    const instance = this.isAuth ? this.instance : this.instanceWithoutAuth;
    return instance.post<TApiBooking>(`/companies/${companyId}/bookings`, formattedDate);
  }

  async updateBookingByToken({ token, data }: TUpdateBookingByTokenArgs) {
    const formattedDate = {
      token,
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    return this.instanceWithoutAuth.post<TBooking>(`/bookings/edit/`, formattedDate);
  }

  async updateBookingByAdmin({ data }: TUpdateBookingByAdminArgs) {
    const formattedDate = {
      ...data,
      booking_id: data.bookingId,
      date: format(data.date, "yyyy-MM-dd"),
    };

    return this.instance.post<TBooking>(`/bookings/admin-edit/`, formattedDate);
  }

  // async updateBooking({ companyId }: TUpdateBookingsArgs) {
  //   return this.instance.get<TGetResponse<TBooking[]>>(`/bookings/${companyId}/`);
  // }

  async deleteBooking({ companyId, bookingId }: TDeleteBookingsArgs) {
    return this.instance.delete(`/bookings/${companyId}/delete/${bookingId}/`);
  }

  async cancelBooking({ token }: TCancelBookingArgs) {
    return this.instance.post(`/bookings/cancel/`, { token });
  }

  async confirmBooking({ token }: TConfirmBookingArgs) {
    return this.instance.post(`/bookings/confirm/`, { token });
  }

  async getBookingComments({ bookingId }: TGetBookingComments) {
    return this.instance.get<TGetResponse<TComment[]>>(
      `/bookings/comment/list/${bookingId}/`
    );
  }

  async createBookingComment({ bookingId, data }: TCreateBookingComment) {
    return this.instance.post<TComment>(`/bookings/comment/create/${bookingId}/`, data);
  }

  async updateBookingComment({ commentId, data }: TUpdateBookingComment) {
    return this.instance.patch<TComment>(`/bookings/comment/${commentId}/`, data);
  }

  async deleteBookingComment({ commentId }: TDeleteBookingComment) {
    return this.instance.delete<TComment>(`/bookings/comment/${commentId}/`);
  }
}
