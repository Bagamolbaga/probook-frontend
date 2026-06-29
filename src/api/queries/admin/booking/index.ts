/* eslint-disable @typescript-eslint/no-unused-vars */
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

import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import {
  TCreateBookingArgs,
  TDeleteBookingsArgs,
  TUpdateBookingByAdminArgs,
  TUpdateBookingByTokenArgs,
} from "@/api/entities/admin/booking";
import { TGetCompanySalesAndCustomerStat } from "@/api/entities/company";
import { useGetCompanyServicesForAdminAppQuery } from "../services";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
};

type TGetBookings = {
  companyId: number;
  queryParams?: {
    start_date: Date;
    end_date: Date;
    offset?: string;
    limit?: string;
  };
};

type TGetAllBookings = {
  companyId: number;
  queryParams: {
    start_date: Date;
    end_date: Date;
    offset: number;
    limit: number;
  };
};

type TGetBookingByToken = {
  token?: string;
};

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options2<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetBookingsForAdminApp = (
  options: Options2<TGetBookings, TGetResponse<TBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const servicesResult = useGetCompanyServicesForAdminAppQuery({
    companyId,
    queryParams: {
      offset: "0",
      limit: "1000",
    },
  });

  const fetcherFn = async () => {
    const bookingsResponse = await apiClient.admin.booking.getBookings({
      companyId,
      queryParams,
    });
    const bookings = bookingsResponse.data.results;

    if (!servicesResult.data) {
      return {
        ...bookingsResponse.data,
        results: [],
      };
    }

    const servicesMap = new Map<number, TService>();
    servicesResult.data.results.forEach((service) => {
      servicesMap.set(service.id, service);
    });

    const data = bookings.map((booking) => {
      const enrichedServices = booking.services
        .map(({ service_id, service_option_id }) => {
          const service = servicesMap.get(service_id);
          if (!service) return null;

          const option = service.options.find((opt) => opt.id === service_option_id);
          if (!option) return null;

          return {
            service,
            service_option: option,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);

      return {
        ...booking,
        services: enrichedServices,
      };
    });

    return {
      ...bookingsResponse.data,
      results: data,
    };
  };

  return useQuery({
    queryKey: [
      "bookings",
      companyId,
      queryParams?.start_date?.getTime(),
      queryParams?.end_date?.getTime(),
      servicesResult.dataUpdatedAt,
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0 && servicesResult.isSuccess,
    ...queryOptions,
  });
};

export const useGetAllBookingsForAdminApp = (
  options: Options2<TGetAllBookings, TGetResponse<TBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const servicesResult = useGetCompanyServicesForAdminAppQuery({
    companyId,
    queryParams: {
      offset: "0",
      limit: "1000",
    },
  });

  const d: any = useGetBookingsForAdminApp({
    companyId,
    queryParams: {
      start_date: queryParams?.start_date,
      end_date: queryParams?.end_date,
      limit: queryParams.limit.toString(),
      offset: queryParams.offset.toString(),
    },
  });

  const fetcherFn = async ({ limit, offset }: { limit: number; offset: number }) => {
    const bookingsResponse = await apiClient.admin.booking.getBookings({
      companyId,
      queryParams: {
        start_date: queryParams.start_date,
        end_date: queryParams.end_date,
        limit: limit.toString(),
        offset: offset.toString(),
      },
    });
    const bookings = bookingsResponse.data.results;

    if (!servicesResult.data)
      return {
        ...bookingsResponse.data,
        results: [],
      };

    const servicesMap = new Map<number, TService>();
    servicesResult.data.results.forEach((service) => {
      servicesMap.set(service.id, service);
    });

    const data = bookings.map((booking) => {
      const enrichedServices = booking.services
        .map(({ service_id, service_option_id }) => {
          const service = servicesMap.get(service_id);
          if (!service) return null;

          const option = service.options.find((opt) => opt.id === service_option_id);
          if (!option) return null;

          return {
            service,
            service_option: option,
          };
        })
        .filter((s): s is NonNullable<typeof s> => s !== null);

      return {
        ...booking,
        services: enrichedServices,
      };
    });

    return {
      ...bookingsResponse.data,
      results: data,
    };
  };

  return useQueries({
    queries: Array.from({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      length: d.data?.count ? Math.ceil(d.data.count / queryParams.limit) : 0,
    }).map((_, idx) => ({
      queryKey: [
        "all_bookings",
        companyId,
        queryParams.start_date.getTime(),
        queryParams.end_date.getTime(),
        queryParams.limit,
        queryParams.offset + queryParams.limit * idx,
        servicesResult.dataUpdatedAt,
      ],
      queryFn: () =>
        fetcherFn({
          limit: queryParams.limit,
          offset: queryParams.offset + queryParams.limit * idx,
        }),
      staleTime: 1000 * 60,
      enabled: companyId > 0 && servicesResult.isSuccess,
      // ...queryOptions,
    })),
  });
};

export const useGetBookingByTokenForAdminApp = (
  options: Options<TGetBookingByToken>
): UseQueryResult<TBooking | null, Error> => {
  const apiClient = useApiClient();
  const { token } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.booking.getBookingByToken({ token: token! }))?.data;
  };

  return useQuery({
    queryKey: ["booking", token],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!token,
    // ...queryOptions,
  });
};

export const useCreateBookingForAdminApp = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateBookingArgs) => {
      return apiClient.admin.booking.createBooking(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["bookings", args.companyId],
      });
    },
  });
};

export const useUpdateBookingByTokenForAdminApp = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateBookingByTokenArgs) => {
      return apiClient.admin.booking.updateBookingByToken(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["booking", args.token],
      });
    },
  });
};

export const useUpdateBookingByAdminForAdminApp = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateBookingByAdminArgs) => {
      return apiClient.admin.booking.updateBookingByAdmin(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["booking", args.data.bookingId],
      });
    },
  });
};

export const useDeleteBookingForAdminApp = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteBookingsArgs) => {
      return apiClient.admin.booking.deleteBooking(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["bookings", args.companyId],
      });
    },
  });
};

export const useGetCompanySalesAndCustomerStatForAdminApp = (
  options: Options<TGetCompanySalesAndCustomerStat>
) => {
  const apiClient = useApiClient();
  const { companyId } = useGetCompanyId();
  const { queryOptions, ...args } = options;

  const fetcherFn = async () => {
    if (args.companyId === -1) {
      return null;
    }

    return (await apiClient.company.getCompanySalesAndCustomerStat(args)).data;
  };

  return useQuery({
    queryKey: ["sales_and_customer_stat", args.companyId, args.startDate, args.endDate],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0,
    // ...queryOptions,
  });
};
