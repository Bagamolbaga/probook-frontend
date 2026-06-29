import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import RecoveryPasswordScene from "@/scenes/auth/business/recoveryPassword";

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
    title: t("pages.recoveryPassword.title"),
    description: t("pages.recoveryPassword.description"),
  };
}

const RecoveryPasswordPage = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return <RecoveryPasswordScene />;
};

export default RecoveryPasswordPage;
