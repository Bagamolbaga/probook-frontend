import CompanyDetailsScene from "@/scenes/bookingFlow/companyDetails";
import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n";
import BookingFlowLayout from "@/components/layouts/booking-flow";
import { BaseHeader } from "@/components/headers/landing";
import LandingFooter from "@/components/footers/landing";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { locale: string; companyId: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  try {
    const { storeId } = await searchParams;

    const companyDetailsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/companies/${(storeId as string) || ""}`,
      {
        method: "GET",
      }
    );

    const companyDetails: TCompany = (await companyDetailsRes.json()) as TCompany;

    return {
      title: `${companyDetails?.name} | Bowers`,
      description: `${companyDetails?.address1} | Bowers`,
    };
  } catch (error) {
    return {
      title: `Bowers`,
      description: `Bowers`,
    };
  }
}

const CompanyDetailsPage = async ({
  params: { companyId },
  searchParams,
}: {
  params: { companyId: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { storeId } = await searchParams;

  if (!storeId) {
    redirect("/search");
  }

  return (
    <BookingFlowLayout
      header={<BaseHeader color="white" withLanguageSwitcher />}
      footer={<LandingFooter />}
    >
      <CompanyDetailsScene companyId={storeId as string} />
    </BookingFlowLayout>
  );
};

export default CompanyDetailsPage;
