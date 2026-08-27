import { FC } from "react";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormControl, MenuItem } from "@mui/material";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import CustomSelect from "@/components/ui/inputs/Select";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import { useTranslations } from "@/i18n";
import { SignUpForm } from "..";

const BUSINESS_TYPES = ["Beauty salon", "Barbershop", "Spa", "Wellness", "Other"];

type Props = {
  form: UseFormReturn<SignUpForm, any, undefined>;
  handleSignUpStep: (value: SignUpForm) => void;
};

const CompanyInformationStep: FC<Props> = ({ form, handleSignUpStep }) => {
  const t = useTranslations();
  const isNextBtnActive =
    form.watch("companyName") && form.watch("business") && form.watch("phone");

  return (
    <div className="w-full mt-16">
      <div className="">
        <TextField
          id="companyName"
          label={t("ui.labels.storeName")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
          }}
          error={form.formState.errors.companyName}
          requiredHideSymbol
        />
      </div>
      <div className="mt-5">
        <FormControl fullWidth>
          <p className="mb-2 text-sm text-greyPrimary">Business type</p>
          <Controller
            render={({ field, formState }) => (
              <CustomSelect
                id="business"
                placeholder={t("ui.labels.startTyping")}
                IconComponent={ArrowSecondaryDownIcon}
                error={!!formState.errors.business}
                {...field}
              >
                {BUSINESS_TYPES.map((businessType) => (
                  <MenuItem key={businessType} value={businessType}>
                    {businessType}
                  </MenuItem>
                ))}
              </CustomSelect>
            )}
            name="business"
            control={form.control}
            rules={{ required: true }}
          />
        </FormControl>
      </div>
      <div className="mt-2">
        <TextField
          id="phone"
          label={t("ui.labels.phone")}
          placeholder={t("ui.labels.startTyping")}
          type="tel"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
            // pattern: PHONE_NUMBER_REGEXP,
          }}
          error={form.formState.errors.phone}
          requiredHideSymbol
        />
      </div>

      <div className="py-12 flex gap-[100px] sm:gap-0 sm:justify-between">
        <Button variant="resting" onClick={() => form.setValue("_step", 1)}>
          {t("ui.actions.cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={form.handleSubmit(handleSignUpStep)}
          disabled={!isNextBtnActive}
        >
          {t("ui.actions.next")}
        </Button>
      </div>
    </div>
  );
};

export default CompanyInformationStep;
