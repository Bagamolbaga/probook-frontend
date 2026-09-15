type TCompany<T = unknown> = {
  id: number;
  country?: {
    code: string;
    name: string;
  };
  name: string;
  timezone?: string;
  staffLimit: number;
  status: "created" | "activated" | "deactivated";
  // num_employees: string;
  // life_time_revenue: number;
  businessType: string;
  phone: string;
  // subscribe_to_newsletter: boolean;
  address?: string;
  zipCode?: string;
  city?: string;
  pos: {
    lat: number | null;
    lng: number | null;
  };
  workingSchedule: CompanyWorkingSchedule;
  createdAt: string;
  updatedAt: string;
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
  "Friday" | "Monday" | "Sunday" | "Tuesday" | "Saturday" | "Thursday" | "Wednesday";

type CompanyWorkingDaySchedule = {
  workingSlots: number[];
  breakSlots: number[];
};

type CompanyWorkingSchedule = Record<WorkingScheduleWeekDays, CompanyWorkingDaySchedule>;

type WorkingScheduleWeekDaysArr = [
  "Friday",
  "Monday",
  "Sunday",
  "Tuesday",
  "Saturday",
  "Thursday",
  "Wednesday",
];
