import type { User, UserCompany } from "@/types/user";

type CompanyAccess = Pick<UserCompany, "roles" | "permissions">;

export const SPECIALIST_PERMISSIONS = {
  readBookings: "bookings:read:self",
  createBookings: "bookings:create:self",
  rescheduleBookings: "bookings:reschedule:self",
  updateBookingStatus: "bookings:update:self-status",
  readAssignedCustomers: "customers:read:assigned",
  readSchedule: "schedule:read:self",
  readProfile: "profile:read:self",
  updateProfile: "profile:update:self",
} as const;

export const getActiveMemberships = (user?: User | null) =>
  (user?.memberships || []).filter((membership) => membership.status === "ACTIVE");

export const getUserCompanies = (user?: User | null): UserCompany[] => {
  if (user?.companies) return user.companies;

  return getActiveMemberships(user).map((membership) => ({
    id: membership.companyId,
    name: membership.companyName,
    roles: membership.roles,
    specialistProfileId: membership.specialistProfileId,
    permissions: membership.permissions,
  }));
};

export const isOwnerMembership = (company?: CompanyAccess | null) =>
  Boolean(company?.roles.includes("OWNER"));

export const isSpecialistMembership = (company?: CompanyAccess | null) =>
  Boolean(company?.roles.includes("SPECIALIST"));

export const hasPermission = (
  company: CompanyAccess | null | undefined,
  permission: string
) => Boolean(company?.permissions.includes(permission) || isOwnerMembership(company));
