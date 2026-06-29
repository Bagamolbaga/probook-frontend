import { PropsWithChildren } from "react";
import AccountLayout from "@/components/layouts/main/Account";

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
    title: t("pages.dashboard.account.title"),
    description: t("pages.dashboard.account.description"),
  };
}

export default function AccountPageLayout({ children }: PropsWithChildren) {
  return <AccountLayout>{children}</AccountLayout>;
}
