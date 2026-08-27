"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormControl } from "@mui/material";
import { useTranslations } from "next-intl";

import { Form } from "..";
import AppSelect from "@/components/ui/inputs/AppSelect";
import Spinner from "@/components/ui/loaders/Spinner";
import { TimeManager } from "@/utils/timeManager";
import { cn } from "@/utils/cn";
import PlusRight from "@/components/ui/icons/Plus";

const WEEK_DAYS: { id: keyof Form["workingSchedule"]; text: string }[] = [
  {
    id: "Monday",
    text: "Monday",
  },
  {
    id: "Tuesday",
    text: "Tuesday",
  },
  {
    id: "Wednesday",
    text: "Wednesday",
  },
  {
    id: "Thursday",
    text: "Thursday",
  },
  {
    id: "Friday",
    text: "Friday",
  },
  {
    id: "Saturday",
    text: "Saturday",
  },
  {
    id: "Sunday",
    text: "Sunday",
  },
];

type Props = {
  form: UseFormReturn<Form>;
  isLoading?: boolean;
};

type RowItem = {
  weekDay: string;
};

type RowItemProps = {
  weekDay: keyof Form["workingSchedule"];
  form: UseFormReturn<Form>;
};

const RowItem = ({ weekDay, form }: RowItemProps) => {
  const t = useTranslations();

  const [showBreakPickers, setShowBreakPickers] = useState(false);

  const showBreakPickersHandler = () => {
    setShowBreakPickers(true);
  };

  const allTimeSlots = useMemo(() => {
    const slotManager = new TimeManager();
    const slots = slotManager.SLOTS.filter((s) => s.minute === 0 || s.minute === 30);
    return slots;
  }, []);

  //  WORK SLOTS SECTION

  useEffect(() => {
    const value = form.watch(`workingSchedule.${weekDay}.slots.from`);

    //@ts-ignore
    if (value?.id === "off") {
      form.setValue(`workingSchedule.${weekDay}.slots.from`, undefined);
    }
  }, [form.watch(`workingSchedule.${weekDay}.slots.from`), weekDay]);

  useEffect(() => {
    const value = form.watch(`workingSchedule.${weekDay}.slots.to`);

    //@ts-ignore
    if (value?.id === "off") {
      form.setValue(`workingSchedule.${weekDay}.slots.to`, undefined);
    }
  }, [form.watch(`workingSchedule.${weekDay}.slots.to`), weekDay]);

  const fromTimeOptions = useMemo(() => {
    const slots = form.watch(`workingSchedule.${weekDay}.slots.to`)
      ? allTimeSlots.filter(
          (s) => s.slot < form.watch(`workingSchedule.${weekDay}.slots.to`)!.slot
        )
      : allTimeSlots;

    return [{ id: "off", value: null }, ...slots.map((s) => ({ id: s.label, ...s }))];
  }, [allTimeSlots, form.watch(`workingSchedule.${weekDay}.slots.to`)]);

  const toTimeOptions = useMemo(() => {
    const slots = form.watch(`workingSchedule.${weekDay}.slots.from`)
      ? allTimeSlots.filter(
          (s) => s.slot > form.watch(`workingSchedule.${weekDay}.slots.from`)!.slot
        )
      : allTimeSlots;

    return [{ id: "off", value: null }, ...slots.map((s) => ({ id: s.label, ...s }))];
  }, [allTimeSlots, weekDay, form.watch(`workingSchedule.${weekDay}.slots.from`)]);

  const fromSelectedOption = useMemo(() => {
    const data = form.watch(`workingSchedule.${weekDay}.slots.from`);

    if (data) {
      return {
        ...data,
        id: data.label,
      };
    }

    return undefined;
  }, [form.watch(`workingSchedule.${weekDay}.slots.from`), weekDay]);

  const toSelectedOption = useMemo(() => {
    const data = form.watch(`workingSchedule.${weekDay}.slots.to`);

    if (data) {
      return {
        ...data,
        id: data.label,
      };
    }

    return undefined;
  }, [form.watch(`workingSchedule.${weekDay}.slots.to`), weekDay]);

  //  BREAK SLOTS SECTION

  useEffect(() => {
    const value = form.watch(`workingSchedule.${weekDay}.break.from`);

    //@ts-ignore
    if (value?.id === "off") {
      form.setValue(`workingSchedule.${weekDay}.break.from`, undefined);
    }
  }, [form.watch(`workingSchedule.${weekDay}.break.from`), weekDay]);

  useEffect(() => {
    const value = form.watch(`workingSchedule.${weekDay}.break.to`);

    //@ts-ignore
    if (value?.id === "off") {
      form.setValue(`workingSchedule.${weekDay}.break.to`, undefined);
    }
  }, [form.watch(`workingSchedule.${weekDay}.break.to`), weekDay]);

  const breakFromTimeOptions = useMemo(() => {
    const slots = form.watch(`workingSchedule.${weekDay}.break.to`)
      ? allTimeSlots
          .filter(
            (s) =>
              s.slot > form.watch(`workingSchedule.${weekDay}.slots.from`)!.slot &&
              s.slot < form.watch(`workingSchedule.${weekDay}.slots.to`)!.slot
          )
          .filter((s) => s.slot < form.watch(`workingSchedule.${weekDay}.break.to`)!.slot)
      : allTimeSlots;

    return [{ id: "off", value: null }, ...slots.map((s) => ({ id: s.label, ...s }))];
  }, [allTimeSlots, form.watch(`workingSchedule.${weekDay}.break.to`)]);

  const breakToTimeOptions = useMemo(() => {
    const slots = form.watch(`workingSchedule.${weekDay}.break.from`)
      ? allTimeSlots
          .filter(
            (s) =>
              s.slot > form.watch(`workingSchedule.${weekDay}.slots.from`)!.slot &&
              s.slot < form.watch(`workingSchedule.${weekDay}.slots.to`)!.slot
          )
          .filter(
            (s) => s.slot > form.watch(`workingSchedule.${weekDay}.break.from`)!.slot
          )
      : allTimeSlots;

    return [{ id: "off", value: null }, ...slots.map((s) => ({ id: s.label, ...s }))];
  }, [allTimeSlots, weekDay, form.watch(`workingSchedule.${weekDay}.break.from`)]);

  const breakFromSelectedOption = useMemo(() => {
    const data = form.watch(`workingSchedule.${weekDay}.break.from`);

    if (data) {
      return {
        ...data,
        id: data.label,
      };
    }

    return undefined;
  }, [form.watch(`workingSchedule.${weekDay}.break.from`), weekDay]);

  const breakToSelectedOption = useMemo(() => {
    const data = form.watch(`workingSchedule.${weekDay}.break.to`);

    if (data) {
      return {
        ...data,
        id: data.label,
      };
    }

    return undefined;
  }, [form.watch(`workingSchedule.${weekDay}.break.to`), weekDay]);

  const isCanShowBreakPickers = useMemo(
    () =>
      form.watch(`workingSchedule.${weekDay}.slots.from`)?.slot &&
      form.watch(`workingSchedule.${weekDay}.slots.to`)?.slot,
    [
      form.watch(`workingSchedule.${weekDay}.slots.from`),
      form.watch(`workingSchedule.${weekDay}.slots.to`),
      weekDay,
    ]
  );

  return (
    <div className="w-full flex items-center border-b border-greyOutline">
      <div className="w-1/2 py-2 pr-5 flex items-center border-r border-greyOutline">
        <div className="min-w-[120px]">
          <p className="text-sm font-normal">{weekDay}</p>
        </div>
        <div className="w-full flex items-center gap-2">
          <FormControl fullWidth>
            <Controller
              render={() => (
                <AppSelect
                  id={`workingSchedule.${weekDay}.slots.from`}
                  classNames={{
                    selectContainer: "w-full",
                  }}
                  selectDropdownPosition="top"
                  options={fromTimeOptions}
                  selectedOption={fromSelectedOption}
                  setValue={form.setValue}
                  renderOption={(option) => {
                    if (option.id === "off") {
                      return <p className={cn("text-sm")}>Off</p>;
                    }

                    return (
                      //@ts-ignore
                      <p className={cn("text-sm")}>{option.label}</p>
                    );
                  }}
                  renderOptionSelected={(option) => {
                    if (!option) {
                      return <p className={cn("text-sm")}>hh:mm</p>;
                    }

                    if (option?.id === "off") {
                      return <p className={cn("text-sm")}>hh:mm</p>;
                    }

                    //@ts-ignore
                    return <p className={cn("text-sm")}>{option.label}</p>;
                  }}
                />
              )}
              name={`workingSchedule.${weekDay}.slots.from`}
              control={form.control}
            />
          </FormControl>
          <span className="text-greyPrimary">-</span>
          <FormControl fullWidth>
            <Controller
              render={() => (
                <AppSelect
                  id={`workingSchedule.${weekDay}.slots.to`}
                  classNames={{
                    selectContainer: "w-full",
                  }}
                  selectDropdownPosition="top"
                  options={toTimeOptions}
                  selectedOption={toSelectedOption}
                  setValue={form.setValue}
                  renderOption={(option) => {
                    if (option.id === "off") {
                      return <p className={cn("text-sm")}>Off</p>;
                    }

                    return (
                      //@ts-ignore
                      <p className={cn("text-sm")}>{option.label}</p>
                    );
                  }}
                  renderOptionSelected={(option) => {
                    if (!option) {
                      return <p className={cn("text-sm")}>hh:mm</p>;
                    }

                    if (option?.id === "off") {
                      return <p className={cn("text-sm")}>hh:mm</p>;
                    }

                    //@ts-ignore
                    return <p className={cn("text-sm")}>{option.label}</p>;
                  }}
                />
              )}
              name={`workingSchedule.${weekDay}.slots.to`}
              control={form.control}
            />
          </FormControl>
        </div>
      </div>
      <div className="w-1/2 pl-5 flex items-center gap-2">
        {showBreakPickers || form.watch(`workingSchedule.${weekDay}.break`)?.from ? (
          <div className="w-full flex items-center gap-2">
            <FormControl fullWidth>
              <Controller
                render={() => (
                  <AppSelect
                    id={`workingSchedule.${weekDay}.break.from`}
                    classNames={{
                      selectContainer: "w-full",
                    }}
                    selectDropdownPosition="top"
                    options={breakFromTimeOptions}
                    selectedOption={breakFromSelectedOption}
                    setValue={form.setValue}
                    renderOption={(option) => {
                      if (option.id === "off") {
                        return <p className={cn("text-sm")}>Off</p>;
                      }

                      return (
                        //@ts-ignore
                        <p className={cn("text-sm")}>{option.label}</p>
                      );
                    }}
                    renderOptionSelected={(option) => {
                      if (!option) {
                        return <p className={cn("text-sm")}>hh:mm</p>;
                      }

                      if (option?.id === "off") {
                        return <p className={cn("text-sm")}>hh:mm</p>;
                      }

                      //@ts-ignore
                      return <p className={cn("text-sm")}>{option.label}</p>;
                    }}
                  />
                )}
                name={`workingSchedule.${weekDay}.break.from`}
                control={form.control}
              />
            </FormControl>
            <span className="text-greyPrimary">-</span>
            <FormControl fullWidth>
              <Controller
                render={() => (
                  <AppSelect
                    id={`workingSchedule.${weekDay}.break.to`}
                    classNames={{
                      selectContainer: "w-full",
                    }}
                    selectDropdownPosition="top"
                    options={breakToTimeOptions}
                    selectedOption={breakToSelectedOption}
                    setValue={form.setValue}
                    renderOption={(option) => {
                      if (option.id === "off") {
                        return <p className={cn("text-sm")}>Off</p>;
                      }

                      return (
                        //@ts-ignore
                        <p className={cn("text-sm")}>{option.label}</p>
                      );
                    }}
                    renderOptionSelected={(option) => {
                      if (!option) {
                        return <p className={cn("text-sm")}>hh:mm</p>;
                      }

                      if (option?.id === "off") {
                        return <p className={cn("text-sm")}>hh:mm</p>;
                      }

                      //@ts-ignore
                      return <p className={cn("text-sm")}>{option.label}</p>;
                    }}
                  />
                )}
                name={`workingSchedule.${weekDay}.break.to`}
                control={form.control}
              />
            </FormControl>
          </div>
        ) : (
          <div onClick={isCanShowBreakPickers ? showBreakPickersHandler : undefined}>
            <PlusRight
              className={cn(
                "h-10 stroke-greyPrimary transition-all pointer-events-none",
                {
                  "pointer-events-auto cursor-pointer hover:stroke-purplePrimary":
                    isCanShowBreakPickers,
                }
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const WorkingShedule = ({ form, isLoading }: Props) => {
  const t = useTranslations();

  return (
    <div className="w-full mt-16">
      <p className="text-sm font-bold">Working schedule</p>
      <p className="text-sm text-greyPrimary">
        These working schedule will be displayed o the page with detailed information
        about your salon
      </p>
      {isLoading ? (
        <div className="w-full mt-5 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div className={cn("w-full mt-4 flex flex-col")}>
          {WEEK_DAYS.map((d) => (
            <RowItem key={d.id} weekDay={d.id} form={form} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkingShedule;
