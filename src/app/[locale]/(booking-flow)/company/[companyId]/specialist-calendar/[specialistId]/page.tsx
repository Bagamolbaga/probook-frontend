import { notFound } from "next/navigation";
import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SpecialistCalendarScene from "@/scenes/company/specialistCalendar";
import { redirect } from "@/i18n";

export async function generateMetadata({
  params,
}: {
  params: { locale: string; companyId: string; specialistId: string };
}): Promise<Metadata> {
  const t = await getTranslations({
    locale: params.locale,
    namespace: "metadata",
  });

  const companyDetailsRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/company/specialist/${params.specialistId}/`,
    {
      method: "GET",
    }
  );

  const specialist: TSpecialist = (await companyDetailsRes.json()) as TSpecialist;

  return {
    title: `${specialist?.full_name} | Bowers`,
    description: `${specialist?.full_name} | Bowers`,
  };
}

const SpecialistCalendarPage = async ({
  params: { companyId, specialistId },
  searchParams,
}: {
  params: { companyId: string; specialistId: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;

  if (isNaN(Number(specialistId)) || !params.storeId || isNaN(Number(params.storeId))) {
    redirect("/search");
  }

  return (
    <SpecialistCalendarScene
      companyId={Number(params.storeId)}
      specialistId={Number(specialistId)}
    />
  );
};

export default SpecialistCalendarPage;
