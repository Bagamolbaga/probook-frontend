/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useTranslations, useRouter } from "@/i18n";

import { useApiClient } from "@/api/context";
import { PASSWORD_REGEXP } from "@/utils/regexps";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import { toaster } from "@/components/ui/toaster";
import LogoIcon from "@/components/ui/icons/LogoFull";
import ImageSignUp from "@/assets/business_signUp_step_1.svg";
import ImageRecover from "@/assets/business_recoverPassweord.svg";
import Spinner from "@/components/ui/loaders/Spinner";

type Form = {
  password: string;
  confirmPassword: string;
};

const EnterPasswordScene = ({
  token,
  variant,
}: {
  token: string;
  variant: "SIGN_UP" | "RECOVER_PASSWORD";
}) => {
  const t = useTranslations();
  const apiClient = useApiClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Form>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const apiCallHandler = async (formData: Form) => {
    if (variant === "SIGN_UP") {
      return apiClient.businessUser.setPassword({
        token,
        password: formData.password,
      });
    }

    if (variant === "RECOVER_PASSWORD") {
      return apiClient.businessUser.recoverPasswordSetPassword({
        token,
        password: formData.password,
      });
    }
  };

  const handleEnterPassword = async (formData: Form) => {
    try {
      if (formData.password === formData.confirmPassword) {
        setIsLoading(true);

        const res = await apiCallHandler(formData);

        if (res) {
          toaster.success(t("auth.recoverPasswordPage.passwordSetSuccess"), {
            onClose: () => {
              router.push("/sign-in");
            }
          })
        }
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const submitBtnIsActive = useMemo(() => {
    const formData = form.getValues();

    if (formData.password && formData.confirmPassword) return true;

    return false;
  }, [form.watch()]);

  return (
    <div className="relative w-full min-h-screen flex bg-darkPrimary">
      <div className="w-2/3 min-h-screen px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm rounded-r-[20px] bg-white sm:w-full sm:rounded-none">
        <div className="min-h-screen max-w-[770px] ml-auto flex flex-col justify-end">
          <div className="min-h-screen py-20 pr-[240px] rounded-r-[20px] bg-white md:pr-[120px] sm:w-full sm:pr-0 sm:flex sm:flex-col sm:items-center">
            <h3 className="text-[32px] sm:text-center">{t("auth.title1")}</h3>
            <h3 className="text-[32px] sm:text-center">{t("auth.title2")}</h3>
            <p className="mt-6 text-sm text-greyPrimary sm:text-center">
              {t("auth.subTitle")}
            </p>

            <div className="w-full mt-16">
              <div className="mt-2">
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
              </div>
              <div className="mt-2">
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
              </div>

              <div className="py-12 flex gap-[100px] sm:gap-0 sm:justify-between">
                <Button
                  variant="primary"
                  onClick={form.handleSubmit(handleEnterPassword)}
                  disabled={!submitBtnIsActive || isLoading}
                >
                  {isLoading ? <Spinner className="size-5" /> : t("ui.actions.finish")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 w-1/3 h-screen flex justify-center items-center overflow-hidden bg-darkPrimary sm:hidden">
        <LogoIcon className="absolute top-[10%] left-[50%] -translate-x-[50%]" />
        {variant === "SIGN_UP" && (
          <Image
            className="h-[55vw] object-left object-cover"
            src={ImageSignUp}
            alt="Bowers"
          />
        )}
        {variant === "RECOVER_PASSWORD" && (
          <Image
            className="h-full object-right object-cover"
            src={ImageRecover}
            alt="Bowers"
          />
        )}
      </div>
    </div>
  );
};

export default EnterPasswordScene;
