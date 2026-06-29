import BookingManagementScene from "@/scenes/main/bookingManagement";

const BookingManagementPage = ({
  params: { token },
}: {
  params: { token?: string };
}) => {
  return <BookingManagementScene token={token} />;
};

export default BookingManagementPage;
