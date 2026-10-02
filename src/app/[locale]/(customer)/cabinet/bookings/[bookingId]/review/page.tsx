import CustomerBookingReviewScene from "@/src/scenes/customerCabinet/BookingReview";

export default function CustomerBookingReviewPage({
  params,
}: {
  params: { bookingId: string };
}) {
  return <CustomerBookingReviewScene bookingId={params.bookingId} />;
}
