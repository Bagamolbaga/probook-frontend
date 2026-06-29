import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import PrivacyPolicyScene from "@/scenes/landing/privacy-policy";

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
    title: t("pages.privacy_policy.title"),
    description: t("pages.privacy_policy.description"),
  };
}

const PrivacyPolicyPage = () => {
  return <PrivacyPolicyScene />;
};

export default PrivacyPolicyPage;
