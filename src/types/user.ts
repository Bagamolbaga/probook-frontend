export type User = {
  id: number;
  _id?: string;
  company?: string | null | Record<string, unknown>;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  authProvider?: "password" | "google" | "both";
  googleId?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  role?: "admin" | "manager" | "specialist" | "customer" | "owner";
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
  // Legacy domain screens still use these fields until their API models migrate.
  company_id: string | number | null;
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_start: string | null;
  stripe_subscription_end: string | null;
  line_user_id: string | null;
};
