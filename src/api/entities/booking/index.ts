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

export type TCreateBookingArgs = {
  companyId: string;
  data: {
    services: string[];
    specialist: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
    };
    date: Date;
    slots: number[];
    status?: "BLOCKED" | "PENDING" | "COMPLETED" | "OFF" | "CONFIRMED";
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

    return this.instanceWithoutAuth.get<TGetResponse<TApiBooking[]>>(
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

  async getBookingByToken({ token }: TGetBookingByTokenArgs) {
    return this.instanceWithoutAuth.post<TBooking>(`/bookings/get-booking/`, { token });
  }

  async createBooking({ companyId, data }: TCreateBookingArgs) {
    const formattedDate = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    return this.instanceWithoutAuth.post<TApiBooking>(
      `/companies/${companyId}/bookings`,
      formattedDate
    );
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
