export type User = {
  id: number;
  company_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
  is_superuser: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_start: string | null;
  stripe_subscription_end: string | null;
  line_user_id: string | null
};
