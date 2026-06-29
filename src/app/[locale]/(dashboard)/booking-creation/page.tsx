import BookingCreationScene from "@/scenes/main/bookingCreation";
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
    title: t("pages.dashboard.booking_creation.title"),
    description: t("pages.dashboard.booking_creation.description"),
  };
}

const BookingCreationPage = () => {
  return <BookingCreationScene />;
};

export default BookingCreationPage;
