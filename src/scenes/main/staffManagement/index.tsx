"use client";

import StaffListTable from "./components/staffListTable";
import ShiftManagement from "./components/shiftManagement";
import Tabs from "@/components/ui/tab";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import OperationHours from "./components/operationHours";
import SubscriptionChecker from "@/components/subscriptionChecker";
import MainPagesTitle from "@/components/mainPagesTitle";
import SuperAdminChecker from "@/components/superAdminChecker";

const TABS = [
  {
    id: "staff_list",
    text: "Staff list",
  },
  {
    id: "shift_management",
    text: "Shift management",
  },
  {
    id: "operation_hours",
    text: "Operation hours",
  },
] as const;

type Tab = (typeof TABS)[number];

const StaffManagementScene = () => {
  const t = useTranslations();

  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "staff_list":
        return <StaffListTable />;

      case "operation_hours":
        return <OperationHours />;

      default:
        return <ShiftManagement />;
    }
  }, [activeTab]);

  const TABS_i18n = useMemo(
    () => TABS.map((i) => ({ ...i, text: t(`staffManagement.tabs.${i.id}` as any) })),
    []
  );

  return (
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline sm:px-5 sm:py-6 sm:pb-[64px]">
      <div className="pb-6 flex justify-between items-center sm:flex-col sm:items-start">
        <MainPagesTitle text={t("staffManagement.title")} />
        <div className="flex items-center sm:w-full sm:mt-3">
          <Tabs
            activelTabId={activeTab.id}
            tabs={TABS_i18n}
            onSelect={(t) => setActiveTab(t as Tab)}
          />
        </div>
      </div>
      <div className="w-full min-h-[calc(100vh-62px-52px)] flex sm:min-h-[calc(100vh-62px-128px)] sm:pb-5">
        {/* <SuperAdminChecker> */}
        {/* <SubscriptionChecker> */}
        {content}

        {/* </SubscriptionChecker> */}
        {/* </SuperAdminChecker> */}
      </div>
    </div>
  );
};

export default StaffManagementScene;
