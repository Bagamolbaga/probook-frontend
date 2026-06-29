"use client";

import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import { addDays, differenceInDays, format } from "date-fns";
import { useMemo } from "react";

const SubscriptionForm = ({
  status,
  staff_limit,
  remaining_days,
  pricing_per_staff,
  next_billing,
}: TCompanySubscription) => {
  const data = useMemo(() => {
    return {
      staffCount: 20,
      pricePerStaff: 600,
      daysRemaining: new Date(addDays(new Date(), 60)),
      nextBillingDate: new Date(addDays(new Date(), 60)),
    };
  }, []);

  const getStatus = () => {
    if (status === "active") {
      return "Active";
    }

    return "Free Trial";
  };

  return (
    <div className="w-full">
      <div className="w-full flex items-end">
        <div className="w-full">
          <div className="w-full px-5 py-[14px] flex items-center gap-3 bg-greyBackgroundLight">
            <div className="w-[40%] flex justify-start items-center">
              <p className="text-xs font-bold text-greyPrimary">Plan Status</p>
            </div>
            <div className="w-[15%] flex justify-center items-center">
              <p className="text-xs font-bold text-greyPrimary">Staff Limit</p>
            </div>
            <div className="w-[15%] flex justify-center items-center">
              <p className="text-xs font-bold text-greyPrimary">Pricing per Staff</p>
            </div>
            <div className="w-[15%] flex justify-center items-center">
              <p className="text-xs font-bold text-greyPrimary">
                {status === "active" ? "Subscription Remaining" : "Trial Remaining"}
              </p>
            </div>
            <div className="w-[15%] flex justify-center items-center">
              <p className="text-xs font-bold text-greyPrimary">Next billing</p>
            </div>
          </div>
          <div className="w-full mt-4 px-5 py-[10px] flex items-center gap-3 rounded-xl border border-greyOutlineSecondary">
            <div className="w-[40%] flex justify-start items-center gap-2">
              <h5 className={cn("text-base font-bold")}>{getStatus()}</h5>
              {Math.max(remaining_days, 0) ? (
                <p className="px-2 py-0.5 rounded-lg text-sm text-purplePrimary bg-purpleExtraLight">
                  Remaining Duration: {Math.max(remaining_days, 0)} Days
                </p>
              ) : null}
            </div>
            <div className="w-[15%] flex justify-center items-center cursor-pointer">
              <p className="text-base">{staff_limit}</p>
            </div>
            <div className="w-[15%] py-1 flex justify-center items-center">
              <p className="text-base">{formatCurrency(pricing_per_staff)}</p>
            </div>
            <div className="w-[15%] py-1 flex justify-center items-center">
              <p className="text-base">{Math.max(remaining_days, 0)} days</p>
            </div>
            <div className="w-[15%] py-1 flex justify-center items-center">
              <p className="text-base">{format(next_billing, "dd MMM yyyy")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionForm;
