"use client";

import { useApiClient } from "@/api/context";
import { useGetSubscriptionPlansQuery } from "@/api/queries/payment";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/loaders/Spinner";
import PricingCart from "@/components/ui/pricingCart";
import { toaster } from "@/components/ui/toaster";
import { useAppSession } from "@/hooks/useAppSession";
import { usePathname } from "@/i18n";
import { useThemeStore } from "@/stores/theme";
import { isAfter } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useStore } from "zustand";

const PLANS_ITEMS = {
  premium: [
    {
      id: 1,
      text: "Bowers Ecosystem",
      include: true,
    },
    {
      id: 2,
      text: "Appointment Booking",
      include: true,
    },
    {
      id: 3,
      text: "Supports up to 5 Staff Members",
      include: true,
    },
    {
      id: 4,
      text: "Free Store Photoshoot",
    },
    {
      id: 5,
      text: "Future Updates Tailored to Your Needs",
    },
  ],
  team: [
    {
      id: 1,
      text: "Bowers Ecosystem",
      include: true,
    },
    {
      id: 2,
      text: "Appointment Booking",
      include: true,
    },
    {
      id: 3,
      text: "Supports up to 5 Staff Members",
      include: true,
    },
    {
      id: 4,
      text: "Free Store Photoshoot",
      include: true,
    },
    {
      id: 5,
      text: "Future Updates Tailored to Your Needs",
    },
  ],
  business: [
    {
      id: 1,
      text: "Bowers Ecosystem",
      include: true,
    },
    {
      id: 2,
      text: "Appointment Booking",
      include: true,
    },
    {
      id: 3,
      text: "Supports up to 5 Staff Members",
      include: true,
    },
    {
      id: 4,
      text: "Free Store Photoshoot",
      include: true,
    },
    {
      id: 5,
      text: "Future Updates Tailored to Your Needs",
      include: true,
    },
  ],
};

const ServicesAndPricingScene = () => {
  const apiClient = useApiClient();
  const pathname = usePathname();
  const { data: session, update } = useAppSession();

  const toggleOpenSidebar = useStore(useThemeStore, (st) => st.toggleOpenSidebar);

  const getSubscriptionPlansQuery = useGetSubscriptionPlansQuery({});

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

  const createSubscriptionCheckoutLinkHandler = async () => {
    try {
      const { data } = await apiClient.payments.createSubscriptionCheckoutLink({
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ZERO_PRICE_ID || "",
        successUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}?is_success_buy_subscription=true`,
        cancelUrl: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}?is_cancel_buy_subscription=true`,
      });

      if (data.checkout_url) {
        window.open(data.checkout_url, "", "noopener,noreferrer");
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const isUserHaveSubscription = useMemo(() => {
    if (session?.user?.stripe_subscription_start && session?.user?.stripe_subscription_end) {
      if (isAfter(session.user.stripe_subscription_end, new Date())) {
        return true
      }
    }

    return false
  }, [session?.user?.stripe_subscription_start, session?.user?.stripe_subscription_end])
    

  return (
    <div className="w-full min-h-[100vh] px-7 py-6 bg-greyOutline">
      <div className="pb-6 flex justify-between items-center">
        <div className="flex items-center">
          <i className="la la-bars mr-5 cursor-pointer" onClick={toggleOpenSidebar}></i>
          <h5 className="text-xl font-bold" onClick={() => update()}>
            Pricing
          </h5>
        </div>
      </div>
      <div className="w-full min-h-[calc(100vh-62px-52px)] flex flex-col items-center rounded-xl bg-white">
        <div className="w-full pt-[65px] pb-[50px] flex flex-col items-center bg-greyBackgroundLight">
          <h4 className="text-[32px]">Pricing designed for scale</h4>
          <p className="mt-1 text-sm text-greyPrimary">
            Just straight-forward pricing that aligns with your business goals.
          </p>
          {/* <div className="mt-4 py-[4px] px-[4px] flex items-center justify-center gap-4 rounded-md bg-white">
            <Button variant="transparent" className="py-2 border-none text-nowrap gap-2">
              Pay yearly{" "}
              <Badge variant="secondary" rounded="sm" color="black" className="px-2">
                -80%
              </Badge>
            </Button>
            <Button variant="primary-resting" className="py-2 border-none">
              Pay monthly
            </Button>
          </div> */}
        </div>
        <div className="w-full p-6 flex-1 flex justify-center gap-8">
          <PricingCart.DashboardVariant
            variant={isUserHaveSubscription ? "selected" : "default"}
            planName="Starter Kit"
            mainPrice="฿3390"
            mainPricePeriod="/ month"
            desc="Tailored for small beauty stores, the Starter Kit provides essential tools for teams with fewer staff members."
            planItems={PLANS_ITEMS.premium}
            onClickHandler={createSubscriptionCheckoutLinkHandler}
          />
          <PricingCart.DashboardVariant
            variant={isUserHaveSubscription ? "selected" : "default"}
            planName="Growth Package"
            mainPrice="฿5450"
            mainPricePeriod="/ month"
            desc="Ideal for medium-sized stores, the Growth Plan offers advanced tools to manage a growing team efficiently."
            planItems={PLANS_ITEMS.team}
            onClickHandler={createSubscriptionCheckoutLinkHandler}
          />
          <PricingCart.DashboardVariant
            variant={isUserHaveSubscription ? "selected" : "default"}
            planName="Enterprise Edition"
            mainPrice="Custom pricing"
            desc="Designed for large beauty stores, the Enterprise Edition offers across multiple teams."
            planItems={PLANS_ITEMS.business}
            onClickHandler={createSubscriptionCheckoutLinkHandler}
          />
        </div>
      </div>
    </div>
  );
};

export default ServicesAndPricingScene;
