import BookingFlowBookingCreation from "@/scenes/bookingFlow/bookingCreation";
import React from "react";
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
    title: t("pages.booking_flow.booking_creation.title"),
    description: t("pages.booking_flow.booking_creation.description"),
  };
}

const BookingCreationPage = async ({
  params: { companyId },
  searchParams,
}: {
  params: { companyId: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  if (!params.storeId) {
    redirect("/search");
  }

  return <BookingFlowBookingCreation companyId={params.storeId as string} />;
};

export default BookingCreationPage;
