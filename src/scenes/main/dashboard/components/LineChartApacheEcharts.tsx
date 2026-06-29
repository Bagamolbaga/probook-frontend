/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */

"use client";

import Button from "@/components/ui/button";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  getDate,
  getMonth,
  getWeek,
  isBefore,
} from "date-fns";
import { FC, useEffect, useMemo, useState } from "react";

import ReactECharts from "echarts-for-react";
import { EChartOption, EChartsLoadingOption, EChartsOption } from "echarts";
import { graphic } from "echarts";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/formatCurrency";
import { TRange } from "@/hooks/useGetDashboardStatistic";

type TData = {
  name: string;
  sales: number;
  customer: number;
  _isBefore: boolean;
  _isCurrent: boolean;
};

const DATE_FORMAT = "yyyy-MM-dd";

const SERIES_CONFIG: {
  sales: EChartOption.Series;
  customer: EChartOption.Series;
} = {
  sales: {
    name: "Sales",
    type: "line",
    smooth: true,
    lineStyle: {
      width: 1.5,
    },
    showSymbol: false,
    areaStyle: {
      opacity: 0.2,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "#4cce18",
        },
        {
          offset: 1,
          color: "#4cce1850",
        },
      ]),
    },
    emphasis: {
      //@ts-ignore
      focus: "series",
    },
    symbolSize: 10,
    connectNulls: true,
    data: [],
  },
  customer: {
    name: "Customer",
    type: "line",
    smooth: true,
    lineStyle: {
      width: 1.5,
    },
    showSymbol: false,
    areaStyle: {
      opacity: 0.2,
      color: new graphic.LinearGradient(0, 0, 0, 1, [
        {
          offset: 0,
          color: "#603fef",
        },
        {
          offset: 1,
          color: "#603fef50",
        },
      ]),
    },
    emphasis: {
      //@ts-ignore
      focus: "series",
    },
    symbolSize: 10,
    connectNulls: true,
    data: [],
  },
};

const generateDataByDay = ({
  start,
  end,
  bookings,
}: {
  start: Date;
  end: Date;
  bookings: TBooking[];
}) => {
  const arr: TData[] = [];
  const dateArray = eachDayOfInterval({ start, end });

  dateArray.forEach((date, idx) => {
    const bookingsInThisDate = bookings.filter(
      (b) => b.date === format(date, DATE_FORMAT)
    );
    if (bookingsInThisDate.length) {
      const uniqCustomers = new Set<string>(
        bookingsInThisDate.map((b) => b.client?.username)
      );

      arr.push({
        name: format(date, "d MMM"),
        sales: bookingsInThisDate.reduce((acc, cur) => (acc += cur.services.length), 0),
        customer: uniqCustomers.size,
        _isBefore: isBefore(date, new Date()),
        _isCurrent: getDate(date) === getDate(new Date()),
      });
    } else {
      arr.push({
        name: format(date, "d MMM"),
        sales: 0,
        customer: 0,
        _isBefore: isBefore(date, new Date()),
        _isCurrent: getDate(date) === getDate(new Date()),
      });
    }
  });

  const salesSeries: EChartOption.Series = {
    ...SERIES_CONFIG.sales,
    data: arr.map((i) => {
      return {
        value: i.sales,
      } as EChartOption.SeriesLine.DataObject;
    }),
  };

  const customerSeries: EChartOption.Series = {
    ...SERIES_CONFIG.customer,
    data: arr.map((i) => {
      return {
        value: i.customer,
      } as EChartOption.SeriesLine.DataObject;
    }),
  };

  const xAxisData = arr.map((i) => {
    if (i._isCurrent) {
      return {
        value: i.name,
        textStyle: {
          color: "#603fef",
          fontWeight: 500,
        },
      };
    }

    if (i._isBefore) {
      return {
        value: i.name,
        textStyle: {
          color: "#8181a5",
        },
      };
    }

    return {
      value: i.name,
      textStyle: {
        color: "#1c1d21",
      },
    };
  });

  return {
    xAxisData,
    salesSeries,
    customerSeries,
  };
};

