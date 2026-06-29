import React, { FC } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControlLabel } from "@mui/material";

import Button from "@/components/ui/button";
import RadioButton from "@/components/ui/inputs/RadioButton";
import TextField from "@/components/ui/inputs/TextField";
import { Link, useTranslations } from "@/i18n";
import { SignUpForm } from "..";
import { EMAIL_REGEXP, PASSWORD_REGEXP } from "@/utils/regexps";

type Props = {
  form: UseFormReturn<SignUpForm, any, undefined>;
  handleSignUpStep: (value: SignUpForm) => void;
};

const EmailPasswordStep: FC<Props> = ({ form, handleSignUpStep }) => {
  const t = useTranslations();
  return (
    <div className="w-full mt-16">
      <div className="">
        <TextField
          id="firtsName"
          label={t("ui.labels.firstName")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
          }}
          error={form.formState.errors.firtsName}
          requiredHideSymbol
        />
      </div>
      <div className="mt-2">
        <TextField
          id="lastName"
          label={t("ui.labels.lastName")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
          }}
          error={form.formState.errors.lastName}
          requiredHideSymbol
        />
      </div>
      <div className="mt-2">
        <TextField
          id="email"
          label={t("ui.labels.email")}
          placeholder={t("ui.labels.startTyping")}
          type="email"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
            pattern: {
              value: EMAIL_REGEXP,
              message: "Invalid email",
            },
          }}
          error={form.formState.errors.email}
          showError
          requiredHideSymbol
        />
      </div>
      {/* <div className="mt-2">
        <TextField
          id="password"
          label={t("ui.labels.password")}
          placeholder={t("ui.labels.startTyping")}
          type="password"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
            pattern: {
              value: PASSWORD_REGEXP,
              message: t("ui.errors.invalidPassword"),
            },
          }}
          error={form.formState.errors.password}
          showError
          requiredHideSymbol
        />
      </div> */}
      {/* <div className="mt-2">
        <TextField
          id="confirmPassword"
          label={t("ui.labels.confirmPassword")}
          placeholder={t("ui.labels.startTyping")}
          type="password"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
            validate: (value, formState) => {
              return value === formState.password
                ? true
                : t("ui.errors.passwordDontMatch");
            },
          }}
          error={form.formState.errors.confirmPassword}
          showError
          requiredHideSymbol
        />
      </div> */}

      <div className="mt-2">
        <FormControlLabel
          checked={Boolean(form.watch("agreeTermsAndCond"))}
          control={
            <RadioButton
              onClick={() => {
                form.setValue("agreeTermsAndCond", !form.watch("agreeTermsAndCond"));
              }}
            />
          }
          label={
            <p className="text-sm font-bold text-[inherit]">
              {t.rich("auth.iAgreeTerms", {
                link: (t) => (
                  <Link
                    href="/terms"
                    className="transition-colors underline hover:text-purplePrimary"
                  >
                    {t}
                  </Link>
                ),
              })}
            </p>
          }
        />
      </div>

      <div className="mt-2">
        <FormControlLabel
          checked={Boolean(form.watch("agreeNewsSubscribe"))}
          control={
            <RadioButton
              onClick={() => {
                form.setValue("agreeNewsSubscribe", !form.watch("agreeNewsSubscribe"));
              }}
            />
          }
          label={
            <p className="text-sm font-bold text-[inherit]">{t("auth.iAgreeNews")}</p>
          }
        />
      </div>

      <div className="py-12 flex gap-[100px] sm:gap-0 sm:justify-between">
        <Button variant="primary" onClick={form.handleSubmit(handleSignUpStep)}>
          {t("auth.signUp")}
        </Button>
        <Link href="/sign-in">
          <Button variant="resting">{t("auth.signIn")}</Button>
        </Link>
      </div>
    </div>
  );
};

export default EmailPasswordStep;
