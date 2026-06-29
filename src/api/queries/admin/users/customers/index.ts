import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import { TCreateCustomerArgs, TGetAdminAllCustomersArgs, TGetAdminAllCustomersRes, TGetAdminCustomersArgs, TGetCustomerBookingHistoryArgs, TGetCustomerBookingHistoryRes, TGetCustomerDetailsArgs } from "@/api/entities/admin/users/customers";

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetAllCustomersForAdminAppQuery = (
  options: Options<TGetAdminAllCustomersArgs, TGetResponse<TGetAdminAllCustomersRes>>
) => {
  const apiClient = useApiClient();
  const { queryParams = {} } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.customers.getAllCustomers({ queryParams })).data;
  };

  return useQuery({
    queryKey: ["all_customers", ...Object.values(queryParams)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
  });
};

export const useGetCompanyCustomersForAdminAppQuery = (
  options: Options<TGetAdminCustomersArgs, TGetResponse<TCustomer[]>>
) => {
  const apiClient = useApiClient();
  const { queryParams = {}, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.customers.getCompanyCustomers({ companyId, queryParams })).data;
  };

  return useQuery({
    queryKey: ["customers", companyId, ...Object.values(queryParams)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};

export const useGetCustomerBookingHistoryForAdminAppQuery = (
  options: Options<TGetCustomerBookingHistoryArgs, TGetResponse<TGetCustomerBookingHistoryRes>>
) => {
  const apiClient = useApiClient();
  const { queryParams = {}, customerId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.customers.getCustomerBookingHistory({ customerId, queryParams })).data;
  };

  return useQuery({
    queryKey: ["customer_booking_history", customerId, ...Object.values(queryParams)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: customerId > 0
  });
};

export const useCreateCustomerForAdminAppQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCustomerArgs) => {
      return apiClient.admin.customers.createCustomer(input);
    },
    onSuccess: (_, customer) => {
      return queryClient.invalidateQueries({
        queryKey: ["customers", customer.companyId],
      });
    },
  });
};

export const useGetCustomerDetailsQuery = (options: TGetCustomerDetailsArgs) => {
  const apiClient = useApiClient();
  const { companyId, customerId } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.customers.getCustomerDetails({ companyId, customerId })).data;
  };

  return useQuery({
    queryKey: ["customer", companyId, customerId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0 && customerId > 0
  });
};