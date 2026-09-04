import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import type { CreateInvitationInput } from "@/api/entities/invitation";

export const useInvitationPreviewQuery = (token: string) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["invitation-preview", token],
    queryFn: async () => (await apiClient.invitations.getPreview(token)).data,
    enabled: Boolean(token),
    retry: false,
  });
};

export const useCompanyInvitationsQuery = (companyId: string) => {
  const apiClient = useApiClient();
  return useQuery({
    queryKey: ["company-invitations", companyId],
    queryFn: async () => (await apiClient.invitations.list(companyId)).data,
    enabled: Boolean(companyId),
  });
};

export const useCreateInvitationMutation = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInvitationInput) => apiClient.invitations.create(input),
    onSuccess: (_, input) =>
      queryClient.invalidateQueries({
        queryKey: ["company-invitations", input.companyId],
      }),
  });
};

export const useAcceptInvitationMutation = () => {
  const apiClient = useApiClient();
  return useMutation({
    mutationFn: (token: string) => apiClient.invitations.accept(token),
  });
};

export const useResendInvitationMutation = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      companyId,
      invitationId,
    }: {
      companyId: string;
      invitationId: string;
    }) => apiClient.invitations.resend(companyId, invitationId),
    onSuccess: (_, input) =>
      queryClient.invalidateQueries({
        queryKey: ["company-invitations", input.companyId],
      }),
  });
};

export const useRevokeInvitationMutation = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      companyId,
      invitationId,
    }: {
      companyId: string;
      invitationId: string;
    }) => apiClient.invitations.revoke(companyId, invitationId),
    onSuccess: (_, input) =>
      queryClient.invalidateQueries({
        queryKey: ["company-invitations", input.companyId],
      }),
  });
};
