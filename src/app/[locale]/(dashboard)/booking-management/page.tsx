import BookingManagementScene from "@/scenes/main/bookingManagement";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata",
  });

  return {
    title: t("pages.dashboard.booking_management.title"),
    description: t("pages.dashboard.booking_management.description"),
  };
}

const BookingManagementPage = () => {
  return <BookingManagementScene />;
};

export default BookingManagementPage;
