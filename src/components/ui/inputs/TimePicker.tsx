/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ComponentProps, FC, useEffect, useMemo, useRef, useState } from "react";
import Button from "../button";
import { FormControl, MenuItem, NativeSelect } from "@mui/material";
import {
  Control,
  Controller,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import CustomSelect from "../inputs/Select";
import ArrowSecondaryDownIcon from "../icons/ArrowSecondaryDown";
import {
  AFTERNOON_RANGE_TIME_SLOTS,
  EVENING_RANGE_TIME_SLOTS,
  MORNING_RANGE_TIME_SLOTS,
  TIME_SLOTS,
} from "@/constants/timeSlots";
import ClockIcon from "../icons/Clock";
import TextField from "../inputs/TextField";
import { cn } from "@/utils/cn";
import CustomScrollbarStyles from "@/styles/scrollbar.module.sass";
import { useClickOutside } from "@/hooks/useClickOutside";
import AppSelect from "./AppSelect";
import { useTranslations } from "next-intl";

type TextFieldProps = ComponentProps<typeof TextField>;

type Props = {
  fromId: string;
  toId: string;
  from?: (typeof TIME_SLOTS)[0] & { id: string };
  to?: (typeof TIME_SLOTS)[0] & { id: string };
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  control: Control<any, any>;
  textFieldProps: TextFieldProps;
  withIcon?: boolean;
  isOpen?: boolean;
};

const TimePicker: FC<Props> = ({
  fromId,
  toId,
  from,
  to,
  setValue,
  register,
  control,
  textFieldProps,
  withIcon = true,
  isOpen
}) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const localForm = useForm<{ time: string }>();

  const [isOpenLocal, setIsOpenLocal] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<
    "any" | "morning" | "afternoon" | "evening"
  >("any");

  const [isFromFocus, setIsFromFocus] = useState(false);

  const timeSlotsSelect = useMemo(() => {
    const fromSlots = TIME_SLOTS.filter((t) => (to ? t.slot < to.slot : true)).map(
      (s) => ({ id: s.label, ...s })
    );
    const toSlots = TIME_SLOTS.filter((t) => (from ? t.slot > from.slot : true)).map(
      (s) => ({ id: s.label, ...s })
    );
    return { fromSlots, toSlots };
  }, [from, to]);

  useEffect(() => {
    if (
      from?.slot === MORNING_RANGE_TIME_SLOTS.from.slot &&
      to?.slot === MORNING_RANGE_TIME_SLOTS.to.slot
    ) {
      setSelectedPreset("morning");
      return;
    }
    if (
      from?.slot === AFTERNOON_RANGE_TIME_SLOTS.from.slot &&
      to?.slot === AFTERNOON_RANGE_TIME_SLOTS.to.slot
    ) {
      setSelectedPreset("afternoon");
      return;
    }
    if (
      from?.slot === EVENING_RANGE_TIME_SLOTS.from.slot &&
      to?.slot === EVENING_RANGE_TIME_SLOTS.to.slot
    ) {
      setSelectedPreset("evening");
      return;
    }

    setSelectedPreset("any");
  }, [from, to]);

  const selectAnyDateTimeRange = () => {
    setValue(fromId, undefined);
    setValue(toId, undefined);
  };

  const selectMornigTimeRange = () => {
    setValue(fromId, MORNING_RANGE_TIME_SLOTS.from);
    setValue(toId, MORNING_RANGE_TIME_SLOTS.to);
  };

  const selectAfternoonTimeRange = () => {
    setValue(fromId, AFTERNOON_RANGE_TIME_SLOTS.from);
    setValue(toId, AFTERNOON_RANGE_TIME_SLOTS.to);
  };

  const selectEveningTimeRange = () => {
    setValue(fromId, EVENING_RANGE_TIME_SLOTS.from);
    setValue(toId, EVENING_RANGE_TIME_SLOTS.to);
  };

  useClickOutside(containerRef, () => setIsOpenLocal(false));

  return (
    <div ref={containerRef} className="relative w-full">
      <TextField
        className="pb-1 !pt-0"
        placeholder={t("ui.timeSelectInput.anyTime")}
        autoComplete="off"
        iconLeft={withIcon && <ClockIcon className="stroke-darkPrimary" />}
        value={`${from?.label || ""} ${(from && to && "-") || ""} ${to?.label || ""}`.trim()}
        {...textFieldProps}
        onFocus={(e) => {
          textFieldProps?.onFocus && textFieldProps.onFocus(e)
          setIsOpenLocal(true);
        }}
      />
      {(isOpenLocal || isOpen) && (
        <div className="absolute z-20 top-full left-0 w-[410px] md:w-full sm:w-full p-4 flex flex-col rounded-lg border bg-white border-greyOutlineSecondary shadow-primary">
          <div className="grid grid-cols-4 items-center gap-2 sm:grid-cols-2">
            <Button
              className="flex-1 !py-1 !px-3 !rounded-full text-sm font-bold sm:!px-1"
              variant={selectedPreset === "any" ? "primary" : "resting-active"}
              onClick={selectAnyDateTimeRange}
            >
              {t("ui.timeSelectInput.anyDate")}
            </Button>
            <Button
              className="flex-1 !py-1 !px-3 !rounded-full text-sm font-bold sm:!px-1"
              variant={selectedPreset === "morning" ? "primary" : "resting-active"}
              onClick={selectMornigTimeRange}
            >
              {t("ui.timeSelectInput.morning")}
            </Button>
            <Button
              className="flex-1 !py-1 !px-3 !rounded-full text-sm font-bold sm:!px-1"
              variant={selectedPreset === "afternoon" ? "primary" : "resting-active"}
              onClick={selectAfternoonTimeRange}
            >
              {t("ui.timeSelectInput.afternoon")}
            </Button>
            <Button
              className="flex-1 !py-1 !px-3 !rounded-full text-sm font-bold sm:!px-1"
              variant={selectedPreset === "evening" ? "primary" : "resting-active"}
              onClick={selectEveningTimeRange}
            >
              {t("ui.timeSelectInput.evening")}
            </Button>
          </div>
          <div className="mt-5 flex items-center justify-between gap-2">
            <FormControl fullWidth>
              <Controller
                render={({ field, formState }) => (
                  <AppSelect
                    id={fromId}
                    options={timeSlotsSelect.fromSlots}
                    selectedOption={from}
                    setValue={setValue}
                    renderOption={(option) => (
                      <p className={cn("text-sm")}>{option.label}</p>
                    )}
                    renderOptionSelected={(option) => (
                      <p className={cn("text-sm")}>
                        {option ? option.label : t("ui.timeSelectInput.from")}
                      </p>
                    )}
                  />
                )}
                name={fromId}
                control={control}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                render={({ field, formState }) => (
                  <AppSelect
                    id={toId}
                    options={timeSlotsSelect.toSlots}
                    setValue={setValue}
                    selectedOption={to}
                    renderOption={(option) => (
                      <div className={cn("text-sm")}>{option.label}</div>
                    )}
                    renderOptionSelected={(option) => (
                      <p className={cn("text-sm")}>
                        {option ? option.label : t("ui.timeSelectInput.to")}
                      </p>
                    )}
                  />
                )}
                name={toId}
                control={control}
              />
            </FormControl>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimePicker;
