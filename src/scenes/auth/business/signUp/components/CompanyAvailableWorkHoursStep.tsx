import { FC, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";

import { SignUpForm } from "..";
import Button from "@/components/ui/button";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
import Spinner from "@/components/ui/loaders/Spinner";

export const WEEK_DAYS = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

type Props = {
  form: UseFormReturn<SignUpForm, any, undefined>;
  handleSignUpStep: (value: SignUpForm) => void;
};

const CompanyAvailableWorkHoursStep: FC<Props> = ({ form, handleSignUpStep }) => {
  const t = useTranslations()
  const renderSlots = useMemo(() => {
    const timeSlotsInWorkRange = TIME_SLOTS.filter((sl) => !sl.minute);

    const isInSelectedRange = (s: TTimeSlot) => {
      const time = form.watch("time");

      if (!time[0] || !time[1]) return;

      const [start, end] =
        time[0].slot > time[1].slot ? [time[1], time[0]] : [time[0], time[1]];

      return s.slot >= start.slot && s.slot <= end.slot;
    };

    const isSelected = (s: TTimeSlot) => {
      const time = form.watch("time");
      if (!time) return;

      return time[0]?.slot === s.slot || time[1]?.slot === s.slot;
    };

    return timeSlotsInWorkRange.map((s) => ({
      ...s,
      isColorHighlight: isInSelectedRange(s) || isSelected(s),
    }));
  }, [form.watch("time")]);

  const selectDayHandler = (d: string) => {
    const prev = form.watch("weekDays");

    const finded = prev.find((p) => p === d);

    if (finded) {
      form.setValue(
        "weekDays",
        prev.filter((p) => p !== d)
      );
    } else {
      form.setValue("weekDays", [...prev, d]);
    }
  };

  const selectTimeHandler = (t: TTimeSlot) => {
    const time = form.watch("time");

    if (!time[0]) {
      form.setValue("time", [t, undefined]);
      return;
    }

    if (time[0] && !time[1]) {
      form.setValue("time", [time[0], t]);
      return;
    }

    if (time[0] && time[1]) {
      form.setValue("time", [undefined, undefined]);
      return;
    }
  };

  const isNextBtnActive =
    form.watch("weekDays").length && form.watch("time")[0] && form.watch("time")[1];

  const WEEK_DAYS_i18n = useMemo(() => Object.values(WEEK_DAYS).map(w => t(`ui.months.${w}` as any)), [])

  return (
    <div className="w-full mt-16">
      <p className="text-sm font-bold text-greyPrimary">{t("auth.selectAvailableDaysOfWeek")}</p>
      <div className={cn("w-full mt-4 flex justify-between gap-2")}>
        {WEEK_DAYS_i18n.map((d) => (
          <div
            key={d}
            className={cn(
              "py-2 flex-1 flex flex-col items-center rounded-lg cursor-pointer border transition-all border-greyOutlineSecondary hover:border-purplePrimary",
              {
                "font-bold text-white border-purplePrimary bg-purplePrimary": form
                  .watch("weekDays")
                  .find((p) => p === d),
              }
            )}
            onClick={() => selectDayHandler(d)}
          >
            <p className="text-sm text-[inherit]">{d}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-sm font-bold text-greyPrimary">
      {t("auth.selectAvailableHoursOfDay")}
      </p>
      <div className="w-full mt-4 grid grid-cols-12 gap-2">
        {renderSlots.map((s) => (
          <div
            key={s.slot}
            className={cn(
              "col-span-3 py-2 flex items-center justify-center text-sm rounded-lg border transition-all border-greyBackground bg-greyBackground",
              {
                "font-bold text-purplePrimary border-purplePrimary": s.isColorHighlight,
                "hover:border-purplePrimary cursor-pointer": true,
              }
            )}
            onClick={() => selectTimeHandler(s)}
          >
            {s.label}
          </div>
        ))}
      </div>
      <div className="py-12 flex gap-[100px] sm:gap-0 sm:justify-between">
        <Button variant="resting" onClick={() => form.setValue("_step", 3)}>
        {t("ui.actions.cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={form.handleSubmit(handleSignUpStep)}
          disabled={!isNextBtnActive || form.getValues("_loading")}
        >
           {form.getValues("_loading") ? <Spinner className="size-5"/> : t("ui.actions.finish")}
        </Button>
      </div>
    </div>
  );
};

export default CompanyAvailableWorkHoursStep;
