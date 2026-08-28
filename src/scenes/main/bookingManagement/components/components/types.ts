export type FormattedDataItem = {
  _booking?: TApiBooking;
  shifts: {
    id: TApiBooking["id"];
    slots: TApiBooking["slots"];
    customer: TApiBooking["customer"];
    date: TApiBooking["date"];
    status: TApiBooking["status"];
    services: TApiBooking["services"];
    totalPrice: TApiBooking["totalPrice"];
    createdAt?: TApiBooking["createdAt"];
    updatedAt?: TApiBooking["updatedAt"];
  }[];
  id: TApiBooking["id"];
  specialist: TApiBooking["specialist"];
  customWorkingShift?: TShift;
  company: string;
  revalidateQueries: () => void;
};

export type UpdateBookingForm = {
  companyId: string;
  bookingId: string;
  status: TApiBooking["status"];
  totalPrice: TApiBooking["totalPrice"];
  createdAt?: TApiBooking["createdAt"];
  updatedAt?: TApiBooking["updatedAt"];
  assignee?: TApiBooking["specialist"];
  customer: TApiBooking["customer"];
  time: {
    start: string;
    end: string;
    slots: number[];
  } | null;
  date: Date;
  location: string;
  servicesId: string[];
  services: TApiBooking["services"];
};
