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
} from "@/api/entities/company";
import { TGetServicesTypesArgs } from "@/api/entities/services";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
  enabled?: boolean;
};

export const useGetCompanyServicesQuery = (options: Options<TGetCompanyServicesArgs>) => {
  const apiClient = useApiClient();
  const { companyId, queryParams = {}, enabled } = options;

  const fetcherFn = async () => {
    return (await apiClient.company.getCompanyServices({ companyId, queryParams })).data;
  };

  return useQuery({
    queryKey: ["services", companyId, ...Object.values(queryParams)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: enabled ?? !!companyId,
  });
};

export const useGetCompanyServicesTypesQuery = (
  options: Options<TGetServicesTypesArgs>
) => {
  const apiClient = useApiClient();
  const { companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.services.getServicesTypes({ companyId })).data;
  };

  return useQuery({
    queryKey: ["services_types", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};

export const useCreateCompanyServiceQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCompanyServiceArgs) => {
      // if (session?.user?.is_superuser) return apiClient.admin.services.createCompanyService({companyId, ...input});

      return apiClient.company.createCompanyService(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.data.companyId],
      });
    },
  });
};

export const useUpdateCompanyServiceQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCompanyServiceArgs) => {
      // if (session?.user?.is_superuser) return apiClient.admin.services.updateCompanyService({companyId, ...input});

      return apiClient.company.updateCompanyService(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.data.companyId],
      });
    },
  });
};

export const useDeleteCompanyServiceQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanyServiceArgs) => {
      // if (session?.user?.is_superuser) return apiClient.admin.services.deleteCompanyService(input);

      return apiClient.company.deleteCompanyService(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.companyId],
      });
    },
  });
};

export const useUploadServiceImageQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUploadServiceImageArgs) => {
      // if (session?.user?.is_superuser) return apiClient.admin.services.uploadServiceImage({companyId, ...input});

      return apiClient.company.uploadServiceImage(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["services", args.serviceId],
      });
    },
  });
};

export const useGetNewestServicesQuery = (options: Options<object>) => {
  const apiClient = useApiClient();
  void options;

  const fetcherFn = async () => {
    return (await apiClient.services.getNewestServices()).data;
  };

  return useQuery({
    queryKey: ["newest_services"],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};
