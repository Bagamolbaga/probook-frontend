/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Grid } from "@mui/material";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  addWeeks,
  getMonth,
  isSameDay,
} from "date-fns";

import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import {
  useGetCompanyShiftsForDateRangeQuery,
  useGetCompanyShiftsQuery,
} from "@/api/queries/company/shift";

import ShiftItem from "./components/ShiftItem";
import Button from "@/components/ui/button";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import ListIsEmptyPlaceholderImage from "@/assets/staffManagement/SpecialistListEmptyOverlay.svg";
import { cn } from "@/utils/cn";
import { DEFAULT_SHIFTS } from "@/constants/defaultShifts";
import { useLocale, useTranslations } from "next-intl";
import { DATE_FNS_LOCALES } from "@/i18n";
import { TimeManager } from "@/utils/timeManager";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

const WEEK_STARTS_ON = 1;

const ShiftManagement = () => {
  const t = useTranslations();
  const locale = useLocale() as keyof typeof DATE_FNS_LOCALES;
  const { companyId } = useGetCompanyId();

  const [firstDayOnWeek, setFirstDayOnWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: WEEK_STARTS_ON })
  );
  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const getCompanyShiftsForDateRangeQuery = useGetCompanyShiftsForDateRangeQuery({
    companyId,
    start: firstDayOnWeek,
    end: addWeeks(firstDayOnWeek, 1),
  });
  const getCompanyShiftsQuery = useGetCompanyShiftsQuery({ companyId });

  const revalidateQueries = async () => {
    void getCompanySpecialistsQuery.refetch();
    void getCompanyShiftsForDateRangeQuery.refetch();
  };

  const week = useMemo(() => {
    const startOfWeekDate = startOfWeek(firstDayOnWeek, { weekStartsOn: WEEK_STARTS_ON });
    const endOfWeekDate = endOfWeek(firstDayOnWeek, { weekStartsOn: WEEK_STARTS_ON });
    const daysOfWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });

    return { startOfWeekDate, endOfWeekDate, daysOfWeek };
  }, [firstDayOnWeek]);

  const data = useMemo(() => {
    return (
      getCompanySpecialistsQuery.data?.results.map((s) => {
        const shifts =
          getCompanyShiftsForDateRangeQuery.data?.results.find((sf) => sf.id === s.id)
            ?.shifts || [];

        return {
          id: s.id,
          specialist: s,
          shifts,
        };
      }) || []
    );
  }, [getCompanySpecialistsQuery.data, getCompanyShiftsForDateRangeQuery.data]);

  const dateStringBySelectedWeek = useMemo(() => {
    const firstDay = week.daysOfWeek.at(0);
    const lastDay = week.daysOfWeek.at(-1);

    if (firstDay && lastDay) {
      if (getMonth(firstDay) === getMonth(lastDay)) {
        return `${format(firstDay, "MMMM d", {
          locale: DATE_FNS_LOCALES[locale],
        })} - ${format(lastDay, "d, yyyy", {
          locale: DATE_FNS_LOCALES[locale],
        })}`;
      } else {
        return `${format(firstDay, "MMMM d", {
          locale: DATE_FNS_LOCALES[locale],
        })} - ${format(lastDay, "MMMM d, yyyy", {
          locale: DATE_FNS_LOCALES[locale],
        })}`;
      }
    }
  }, [locale, week.daysOfWeek]);

  const colIsEqualCurrentDate = (col: number) => {
    const colDate = week.daysOfWeek[col];
    const currDate = new Date();

    return isSameDay(colDate, currDate);
  };

  const renderShift = (row: number, dayCol: number) => {
    const day = week.daysOfWeek[dayCol];

    const currData = data[row];

    const defaultShift =
      getCompanyShiftsForDateRangeQuery.data?.results.find(
        (sf) => sf.id === currData.specialist.id
      )?.default_shift || currData.specialist.default_shift;

    const findedCustomShift = currData.shifts.find(
      (s) =>
        s.date ===
        format(day, "yyyy-MM-dd", {
          locale: DATE_FNS_LOCALES[locale],
        })
    );

    if (findedCustomShift) {
      return (
        <ShiftItem
          specialistId={currData.specialist.id}
          customShift={findedCustomShift}
          defaultShift={defaultShift}
          date={day}
          col={dayCol}
          revalidateQueries={revalidateQueries}
        />
      );
    }

    return (
      <ShiftItem
        defaultShift={defaultShift}
        specialistId={currData.specialist.id}
        date={day}
        col={dayCol}
        revalidateQueries={revalidateQueries}
      />
    );
  };

  const selectNextWeekHandler = () => {
    setFirstDayOnWeek((prev) => addWeeks(prev, 1));
  };

  const selectPrevWeekHandler = () => {
    setFirstDayOnWeek((prev) => addWeeks(prev, -1));
  };

  if (getCompanySpecialistsQuery.isPending) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[300px] h-[300px]" />
      </div>
    );
  }

  if (
    !getCompanySpecialistsQuery.isPending &&
    !getCompanySpecialistsQuery.data?.results.length
  ) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div>
          <Image
            src={ListIsEmptyPlaceholderImage}
            alt={t("staffManagement.staffList.empty.title")}
          />
        </div>
        <h4 className="text-[32px] font-bold text-center">
          {t("staffManagement.staffList.empty.title")}
        </h4>
        <p className="mt-3 text-sm text-center text-greyPrimary">
          {t.rich("staffManagement.staffList.empty.subTitle", {
            br: () => <br />,
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full px-7 pt-10 pb-5 flex flex-col rounded-xl bg-white sm:px-5 sm:py-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold">{dateStringBySelectedWeek}</div>
        <div className="flex items-center gap-1">
          <Button
            className="w-12"
            variant="resting-active"
            onClick={selectPrevWeekHandler}
          >
            <ArrowSecondaryDownIcon className="rotate-90" />
          </Button>
          <Button
            className="w-12"
            variant="resting-active"
            onClick={selectNextWeekHandler}
          >
            <ArrowSecondaryDownIcon className="-rotate-90" />
          </Button>
        </div>
      </div>
      <div className="flex mt-9 rounded-xl overflow-y-visible border border-greyOutlineSecondary sm:mt-5">
        <div className="min-w-[100px] h-full flex-none flex flex-col">
          <div className="w-full py-5 px-[6px] text-sm text-greyPrimary border-b border-greyOutlineSecondary bg-greyBackgroundLight">
            <div className="invisible">1</div>
          </div>
          {data?.map((item) => (
            <div
              key={item.specialist.id}
              className="w-full h-[48.8px] py-[6px] px-[6px] flex items-center gap-2 border-b last:border-b-0 border-greyOutlineSecondary"
            >
              <div className="min-w-8 min-h-8 w-8 h-8 rounded-full overflow-hidden bg-greyPrimary/40">
                {item.specialist.specialist_details.avatar && (
                  <Image
                    key={item.specialist.specialist_details.avatar}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    src={item.specialist.specialist_details.avatar}
                    alt={item.specialist.full_name}
                  />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-bold">
                  {item.specialist.full_name ? item.specialist.full_name : `${item.specialist.specialist_details.first_name} ${item.specialist.specialist_details.last_name}`}
                </span>
                <span className="text-sm text-greyPrimary">
                  {item.specialist.default_shift.name === "CUSTOM"
                    ? DEFAULT_SHIFTS.find((s) => s.nameId === "CUSTOM")?.name
                    : DEFAULT_SHIFTS.find(
                        (s) => s.id === item.specialist.default_shift.id
                      )?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex flex-col ">
          <Grid
            container
            // spacing={2}
            columns={10}
            sx={{
              position: "relative",
              width: "100%",
              height: "fit-content",
              m: 0,
              flexGrow: 1,
              flexWrap: "nowrap",
            }}
            className="border-b border-greyOutlineSecondary"
          >
            {week.daysOfWeek.map((t, col) => (
              <Grid md key={t.toISOString()} className="bg-greyBackgroundLight">
                <div
                  className={cn(
                    "min-w-20 py-5 flex justify-center items-center text-sm text-wrap text-greyPrimary",
                    {
                      "font-bold text-purplePrimary": colIsEqualCurrentDate(col),
                    }
                  )}
                >
                  {format(t, "EEE d", {
                    locale: DATE_FNS_LOCALES[locale],
                  })}
                </div>
              </Grid>
            ))}
          </Grid>
          <div className="w-full flex flex-col rounded-br-xl border-greyOutlineSecondary">
            {Array.from<number>(Array(data?.length))
              .map(() => Array.from<number>(Array(week.daysOfWeek.length)))
              .map((_, row) => (
                <Grid
                  container
                  columns={10}
                  key={row}
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "fit-content",
                    m: 0,
                    flexGrow: 1,
                    flexWrap: "nowrap",
                  }}
                  className="border-b last:border-b-0 border-greyOutlineSecondary"
                >
                  {_.map((i, col) => (
                    <Grid md key={col}>
                      <div
                        className={cn(
                          "relative min-w-20 h-12 flex items-center justify-center border-l border-greyOutlineSecondary text-sm",
                          {
                            "border-b border-b-purplePrimary":
                              row === data.length - 1 && colIsEqualCurrentDate(col),
                            // "border-t": row === 0,
                            // "border-r": rowarr.length - 1 === col,
                          }
                        )}
                      >
                        {renderShift(row, col)}
                      </div>
                    </Grid>
                  ))}
                </Grid>
              ))}
          </div>
        </div>
      </div>
      <div className="w-full mt-auto flex justify-center items-center gap-4">
        {getCompanyShiftsQuery.data?.results
          .filter((s) => s.is_default && !s.specialist)
          .sort((a, b) => a.id - b.id)
          .map((s) => {
            const fullSlots = new TimeManager().getWorkingScheduleFirstWeekDaySlots(
              s.working_schedule
            );

            const range = fullSlots.workings.length
              ? `(${fullSlots.workings[0]?.label} - ${fullSlots.workings[fullSlots.workings.length - 1]?.label})`
              : null;
            return (
              <div key={s.id} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full bg-white border-[4px]"
                  style={{ borderColor: s.color }}
                ></div>
                <p className="text-sm">
                  {s.name} <span className="ml-1 text-greyPrimary">{range}</span>
                </p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ShiftManagement;
