import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import TermsOfServiceScene from "@/scenes/landing/terms-of-service";

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
    title: t("pages.terms.title"),
    description: t("pages.terms.description"),
  };
}

const TermsOfServicePage = () => {
  return <TermsOfServiceScene />;
};

export default TermsOfServicePage;
