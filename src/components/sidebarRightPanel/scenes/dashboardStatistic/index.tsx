import { useTranslations } from "next-intl";
import { useMemo } from "react";

import Button from "@/components/ui/button";
import StatisticWithLine from "@/components/ui/widgets/statisticWithLine";
import { useGetDashboardStatistic } from "@/hooks/useGetDashboardStatistic";

export const DashboardStatisticScene = () => {
  const t = useTranslations();

  const {
    getCompanySalesAndCustomerStatPrevQuery,
    getCompanySalesAndCustomerStatQuery,
    allBookings,
    selectedRange,
    setSelectedRange,
  } = useGetDashboardStatistic();

  const topWidgetsSubTitleprefix = useMemo(() => {
    if (selectedRange === "day") {
      return t("dashboard.day");
    }
    if (selectedRange === "week") {
      return t("dashboard.week");
    }
    if (selectedRange === "month") {
      return t("dashboard.year");
    }
  }, [selectedRange]);

  const getPercentDone = (prevValue: number, currValue: number) => {
    if (currValue >= prevValue) return 100;

    return Math.ceil((prevValue / 100) * currValue * 100);
  };

  return (
    <div className="h-full flex flex-col gap-3 overflow-x-hidden overflow-y-auto">
      <div className="w-full flex items-center gap-2">
        <Button
          variant={selectedRange === "day" ? "resting-active" : "resting"}
          className="py-2 px-3"
          onClick={() => setSelectedRange("day")}
        >
          {t("dashboard.day")}
        </Button>
        <Button
          variant={selectedRange === "week" ? "resting-active" : "resting"}
          className="py-2 px-3"
          onClick={() => setSelectedRange("week")}
        >
          {t("dashboard.week")}
        </Button>
        <Button
          variant={selectedRange === "month" ? "resting-active" : "resting"}
          className="py-2 px-3"
          onClick={() => setSelectedRange("month")}
        >
          {t("dashboard.month")}
        </Button>
      </div>
      <StatisticWithLine
        forSideBar
        title={t("dashboard.sales")}
        subTitle={`${topWidgetsSubTitleprefix} ${t("dashboard.comparison")}`}
        rightText={allBookings.reduce((acc, i) => (acc += i.services.length), 0) ?? ""}
        isLoading={getCompanySalesAndCustomerStatQuery.isPending}
        percentDone={getPercentDone(
          getCompanySalesAndCustomerStatPrevQuery.data?.sales_report.sales ?? 0,
          getCompanySalesAndCustomerStatQuery.data?.sales_report.sales ?? 0
        )}
        color="green"
      />
      <StatisticWithLine
        forSideBar
        title={t("dashboard.customer")}
        subTitle={`${topWidgetsSubTitleprefix} ${t("dashboard.comparison")}`}
        rightText={allBookings.length ?? ""}
        isLoading={getCompanySalesAndCustomerStatQuery.isPending}
        percentDone={getPercentDone(
          getCompanySalesAndCustomerStatPrevQuery.data?.sales_report.customers ?? 0,
          getCompanySalesAndCustomerStatQuery.data?.sales_report.customers ?? 0
        )}
        color="purple"
      />
      <StatisticWithLine
        forSideBar
        title={t("dashboard.firstTimeCustomer")}
        subTitle={`${topWidgetsSubTitleprefix} ${t("dashboard.comparison")}`}
        rightText={
          getCompanySalesAndCustomerStatQuery.data?.sales_report.first_time_customers ??
          ""
        }
        isLoading={getCompanySalesAndCustomerStatQuery.isPending}
        percentDone={getPercentDone(
          getCompanySalesAndCustomerStatPrevQuery.data?.sales_report
            .first_time_customers ?? 0,
          getCompanySalesAndCustomerStatQuery.data?.sales_report.first_time_customers ?? 0
        )}
        color="orange"
      />
    </div>
  );
};
