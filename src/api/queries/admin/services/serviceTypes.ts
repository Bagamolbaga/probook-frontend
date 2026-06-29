import { useApiClient } from "@/api/context";
import {
  TCreateServicesTypeArgs,
  TDeleteServicesTypeArgs,
  TGetCompanyServicesArgs,
  TGetServicesTypesRes,
  TUpdateServicesTypeArgs,
} from "@/api/entities/admin/services";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetCompanyServicesTypesQuery = (
  options: Options<TGetCompanyServicesArgs, TGetResponse<TServiceType_new[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.services.getServicesTypes({ companyId })).data;
  };

  return useQuery({
    queryKey: ["services_types", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};

export const useCreateCompanyServicesTypeQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateServicesTypeArgs) => {
      return apiClient.admin.services.createServicesType(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services_types", args.companyId],
      });
    },
  });
};

export const useUpdateCompanyServicesTypeQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateServicesTypeArgs) => {
      return apiClient.admin.services.updateServicesType(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services_types", args.companyId],
      });
    },
  });
};

export const useDeleteCompanyServicesTypeQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteServicesTypeArgs) => {
      return apiClient.admin.services.deleteServicesType(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services_types", args.companyId],
      });
    },
  });
};
