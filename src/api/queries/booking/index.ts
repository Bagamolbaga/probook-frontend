import { getDefaultQueryOptions } from "./../defaultQueryOptions";
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
import {
  TCreateBookingArgs,
  TDeleteBookingsArgs,
  TUpdateBookingByAdminArgs,
  TUpdateBookingByTokenArgs,
} from "@/api/entities/booking";
import {
  TGetCompanySalesAndCustomerStat,
  TGetCompanySalesAndCustomerStatRes,
} from "@/api/entities/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { useGetCompanyServicesQuery } from "../company/services";

type TGetBookings<T = unknown> = {
  companyId: number;
  queryParams?: T & {
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

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetBookingsQuery = (
  options: Options<TGetBookings, TGetResponse<TBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  // const servicesResult = useGetCompanyServicesQuery({
  //   companyId,
  //   queryParams: {
  //     offset: "0",
  //     limit: "1000",
  //   },
  // });

  const fetcherFn = async () => {
    return (await apiClient.bookings.getBookings({
      companyId,
      queryParams,
    })).data;
    // const bookings = bookingsResponse.data.results;

    // if (!servicesResult.data){

    //   return {
    //     ...bookingsResponse.data,
    //     results: [],
    //   };
    // }

    // const servicesMap = new Map<string, TService>();
    // servicesResult.data.results.forEach((service) => {
    //   servicesMap.set(service._id, service);
    // });

    // const data = bookings.map((booking) => {
    //   const enrichedServices = booking.services
    //     .map(({ service_id, service_option_id }) => {
    //       const service = servicesMap.get(service_id);
    //       if (!service) return null;

    //       const option = service.options.find((opt) => opt.id === service_option_id);
    //       if (!option) return null;

    //       return {
    //         service,
    //         service_option: option,
    //       };
    //     })
    //     .filter((s): s is NonNullable<typeof s> => s !== null); 

    //   return {
    //     ...booking,
    //     services: enrichedServices,
    //   };
    // });

    // return {
    //   ...bookingsResponse.data,
    //   results: bookings,
    // };
  };

  return useQuery({
    queryKey: [
      "bookings",
      companyId,
      queryParams?.start_date?.getTime(),
      queryParams?.end_date?.getTime(),
      // servicesResult.dataUpdatedAt,
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
    ...queryOptions,
  });
};

export const useGetBookingsMinQuery = (
  options: Options<TGetBookings<{ specialist_id?: string }>, TGetResponse<TBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const fetcherFn = async () => {
    const res = (await apiClient.bookings.getBookingsMin({ companyId, queryParams }))
      .data;

    if (res.results) {
      res.results = res.results.map((b) => ({
        ...b,
        specialist:
          typeof b.specialist === "number"
            ? { id: b.specialist as unknown as number }
            : b.specialist,
      }));
    }

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
    // ...queryOptions,
  });
};

export const useGetAllBookingsQuery = (
  options: Options<TGetAllBookings, TGetResponse<TBooking[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, queryParams } = options;

  const servicesResult = useGetCompanyServicesQuery({
    companyId,
    queryParams: {
      offset: "0",
      limit: "1000",
    },
  });

  const d: any = useGetBookingsQuery({
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
    onSuccess: (_, args) => {
      void queryClient.invalidateQueries({
        queryKey: ["all_bookings", args.companyId],
      });

      return queryClient.invalidateQueries({
        queryKey: ["bookings", args.companyId],
      });
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
  options: Options<TGetCompanySalesAndCustomerStat, TGetCompanySalesAndCustomerStatRes>
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
