"use client";

import React, { FC, useEffect, useMemo } from "react";
import cn from "clsx";
import Button from "../button";
import { useAppSession } from "@/hooks/useAppSession";
import { isAfter } from "date-fns";
import { usePathname, useRouter, useTranslations } from "@/i18n";
import { useApiClient } from "@/api/context";
import { useSearchParams } from "next/navigation";

type Props = {
  planName: string;
  mainPrice?: string;
  desc: string;
  includesLabel: string;
  planItems: string[];
  mainPricePeriod?: string;
  variant?: "primary" | "default";
};

export const LandingVariant: FC<Props> = ({
  planName,
  mainPrice,
  desc,
  includesLabel,
  planItems,
  mainPricePeriod,
  variant = "default",
}) => {
  const t = useTranslations()

  const { data: session, update } = useAppSession();
  const router = useRouter();
  const pathname = usePathname();
  const apiClient = useApiClient();

  const params = useSearchParams();
  const isSuccessBuySuscription = useMemo(
    () => params.get("is_success_buy_subscription"),
    [params]
  );

  useEffect(() => {
    if (isSuccessBuySuscription === "true") {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      update();
    }
  }, [isSuccessBuySuscription]);

  const onClickLocalHandler = async () => {
    router.push("/contact");
    return;

    if (!session?.user) {
      // router.push("/contact");
      return;
    }

    if (isUserHaveSubscription) {
      router.push("/account/billing");
      return;
    }

    const { data } = await apiClient.payments.createSubscriptionCheckoutLink({
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ZERO_PRICE_ID || "",
      successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}?is_success_buy_subscription=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}?is_cancel_buy_subscription=true`,
    });

    if (data.checkout_url) {
      window.open(data.checkout_url, "", "noopener,noreferrer");
    }
  };

  const isUserHaveSubscription = useMemo(() => {
    if (
      session?.user?.stripe_subscription_start &&
      session?.user?.stripe_subscription_end
    ) {
      if (isAfter(session.user.stripe_subscription_end, new Date())) {
        return true;
      }
    }

    return false;
  }, [session?.user?.stripe_subscription_start, session?.user?.stripe_subscription_end]);

  return (
    <div
      className={cn("max-w-[400px] py-6 px-8 flex flex-col rounded-xl", {
        "bg-white": variant === "default",
        "bg-darkPrimary shadow-lg": variant === "primary",
        "text-darkPrimary": variant === "default",
        "text-white": variant === "primary",
      })}
    >
      <p
        className={cn("text-lg font-bold text-left", {
          "text-darkPrimary": variant === "default",
          "text-white": variant === "primary",
        })}
      >
        {planName}
      </p>
      <span
        className={cn("mt-2 text-[42px] font-bold text-left", {
          "text-gray": variant === "default",
          "text-white": variant === "primary",
        })}
      >
        {mainPrice && mainPrice}
        {mainPrice && mainPricePeriod && (
          <span
            className={cn("ml-1 text-base", {
              "text-gray": variant === "default",
              "text-grayLight": variant === "primary",
            })}
          >
            / {mainPricePeriod}
          </span>
        )}
      </span>
      <p
        className={cn("min-h-[74px] mt-4 text-left", {
          "text-grey": variant === "default",
          "text-white": variant === "primary",
        })}
      >
        {desc}
      </p>
      <Button
        className="w-full my-10"
        variant={variant === "primary" ? "primary" : "dark-outline"}
        color={variant === "primary" ? "white" : "dark"}
        rounded
        textBold
        onClick={onClickLocalHandler}
      >
        {isUserHaveSubscription ? "Current plan" : t("ui.getStarted")}
      </Button>
      <p
        className={cn("text-base font-bold text-left", {
          "text-darkPrimary": variant === "default",
          "text-white": variant === "primary",
        })}
      >
        {includesLabel}
      </p>
      <div className="mt-4 flex flex-col items-start gap-3">
        {planItems.map((text, idx) => (
          <div key={idx} className="flex items-center gap-5">
            <div
              className={cn("w-1 h-1 rounded-full", {
                "bg-darkPrimary": variant === "default",
                "bg-white": variant === "primary",
              })}
            />
            <p
              className={cn("w-full text-left", {
                "text-gray": variant === "default",
                "text-greyBackground": variant === "primary",
              })}
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
