"use client";

import axios from "axios";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ImageStep1 from "@/assets/business_signIn_step_1.svg";
import Button from "@/components/ui/button";
import GoogleBrandIcon from "@/components/ui/icons/GoogleBrand";
import LogoIcon from "@/components/ui/icons/LogoFull";
import TextField from "@/components/ui/inputs/TextField";
import { toaster } from "@/components/ui/toaster";
import { Link, useLocale, useTranslations } from "@/i18n";
import { getSafeCallbackUrl } from "@/utils/auth";
import { EMAIL_REGEXP, PASSWORD_REGEXP } from "@/utils/regexps";

type SignInForm = {
  email: string;
  password: string;
  code: string;
  firstName: string;
  lastName: string;
  phone: string;
};

type AuthMode = "password" | "email-otp";
type OtpStep = "request" | "verify" | "profile";

const PROFILE_REQUIRED = "EMAIL_OTP_PROFILE_REQUIRED:";

const BusinessSignInScene = () => {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = getSafeCallbackUrl(searchParams.get("callbackUrl"), locale);
  const [mode, setMode] = useState<AuthMode>(
    searchParams.get("mode") === "email-otp" ? "email-otp" : "password"
  );
  const [otpStep, setOtpStep] = useState<OtpStep>("request");
  const [onboardingToken, setOnboardingToken] = useState("");
  const [secondsUntilResend, setSecondsUntilResend] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleSubmit, register, getValues, resetField, formState } =
    useForm<SignInForm>({ mode: "onSubmit" });

  useEffect(() => {
    if (secondsUntilResend <= 0) return;
    const timer = window.setInterval(
      () => setSecondsUntilResend((value) => Math.max(0, value - 1)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [secondsUntilResend]);

  const completeSignIn = () => {
    router.replace(callbackUrl);
    router.refresh();
  };

  const handlePasswordSignIn = async (data: SignInForm) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.ok) completeSignIn();
      else toaster.error(t("auth.otp.invalidCredentials"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const requestCode = async () => {
    const email = getValues("email");
    if (!email || !EMAIL_REGEXP.test(email)) {
      toaster.error(t("ui.errors.invalidEmail"));
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/email-otp/request`, {
        email,
        locale,
      });
      setOtpStep("verify");
      setSecondsUntilResend(60);
      resetField("code");
      toaster.success(t("auth.otp.codeSent"));
    } catch {
      toaster.error(t("auth.otp.requestFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async (data: SignInForm) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("email-otp", {
        redirect: false,
        email: data.email,
        code: data.code,
      });
      if (result?.ok) {
        completeSignIn();
        return;
      }

      const error = result?.error ? decodeURIComponent(result.error) : "";
      const markerIndex = error.indexOf(PROFILE_REQUIRED);
      if (markerIndex >= 0) {
        setOnboardingToken(error.slice(markerIndex + PROFILE_REQUIRED.length));
        setOtpStep("profile");
        return;
      }
      toaster.error(t("auth.otp.invalidCode"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeProfile = async (data: SignInForm) => {
    setIsSubmitting(true);
    try {
      const result = await signIn("email-otp", {
        redirect: false,
        onboardingToken,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
      });
      if (result?.ok) completeSignIn();
      else toaster.error(t("auth.otp.profileFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setOtpStep("request");
    setOnboardingToken("");
  };

  const renderOtpForm = () => {
    if (otpStep === "profile") {
      return (
        <form
          className="mt-10 space-y-4"
          onSubmit={handleSubmit(completeProfile)}
          aria-label={t("auth.otp.profileTitle")}
        >
          <h2 className="text-xl font-bold">{t("auth.otp.profileTitle")}</h2>
          <p className="text-sm text-greyPrimary">{t("auth.otp.profileDescription")}</p>
          <TextField
            id="firstName"
            label={t("auth.otp.firstName")}
            register={register}
            rules={{ required: t("ui.errors.fieldIsRequired") }}
            error={formState.errors.firstName}
            showError
            autoFocus
          />
          <TextField
            id="lastName"
            label={t("auth.otp.lastName")}
            register={register}
            rules={{ required: t("ui.errors.fieldIsRequired") }}
            error={formState.errors.lastName}
            showError
          />
          <TextField
            id="phone"
            label={t("auth.otp.phone")}
            type="tel"
            register={register}
            error={formState.errors.phone}
            showError
          />
          <Button
            className="w-full"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("auth.otp.working") : t("auth.otp.finish")}
          </Button>
        </form>
      );
    }

    return (
      <form
        className="mt-10 space-y-4"
        onSubmit={handleSubmit(otpStep === "request" ? requestCode : verifyCode)}
        aria-label={t("auth.otp.signInWithCode")}
      >
        <TextField
          id="email"
          label={t("ui.labels.email")}
          placeholder={t("ui.labels.startTyping")}
          type="email"
          register={register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
            pattern: { value: EMAIL_REGEXP, message: t("ui.errors.invalidEmail") },
          }}
          error={formState.errors.email}
          showError
          disabled={otpStep === "verify"}
          autoFocus
        />
        {otpStep === "verify" && (
          <>
            <TextField
              id="code"
              label={t("auth.otp.code")}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              register={register}
              rules={{
                required: t("ui.errors.fieldIsRequired"),
                pattern: { value: /^\d{6}$/, message: t("auth.otp.invalidCode") },
              }}
              error={formState.errors.code}
              showError
              autoFocus
            />
            <button
              type="button"
              className="text-sm font-bold text-purplePrimary disabled:text-greyPrimary"
              onClick={() => void requestCode()}
              disabled={secondsUntilResend > 0 || isSubmitting}
            >
              {secondsUntilResend > 0
                ? t("auth.otp.resendIn", { seconds: secondsUntilResend })
                : t("auth.otp.resend")}
            </button>
          </>
        )}
        <Button
          className="w-full"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("auth.otp.working")
            : otpStep === "request"
              ? t("auth.otp.sendCode")
              : t("auth.otp.verify")}
        </Button>
      </form>
    );
  };

  return (
    <div className="relative flex min-h-screen w-full bg-darkPrimary">
      <div className="min-h-screen w-2/3 rounded-r-[20px] bg-white px-layoutLeftRight md:px-layoutLeftRight_md sm:w-full sm:rounded-none sm:px-layoutLeftRight_sm">
        <div className="ml-auto flex min-h-screen max-w-[770px] flex-col justify-center pr-[240px] md:pr-[120px] sm:items-center sm:pr-0">
          <div className="w-full max-w-[460px] py-12">
            <h1 className="text-[32px] sm:text-center">{t("auth.title1")}</h1>
            <p className="mt-3 text-sm text-greyPrimary sm:text-center">
              {mode === "email-otp" ? t("auth.otp.description") : t("auth.subTitle")}
            </p>

            <div
              className="mt-8 grid grid-cols-2 gap-2 rounded-lg bg-greyBackground p-1"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "password"}
                className={`rounded-md px-3 py-2 text-sm font-bold ${mode === "password" ? "bg-white text-darkPrimary" : "text-greyPrimary"}`}
                onClick={() => switchMode("password")}
              >
                {t("auth.otp.passwordMode")}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "email-otp"}
                className={`rounded-md px-3 py-2 text-sm font-bold ${mode === "email-otp" ? "bg-white text-darkPrimary" : "text-greyPrimary"}`}
                onClick={() => switchMode("email-otp")}
              >
                {t("auth.otp.codeMode")}
              </button>
            </div>

            {mode === "email-otp" ? (
              renderOtpForm()
            ) : (
              <form
                className="mt-10 space-y-4"
                onSubmit={handleSubmit(handlePasswordSignIn)}
              >
                <TextField
                  id="email"
                  label={t("ui.labels.email")}
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
                />
                <TextField
                  id="password"
                  label={t("ui.labels.password")}
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
                />
                <div className="flex items-center justify-between pt-3">
                  <Link
                    className="text-sm font-bold text-purplePrimary"
                    href="/recovery-password"
                  >
                    {t("auth.recoverPassword")}
                  </Link>
                </div>
                <Button
                  className="w-full"
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {t("auth.signIn")}
                </Button>
                <button
                  className="flex items-center gap-2 text-sm text-greyPrimary"
                  type="button"
                  aria-label={t("auth.signInWithGoogle")}
                  onClick={() => void signIn("google", { callbackUrl })}
                >
                  <GoogleBrandIcon className="fill-greyPrimary" />
                  {t("auth.orSignInWith")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="fixed right-0 top-0 flex h-screen w-1/3 items-center justify-center overflow-hidden bg-darkPrimary sm:hidden">
        <Link href="/">
          <LogoIcon className="absolute left-1/2 top-[10%] z-10 -translate-x-1/2" />
        </Link>
        <Image
          src={ImageStep1 as unknown as string}
          className="mt-10 h-full object-cover object-left"
          alt=""
          priority
        />
      </div>
    </div>
  );
};

export default BusinessSignInScene;
