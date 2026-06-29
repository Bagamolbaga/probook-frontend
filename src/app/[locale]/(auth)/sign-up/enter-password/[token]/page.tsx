import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SignUpEnterPasswordScene from "@/scenes/auth/business/signUp/EnterPassword";

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

const SignUpEnterPasswordPage = ({
  params: { token },
}: {
  params: { token: string };
}) => {
  return <SignUpEnterPasswordScene token={token} variant="SIGN_UP" />;
};

export default SignUpEnterPasswordPage;
