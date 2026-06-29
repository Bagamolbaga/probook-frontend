import SearchPageScene from "@/scenes/landing/search";
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
    title: t("pages.search.title"),
    description: t("pages.search.description"),
  };
}

const SearchPage = () => {
  return <SearchPageScene />;
};

export default SearchPage;
