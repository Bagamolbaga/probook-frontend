import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServicesScene from "@/scenes/landing/services";

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
    title: t("pages.services.title"),
    description: t("pages.services.description"),
  };
}

const ServicesPage = () => {
  return <ServicesScene />;
};

export default ServicesPage;
