export type CompanyMembershipRole = "OWNER" | "SPECIALIST";

export type CompanyMembershipStatus = "ACTIVE" | "SUSPENDED";

export type CompanyMembership = {
  id: string;
  companyId: string;
  companyName: string;
  roles: CompanyMembershipRole[];
  status: CompanyMembershipStatus;
  specialistProfileId: string | null;
  permissions: string[];
};

export type UserCompany = {
  id: string;
  name: string | null;
  roles: CompanyMembershipRole[];
  specialistProfileId: string | null;
  permissions: string[];
};

export type User = {
  id: number;
  _id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
  authProvider?: "password" | "google" | "both";
  googleId?: string;
  emailVerified?: boolean;
  lastLoginAt?: string;
  fullName?: string;
  createdAt?: string;
  updatedAt?: string;
  memberships?: CompanyMembership[];
  companies?: UserCompany[];
  username: string;
  first_name: string;
  last_name: string;
  is_superuser: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_start: string | null;
  stripe_subscription_end: string | null;
  line_user_id: string | null;
};
