/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import { TUpdateBusinessUserLineId, TUploadUserAvatarArgs } from "@/api/entities/user/business";
import { TCreateCustomerArgs, TGetCustomerBookingHistoryArgs, TGetCustomerDetailsArgs, TGetCustomersArgs } from "@/api/entities/user/customer";
import { useAppSession } from '@/hooks/useAppSession';
import { useStore } from 'zustand';
import { useSuperAdminStore } from '@/stores/superAdmin';

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useUploadUserAvatarQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUploadUserAvatarArgs) => {
      return apiClient.businessUser.uploadUserAvatar(input);
    },
    onSuccess: (_, specialist) => {
      return queryClient.invalidateQueries({
        queryKey: ["specialists"],
      });
    },
  });
};

export const useGetCustomersQuery = (options: TGetCustomersArgs) => {
  const apiClient = useApiClient();
  const { queryParams = {}, companyId } = options;

  const fetcherFn = async () => {
    return (await apiClient.customerUser.getCustomers({ companyId, queryParams })).data;
  };

  return useQuery({
    queryKey: ["customers", companyId, ...Object.values(queryParams)],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId
  });
};

export const useCreateCustomerQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCustomerArgs) => {
      return apiClient.customerUser.createCustomer(input);
    },
    onSuccess: (_, customer) => {
      return queryClient.invalidateQueries({
        queryKey: ["customers", customer.companyId],
      });
    },
  });
};

export const useGetCustomerDetailsQuery = (options: Options<TGetCustomerDetailsArgs, TCustomer>) => {
  const apiClient = useApiClient();
  const { companyId, customerId } = options;

  const fetcherFn = async () => {
    return (await apiClient.customerUser.getCustomerDetails({ companyId, customerId })).data;
  };

  return useQuery({
    queryKey: ["customer_details", companyId, customerId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};

export const useGetCustomerBookingsHistoryQuery = (options: Options<TGetCustomerBookingHistoryArgs, unknown>) => {
  const apiClient = useApiClient();
  const { customerId } = options;

  const fetcherFn = async () => {
    return (await apiClient.customerUser.getCustomerBookingsHistory({ customerId })).data;
  };

  return useQuery({
    queryKey: ["customer_details", customerId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: customerId > 0
  });
};

export const useUpdateBusinessUserLineIdQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateBusinessUserLineId) => {
      return apiClient.businessUser.updateUserLineId(input);
    },
    onSuccess: (_, user) => {
      return queryClient.invalidateQueries({
        queryKey: ["user", user.userId],
      });
    },
  });
};