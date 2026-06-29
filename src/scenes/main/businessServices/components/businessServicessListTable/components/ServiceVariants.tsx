/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Controller, UseFormReturn } from "react-hook-form";
import { CreateServiceForm } from "..";
import { duration, FormControl, MenuItem } from "@mui/material";
import { useTranslations } from "next-intl";
import AppSelect from "@/components/ui/inputs/AppSelect";
import { Switch } from "@/components/ui/inputs/Switch";
import { useMemo, useState } from "react";
import TextField from "@/components/ui/inputs/TextField";
import MoneyIcon from "@/components/ui/icons/Money";
import ClockIcon from "@/components/ui/icons/Clock";
import { cn } from "@/utils/cn";
import DeleteIcon from "@/components/ui/icons/Delete";
import CustomSelect from "@/components/ui/inputs/Select";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";

type VariantRowProps = {
  showNameInput?: boolean;
  index: number;
  form: UseFormReturn<CreateServiceForm>;
  handleDelete?: (index: number) => void;
};

const VariantRow = ({ index, form, showNameInput, handleDelete }: VariantRowProps) => {
  const t = useTranslations();

  const timeOptions = useMemo(() => {
    const MAX_HOURS = 5;
    const STEP = 15;

    return Array.from({ length: (MAX_HOURS * 60) / STEP }).map((i, idx) => ({
      id: STEP * (idx + 1),
      value: STEP * (idx + 1),
    }));
  }, []);

  return (
    <div className="w-full">
      {showNameInput && (
        <TextField
          className="!py-[5px]"
          id={`options.${index}.name`}
          label={"Name"}
          placeholder={"Option name"}
          register={form.register}
          error={
            (form.formState.errors.options &&
              form.formState.errors.options[index]?.name) ||
            undefined
          }
          type="text"
          rules={{}}
          requiredHideSymbol
        />
      )}
      <div
        className={cn("w-full flex items-center justify-between gap-5", "sm:flex-col", {
          "mt-5": showNameInput,
        })}
      >
        <FormControl fullWidth>
          <p className="mb-2 text-sm text-greyPrimary">Duration</p>
          <Controller
            render={({ field, formState }) => {
              return (
                // <AppSelect
                //   classNames={{
                //     container: "!py-0 ",
                //     selectContainer: "w-full !border",
                //   }}
                //   id={`options.${index}.time_in_minutes`}
                //   variant="border-bottom"
                //   selectDropdownPosition="bottom" //TODO add right and keft position
                //   options={timeOptions}
                //   setValue={form.setValue}
                //   selectedOption={form.watch(`options.${index}.duration`)}
                //   renderLeftIcon={() => (
                //     <ClockIcon className="min-w-5 stroke-darkPrimary" />
                //   )}
                //   renderOption={(option) => {
                //     return <div className="flex items-center gap-2">{option.value}</div>;
                //   }}
                //   renderOptionSelected={(option) => {
                //     return <div className="flex items-center gap-2">{option?.value}</div>;
                //   }}
                // />

                <CustomSelect
                  IconComponent={ArrowSecondaryDownIcon}
                  id={`options.${index}.time_in_minutes`}
                  {...field}
                >
                  {timeOptions.map((to) => (
                    <MenuItem key={to.value} value={to.value}>
                      {to.value}
                    </MenuItem>
                  ))}
                </CustomSelect>
              );
            }}
            name={`options.${index}.duration`}
            control={form.control}
          />
        </FormControl>

        <TextField
          className="!py-[5px]"
          id={`options.${index}.price`}
          label={t(
            "businessServices.createUpdateModal.multipleDurationOptions.price.label"
          )}
          placeholder={t(
            "businessServices.createUpdateModal.multipleDurationOptions.price.label"
          )}
          iconLeft={<MoneyIcon />}
          iconRight={
            <span className="text-sm text-greyPrimary">{t("ui.labels.baht")}</span>
          }
          register={form.register}
          error={
            (form.formState.errors.options &&
              form.formState.errors.options[index]?.price) ||
            undefined
          }
          type="number"
          min={0}
          rules={{
            min: 0,
            // max: 1000,
            // pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
          }}
        />

        <div
          className="cursor-pointer"
          onClick={() => handleDelete && handleDelete(index)}
        >
          <DeleteIcon />
        </div>
      </div>
    </div>
  );
};

type Props = {
  form: UseFormReturn<CreateServiceForm>;
};

const ServiceVariants = ({ form }: Props) => {
  const [isUseMultipleVariants, setIsUseMultipleVariants] = useState(
    () => form.watch("options").length > 1
  );

  const options = useMemo(() => form.watch("options") || [], [form.watch("options")]);

  const toggleIsMultiple = () => {
    setIsUseMultipleVariants((p) => !p);
  };

  const addEmptyVariantHandler = () => {
    const emptyItem = { name: "", price: 0, duration: 0 };

    form.setValue("options", [...options, emptyItem]);
  };

  const removeVariantHandler = (index: number) => {
    const currr = form.watch("options");
    form.setValue(
      "options",
      currr.filter((_, idx) => idx !== index)
    );
  };

  return (
    <div className="w-full mt-5">
      <div className="w-full flex items-center gap-5">
        <label htmlFor="x1" className="mr-2 text-sm cursor-pointer text-greyPrimary">
          Multiple Duration Options
        </label>
        <Switch id="x1" checked={isUseMultipleVariants} onClick={toggleIsMultiple} />
      </div>

      <div className="w-full mt-5 flex flex-col gap-3">
        {isUseMultipleVariants ? (
          options.map((v, idx) => (
            <VariantRow
              key={idx}
              index={idx}
              form={form}
              showNameInput={isUseMultipleVariants}
              handleDelete={removeVariantHandler}
            />
          ))
        ) : (
          <VariantRow key={0} index={0} form={form} showNameInput={false} />
        )}
      </div>

      {isUseMultipleVariants && (
        <p
          className="mt-3 text-xs font-extrabold uppercase cursor-pointer text-purplePrimary"
          onClick={addEmptyVariantHandler}
        >
          add more options
        </p>
      )}
    </div>
  );
};

export default ServiceVariants;
