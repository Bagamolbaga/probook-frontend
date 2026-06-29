import {
  UndefinedInitialDataOptions,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import {
  TDeleteCompanyImagesArgs,
  TGetCompaniesArgs,
  TGetCompanyDetailsArgs,
  TGetCompanyImagesArgs,
  TGetCompanyImagesRes,
  TSearchCompanysArgs,
  TSearchCompanysRes,
  TUpdateCompanyDetailsArgs,
  TUploadCompanyImagesArgs,
  TUploadCompanyLogoArgs,
} from "@/api/entities/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { getDefaultQueryOptions } from "../defaultQueryOptions";
import {
  TSearchServicesAndStoresArgs,
  TSearchServicesAndStoresRes,
} from "@/api/entities/services";
import { AxiosResponse } from "axios";
import { removeEmptyFields } from "@/utils/removeEmptyFields";

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetCompanyDetailsQuery = (
  options: Options<TGetCompanyDetailsArgs, AxiosResponse<TCompany>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, ...args } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.getCompanyDetails({ companyId, ...args })).data;
  };

  return useQuery({
    enabled: !!companyId,
    queryKey: ["company", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,

    // ...queryOptions,
  });
};

export const useUpdateCompanyDetailsQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCompanyDetailsArgs) => {
      return apiClient.company.updateCompanyDetails(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["company", args.companyId],
      });
    },
  });
};

export const useGetCompaniesQuery = (
  options: Options<TGetCompaniesArgs, AxiosResponse<TGetResponse<TCompany[]>>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, queryParams } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.getCompanies({ queryParams })).data;
  };

  return useQuery({
    queryKey: ["companies", ...Object.values(queryParams || {})],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};

export const useSearchCompaniesQuery = (
  options: Options<
    Omit<TSearchCompanysArgs, "companyId">,
    TGetResponse<TSearchCompanysRes>
  >
) => {
  const apiClient = useApiClient();
  const { queryOptions, query } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.searchCompanyServices({ query })).data;
  };

  return useQuery({
    queryKey: ["search_companies", Object.values(query)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    ...queryOptions,
  });
};

export const useSearchServicesAndStoresQuery = (
  options: Options<TSearchServicesAndStoresArgs, TSearchServicesAndStoresRes>
) => {
  const apiClient = useApiClient();
  const { queryOptions, ...query } = options;

  const fetcherFn = async () => {
    return (await apiClient.services.searchServicesAndStores(query)).data;
  };

  return useQuery({
    queryKey: ["search_services_and_companies", Object.values(removeEmptyFields(query))],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    ...queryOptions,
  });
};

export const useGetCompaniesImagesQuery = (
  options: Options<TGetCompanyImagesArgs, AxiosResponse<TGetCompanyImagesRes>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.getCompanyImages({ companyId })).data;
  };

  return useQuery({
    queryKey: ["company_images", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
    // ...queryOptions,
  });
};

export const useUploadCompanyImagesQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUploadCompanyImagesArgs) => {
      return apiClient.company.uploadCompanyImages(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["company_images", args.companyId],
      });
    },
  });
};

export const useDeleteCompanyImagesQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanyImagesArgs) => {
      return apiClient.company.deleteCompanyImages(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["company_images", args.companyId],
      });
    },
  });
};

export const useUploadCompanyLogoQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUploadCompanyLogoArgs) => {
      return apiClient.company.uploadCompanyLogo(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["company_logo", args.companyId],
      });
    },
  });
};
