import BusinessServicesScene from "@/scenes/main/businessServices";
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
    title: t("pages.dashboard.business_services.title"),
    description: t("pages.dashboard.business_services.description"),
  };
}

const BusinessServicesPage = () => {
  return <BusinessServicesScene />;
};

export default BusinessServicesPage;
