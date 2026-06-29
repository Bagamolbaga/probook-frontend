import StaffManagementScene from "@/scenes/main/staffManagement";
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
    title: t("pages.dashboard.staff_management.title"),
    description: t("pages.dashboard.staff_management.description"),
  };
}

const StaffManagementPage = () => {
  return <StaffManagementScene />;
};

export default StaffManagementPage;
