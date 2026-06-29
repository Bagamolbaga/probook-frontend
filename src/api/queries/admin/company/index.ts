import { useApiClient } from "@/api/context";
import {
  TDeleteCompanyArgs,
  TGetAdminBackboneStatisticRes,
  TGetAdminCompaniesArgs,
  TGetAdminCompaniesRes,
  TGetAdminCompanyDetailsRes,
} from "@/api/entities/admin/company";
import {
  TGetCompanyDetailsArgs,
  TUpdateCompanyDetailsArgs,
} from "@/api/entities/company";
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

export const useGetAsAdminCompanys = (
  options: Options<TGetAdminCompaniesArgs, TGetResponse<TGetAdminCompaniesRes>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, queryParams = {} } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.company.getCompanies(queryParams)).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["companys", ...Object.values(queryParams)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    ...queryOptions,
  });
};

export const useGetAsAdminCompanyDetailsQuery = (
  options: Options<TGetCompanyDetailsArgs, TGetAdminCompanyDetailsRes>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.company.getCompanyDetails({ companyId })).data;
  };

  return useQuery({
    queryKey: ["company", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};

export const useGetAsAdminBackboneStatisticQuery = (
  options: Options<unknown, TGetAdminBackboneStatisticRes>
) => {
  const apiClient = useApiClient();
  const { queryOptions } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.company.getBackboneStatistic()).data;
  };

  return useQuery({
    queryKey: ["backbone_statistic"],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    ...queryOptions,
  });
};

export const useUpdateCompanyForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCompanyDetailsArgs) => {
      return apiClient.admin.company.updateCompany(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["company", args.companyId],
      });
    },
  });
};

export const useDeleteCompanyForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanyArgs) => {
      return apiClient.admin.company.deleteCompany(input);
    },
    onSuccess: (_, company) => {
      void queryClient.invalidateQueries({
        queryKey: ["companys"],
      });
      return queryClient.invalidateQueries({
        queryKey: ["company", company.companyId],
      });
    },
  });
};
