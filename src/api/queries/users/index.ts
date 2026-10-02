/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useApiClient } from "@/src/api/context";
import {
  TUpdateBusinessUserLineId,
  TUploadUserAvatarArgs,
} from "@/src/api/entities/user/business";
import {
  TBookingCustomerDetails,
  TBookingCustomerListItem,
  TCreateCustomerArgs,
  TGetCustomerBookingHistoryArgs,
  TGetCustomerDetailsArgs,
  TGetCustomersArgs,
  TLookupCustomerByEmailArgs,
  TLookupCustomersArgs,
} from "@/src/api/entities/user/customer";
import { useAppSession } from "@/src/hooks/useAppSession";
import { useStore } from "zustand";
import { useSuperAdminStore } from "@/src/stores/superAdmin";

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
  const { data: session } = useAppSession();
  const { queryParams = {}, companyId } = options;
  const currentUserId = session?.user?._id || session?.user?.id;

  const fetcherFn = async () => {
    return (await apiClient.customerUser.getCustomers({ companyId, queryParams })).data;
  };

  return useQuery({
    queryKey: [
      "customers",
      "authenticated",
      currentUserId,
      companyId,
      ...Object.values(queryParams),
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: Boolean(companyId && session?.accessToken && currentUserId),
  });
};

export const useLookupCustomersQuery = (
  options: TLookupCustomersArgs & { enabled?: boolean }
) => {
  const apiClient = useApiClient();
  const { data: session } = useAppSession();
  const { companyId, search, limit = 5, enabled = true } = options;
  const currentUserId = session?.user?._id || session?.user?.id;

  return useQuery({
    queryKey: [
      "customer_lookup",
      "authenticated",
      currentUserId,
      companyId,
      search,
      limit,
    ],
    queryFn: async () =>
      (await apiClient.customerUser.lookupCustomers({ companyId, search, limit })).data,
    staleTime: 1000 * 60,
    enabled: Boolean(
      enabled && companyId && search.length >= 3 && session?.accessToken && currentUserId
    ),
  });
};

export const useLookupCustomerByEmailQuery = (
  options: TLookupCustomerByEmailArgs & { enabled?: boolean }
) => {
  const apiClient = useApiClient();
  const { data: session } = useAppSession();
  const { companyId, email, enabled = true } = options;
  const currentUserId = session?.user?._id || session?.user?.id;

  return useQuery({
    queryKey: [
      "customer_lookup_by_email",
      "authenticated",
      currentUserId,
      companyId,
      email,
    ],
    queryFn: async () =>
      (await apiClient.customerUser.lookupCustomerByEmail({ companyId, email })).data,
    staleTime: 1000 * 60,
    enabled: Boolean(
      enabled && companyId && email && session?.accessToken && currentUserId
    ),
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

export const useGetCustomerDetailsQuery = (
  options: Options<TGetCustomerDetailsArgs, TBookingCustomerDetails>
) => {
  const apiClient = useApiClient();
  const { data: session } = useAppSession();
  const { companyId, customerId } = options;
  const currentUserId = session?.user?._id || session?.user?.id;

  const fetcherFn = async () => {
    return (await apiClient.customerUser.getCustomerDetails({ companyId, customerId }))
      .data;
  };

  return useQuery({
    queryKey: ["customer_details", "authenticated", currentUserId, companyId, customerId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: Boolean(companyId && customerId && session?.accessToken && currentUserId),
  });
};

export const useGetCustomerBookingsHistoryQuery = (
  options: Options<TGetCustomerBookingHistoryArgs, unknown>
) => {
  const apiClient = useApiClient();
  const { data: session } = useAppSession();
  const { companyId, customerId, queryParams = {} } = options;
  const currentUserId = session?.user?._id || session?.user?.id;

  const fetcherFn = async () => {
    return (
      await apiClient.customerUser.getCustomerBookingsHistory({
        companyId,
        customerId,
        queryParams,
      })
    ).data;
  };

  return useQuery({
    queryKey: [
      "customer_bookings",
      "authenticated",
      currentUserId,
      companyId,
      customerId,
      ...Object.values(queryParams),
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: Boolean(companyId && customerId && session?.accessToken && currentUserId),
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
