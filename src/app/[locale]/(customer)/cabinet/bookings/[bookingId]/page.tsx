import CustomerBookingDetailScene from "@/scenes/customerCabinet/BookingDetail";

export default function CustomerBookingDetailPage({
  params,
}: {
  params: { bookingId: string };
}) {
  return <CustomerBookingDetailScene bookingId={params.bookingId} />;
}
