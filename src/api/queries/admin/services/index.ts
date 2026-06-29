import { TGetCompanyServiceTypesArgs } from "@/api/entities/admin/services";
import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import {
  TGetCompanyServicesArgs,
  TUpdateCompanyServiceArgs,
  TCreateCompanyServiceArgs,
  TDeleteCompanyServiceArgs,
  TUploadServiceImageArgs,
} from "@/api/entities/admin/services";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
};

export const useGetCompanyServicesForAdminAppQuery = (
  options: Options<TGetCompanyServicesArgs>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.services.getCompanyServices({ companyId, queryParams }))
      .data;
  };

  return useQuery({
    queryKey: ["services", companyId, queryParams?.limit, queryParams?.offset],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};

export const useGetCompanyServicesTypesForAdminAppQuery = (
  options: Options<TGetCompanyServiceTypesArgs>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, ...args } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.services.getServicesTypes({ companyId, ...args })).data;
  };

  return useQuery({
    queryKey: ["services_types"],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};

export const useCreateCompanyServiceForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCompanyServiceArgs) => {
      return apiClient.admin.services.createCompanyService(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.data.company],
      });
    },
  });
};

export const useUpdateCompanyServiceForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCompanyServiceArgs) => {
      return apiClient.admin.services.updateCompanyService(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", _.data.company],
      });
    },
  });
};

export const useDeleteCompanyServiceForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanyServiceArgs) => {
      return apiClient.admin.services.deleteCompanyService(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.companyId],
      });
    },
  });
};

export const useUploadServiceImageForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUploadServiceImageArgs) => {
      return apiClient.admin.services.uploadServiceImage(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.serviceId],
      });
    },
  });
};

export const useGetNewestServicesForAdminAppQuery = (options: Options<object>) => {
  const apiClient = useApiClient();

  const fetcherFn = async () => {
    return (await apiClient.admin.services.getNewestServices()).data;
  };

  return useQuery({
    queryKey: ["newest_services"],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};
