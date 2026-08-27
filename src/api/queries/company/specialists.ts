/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import {
  TCreateCompanySpecialistsArgs,
  TDeleteCompanySpecialistsArgs,
  TGetCompanyShiftsForDateRangeArgs,
  TGetCompanySpecialistsArgs,
  TUpdateCompanySpecialistsArgs,
} from "@/api/entities/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
};

type TGetSpecialists = {
  companyId: number;
};

export const useGetCompanySpecialistsQuery = (
  options: Options<TGetCompanySpecialistsArgs>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.getCompanySpecialists({ companyId, queryParams }))
      .data;
  };

  return useQuery({
    queryKey: ["specialists", companyId, queryParams?.limit, queryParams?.offset],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
    // ...queryOptions,
  });
};

export const useCreateCompanySpecialistsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: Omit<TCreateCompanySpecialistsArgs, "companyId">) =>
      apiClient.company.createCompanySpecialist({ companyId, ...input }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists", companyId],
      });
    },
  });
};

export const useUpdateCompanySpecialistsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: Omit<TUpdateCompanySpecialistsArgs, "companyId">) =>
      apiClient.company.updateCompanySpecialist({ companyId, ...input }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists", companyId],
      });
    },
  });
};

export const useDeleteCompanySpecialistsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: Omit<TDeleteCompanySpecialistsArgs, "companyId">) =>
      apiClient.company.deleteCompanySpecialist({ companyId, ...input }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists", companyId],
      });
    },
  });
};
