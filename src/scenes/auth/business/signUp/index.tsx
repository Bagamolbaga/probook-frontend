/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";

import LogoIcon from "@/components/ui/icons/LogoFull";
import ImageStep1 from "@/assets/business_signUp_step_1.svg";
import ImageStep2 from "@/assets/business_signUp_step_2.svg";
import { toaster } from "@/components/ui/toaster";
import EmailPasswordStep from "./components/EmailPasswordStep";
import CompanyInformationStep from "./components/CompanyInformationStep";
import CompanyAddressStep from "./components/CompanyAddressStep";
import CompanyAvailableWorkHoursStep, {
  WEEK_DAYS,
} from "./components/CompanyAvailableWorkHoursStep";
import { TTimeSlot } from "@/constants/timeSlots";
import { signIn } from "next-auth/react";
import { Link, useRouter, useTranslations } from "@/i18n";
import axios, { AxiosError } from "axios";

export type SignUpForm = {
  _step: number;
  _loading?: boolean;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTermsAndCond: boolean;
  agreeNewsSubscribe: boolean;

  companyName: string;
  business: string;
  phone: string;

  address1: string;
  zip_code: string;
  city: string;
  lat?: number;
  lng?: number;

  weekDays: string[];
  time: [TTimeSlot | undefined, TTimeSlot | undefined];
};

const BusinessSignInScene = () => {
  const t = useTranslations();
  const router = useRouter();

  const form = useForm<SignUpForm>({
    mode: "onSubmit",
    defaultValues: {
      _step: 1,
      business: "",
      weekDays: [],
      time: [undefined, undefined],
    },
  });

  const handleSignUpStep1 = async (data: SignUpForm) => {
    if (data.password !== data.confirmPassword) {
      toaster.error(t("ui.errors.passwordDontMatch"));
      return;
    }
    if (!data.agreeTermsAndCond) {
      toaster.error("You should agree to terms and conditions!");
      return;
    }

    form.setValue("_step", 2);
  };

  const handleSignUpStep2 = async (data: SignUpForm) => {
    form.setValue("_step", 3);
  };

  const handleSignUpStep3 = async (addressFormData: SignUpForm) => {
    try {
      form.setValue("_step", 4);
    } catch (error) {
      console.error(error);
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const handleSignUpStep4 = async () => {
    try {
      form.setValue("_loading", true);

      const values = form.getValues();
      const time = values.time;
      if (!time[0] || !time[1] || values.weekDays.length === 0) {
        toaster.error(t("ui.errors.fieldIsRequired"));
        return;
      }

      const [start, end] =
        time[0].slot > time[1].slot ? [time[1], time[0]] : [time[0], time[1]];
      const workingSchedule = Object.values(WEEK_DAYS).reduce<
        Record<string, { workingSlots: number[]; breakSlots: number[] }>
      >((schedule, day) => {
        schedule[day] = values.weekDays.includes(day)
          ? {
              workingSlots: Array.from(
                { length: end.slot - start.slot + 1 },
                (_, i) => start.slot + i
              ),
              breakSlots: [],
            }
          : { workingSlots: [], breakSlots: [] };
        return schedule;
      }, {});

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        company: {
          name: values.companyName.trim(),
          businessType: values.business.trim() || undefined,
          phone: values.phone.trim() || undefined,
          address: values.address1.trim(),
          zipCode: values.zip_code.trim(),
          city: values.city.trim(),
          pos: { lat: values.lat!, lng: values.lng! },
          workingSchedule,
        },
      });

      const loginRes = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (!loginRes?.ok) throw new Error("Registration succeeded but sign in failed");
      toaster.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      const apiError = error as AxiosError<{ message?: string | string[] }>;
      const message = apiError.response?.data?.message;
      toaster.error(
        Array.isArray(message) ? message[0] : message || t("ui.errors.wentWrong")
      );
    } finally {
      form.setValue("_loading", false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex bg-darkPrimary">
      <div className="w-2/3 min-h-screen px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm rounded-r-[20px] bg-white sm:w-full sm:rounded-none">
        <div className="min-h-screen max-w-[770px] ml-auto flex flex-col justify-end">
          <div className="min-h-screen py-20 pr-[240px] rounded-r-[20px] bg-white md:pr-[120px] sm:w-full sm:pr-0 sm:flex sm:flex-col sm:items-center">
            {form.watch("_step") !== 5 && (
              <>
                <h3 className="text-[32px] sm:text-center">{t("auth.title1")}</h3>
                <h3 className="text-[32px] sm:text-center">{t("auth.title2")}</h3>
                <p className="mt-6 text-sm text-greyPrimary sm:text-center">
                  {t("auth.subTitle")}
                </p>
              </>
            )}
            {form.watch("_step") === 1 && (
              <EmailPasswordStep form={form} handleSignUpStep={handleSignUpStep1} />
            )}
            {form.watch("_step") === 2 && (
              <CompanyInformationStep form={form} handleSignUpStep={handleSignUpStep2} />
            )}

            {form.watch("_step") === 3 && (
              <CompanyAddressStep form={form} handleSignUpStep={handleSignUpStep3} />
            )}
            {form.watch("_step") === 4 && (
              <CompanyAvailableWorkHoursStep
                form={form}
                handleSignUpStep={handleSignUpStep4}
              />
            )}
          </div>
        </div>
      </div>
      <div className="fixed top-0 right-0 w-1/3 h-screen flex justify-center items-center overflow-hidden bg-darkPrimary sm:hidden">
        {form.watch("_step") === 1 && (
          <>
            <Link href="/">
              <LogoIcon className="absolute top-[10%] left-[50%] -translate-x-[50%]" />
            </Link>
            <Image
              className="h-[55vw] object-left object-cover"
              src={ImageStep1}
              alt="Bowers"
            />
          </>
        )}
        {form.watch("_step") !== 1 && (
          <Image
            className="h-[55vw] -mt-[20%] object-center object-cover"
            src={ImageStep2}
            alt="Bowers"
          />
        )}
      </div>
    </div>
  );
};

export default BusinessSignInScene;
