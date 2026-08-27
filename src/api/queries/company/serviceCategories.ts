import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useApiClient } from "@/api/context";
import {
  TCreateCompanyServiceCategoryArgs,
  TDeleteCompanyServiceCategoryArgs,
  TGetCompanyServiceCategoriesArgs,
  TUpdateCompanyServiceCategoryArgs,
} from "@/api/entities/company";

const serviceCategoriesQueryKey = (companyId: string) => [
  "service_categories",
  companyId,
];

export const useGetCompanyServiceCategoriesQuery = ({
  companyId,
}: TGetCompanyServiceCategoriesArgs) => {
  const apiClient = useApiClient();

  return useQuery({
    queryKey: serviceCategoriesQueryKey(companyId),
    queryFn: async () => {
      return (await apiClient.company.getCompanyServiceCategories({ companyId })).data;
    },
    staleTime: 1000 * 60,
    enabled: Boolean(companyId),
  });
};

export const useCreateCompanyServiceCategoryQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCompanyServiceCategoryArgs) =>
      apiClient.company.createCompanyServiceCategory(input),
    onSuccess: (_, { companyId }) =>
      queryClient.invalidateQueries({
        queryKey: serviceCategoriesQueryKey(companyId),
      }),
  });
};

export const useUpdateCompanyServiceCategoryQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCompanyServiceCategoryArgs) =>
      apiClient.company.updateCompanyServiceCategory(input),
    onSuccess: (_, { companyId }) =>
      queryClient.invalidateQueries({
        queryKey: serviceCategoriesQueryKey(companyId),
      }),
  });
};

export const useDeleteCompanyServiceCategoryQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanyServiceCategoryArgs) =>
      apiClient.company.deleteCompanyServiceCategory(input),
    onSuccess: (_, { companyId }) =>
      queryClient.invalidateQueries({
        queryKey: serviceCategoriesQueryKey(companyId),
      }),
  });
};
