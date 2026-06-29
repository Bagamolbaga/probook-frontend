import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BusinessSignUpScene from "@/scenes/auth/business/signUp";
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
    title: t("pages.signUp.title"),
    description: t("pages.signUp.description"),
  };
}

const SignUpPage = () => {
  redirect("/sign-in")
  return null;
  
  return <BusinessSignUpScene />;
};

export default SignUpPage;
