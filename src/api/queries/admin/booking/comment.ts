import {
  UndefinedInitialDataOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApiClient } from "@/api/context";
import {
  TCreateBookingComment,
  TDeleteBookingComment,
  TGetBookingComments,
  TUpdateBookingComment,
} from "@/api/entities/admin/booking";

type Options<T> = T & {
  queryOptions?: UndefinedInitialDataOptions;
};

export const useGetBookingCommentsQuery = (options: Options<TGetBookingComments>) => {
  const apiClient = useApiClient();
  const { queryOptions, ...args } = options;

  const fetcherFn = async () => {
    return (await apiClient.admin.booking.getBookingComments(args)).data;
  };

  return useQuery({
    queryKey: ["comments", args.bookingId],
    queryFn: fetcherFn,
    staleTime: 1000 * 60,
    // ...queryOptions,
  });
};

export const useCreateBookingCommentQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TCreateBookingComment) => {
      return apiClient.admin.booking.createBookingComment(input);
    },
    onSuccess: (_, comment) => {
      return queryClient.invalidateQueries({
        queryKey: ["comments", comment.bookingId],
      });
    },
  });
};

export const useUpdateBookingCommentQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TUpdateBookingComment) => {
      return apiClient.admin.booking.updateBookingComment(input);
    },
    onSuccess: (_, comment) => {
      return queryClient.invalidateQueries({
        queryKey: ["comments", _.data.booking],
      });
    },
  });
};

export const useDeleteBookingCommentQuery = () => {
  const apiClient = useApiClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TDeleteBookingComment) => {
      return apiClient.admin.booking.deleteBookingComment(input);
    },
    onSuccess: (_, comment) => {
      return queryClient.invalidateQueries({
        queryKey: ["comments", comment.bookingId],
      });
    },
  });
};
