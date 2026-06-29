import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { TGetCompanySpecialistsArgs } from "@/api/entities/admin/specialists";
import { useApiClient } from "@/api/context";
import { TCreateCompanySpecialistsArgs, TDeleteCompanySpecialistsArgs, TUpdateCompanySpecialistsArgs } from "@/api/entities/admin/specialists";

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetAdminCompanySpecialistsQuery = (
  options: Options<TGetCompanySpecialistsArgs, TGetResponse<TSpecialist[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    return (
      await apiClient.admin.specialists.getCompanySpecialists({ companyId, queryParams })
    ).data;
  };

  return useQuery({
    queryKey: ["specialists", companyId, queryParams?.limit, queryParams?.offset],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};

export const useCreateCompanySpecialistsForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCompanySpecialistsArgs) => {
      return apiClient.admin.specialists.createCompanySpecialist(input);
    },
    onSuccess: (_, specialist) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists"],
      });
    },
  });
};

export const useUpdateCompanySpecialistsForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCompanySpecialistsArgs) => {
      return apiClient.admin.specialists.updateCompanySpecialist(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists", _.data.id],
      });
    },
  });
};

export const useDeleteCompanySpecialistsForAdmiAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanySpecialistsArgs) => {
      return apiClient.admin.specialists.deleteCompanySpecialist(input);
    },
    onSuccess: (_, specialist) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists"],
      });
    },
  });
};

