/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import LogoIcon from "@/components/ui/icons/LogoFull";
import TwitterBrandIcon from "@/components/ui/icons/TwitterBrand";
import GoogleBrandIcon from "@/components/ui/icons/GoogleBrand";
import FacebookBrandIcon from "@/components/ui/icons/FacebookBrand";
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
import { useApiClient } from "@/api/context";
import { signIn } from "next-auth/react";
import { useAppSession } from "@/hooks/useAppSession";
import { Link, useRouter, useTranslations } from "@/i18n";
import AccountCreatedStep from "./components/AccountCreatedStep";

export type SignUpForm = {
  _step: number;
  _loading?: boolean;
  firtsName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTermsAndCond: boolean;
  agreeNewsSubscribe: boolean;

  companyName: string;
  employees: NUM_EMPLOYEES;
  business: string;
  phone: string;

  address1: string;
  address2: string;
  zip_code: string;
  city: string;
  country: string;
  lat?: number;
  lng?: number;

  weekDays: string[];
  time: [TTimeSlot | undefined, TTimeSlot | undefined];
};

const NUMBER_OF_EMPLOYEESS_OPTIONS: { label: string; value: NUM_EMPLOYEES }[] = [
  {
    label: "1 - 10",
    value: "LOW",
  },
  {
    label: "10 - 100",
    value: "MEDIUM",
  },
  {
    label: "100 - 10,000",
    value: "HIGH",
  },
  {
    label: "Above 10,000",
    value: "VERY_HIGH",
  },
];
type NUM_EMPLOYEES = "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH";

type BusinessOption = {
  label: string;
  value: string;
};
const BUSINESS_OPTIONS: BusinessOption[] = [
  {
    label: "Business type 1",
    value: "type_1",
  },
  {
    label: "Business type 2",
    value: "type_2",
  },
];

const BusinessSignInScene = () => {
  const t = useTranslations();
  const { data: session, update } = useAppSession();
  const router = useRouter();
  const apiClient = useApiClient();

  const [accountCreatedWithFullData, setAccountCreatedWithFullData] = useState(false);

  const form = useForm<SignUpForm>({
    mode: "onSubmit",
    defaultValues: {
      _step: 1,
      employees: NUMBER_OF_EMPLOYEESS_OPTIONS[0].value,
      business: "Entertainment",
      country: "TH",
      weekDays: [],
      time: [undefined, undefined],
    },
  });

  const createCompanyAccount = async (addressFormData: SignUpForm, working_schedule: TCompany["working_schedule"]) => {
    const body = {
      user_data: {
        first_name: addressFormData.firtsName,
        last_name: addressFormData.lastName,
        email: addressFormData.email,
        // password: addressFormData.password,
        // subscribe_news: userFormData.agreeNewsSubscribe,
      },
      company_data: {
        name: addressFormData.companyName,
        num_employees: addressFormData.employees,
        business_type: addressFormData.business,
        phone: addressFormData.phone,
        address1: addressFormData.address1,
        address2: addressFormData.address2,
        zip_code: addressFormData.zip_code,
        city: addressFormData.city,
        country: addressFormData.country,
        pos: {
          lat: addressFormData.lat || 0,
          lng: addressFormData.lng || 0,
        },
        working_schedule
      },
    };

    return await apiClient.businessUser.register(body);
  };

  const handleSignUpStep1 = async (data: SignUpForm) => {
    // if (data.password !== data.confirmPassword) {
    //   toaster.error(t("ui.errors.passwordDontMatch"));
    //   return;
    // }
    if (!data.agreeTermsAndCond) {
      toaster.error("You should agree to terms and conditions!");
      return;
    }

    form.setValue("_step", form.getValues("_step") + 1);
  };

  const handleSignUpStep2 = async (data: SignUpForm) => {
    form.setValue("_step", form.getValues("_step") + 1);
  };

  const handleSignUpStep3 = async (addressFormData: SignUpForm) => {
    try {
      form.setValue("_step", form.getValues("_step") + 1);

      // const loginRes = await signIn("credentials", {
      //   redirect: false,
      //   email: addressFormData.email,
      //   password: addressFormData.password,
      // });

      // if (loginRes?.ok) {
      //   toaster.success("Subscribed!");
      //   form.setValue("_step", form.getValues("_step") + 1);
      // }
    } catch (error) {
      console.error(error);
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  const handleSignUpStep4 = async (addressFormData: SignUpForm) => {
    try {
      form.setValue("_loading", true);

      const working_schedule: TCompany["working_schedule"] = {
        Friday: {
          times: [],
          breaks: [],
        },
        Monday: {
          times: [],
          breaks: [],
        },
        Sunday: {
          times: [],
          breaks: [],
        },
        Tuesday: {
          times: [],
          breaks: [],
        },
        Saturday: {
          times: [],
          breaks: [],
        },
        Thursday: {
          times: [],
          breaks: [],
        },
        Wednesday: {
          times: [],
          breaks: [],
        },
      };
      const time = form.watch("time");

      const [start, end] =
        time[0]!.slot > time[1]!.slot ? [time[1], time[0]] : [time[0], time[1]];

      // Object.entries(WEEK_DAYS).forEach(([key, fullKey]) => {
      //   if (form.getValues("weekDays").includes(key)) {
      //     //@ts-ignore
      //     working_schedule[fullKey] = {
      //       times: [`${start?.label}-${end?.label}`],
      //       breaks: [],
      //     };
      //   }
      // });

      // const accontCreatedRes = await createCompanyAccount(addressFormData, working_schedule);

      // if (accontCreatedRes) {
      //   // await apiClient.company.updateCompanyDetails({
      //   //   companyId: accontCreatedRes.data.company.id,
      //   //   data: {
      //   //     working_schedule: working_schedule,
      //   //   },
      //   //   // accessToken: session.access_token,
      //   // });

      //   setAccountCreatedWithFullData(true);
      //   form.setValue("_loading", false);
      // }

      toaster.success("Account create successfully!");
    } catch (error) {
      console.error(error);
      toaster.error(t("ui.errors.wentWrong"));
    }
  };

  if (accountCreatedWithFullData) {
    return <AccountCreatedStep />;
  }

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
            {/* <div className="flex items-center gap-[6px]">
              <TwitterBrandIcon className="cursor-pointer transition-all fill-greyPrimary hover:fill-purplePrimary" />
              <GoogleBrandIcon className="cursor-pointer transition-all fill-greyPrimary hover:fill-purplePrimary" />
              <FacebookBrandIcon className="cursor-pointer transition-all fill-greyPrimary hover:fill-purplePrimary" />
              <p className="ml-2 text-sm text-greyPrimary">{t("auth.orSignInWith")}</p>
            </div> */}
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
