import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import BusinessSignInScene from "@/scenes/auth/business/signIn";
import { authOptions } from "@/lib/auth";
import { getSafeCallbackUrl } from "@/utils/auth";

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

const SignInPage = async ({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { callbackUrl?: string };
}) => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect(getSafeCallbackUrl(searchParams.callbackUrl, params.locale));
  }

  return <BusinessSignInScene />;
};

export default SignInPage;
