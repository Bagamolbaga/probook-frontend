type TCompany<T = unknown> = {
  id: number;
  country?: {
    code: string;
    name: string;
  };
  name: string;
  status: "activated" | "deactivated";
  num_employees: string;
  life_time_revenue: number;
  business_type: string;
  phone: string;
  subscribe_to_newsletter: boolean;
  address1?: string;
  address2?: string;
  zip_code?: string;
  city?: string;
  pos: {
    lat: number | null;
    lng: number | null;
  };
  workingSchedule: {
    Friday: {
      times: string[];
      breaks: string[];
    };
    Monday: {
      times: string[];
      breaks: string[];
    };
    Sunday: {
      times: string[];
      breaks: string[];
    };
    Tuesday: {
      times: string[];
      breaks: string[];
    };
    Saturday: {
      times: string[];
      breaks: string[];
    };
    Thursday: {
      times: string[];
      breaks: string[];
    };
    Wednesday: {
      times: string[];
      breaks: string[];
    };
  };
  created_at: string;
  updated_at: string;
  owner: number;
  images: IUploadImage[];
  logo: string | null;
} & T;

type TCompanySubscription = {
  status: "active" | "trialing";
  remaining_days: number;
  next_billing: string;
  staff_limit: number;
  pricing_per_staff: number;
};

type IUploadImage = {
  id: number;
  image: string;
  uploaded_at: string;
};

type WorkingScheduleWeekDays =
  | "Friday"
  | "Monday"
  | "Sunday"
  | "Tuesday"
  | "Saturday"
  | "Thursday"
  | "Wednesday";

type WorkingScheduleWeekDaysArr = [
  "Friday",
  "Monday",
  "Sunday",
  "Tuesday",
  "Saturday",
  "Thursday",
  "Wednesday",
];
