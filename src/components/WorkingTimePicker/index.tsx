/* eslint-disable react-hooks/exhaustive-deps */
import { FormControl } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AppSelect from "../ui/inputs/AppSelect";
import Button from "../ui/button";
import CloseIcon from "../ui/icons/Close";
import { TTimeSlot } from "@/constants/timeSlots";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";

type FormData = {
  from?: TTimeSlot;
  to?: TTimeSlot;
  breakFrom?: TTimeSlot;
  breakTo?: TTimeSlot;
};

type Props = {
  options: TTimeSlot[];
  defaultValue?: FormData;
  handleSelectFrom: (slot?: TTimeSlot) => void;
  handleSelectTo: (slot?: TTimeSlot) => void;
  handleSelectBreakFrom: (slot?: TTimeSlot) => void;
  handleSelectBreakTo: (slot?: TTimeSlot) => void;
};

const WorkingTimePicker = ({
  options,
  defaultValue,
  handleSelectFrom,
  handleSelectTo,
  handleSelectBreakFrom,
  handleSelectBreakTo,
}: Props) => {
  const t = useTranslations();
  const form = useForm<FormData>({
    defaultValues: defaultValue,
  });

  const [isShowBreakTime, setIsShowBreakTime] = useState(
    Boolean(defaultValue?.breakFrom || defaultValue?.breakTo)
  );

  const selectedOptionShiftTimeSlots = useMemo(() => {
    const shift = form.getValues();

    if (!shift) return undefined;

    const fromTimeSlot = shift.from && { ...shift.from, id: shift.from.label };
    const toTimeSlot = shift.to && { ...shift.to, id: shift.to.label };
    const fromBreakTimeSlot = shift.breakFrom && {
      ...shift.breakFrom,
      id: shift.breakFrom.label,
    };
    const toBreakTimeSlot = shift.breakTo && {
      ...shift.breakTo,
      id: shift.breakTo.label,
    };

    return {
      fromTimeSlot,
      toTimeSlot,
      fromBreakTimeSlot,
      toBreakTimeSlot,
    };
  }, [
    form.watch("from"),
    form.watch("to"),
    form.watch("breakFrom"),
    form.watch("breakTo"),
  ]);

  const fromOptions = useMemo(
    () =>
      form.watch("to") ? options.filter((s) => s.slot < form.watch("to")!.slot) : options,
    [options, form.watch("to")]
  );
  const toOptions = useMemo(
    () =>
      form.watch("from")
        ? options.filter((s) => s.slot > form.watch("from")!.slot)
        : options,
    [options, form.watch("from")]
  );

  const breakFromOptions = useMemo(() => {
    if (form.watch("from") && form.watch("to")) {
      return options.filter(
        (s) => s.slot > form.watch("from")!.slot && s.slot < form.watch("to")!.slot
      );
    }

    return options;
  }, [options, form.watch("from"), form.watch("to")]);

  const breakToOptions = useMemo(() => {
    if (form.watch("from") && form.watch("to")) {
      return options.filter(
        (s) => s.slot > form.watch("from")!.slot && s.slot < form.watch("to")!.slot
      );
    }

    return options;
  }, [options, form.watch("from"), form.watch("to")]);

  const handleShowBreakTime = () => {
    setIsShowBreakTime(true);
  };

  const handleHideWorkingTime = () => {
    handleHideBreakTime();

    form.setValue("from", undefined);
    form.setValue("to", undefined);
  };

  const handleHideBreakTime = () => {
    form.setValue("breakFrom", undefined);
    form.setValue("breakTo", undefined);

    setIsShowBreakTime(false);
  };

  useEffect(() => {
    handleSelectFrom(form.watch("from"));
  }, [form.watch("from")]);

  useEffect(() => {
    handleSelectTo(form.watch("to"));
  }, [form.watch("to")]);

  useEffect(() => {
    handleSelectBreakFrom(form.watch("breakFrom"));
  }, [form.watch("breakFrom")]);

  useEffect(() => {
    handleSelectBreakTo(form.watch("breakTo"));
  }, [form.watch("breakTo")]);

  return (
    <div className="w-full mt-2 flex items-center gap-5 sm:flex-col">
      <div className="w-full">
        <p className="mb-2 text-sm text-greyPrimary">
          {t("ui.components.workingTimePicker.workingTime")}
        </p>
        <div className="w-full flex items-center gap-2">
          <FormControl fullWidth>
            <Controller
              render={() => (
                <AppSelect
                  id={"from"}
                  classNames={{
                    selectContainer: "w-full",
                  }}
                  selectDropdownPosition="top"
                  options={fromOptions.map((s) => ({ id: s.label, ...s }))}
                  selectedOption={selectedOptionShiftTimeSlots?.fromTimeSlot}
                  setValue={form.setValue}
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
              name={"from"}
              control={form.control}
            />
          </FormControl>
          <FormControl fullWidth>
            <Controller
              render={() => (
                <AppSelect
                  id={"to"}
                  classNames={{
                    selectContainer: "w-full",
                  }}
                  selectDropdownPosition="top"
                  options={toOptions.map((s) => ({ id: s.label, ...s }))}
                  selectedOption={selectedOptionShiftTimeSlots?.toTimeSlot}
                  setValue={form.setValue}
                  renderOption={(option) => (
                    <p className={cn("text-sm")}>{option.label}</p>
                  )}
                  renderOptionSelected={(option) => (
                    <p className={cn("text-sm")}>
                      {option ? option.label : t("ui.timeSelectInput.to")}
                    </p>
                  )}
                />
              )}
              name={"to"}
              control={form.control}
            />
          </FormControl>
          <Button variant="red-outline" className="!p-1" onClick={handleHideWorkingTime}>
            <CloseIcon className="!stroke-redPrimary" />
          </Button>
        </div>
      </div>
      <div className="w-full">
        <p className="mb-2 text-sm text-greyPrimary">
          {t("ui.components.workingTimePicker.breakTime")}
        </p>
        {isShowBreakTime ? (
          <div className="w-full flex items-center gap-2">
            <FormControl fullWidth>
              <Controller
                render={() => (
                  <AppSelect
                    id={"breakFrom"}
                    classNames={{
                      selectContainer: "w-full",
                    }}
                    selectDropdownPosition="top"
                    options={breakFromOptions.map((s) => ({ id: s.label, ...s }))}
                    selectedOption={selectedOptionShiftTimeSlots?.fromBreakTimeSlot}
                    setValue={form.setValue}
                    renderOption={(option) => (
                      <p className={cn("text-sm")}>{option.label}</p>
                    )}
                    renderOptionSelected={(option) => (
                      <p className={cn("text-sm")}>
                        {option
                          ? option.label
                          : t("ui.components.workingTimePicker.break")}
                      </p>
                    )}
                    renderEmptyOption={() => (
                      <div className="py-[6px] pl-2 pr-1">
                        <p className={"text-sm text-greyPrimary"}>
                          {t("ui.components.workingTimePicker.noOption")}
                        </p>
                      </div>
                    )}
                    error={!form.watch("breakFrom")}
                  />
                )}
                name={"breakFrom"}
                rules={{ required: true }}
                control={form.control}
              />
            </FormControl>
            <FormControl fullWidth>
              <Controller
                render={() => (
                  <AppSelect
                    id={"breakTo"}
                    classNames={{
                      selectContainer: "w-full",
                    }}
                    selectDropdownPosition="top"
                    options={breakToOptions.map((s) => ({ id: s.label, ...s }))}
                    selectedOption={selectedOptionShiftTimeSlots?.toBreakTimeSlot}
                    setValue={form.setValue}
                    renderOption={(option) => (
                      <p className={cn("text-sm")}>{option.label}</p>
                    )}
                    renderOptionSelected={(option) => (
                      <p className={cn("text-sm")}>
                        {option
                          ? option.label
                          : t("ui.components.workingTimePicker.break")}
                      </p>
                    )}
                    renderEmptyOption={() => (
                      <div className="py-[6px] pl-2 pr-1">
                        <p className={"text-sm text-greyPrimary"}>
                          {t("ui.components.workingTimePicker.noOption")}
                        </p>
                      </div>
                    )}
                    error={!form.watch("breakTo")}
                  />
                )}
                name={"breakTo"}
                rules={{ required: true }}
                control={form.control}
              />
            </FormControl>

            <Button variant="red-outline" className="!p-1" onClick={handleHideBreakTime}>
              <CloseIcon className="!stroke-redPrimary" />
            </Button>
          </div>
        ) : (
          <div>
            <Button
              variant="dark-outline"
              className="!py-3"
              onClick={handleShowBreakTime}
            >
              {t("ui.components.workingTimePicker.add")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingTimePicker;
