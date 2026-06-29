"use client";

import { usePathname } from "@/i18n";
import { useMemo } from "react";
import { AccountScene, AccountHeader } from "./scenes/account";
import { DefaultHeader } from "./scenes/default";
import { UpcomingEvents } from "./scenes/upcomingEvents";
import { DashboardStatisticScene } from "./scenes/dashboardStatistic";

const PATTERNS = {
  account: /^\/account\.*/,
  dashboard: /^\/dashboard\.*/,
};

const SidebarRightPanel = () => {
  const pathname = usePathname();

  const content = useMemo(() => {
    switch (true) {
      case PATTERNS.account.test(pathname):
        return {
          header: <DefaultHeader />,
          content: <DashboardStatisticScene />,
        };

      case PATTERNS.dashboard.test(pathname):
        return {
          header: <DefaultHeader />,
          content: <DashboardStatisticScene />,
        };

      default:
        return {
          header: <DefaultHeader />,
          content: <DashboardStatisticScene />,
        };
    }
  }, [pathname]);
  return (
    <div className="w-full h-full overflow-x-hidden">
      {content.header}
      <div className="h-fullExSidebarRightPanelHeader px-7 py-7">
        {content.content}
      </div>
    </div>
  );
};

export default SidebarRightPanel;
