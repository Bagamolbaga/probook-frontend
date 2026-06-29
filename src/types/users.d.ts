type TSpecialist = {
  // id: number;
  // specialist_details: {
  //   id: number;
  //   username: string;
  //   email: string;
  //   phone: string | null;
  //   first_name: string;
  //   last_name: string;
  //   avatar: string | null;
  //   phone_verified: boolean;
  //   company_id: number | null;
  //   is_superuser: boolean;
  //   stripe_customer_id: string | null;
  //   stripe_subscription_start: string | null;
  //   stripe_subscription_end: string | null;
  //   line_user_id: string | null;
  // };
  // default_shift: TShift;
  // full_name: string;
  // is_available: true;
  // rate: string;
  // created_at: string;
  // updated_at: string;
  // company: number;

  id: string;
  company?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
  role: string;
  fullName: string;
  createdAt?: Date;
  updatedAt?: Date;

  specialties: string[];
  bio?: string;
  rating?: number;
  defaultShift?: string;
  services: Service[];
  servicesPopulated?: Service[];
  role: "specialist";
};

type TCustomer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  bookingsCount: number;
  moneySpent: string;
};

type TSpecialistStatic = {
  id: number;
  company_id: number;
  email: string | null;
  phone: string | null;
  full_name: string;
  avatar: string | null;
  default_shift: TShift;
  services: number[];
};
