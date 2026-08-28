"use client";

import { useStore } from "zustand";
import StatisticWithLine from "../../../components/ui/widgets/statisticWithLine";
import CustomerDatabase from "./components/CustomerDatabase";
import LineChartApacheEcharts from "./components/LineChartApacheEcharts";
import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { useGetDashboardStatistic } from "@/hooks/useGetDashboardStatistic";
import SubscriptionChecker from "@/components/subscriptionChecker";
import SuperAdminChecker from "@/components/superAdminChecker";
import { useSuperAdminStore } from "@/stores/superAdmin";
import MainPagesTitle from "@/components/mainPagesTitle";

const DashboardScene = () => {
  const t = useTranslations();
  const selectCompany = useStore(useSuperAdminStore, (st) => st.selectCompany);

  const {
    getCompanySalesAndCustomerStatPrevQuery,
    getCompanySalesAndCustomerStatQuery,
    getAllBookingsQuery,
    allBookings,
    selectedDates,
    selectedRange,
    setSelectedRange,
  } = useGetDashboardStatistic(selectCompany?.id);

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
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline sm:px-5 sm:py-6 sm:pb-[64px]">
      <div className="pb-6 flex justify-between items-center">
        <MainPagesTitle text={t("dashboard.title")} />
      </div>
      <div className="w-full min-h-[calc(100vh-62px-52px)] sm:min-h-[calc(100vh-62px-86px)] sm:pb-5">
        <SuperAdminChecker>
          <SubscriptionChecker>
            <div className="w-full flex gap-7 sm:flex-col sm:gap-3">
              <StatisticWithLine
                title={t("dashboard.sales")}
                subTitle={`${topWidgetsSubTitleprefix} ${t("dashboard.comparison")}`}
                rightText={
                  allBookings.reduce((acc, i) => (acc += i.services.length), 0) ?? ""
                }
                isLoading={getCompanySalesAndCustomerStatQuery.isPending}
                percentDone={getPercentDone(
                  getCompanySalesAndCustomerStatPrevQuery.data?.sales_report.sales ?? 0,
                  getCompanySalesAndCustomerStatQuery.data?.sales_report.sales ?? 0
                )}
                color="green"
              />
              <StatisticWithLine
                title={t("dashboard.customer")}
                subTitle={`${topWidgetsSubTitleprefix} ${t("dashboard.comparison")}`}
                rightText={allBookings.length ?? ""}
                isLoading={getCompanySalesAndCustomerStatQuery.isPending}
                percentDone={getPercentDone(
                  getCompanySalesAndCustomerStatPrevQuery.data?.sales_report.customers ??
                    0,
                  getCompanySalesAndCustomerStatQuery.data?.sales_report.customers ?? 0
                )}
                color="purple"
              />
              <StatisticWithLine
                title={t("dashboard.firstTimeCustomer")}
                subTitle={`${topWidgetsSubTitleprefix} ${t("dashboard.comparison")}`}
                rightText={
                  getCompanySalesAndCustomerStatQuery.data?.sales_report
                    .first_time_customers ?? ""
                }
                isLoading={getCompanySalesAndCustomerStatQuery.isPending}
                percentDone={getPercentDone(
                  getCompanySalesAndCustomerStatPrevQuery.data?.sales_report
                    .first_time_customers ?? 0,
                  getCompanySalesAndCustomerStatQuery.data?.sales_report
                    .first_time_customers ?? 0
                )}
                color="orange"
              />
            </div>
            <div className="w-full mt-7">
              <LineChartApacheEcharts
                allBookings={allBookings as unknown as TBooking[]}
                selectedDates={selectedDates}
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                isLoading={getAllBookingsQuery.some((q) => q.isPending)}
              />
            </div>
            <div className="w-full mt-7">
              <CustomerDatabase />
            </div>
          </SubscriptionChecker>
        </SuperAdminChecker>
      </div>
    </div>
  );
};

export default DashboardScene;
