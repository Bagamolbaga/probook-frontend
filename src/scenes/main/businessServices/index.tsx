"use client";

import BusinessServicesListTable from "./components/businessServicessListTable";
import { useTranslations } from "next-intl";
import SubscriptionChecker from "@/components/subscriptionChecker";
import MainPagesTitle from "@/components/mainPagesTitle";
import SuperAdminChecker from "@/components/superAdminChecker";

const BusinessServicesScene = () => {
  const t = useTranslations();

  return (
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline sm:px-5 sm:py-6 sm:pb-[64px]">
      <div className="pb-6 flex justify-between items-center">
        <MainPagesTitle text={t("businessServices.title")} />
      </div>
      <div className="w-full min-h-[calc(100vh-62px-52px)] flex sm:min-h-[calc(100vh-62px-86px)] sm:pb-5">
        {/* <SuperAdminChecker> */}
          {/* <SubscriptionChecker> */}
            <BusinessServicesListTable />
          {/* </SubscriptionChecker> */}
        {/* </SuperAdminChecker> */}
      </div>
    </div>
  );
};

export default BusinessServicesScene;
