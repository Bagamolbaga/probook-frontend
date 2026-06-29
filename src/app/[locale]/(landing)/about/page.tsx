import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AboutScene from "@/scenes/landing/about";
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
    title: t("pages.about.title"),
    description: t("pages.about.description"),
  };
}

const AboutPage = () => {
  redirect("/")
  return <AboutScene />;
};

export default AboutPage;
