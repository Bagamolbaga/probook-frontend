/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useTranslations, useRouter } from "@/i18n";

import { useApiClient } from "@/api/context";
import { EMAIL_REGEXP } from "@/utils/regexps";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import { toaster } from "@/components/ui/toaster";
import LogoIcon from "@/components/ui/icons/LogoFull";
import ImageStep from "@/assets/business_recoverPassweord.svg";
import Spinner from "@/components/ui/loaders/Spinner";

type Form = {
  email: string;
};

const RecoveryPasswordScene = () => {
  const t = useTranslations();
  const apiClient = useApiClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<Form>({
    defaultValues: {
      email: "",
    },
  });

  const handleEnterPassword = async (formData: Form) => {
    try {
      if (formData.email) {
        setIsLoading(true)

        const res = await apiClient.businessUser.recoverPassword({
          email: formData.email,
        });

        if (res) {
          toaster.success(t("auth.recoverPasswordPage.emailSendSuccess"), {
            onClose: () => {
              router.push("/sign-in");
            }
          })
        }
      }
    } catch (error) {
      toaster.error(t("ui.errors.wentWrong"));
    } finally {
      setIsLoading(false)
    }
  };

  const submitBtnIsActive = useMemo(() => {
    const formData = form.getValues()
    
    if (formData.email) return true

    return false
  }, [form.watch()])

  return (
    <div className="relative w-full min-h-screen flex bg-darkPrimary">
      <div className="w-2/3 min-h-screen px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm rounded-r-[20px] bg-white sm:w-full sm:rounded-none">
        <div className="min-h-screen max-w-[770px] ml-auto flex flex-col justify-end">
          <div className="min-h-screen py-20 pr-[240px] rounded-r-[20px] bg-white md:pr-[120px] sm:w-full sm:pr-0 sm:flex sm:flex-col sm:items-center">
            <h3 className="text-[32px] sm:text-center">{t("auth.recoverPasswordPage.title1")}</h3>
            <h3 className="text-[32px] sm:text-center">{t("auth.recoverPasswordPage.title2")}</h3>
            <p className="mt-6 text-sm text-greyPrimary sm:text-center">
              {t("auth.subTitle")}
            </p>

            <div className="w-full mt-16">
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
                      message: t("ui.errors.invalidEmail"),
                    },
                  }}
                  error={form.formState.errors.email}
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
                  {isLoading ? <Spinner className="size-5"/> : t("auth.recoverPasswordPage.recoverBtn")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 w-1/3 h-screen flex justify-center items-center overflow-hidden bg-darkPrimary sm:hidden">
        <LogoIcon className="absolute top-[10%] left-[50%] -translate-x-[50%]" />
        <Image
          className="h-full object-right object-cover"
          src={ImageStep}
          alt="Bowers"
        />
      </div>
    </div>
  );
};

export default RecoveryPasswordScene;
