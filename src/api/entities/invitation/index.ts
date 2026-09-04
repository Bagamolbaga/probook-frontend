import { ApiClientCore } from "@/api/core";
import type { AuthResponse } from "@/lib/auth";
import type { CompanyMembershipRole } from "@/types/user";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
export type InvitationDeliveryStatus = "PENDING" | "SENT" | "FAILED";

export type InvitationPreview = {
  companyId: string;
  companyName: string;
  companyLogo?: string | null;
  email: string;
  roles: CompanyMembershipRole[];
  expiresAt: string;
  requiresAuthentication: boolean;
  passwordSetupAvailable: boolean;
};

export type CompanyInvitation = {
  id: string;
  companyId: string;
  companyName: string;
  email: string;
  roles: ["SPECIALIST"];
  specialistProfile: {
    firstName: string;
    lastName: string;
    specialties?: string[];
    bio?: string;
    serviceIds?: string[];
    defaultShiftId?: string | null;
  };
  expiresAt: string;
  status: InvitationStatus;
  deliveryStatus: InvitationDeliveryStatus;
  deliveryError?: string | null;
  lastSentAt?: string | null;
  sendAttempts: number;
  createdAt: string;
  updatedAt: string;
};

export type InvitationDeliveryResponse = {
  invitation: CompanyInvitation;
  inviteUrl: string;
};

export type CreateInvitationInput = {
  companyId: string;
  data: {
    email: string;
    roles: ["SPECIALIST"];
    specialistProfile: CompanyInvitation["specialistProfile"];
  };
};

export class ApiClientInvitations extends ApiClientCore {
  getPreview(token: string) {
    return this.instanceWithoutAuth.get<InvitationPreview>(`/invitations/${token}`);
  }

  registerPassword(token: string, data: { password: string }) {
    return this.instanceWithoutAuth.post<AuthResponse>(
      `/auth/invitations/${token}/register-password`,
      data
    );
  }

  accept(token: string) {
    return this.instance.post<{ membership: unknown; specialistProfileId: string }>(
      `/invitations/${token}/accept`
    );
  }

  list(companyId: string) {
    return this.instance.get<TGetResponse<CompanyInvitation[]>>(
      `/companies/${companyId}/invitations`
    );
  }

  create({ companyId, data }: CreateInvitationInput) {
    return this.instance.post<InvitationDeliveryResponse>(
      `/companies/${companyId}/invitations`,
      data
    );
  }

  resend(companyId: string, invitationId: string) {
    return this.instance.post<InvitationDeliveryResponse>(
      `/companies/${companyId}/invitations/${invitationId}/resend`
    );
  }

  revoke(companyId: string, invitationId: string) {
    return this.instance.delete(`/companies/${companyId}/invitations/${invitationId}`);
  }
}
