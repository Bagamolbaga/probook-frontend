import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import {
  TGetCompanyShiftsForDateRangeArgs,
  TCreateCustomShiftForDateArgs,
  TUpdateCustomShiftForDateArgs,
  TGetCompanyShiftsForDateRangeRes,
} from "@/api/entities/company";
import {
  TCreateCompanyShift,
  TDeleteCompanyShift,
  TGetCompanyShiftById,
  TGetCompanyShifts,
  TUpdateCompanyShift,
} from "@/api/entities/company/shift";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

type CustomUseQueryOptions<TRes> = Omit<UseQueryOptions<TRes, Error>, "queryKey">;

type Options<TArgs, TRes> = {
  queryOptions?: CustomUseQueryOptions<TRes>;
} & TArgs;

export const useGetCompanyShiftsForDateRangeQuery = (
  options: Options<
    TGetCompanyShiftsForDateRangeArgs,
    TGetResponse<TGetCompanyShiftsForDateRangeRes[]>
  >
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, ...args } = options;

  const fetcherFn = async () => {
    // if (session?.user?.is_superuser) return (await apiClient.admin.shifts.getCompanyShiftsForDateRange({ companyId, ...args }))
    //   .data;

    return (await apiClient.company.getCompanyShiftsForDateRange({ companyId, ...args }))
      .data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["shifts", companyId, args.start.getTime(), args.end.getTime()],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
  });
};

export const useCreateCompanyShiftForDateQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: Omit<TCreateCustomShiftForDateArgs, "companyId">) => {
      return apiClient.company.createCustomShiftForDate({ companyId, ...input });
    },
    onSuccess: (_, shift) => {
      void queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", companyId],
      });
      return queryClient.invalidateQueries({
        queryKey: ["shifts", companyId],
      });
    },
  });
};

export const useUpdateCompanyShiftForDateQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: Omit<TUpdateCustomShiftForDateArgs, "companyId">) => {
      // if (session?.user?.is_superuser) return apiClient.admin.shifts.updateCustomShiftForDate({companyId, ...input});

      return apiClient.company.updateCustomShiftForDate({ companyId, ...input });
    },
    onSuccess: (_, shift) => {
      void queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", companyId],
      });
      return queryClient.invalidateQueries({
        queryKey: ["shifts", companyId],
      });
    },
  });
};

export const useGetCompanyShiftsQuery = (
  options: Options<TGetCompanyShifts, TGetResponse<TShift[]>>
) => {
  const apiClient = useApiClient();
  const { queryOptions, queryParams, companyId } = options;

  const fetcherFn = async () => {
    // if (session?.user?.is_superuser)
      // return (await apiClient.admin.shifts.getCompanyShifts({ companyId })).data;

    return (await apiClient.shifts.getCompanyShifts({ companyId })).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: [
      "operation_hour_shifts",
      companyId,
      queryParams?.limit,
      queryParams?.offset,
      queryParams?.ordering,
    ],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
  });
};

export const useGetCompanyShiftByIdQuery = (
  options: Options<Omit<TGetCompanyShiftById, "companyId">, TShift>
) => {
  const apiClient = useApiClient();

  const { companyId } = useGetCompanyId();
  const { queryOptions, ...args } = options;

  const fetcherFn = async () => {
    return (await apiClient.shifts.getCompanyShiftById({ companyId, ...args })).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["operation_hour_shifts", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: !!companyId,
  });
};

export const useCreateCompanyShiftQuery = () => {
  const apiClient = useApiClient();

  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: TCreateCompanyShift) => {
      return apiClient.shifts.createCompanyShift(input);
    },
    onSuccess: (res, shift) => {
      void queryClient.invalidateQueries({
        queryKey: ["shifts", companyId],
      });
      return queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", companyId],
      });
    },
  });
};

export const useUpdateCompanyShiftQuery = () => {
  const apiClient = useApiClient();

  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: TUpdateCompanyShift) => {
      return apiClient.shifts.updateCompanyShift(input);
    },
    onSuccess: (res, shift) => {
      void queryClient.invalidateQueries({
        queryKey: ["shifts", companyId],
      });
      return queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", companyId],
      });
    },
  });
};

export const useDeleteCompanyShiftQuery = () => {
  const apiClient = useApiClient();

  const queryClient = useQueryClient();
  const { companyId } = useGetCompanyId();

  return useMutation({
    mutationFn: (input: TDeleteCompanyShift) => {
      return apiClient.shifts.deleteCompanyShift(input);
    },
    onSuccess: (res, shift) => {
      void queryClient.invalidateQueries({
        queryKey: ["shifts", companyId],
      });
      return queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", companyId],
      });
    },
  });
};
