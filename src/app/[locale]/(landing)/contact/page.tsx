import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactScene from "@/scenes/landing/contact";

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
    title: t("pages.contact.title"),
    description: t("pages.contact.description"),
  };
}

const ContactPage = () => {
  return <ContactScene />;
};

export default ContactPage;
