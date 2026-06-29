import { useApiClient } from "@/api/context";
import { TGetCompanySubscriptionArgs, TUpdateCompanySubscriptionArgs } from "@/api/entities/admin/company/subscription";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";


type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetCompanySubscriptionQuery = (
  options: Options<
    TGetCompanySubscriptionArgs,
    TCompanySubscription
  >
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.companySubscription.getSubscription({companyId})).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["company_subscription", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};

// export const useUpdateCompanySubscriptionQuery = () => {
//   const apiClient = useApiClient();
//   const queryClient = useQueryClient();
//   const {companyId} = useGetCompanyId()

//   return useMutation({
//     mutationFn: (input: TUpdateCompanySubscriptionArgs) => {
//       return apiClient.admin.companySubscription.updateSubscription(input);
//     },
//     onSuccess: (_, shift) => {
//       return queryClient.invalidateQueries({
//         queryKey: ["company_subscription", companyId],
//       });
//     },
//   });
// };

export const useCancelCompanySubscriptionQuery = (
  options: Options<
    TGetCompanySubscriptionArgs,
    unknown
  >
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.companySubscription.cancelSubscription({companyId})).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["company_subscription", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};