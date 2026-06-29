type CalendarEventStatus = "booked" | "pending" | "completed" | "break" | "error" | "off";
type BookingStatus =
  | "BLOCKED"
  | "PENDING"
  | "COMPLETED"
  | "OFF"
  | "CONFIRMED"
  | "WALK_IN";

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
  author: TBooking["specialist"]["specialist_details"];
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


