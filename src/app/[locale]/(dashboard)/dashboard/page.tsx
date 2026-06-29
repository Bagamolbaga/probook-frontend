import DashboardScene from "@/scenes/main/dashboard";
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
    title: t("pages.dashboard.default.title"),
    description: t("pages.dashboard.default.description"),
  };
}

const DashboardPage = () => {
  return <DashboardScene />;
};

export default DashboardPage;
