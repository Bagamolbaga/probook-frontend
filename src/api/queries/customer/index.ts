import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useApiClient } from "@/src/api/context";
import type { CustomerBookingsView, ReviewHighlight } from "@/src/api/entities/customer";
import { useAppSession } from "@/src/hooks/useAppSession";

const customerKey = (userId: string | number | undefined) =>
  ["customer", userId] as const;

export const useCustomerProfileQuery = () => {
  const api = useApiClient();
  const { data: session } = useAppSession();
  return useQuery({
    queryKey: [...customerKey(session?.user?.id), "profile"],
    queryFn: async () => (await api.customer.getProfile()).data,
    enabled: Boolean(session?.user?.id),
  });
};

export const useCustomerDashboardQuery = () => {
  const api = useApiClient();
  const { data: session } = useAppSession();
  return useQuery({
    queryKey: [...customerKey(session?.user?.id), "dashboard"],
    queryFn: async () => (await api.customer.getDashboard()).data,
    enabled: Boolean(session?.user?.id),
  });
};

export const useCustomerBookingsQuery = (
  view: CustomerBookingsView,
  companyId?: string
) => {
  const api = useApiClient();
  const { data: session } = useAppSession();
  return useInfiniteQuery({
    queryKey: [...customerKey(session?.user?.id), "bookings", view, companyId || "all"],
    queryFn: async ({ pageParam }) =>
      (
        await api.customer.getBookings({
          view,
          companyId,
          cursor: pageParam || undefined,
          limit: 20,
        })
      ).data,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    enabled: Boolean(session?.user?.id),
  });
};

export const useCustomerBookingQuery = (bookingId: string) => {
  const api = useApiClient();
  const { data: session } = useAppSession();
  return useQuery({
    queryKey: [...customerKey(session?.user?.id), "booking", bookingId],
    queryFn: async () => (await api.customer.getBooking(bookingId)).data,
    enabled: Boolean(session?.user?.id && bookingId),
    retry: false,
  });
};

export const useCustomerBookingReviewQuery = (bookingId: string) => {
  const api = useApiClient();
  const { data: session } = useAppSession();
  return useQuery({
    queryKey: [...customerKey(session?.user?.id), "booking", bookingId, "review"],
    queryFn: async () => (await api.customer.getBookingReview(bookingId)).data,
    enabled: Boolean(session?.user?.id && bookingId),
    retry: false,
  });
};

export const useUpdateCustomerProfileMutation = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const session = useAppSession();
  return useMutation({
    mutationFn: (data: { firstName: string; lastName: string; phone?: string }) =>
      api.customer.updateProfile(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKey(session.data?.user?.id) }),
        session.update(),
      ]);
    },
  });
};

export const useUpdateCustomerAvatarMutation = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const session = useAppSession();
  return useMutation({
    mutationFn: (avatar: string) => api.customer.updateAvatar(avatar),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: customerKey(session.data?.user?.id) }),
        session.update(),
      ]);
    },
  });
};

const useBookingMutationInvalidation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useAppSession();
  return async (bookingId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: [...customerKey(session?.user?.id), "dashboard"],
      }),
      queryClient.invalidateQueries({
        queryKey: [...customerKey(session?.user?.id), "bookings"],
      }),
      queryClient.invalidateQueries({
        queryKey: [...customerKey(session?.user?.id), "booking", bookingId],
      }),
    ]);
  };
};

export const useCancelCustomerBookingMutation = () => {
  const api = useApiClient();
  const invalidate = useBookingMutationInvalidation();
  return useMutation({
    mutationFn: (bookingId: string) => api.customer.cancelBooking(bookingId),
    onSuccess: (_, bookingId) => invalidate(bookingId),
  });
};

export const useRescheduleCustomerBookingMutation = () => {
  const api = useApiClient();
  const invalidate = useBookingMutationInvalidation();
  return useMutation({
    mutationFn: (input: { bookingId: string; date: string; slots: number[] }) =>
      api.customer.rescheduleBooking(input.bookingId, {
        date: input.date,
        slots: input.slots,
      }),
    onSuccess: (_, input) => invalidate(input.bookingId),
  });
};

export const useCreateCustomerBookingReviewMutation = () => {
  const api = useApiClient();
  const invalidate = useBookingMutationInvalidation();
  return useMutation({
    mutationFn: ({
      bookingId,
      ...data
    }: {
      bookingId: string;
      rating: number;
      highlights?: ReviewHighlight[];
      comment?: string;
      recommended?: boolean;
    }) => api.customer.createReview(bookingId, data),
    onSuccess: async (_, input) => {
      await invalidate(input.bookingId);
    },
  });
};
