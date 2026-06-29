export type FormattedDataItem = {
  _booking?: TBooking;
  shifts: {
    id: number;
    slots: TBooking["slots"];
    client: TBooking["client"];
    date: TBooking["date"];
    status: TBooking["status"];
    services: TServiceAndSelectedOption[];
    updatedAt: TBooking["updated_at"];
  }[];
  id: TBooking["id"];
  specialist: TBooking["specialist"];
  customWorkingShift?: TShift;
  company: TBooking["company"];
  revalidateQueries: () => void;
};

export type UpdateBookingForm = {
  companyId: number;
  bookingId: number;
  status: TBooking["status"];
  updatedAt: TBooking["updated_at"];
  assignee?: TBooking["specialist"];
  customer: TBooking["client"];
  time: {
    start: string;
    end: string;
    slots: number[];
  } | null;
  date: Date;
  location: string;
  servicesId: string[];
  services: {
    service: TService;
    option: TService["options"][number];
  }[];
};