const generateDataByWeek = ({
  start,
  end,
  bookings,
}: {
  start: Date;
  end: Date;
  bookings: TBooking[];
}) => {
  const arr: TData[] = [];
  const dateArray = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

  dateArray.forEach((date, idx) => {
    if (idx === 0) return;

    const endOfWeekDate = endOfWeek(date, { weekStartsOn: 1 });

    const daysInThisWeek = eachDayOfInterval({
      start: dateArray[idx - 1],
      end: date,
    }).map((d) => format(d, DATE_FORMAT));

    const bookingsInThisWeekInterval = bookings.filter((b) =>
      daysInThisWeek.includes(b.date)
    );
    if (bookingsInThisWeekInterval.length) {
      const uniqCustomers = new Set<string>(
        bookingsInThisWeekInterval.map((b) => b.client?.username)
      );

      arr.push({
        name: `${format(date, "d MMM")} - ${format(endOfWeekDate, "d MMM")}`,
        sales: bookingsInThisWeekInterval.reduce(
          (acc, cur) => (acc += cur.services.length),
          0
        ),
        customer: uniqCustomers.size,
        _isBefore: isBefore(date, new Date()),
        _isCurrent:
          getWeek(date, { weekStartsOn: 1 }) === getWeek(new Date(), { weekStartsOn: 1 }),
      });
    } else {
      arr.push({
        name: `${format(date, "d MMM")} - ${format(endOfWeekDate, "d MMM")}`,
        sales: 0,
        customer: 0,
        _isBefore: isBefore(date, new Date()),
        _isCurrent:
          getWeek(date, { weekStartsOn: 1 }) === getWeek(new Date(), { weekStartsOn: 1 }),
      });
    }
  });

  const salesSeries: EChartOption.Series = {
    ...SERIES_CONFIG.sales,
    data: arr.map((i) => {
      return {
        value: i.sales,
      } as EChartOption.SeriesLine.DataObject;
    }),
  };

  const customerSeries: EChartOption.Series = {
    ...SERIES_CONFIG.customer,
    data: arr.map((i) => {
      return {
        value: i.customer,
      } as EChartOption.SeriesLine.DataObject;
    }),
  };

  const xAxisData = arr.map((i) => {
    if (i._isCurrent) {
      return {
        value: i.name,
        textStyle: {
          color: "#603fef",
          fontWeight: 500,
        },
      };
    }

    if (i._isBefore) {
      return {
        value: i.name,
        textStyle: {
          color: "#8181a5",
        },
      };
    }

    return {
      value: i.name,
      textStyle: {
        color: "#1c1d21",
      },
    };
  });

  return {
    xAxisData,
    salesSeries,
    customerSeries,
  };
};

const generateDataByMonth = ({
  start,
  end,
  bookings,
}: {
  start: Date;
  end: Date;
  bookings: TBooking[];
}) => {
  const arr: TData[] = [];
  const monthsArray = eachMonthOfInterval({ start, end });

  monthsArray.forEach((date, idx) => {
    const bookingsInThisMonth = bookings.filter(
      (b) => getMonth(b.date) === getMonth(date)
    );
    if (bookingsInThisMonth.length) {
      const uniqCustomers = new Set<string>(
        bookingsInThisMonth.map((b) => b.client?.username)
      );

      arr.push({
        name: format(date, "MMM"),
        sales: bookingsInThisMonth.reduce((acc, cur) => (acc += cur.services.length), 0),
        customer: uniqCustomers.size,
        _isBefore: isBefore(date, new Date()),
        _isCurrent: getMonth(date) === getMonth(new Date()),
      });
    } else {
      arr.push({
        name: format(date, "MMM"),
        sales: 0,
        customer: 0,
        _isBefore: isBefore(date, new Date()),
        _isCurrent: getMonth(date) === getMonth(new Date()),
      });
    }
  });

  const salesSeries: EChartOption.Series = {
    ...SERIES_CONFIG.sales,
    data: arr.map((i) => {
      return {
        value: i.sales,
      } as EChartOption.SeriesLine.DataObject;
    }),
  };

  const customerSeries: EChartOption.Series = {
    ...SERIES_CONFIG.customer,
    data: arr.map((i) => {
      return {
        value: i.customer,
      } as EChartOption.SeriesLine.DataObject;
    }),
  };

  const xAxisData = arr.map((i) => {
    if (i._isCurrent) {
      return {
        value: i.name,
        textStyle: {
          color: "#603fef",
          fontWeight: 500,
        },
      };
    }

    if (i._isBefore) {
      return {
        value: i.name,
        textStyle: {
          color: "#8181a5",
        },
      };
    }

    return {
      value: i.name,
      textStyle: {
        color: "#1c1d21",
      },
    };
  });

  return {
    xAxisData,
    salesSeries,
    customerSeries,
  };
};

