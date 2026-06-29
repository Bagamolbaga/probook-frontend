import { format } from "date-fns";
import { ApiClientCore } from "@/api/core";

export type TGetBookingsArgs = {
  companyId: number;
  queryParams?: {
    start_date: Date;
    end_date: Date;
    offset?: string;
    limit?: string;
  };
};

export type TGetBookingByTokenArgs = {
  token: string;
};

export type TCreateBookingArgs = {
  companyId: number;
  data: {
    services: {id: number, option_id: number}[];
    specialist: number;
    date: Date;
    slots: number[];
  };
};

export type TUpdateBookingByTokenArgs = {
  companyId: number
  token: string;
  data: {
    services: {id: number, option_id: number}[];
    specialist: number
    date: Date;
    slots: number[];
  };
};

export type TUpdateBookingByAdminArgs = {
  companyId: number
  data: {
    bookingId: number
    services: {id: number, option_id: number}[];
    specialist: number
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

export type TConfirmBookingArgs = TCancelBookingArgs

export type TGetBookingComments = {
  companyId: number;
  bookingId: number;
};

export type TCreateBookingComment = {
  companyId: number;
  bookingId: number;
  data: {
    body: string;
    body_thai: string;
  };
};

export type TUpdateBookingComment = {
  companyId: number;
  bookingId: number;
  commentId: number;
  data: {
    body: string;
    body_thai: string;
  };
};

export type TDeleteBookingComment = {
  companyId: number;
  bookingId: number;
  commentId: number;
};

export class ApiClientAdminBookings extends ApiClientCore {
  constructor(token: string, currentUserId: number) {
    super(token, currentUserId);
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

    return this.instance.get<TGetResponse<TBooking<true>[]>>(
      `/superuser/bookings/${companyId}/?${params.toString()}`
    );
  }

  async getBookingByToken({ token }: TGetBookingByTokenArgs) {
    return this.instance.post<TBooking>(`/superuser/bookings/get-booking/`, { token });
  }

  async createBooking({ companyId, data }: TCreateBookingArgs) {
    const formattedDate = {
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    return this.instance.post<TBooking>(
      `/superuser/bookings/${companyId}/`,
      formattedDate
    );
  }

  async updateBookingByToken({ companyId, token, data }: TUpdateBookingByTokenArgs) {
    const formattedDate = {
      token,
      ...data,
      date: format(data.date, "yyyy-MM-dd"),
    };

    return this.instance.post<TBooking>(
      `/superuser/bookings/${companyId}/`,
      formattedDate
    );
  }

  async updateBookingByAdmin({ companyId, data }: TUpdateBookingByAdminArgs) {
    const formattedDate = {
      ...data,
      booking_id: data.bookingId,
      date: format(data.date, "yyyy-MM-dd"),
    };

    return this.instance.patch<TBooking>(
      `/superuser/bookings/${companyId}/${data.bookingId}/`,
      formattedDate
    );
  }

  // async updateBooking({ companyId }: TUpdateBookingsArgs) {
  //   return this.instance.get<TGetResponse<TBooking[]>>(`/superuser/bookings/${companyId}/`);
  // }

  async deleteBooking({ companyId, bookingId }: TDeleteBookingsArgs) {
    return this.instance.delete(`/superuser/bookings/${companyId}/${bookingId}/`);
  }

  async cancelBooking({ token }: TCancelBookingArgs) {
    return this.instance.post(`/superuser/bookings/cancel/`, { token });
  }
  
  async confirmBooking({ token }: TConfirmBookingArgs) {
    return this.instance.post(`/superuser/bookings/confirm/`, { token });
  }

  async getBookingComments({ companyId, bookingId }: TGetBookingComments) {
    return this.instance.get<TGetResponse<TComment[]>>(
      `/superuser/bookings/${companyId}/comments/${bookingId}/`
    );
  }

  async createBookingComment({ companyId, bookingId, data }: TCreateBookingComment) {
    return this.instance.post<TComment>(`/superuser/bookings/${companyId}/comments/${bookingId}/`, data);
  }

  async updateBookingComment({ companyId, bookingId, commentId, data }: TUpdateBookingComment) {
    return this.instance.patch<TComment>(`/superuser/bookings/${companyId}/comments/${bookingId}/${commentId}/`, data);
  }

  async deleteBookingComment({ companyId, bookingId, commentId }: TDeleteBookingComment) {
    return this.instance.delete<TComment>(`/superuser/bookings/${companyId}/comments/${bookingId}/${commentId}/`);
  }
}
