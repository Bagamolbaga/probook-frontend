import BookingConfirmationScene from "@/scenes/bookingFlow/bookingConfirmation";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n";

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
    title: t("pages.booking_flow.booking_confirmation.title"),
    description: t("pages.booking_flow.booking_confirmation.description"),
  };
}

const BookingConfirmationPage = async ({
  params: { companyId, token },
  searchParams,
}: {
  params: { companyId: string; token: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  if (!token.length) {
    redirect("/search");
  }

  return <BookingConfirmationScene companyId={Number(params.storeId)} token={token} />;
};

export default BookingConfirmationPage;