type Props = {
  allBookings: TBooking[];
  selectedDates: {
    start: Date;
    end: Date;
  };
  selectedRange: TRange;
  setSelectedRange: (range: TRange) => void;
  isLoading?: boolean;
};

const LineChartApacheEcharts: FC<Props> = ({
  allBookings,
  selectedDates,
  selectedRange,
  isLoading,
  setSelectedRange,
}) => {
  const t = useTranslations() 
  const generateData = () => {
    if (selectedRange === "day") {
      return generateDataByDay({
        start: selectedDates.start,
        end: selectedDates.end,
        bookings: allBookings,
      });
    }
    if (selectedRange === "week") {
      return generateDataByWeek({
        start: selectedDates.start,
        end: selectedDates.end,
        bookings: allBookings,
      });
    }

    return generateDataByMonth({
      start: selectedDates.start,
      end: selectedDates.end,
      bookings: allBookings,
    });
  };

  const [generatedData, setGeneratedData] = useState(generateData());
  const [sumSalesPrices, setSumSalesPrices] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setGeneratedData(generateData());
      setSumSalesPrices(
        allBookings.reduce(
          (acc, cur) =>
            (acc += cur.services.reduce((acc2, cur2) => (acc2 += Number(cur2?.service_option?.price || 0)), 0)),
          0
        )
      );
    }
  }, [allBookings, isLoading]);

  const changeRangeHandler = (range: TRange) => {
    setSelectedRange(range);
  };

  const chartoption = useMemo(
    () => ({
      color: ["#4cce18", "#603fef"],
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#6a7985",
          },
        },
      },
      legend: {
        data: [],
      },
      grid: {
        left: selectedRange === "week" ? 40 : 20,
        right: selectedRange === "week" ? 40 : 20,
        bottom: 0,
        containLabel: true,
        height: "380px",
        width: "auto",
      },
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: generatedData.xAxisData,
          splitLine: {
            show: true,
            lineStyle: {
              type: [10, 5],
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#8181a5",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: [10, 5],
            },
          },
        },
      ],
      series: [generatedData.salesSeries, generatedData.customerSeries],
    }),
    [generatedData, selectedRange]
  );

  return (
    <div className="py-5 flex-1 flex-col rounded-[20px] bg-white">
      <div className="w-full px-6 flex items-center justify-between">
        <p className="text-lg font-bold">{t("dashboard.yourSales")}</p>
        <div className="flex items-center gap-2">
          <Button
            variant={selectedRange === "day" ? "resting-active" : "resting"}
            onClick={() => changeRangeHandler("day")}
          >
            {t("dashboard.day")}
          </Button>
          <Button
            variant={selectedRange === "week" ? "resting-active" : "resting"}
            onClick={() => changeRangeHandler("week")}
          >
            {t("dashboard.week")}
          </Button>
          <Button
            variant={selectedRange === "month" ? "resting-active" : "resting"}
            onClick={() => changeRangeHandler("month")}
          >
            {t("dashboard.month")}
          </Button>
        </div>
      </div>
      <div className="px-6">
        <h3 className="text-[26px] font-bold">{formatCurrency(sumSalesPrices)}</h3>
        <p className="mt-1 text-sm text-greyPrimary">{t("dashboard.totalIncome")}</p>
      </div>
      <div className="w-full h-[380px] mt-6 px-6">
        <ReactECharts
          className="w-full !h-[380px]"
          loadingOption={
            {
              text: "",
              lineWidth: 3,
            } as EChartsLoadingOption
          }
          showLoading={isLoading}
          //@ts-ignore
          option={isLoading ? {} : chartoption}
        />
      </div>
    </div>
  );
};

export default LineChartApacheEcharts;
