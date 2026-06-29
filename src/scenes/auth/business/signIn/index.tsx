"use client";
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { FormControlLabel } from "@mui/material";
import { Link, useRouter, useTranslations } from "@/i18n";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import RadioButton from "@/components/ui/inputs/RadioButton";

import LogoIcon from "@/components/ui/icons/LogoFull";
import TwitterBrandIcon from "@/components/ui/icons/TwitterBrand";
import GoogleBrandIcon from "@/components/ui/icons/GoogleBrand";
import FacebookBrandIcon from "@/components/ui/icons/FacebookBrand";
import { EMAIL_REGEXP, PASSWORD_REGEXP } from "@/utils/regexps";
import ImageStep1 from "@/assets/business_signIn_step_1.svg";
import { toaster } from "@/components/ui/toaster";

type SignInForm = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const BusinessSignInScene = () => {
  const t = useTranslations();
  const router = useRouter();

  const { handleSubmit, register, reset, clearErrors, watch, setValue, formState } =
    useForm<SignInForm>({
      mode: "onSubmit",
    });

  const handleSignIn = async (data: SignInForm) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (res?.ok) {
        router.push("/dashboard");
      } else {
        toaster.error("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      toaster.error("Invalid credentials");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex bg-darkPrimary">
      <div className="w-2/3 min-h-screen px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm rounded-r-[20px] bg-white sm:w-full sm:rounded-none">
        <div className="min-h-screen max-w-[770px] ml-auto flex flex-col justify-end">
          <div className="min-h-screen py-20 pr-[240px] rounded-r-[20px] bg-white md:pr-[120px] sm:w-full sm:pr-0 sm:flex sm:flex-col sm:items-center">
            <h3 className="text-[32px] sm:text-center">
              {t("auth.title1")}
            </h3>
            <h3 className="text-[32px] sm:text-center"> {t("auth.title2")}</h3>
            <p className="mt-6 text-sm text-greyPrimary sm:text-center">
              {t("auth.subTitle")}
            </p>
            <div className="w-full mt-16">
              <div className="">
                <TextField
                  id="email"
                  label={t("ui.labels.email")}
                  placeholder={t("ui.labels.startTyping")}
                  type="email"
                  register={register}
                  rules={{
                    required: t("ui.errors.fieldIsRequired"),
                    pattern: {
                      value: EMAIL_REGEXP,
                      message: t("ui.errors.invalidEmail"),
                    },
                  }}
                  error={formState.errors.email}
                  showError
                  requiredHideSymbol
                />
              </div>
              <div className="mt-2">
                <TextField
                  id="password"
                  label={t("ui.labels.password")}
                  placeholder={t("ui.labels.startTyping")}
                  type="password"
                  register={register}
                  rules={{
                    required: t("ui.errors.fieldIsRequired"),
                    pattern: {
                      value: PASSWORD_REGEXP,
                      message: t("ui.errors.invalidPassword"),
                    },
                  }}
                  error={formState.errors.password}
                  showError
                  requiredHideSymbol
                />
              </div>
              <div className="mt-8 flex justify-between items-center">
                <FormControlLabel
                  checked={Boolean(watch("rememberMe"))}
                  control={
                    <RadioButton
                      onClick={() => {
                        setValue("rememberMe", !watch("rememberMe"));
                      }}
                    />
                  }
                  label={
                    <p className="text-sm font-bold text-[inherit]">
                      {t("auth.rememberMe")}
                    </p>
                  }
                />
                <Link href="/recovery-password">
                  <p className="text-sm font-bold transition-colors text-purplePrimary hover:text-purpleDark">
                    {t("auth.recoverPassword")}
                  </p>
                </Link>
              </div>

              <div className="py-12 flex gap-[100px] sm:gap-0 sm:justify-between">
                <Button variant="primary" onClick={handleSubmit(handleSignIn)}>
                  {t("auth.signIn")}
                </Button>
                {/* <Link href="/sign-up">
                  <Button variant="resting">{t("auth.signUp")}</Button>
                </Link> */}
              </div>
              {/* <div className="flex items-center gap-[6px]">
                <TwitterBrandIcon className="cursor-pointer transition-all fill-greyPrimary hover:fill-purplePrimary" />
                <div>
                  <GoogleBrandIcon className="cursor-pointer transition-all fill-greyPrimary hover:fill-purplePrimary" />
                </div>
                <FacebookBrandIcon className="cursor-pointer transition-all fill-greyPrimary hover:fill-purplePrimary" />
                <p className="ml-2 text-sm text-greyPrimary">{t("auth.orSignInWith")}</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 w-1/3 h-screen flex justify-center items-center overflow-hidden bg-darkPrimary sm:hidden">
        <Link href="/">
          <LogoIcon className="absolute z-10 top-[10%] left-[50%] -translate-x-[50%]" />
        </Link>
        <div className="relative w-full h-full">
          <Image
            className="absolute top-0 h-full mt-10 object-left object-cover"
            src={ImageStep1}
            alt="Bowers"
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessSignInScene;
