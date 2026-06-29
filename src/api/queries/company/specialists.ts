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
import { useAppSession } from "@/hooks/useAppSession";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
};

type TGetSpecialists = {
  companyId: number;
};

export const useGetCompanySpecialistsQuery = (options: Options<TGetCompanySpecialistsArgs>) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.getCompanySpecialists({ companyId, queryParams })).data;
  };

  return useQuery({
    queryKey: ["specialists", companyId, queryParams?.limit, queryParams?.offset],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId
    // ...queryOptions,
  });
};

export const useCreateCompanySpecialistsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { data: session } = useAppSession();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: TCreateCompanySpecialistsArgs) => {
      if (session?.user?.is_superuser) return apiClient.admin.specialists.createCompanySpecialist({companyId, ...input});
      
      return apiClient.company.createCompanySpecialist(input);
    },
    onSuccess: (_, specialist) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists"],
      });
    },
  });
};

export const useUpdateCompanySpecialistsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { data: session } = useAppSession();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: TUpdateCompanySpecialistsArgs) => {
      if (session?.user?.is_superuser) return apiClient.admin.specialists.updateCompanySpecialist({companyId, ...input});

      return apiClient.company.updateCompanySpecialist(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists", _.data.company],
      });
    },
  });
};

export const useDeleteCompanySpecialistsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { data: session } = useAppSession();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: TDeleteCompanySpecialistsArgs) => {
      if (session?.user?.is_superuser) return apiClient.admin.specialists.deleteCompanySpecialist({companyId, ...input});

      return apiClient.company.deleteCompanySpecialist(input);
    },
    onSuccess: (_, specialist) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists"],
      });
    },
  });
};
