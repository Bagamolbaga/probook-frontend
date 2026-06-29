/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { ComponentProps, FC, useEffect, useRef, useState } from "react";
import TextField from "./TextField";
import DatePicker from "../DatePicker";
import { addDays, format, isValid, parse } from "date-fns";
import { UseFormSetValue, useForm } from "react-hook-form";
import { useClickOutside } from "@/hooks/useClickOutside";
import Button from "../button";
import { useTranslations } from "next-intl";

type TextFieldProps = ComponentProps<typeof TextField>;
type DatePickerProps = ComponentProps<typeof DatePicker>;

type Props = {
  isOpen?: boolean;
  showHeaderButtons?: boolean;
  value: Date | null;
  formSetValue: UseFormSetValue<any>;
  textField: TextFieldProps;
  datePicker: DatePickerProps;
};

const DatePickerField: FC<Props> = ({
  isOpen,
  value,
  showHeaderButtons,
  formSetValue,
  textField,
  datePicker,
}) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    register,
    watch,
    setValue: setValueLocal,
  } = useForm<{ date: string }>({
    defaultValues: {
      date: value ? format(value, "dd/MM/yyyy") : "",
    },
  });
  const [isOpenLocal, setIsOpenLocal] = useState(false);

  const showDatePickerHandler = () => {
    setIsOpenLocal(true);
  };

  const hideDatePickerHandler = () => {
    setIsOpenLocal(false);
  };

  useClickOutside(containerRef, hideDatePickerHandler);

  const handleDayPickerSelect = (date: Date | undefined) => {
    if (!date) {
      // formSetValue(textField.id, null); // keep the input value in sync
    } else {
      formSetValue(textField.id, date); // keep the input value in sync
      setValueLocal("date", format(date, "dd/MM/yyyy"));
      hideDatePickerHandler();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedDate = parse(e.target.value, "dd/MM/yyyy", new Date());

    // if (isValid(parsedDate)) {
    //   formSetValue(textField.id, parsedDate); // keep the input value in sync
    // }
  };

  useEffect(() => {
    const valueString = watch("date");
    const parsedDate = parse(valueString, "dd/MM/yyyy", new Date());

    if (isValid(parsedDate)) {
      formSetValue(textField.id, parsedDate); // keep the input value in sync
    }
  }, [watch("date")]);

  useEffect(() => {
    if (value) {
      setValueLocal("date", format(value, "dd/MM/yyyy"));
    }
  }, []);

  const isSelectedToday = watch("date") === format(new Date(), "dd/MM/yyyy");
  const isSelectedTomorrow =
    watch("date") === format(addDays(new Date(), 1), "dd/MM/yyyy");

  return (
    <div ref={containerRef} className="relative w-full flex flex-col">
      <TextField
        placeholder="dd/MM/yyyy"
        {...textField}
        register={register}
        onClick={showDatePickerHandler}
      />
      {(isOpenLocal || isOpen) && (
        <div className="absolute top-full left-0 z-20 min-w-[280px] w-full mt-2 rounded-lg bg-white">
          {showHeaderButtons && (
            <div className="w-full px-2 pt-2 flex items-center justify-between gap-2">
              <Button
                className="!py-1 !px-3 !rounded-full text-sm font-bold"
                variant={
                  !isSelectedToday && !isSelectedTomorrow ? "primary" : "resting-active"
                }
                onClick={() => formSetValue(textField.id, null)}
              >
                {t("ui.dateSelectInput.anyDate")}
              </Button>
              <Button
                className="!py-1 !px-3 !rounded-full text-sm font-bold"
                variant={isSelectedToday ? "primary" : "resting-active"}
                onClick={() => formSetValue(textField.id, new Date())}
              >
                {t("ui.dateSelectInput.today")}
              </Button>
              <Button
                className="!py-1 !px-3 !rounded-full text-sm font-bold"
                variant={isSelectedTomorrow ? "primary" : "resting-active"}
                onClick={() => formSetValue(textField.id, addDays(new Date(), 1))}
              >
                {t("ui.dateSelectInput.tomorrow")}
              </Button>
            </div>
          )}
          <DatePicker
            mode="single"
            {...datePicker}
            selected={value as any}
            onSelect={handleDayPickerSelect as any}
          />
        </div>
      )}
    </div>
  );
};

export default DatePickerField;
