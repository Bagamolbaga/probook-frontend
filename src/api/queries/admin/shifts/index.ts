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
} from "@/api/entities/admin/shifts";
import {
  TCreateCompanyShift,
  TDeleteCompanyShift,
  TGetCompanyShiftById,
  TGetCompanyShifts,
  TUpdateCompanyShift,
} from "@/api/entities/admin/shifts";

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
    return (await apiClient.admin.shifts.getCompanyShiftsForDateRange({companyId, ...args})).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["shifts", companyId, args.start.getTime(), args.end.getTime()],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};

export const useCreateCompanyShiftForDateQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCustomShiftForDateArgs) => {
      return apiClient.admin.shifts.createCustomShiftForDate(input);
    },
    onSuccess: (_, shift) => {
      return queryClient.invalidateQueries({
        queryKey: ["shifts", shift.companyId],
      });
    },
  });
};

export const useUpdateCompanyShiftForDateQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateCustomShiftForDateArgs) => {
      return apiClient.admin.shifts.updateCustomShiftForDate(input);
    },
    onSuccess: (_, shift) => {
      return queryClient.invalidateQueries({
        queryKey: ["shifts", shift.companyId],
      });
    },
  });
};

export const useGetCompanyShiftsQuery = (
  options: Options<TGetCompanyShifts, TGetResponse<TShift[]>>
) => {
  const apiClient = useApiClient();
  const {queryOptions, companyId} = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.shifts.getCompanyShifts({companyId})).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["operation_hour_shifts", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};

export const useGetCompanyShiftByIdQuery = (
  options: Options<TGetCompanyShiftById, TShift>
) => {
  const apiClient = useApiClient();
  const { queryOptions, companyId, ...args } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.shifts.getCompanyShiftById({companyId, ...args})).data;
  };

  return useQuery({
    ...queryOptions,
    queryKey: ["operation_hour_shifts", companyId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    enabled: companyId > 0
  });
};

export const useCreateCompanyShiftQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateCompanyShift) => {
      return apiClient.admin.shifts.createCompanyShift(input);
    },
    onSuccess: (res, shift) => {
      void queryClient.invalidateQueries({
        queryKey: ["shifts", shift.companyId],
      });
      return queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", shift.companyId],
      });
    },
  });
};

// export const useUpdateCompanyShiftQuery = () => {
//   const apiClient = useApiClient();
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (input: TUpdateCompanyShift) => {
//       return apiClient.admin.shifts.updateCompanyShift(input);
//     },
//     onSuccess: (res, shift) => {
//       return queryClient.invalidateQueries({
//         queryKey: ["operation_hour_shifts", res.data.id],
//       });
//     },
//   });
// };

export const useDeleteCompanyShiftQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteCompanyShift) => {
      return apiClient.admin.shifts.deleteCompanyShift(input);
    },
    onSuccess: (res, shift) => {
      return queryClient.invalidateQueries({
        queryKey: ["operation_hour_shifts", shift.companyId],
      });
    },
  });
};
