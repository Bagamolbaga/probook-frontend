type CalendarEventStatus = "booked" | "pending" | "completed" | "break" | "error" | "off";
type BookingStatus =
  "BLOCKED" | "PENDING" | "COMPLETED" | "OFF" | "CONFIRMED" | "WALK_IN";

type TApiBookingCustomer = {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
};

type TApiBookingCompany = {
  id: string;
  _id?: string;
  name: string;
  logo?: string | null;
};

type TApiBookingSpecialist = {
  id: string;
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  avatar?: string | null;
  specialties: string[];
  bio?: string;
  rating?: number;
};

type TApiBookingService = {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  category?: {
    id: string;
    _id?: string;
    name: string;
  };
  options: ({
    id: string;
    _id?: string;
    description?: string;
  } & Pick<TServiceOption, "name" | "price" | "duration">)[];
  selectedOption: {
    id: string;
    _id?: string;
    name?: string;
    description?: string;
    price: number;
    duration: number;
  };
};

type TApiBooking = {
  id: string;
  _id?: string;
  company: TApiBookingCompany;
  specialist: TApiBookingSpecialist;
  services: TApiBookingService[];
  totalPrice: number;
  customer: TApiBookingCustomer;
  date: string;
  slots: number[];
  status: Exclude<BookingStatus, "WALK_IN">;
  createdAt?: string;
  updatedAt?: string;
  otp_sent?: boolean;
};

type TApiBookingMin = Pick<
  TApiBooking,
  "id" | "specialist" | "date" | "slots" | "status"
> & {
  company?: TApiBooking["company"];
};

type CalendarEvent = {
  id: string | number;
  status: CalendarEventStatus;
  time?: {
    start?: string;
    end?: string;
  };
  title: string;
  desc: string;
};

type TBooking<Raw extends boolean = false> = {
  id: number;
  specialist: TSpecialist;
  services: Raw extends true
    ? { service_id: number; service_option_id: number }[]
    : { service: TService; service_option: TServiceOption }[];
  client: {
    username: string;
    email?: string;
    phone: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    phone_verified: boolean;
  };
  date: string;
  slots: number[];
  price: string;
  slot_duration: number;
  services_duration: number;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
  company: number;
};

type TBookingFromAPI = TBooking<true>;

type TComment = {
  id: number;
  company: number;
  booking: number;
  author: {
    avatar: string | null;
    first_name: string;
    last_name: string;
  };
  body: string;
  body_thai: string;
  created_at: string;
  updated_at: string;
};

type TBookingMin = {
  id: TBooking["id"];
  specialist: Pick<TSpecialist, "id">;
  date: TBooking["date"];
  slots: TBooking["slots"];
  status: BookingStatus;
  company: TBooking["company"];
};
