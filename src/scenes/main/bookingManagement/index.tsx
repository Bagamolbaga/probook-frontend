"use client";

import { useTranslations } from "next-intl";
import TimeLineCalendar from "./components/timeLineCalendar";
import MainPagesTitle from "@/components/mainPagesTitle";
import { useMemo, useState } from "react";
import Tabs from "@/components/ui/tab";
import Calendar from "./components/calendar";

const TABS = [
  {
    id: "availability",
    text: "Availability",
  },
  {
    id: "calendar",
    text: "Calendar",
  },
] as const;

type Tab = (typeof TABS)[number];

const BookingManagementScene = () => {
  const t = useTranslations();

  const [activeTab, setActiveTab] = useState<Tab>(TABS[0]);

  const content = useMemo(() => {
    switch (activeTab.id) {
      case "calendar":
        return <Calendar />;

      default:
        return <TimeLineCalendar />;
    }
  }, [activeTab]);

  return (
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline sm:px-5 sm:py-6 sm:pb-[64px]">
      <div className="pb-6 flex justify-between items-center">
        <MainPagesTitle text={t("bookingManagement.title")} />
        <div className="flex items-center sm:w-full sm:mt-3">
          <Tabs
            activelTabId={activeTab.id}
            tabs={TABS as unknown as Tab[]}
            onSelect={(t) => setActiveTab(t as Tab)}
          />
        </div>
      </div>
      <div className="w-full min-h-[calc(100vh-62px-52px)] flex sm:min-h-[calc(100vh-62px-86px)] sm:pb-5">
        {/* <SuperAdminChecker> */}
        {/* <SubscriptionChecker> */}
        {content}
        {/* </SubscriptionChecker> */}
        {/* </SuperAdminChecker> */}
      </div>
    </div>
  );
};

export default BookingManagementScene;
