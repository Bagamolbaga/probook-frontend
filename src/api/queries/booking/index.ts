import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import {
  TCreateBookingArgs,
  TDeleteBookingsArgs,
  TGetBookingAvailabilityArgs,
  TGetBookingArgs,
  TBookingAvailability,
  TUpdateApiBookingArgs,
  TUpdateBookingByAdminArgs,
  TUpdateBookingByTokenArgs,
} from "@/api/entities/booking";
import {
  TGetCompanySalesAndCustomerStat,
  TGetCompanySalesAndCustomerStatRes,
} from "@/api/entities/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

type TGetBookings<T = unknown> = {
  companyId: string | number;
  queryParams?: T & {
    start_date: Date;
    end_date: Date;
    offset?: string;
    limit?: string;
  };
};

type TGetAllBookings = {
  companyId: string;
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

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetBookingsQuery = (
  options: Options<TGetBookings, TGetResponse<TApiBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    return (
      await apiClient.bookings.getBookings({
        companyId,
        queryParams,
      })
    ).data;
  };

  return useQuery({
    queryKey: [
      "bookings",
      companyId,
      queryParams?.start_date?.getTime(),
      queryParams?.end_date?.getTime(),
      queryParams?.offset,
      queryParams?.limit,
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
    ...queryOptions,
  });
};

export const useGetBookingsMinQuery = (
  options: Options<
    TGetBookings<{ specialist_id?: string }>,
    TGetResponse<TApiBookingMin[]>
  >
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    const res = (await apiClient.bookings.getBookingsMin({ companyId, queryParams }))
      .data;

    return res;
  };

  return useQuery({
    queryKey: [
      "bookings_min",
      companyId,
      queryParams?.specialist_id,
      queryParams?.start_date.getTime(),
      queryParams?.end_date.getTime(),
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
    ...queryOptions,
  });
};

export const useGetBookingQuery = (options: Options<TGetBookingArgs, TApiBooking>) => {
  const apiClient = useApiClient();
  const { companyId, bookingId, queryOptions } = options;

  return useQuery({
    queryKey: ["booking", companyId, bookingId],
    queryFn: async () =>
      (await apiClient.bookings.getBooking({ companyId, bookingId })).data,
    staleTime: 1000 * 60,
    enabled: Boolean(companyId && bookingId),
    ...queryOptions,
  });
};

export const useGetBookingAvailabilityQuery = (
  options: Options<TGetBookingAvailabilityArgs, TBookingAvailability>
) => {
  const apiClient = useApiClient();
  const { companyId, bookingId, specialistId, date, queryOptions } = options;

  return useQuery({
    queryKey: ["booking_availability", companyId, specialistId, date, bookingId],
    queryFn: async () =>
      (
        await apiClient.bookings.getBookingAvailability({
          companyId,
          bookingId,
          specialistId,
          date,
        })
      ).data,
    staleTime: 1000 * 30,
    enabled: Boolean(companyId && bookingId && specialistId && date),
    ...queryOptions,
  });
};

export const useGetAllBookingsQuery = (
  options: Options<TGetAllBookings, TGetResponse<TApiBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const d = useGetBookingsQuery({
    companyId,
    queryParams: {
      start_date: queryParams?.start_date,
      end_date: queryParams?.end_date,
      limit: queryParams.limit.toString(),
      offset: queryParams.offset.toString(),
    },
  });

  const fetcherFn = async ({ limit, offset }: { limit: number; offset: number }) => {
    const bookingsResponse = await apiClient.bookings.getBookings({
      companyId,
      queryParams: {
        start_date: queryParams.start_date,
        end_date: queryParams.end_date,
        limit: limit.toString(),
        offset: offset.toString(),
      },
    });
    return bookingsResponse.data;
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
      ],
      queryFn: () =>
        fetcherFn({
          limit: queryParams.limit,
          offset: queryParams.offset + queryParams.limit * idx,
        }),
      staleTime: 1000 * 60,
      enabled: Boolean(companyId),
      ...queryOptions,
    })),
  });
};

export const useGetBookingByTokenQuery = (
  options: Options<TGetBookingByToken, TBooking>
): UseQueryResult<TBooking | null, Error> => {
  const apiClient = useApiClient();
  const { token } = options;

  const fetcherFn = async () => {
    return (await apiClient.bookings.getBookingByToken({ token: token! }))?.data;
  };

  return useQuery({
    queryKey: ["booking", token],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!token,
    // ...queryOptions,
  });
};

export const useCreateBookingQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateBookingArgs) => {
      return apiClient.bookings.createBooking(input);
    },
    onSuccess: (_, args) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["all_bookings", args.companyId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["bookings", args.companyId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["bookings_min", args.companyId],
        }),
      ]),
  });
};

export const useUpdateApiBookingQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateApiBookingArgs) => apiClient.bookings.updateBooking(input),
    onSuccess: async (response, args) => {
      queryClient.setQueryData(
        ["booking", args.companyId, args.bookingId],
        response.data
      );

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["bookings", args.companyId] }),
        queryClient.invalidateQueries({
          queryKey: ["bookings_min", args.companyId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["all_bookings", args.companyId],
        }),
      ]);
    },
  });
};

export const useUpdateBookingByTokenQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateBookingByTokenArgs) => {
      return apiClient.bookings.updateBookingByToken(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["booking", args.token],
      });
    },
  });
};

export const useUpdateBookingByAdminQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateBookingByAdminArgs) => {
      return apiClient.bookings.updateBookingByAdmin(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["booking", args.data.bookingId],
      });
    },
  });
};

export const useDeleteBookingQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteBookingsArgs) => {
      return apiClient.bookings.deleteBooking(input);
    },
    onSuccess: (_, args) => {
      return queryClient.invalidateQueries({
        queryKey: ["bookings", args.companyId],
      });
    },
  });
};

export const useGetCompanySalesAndCustomerStatQuery = (
  options: Options<
    TGetCompanySalesAndCustomerStat,
    TGetCompanySalesAndCustomerStatRes | null
  >
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
    enabled: Boolean(companyId),
    ...queryOptions,
  });
};
