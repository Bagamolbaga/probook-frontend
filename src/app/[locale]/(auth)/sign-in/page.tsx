import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BusinessSignInScene from "@/scenes/auth/business/signIn";
import { authOptions } from "@/lib/auth";

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
    title: t("pages.signIn.title"),
    description: t("pages.signIn.description"),
  };
}

const SignInPage = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return <BusinessSignInScene />;
};

export default SignInPage;
