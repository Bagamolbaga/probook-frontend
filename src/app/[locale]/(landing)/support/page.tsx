import { Metadata } from "next";
import { getTranslations, redirect } from "@/i18n";
import SupportPageScene from "@/scenes/support";
import { CATEGORIES } from "@/constants/supportPageData";

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
    title: t("pages.support.title"),
    description: t("pages.support.description"),
  };
}

const SupportPage = ({
  searchParams,
}: {
  params: { locale: string };
  searchParams: Record<string, string>;
}) => {
  if (
    !searchParams["category"] ||
    !CATEGORIES.find((c) => c.id === searchParams["category"])
  ) {
    redirect(
      `/support?category=personal${searchParams["search"] ? `&search=${searchParams["search"]}` : ""}`
    );
  }

  return <SupportPageScene />;
};

export default SupportPage;
