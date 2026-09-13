import { QueryClient } from "@tanstack/react-query";

export const invalidateCompanyBookingQueries = (
  queryClient: QueryClient,
  companyId: string | number,
  bookingId?: string | number
) => {
  const invalidations = [
    queryClient.invalidateQueries({ queryKey: ["all_bookings", companyId] }),
    queryClient.invalidateQueries({ queryKey: ["bookings", companyId] }),
    queryClient.invalidateQueries({ queryKey: ["bookings_min", companyId] }),
    queryClient.invalidateQueries({ queryKey: ["booking_availability", companyId] }),
    queryClient.invalidateQueries({ queryKey: ["customers", companyId] }),
    queryClient.invalidateQueries({ queryKey: ["sales_and_customer_stat", companyId] }),
  ];

  if (bookingId) {
    invalidations.push(
      queryClient.invalidateQueries({ queryKey: ["booking", companyId, bookingId] })
    );
  }

  return Promise.all(invalidations);
};
