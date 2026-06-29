"use client";

import { PropsWithChildren, useMemo } from "react";
import { format } from "date-fns";

import SubscriptionForm from "./components/SubscriptionForm";
import { useGetPaymentdetailsQuery } from "@/api/queries/payment";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/loaders/Spinner";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { useGetCompanySubscriptionQuery } from "@/api/queries/company/subscription";
import { useAppSession } from "@/hooks/useAppSession";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

const RowItem = ({ children }: PropsWithChildren) => {
  return (
    <div
      className={cn(
        "w-full py-6 pl-8 pr-7 flex items-center justify-between border-b border-greyOutlineSecondary last:border-none"
      )}
    >
      {children}
    </div>
  );
};

const AccountBillingScene = () => {
  const { data: session } = useAppSession();
  const { companyId } = useGetCompanyId();

  const getCompanySubscriptionQuery = useGetCompanySubscriptionQuery({
    companyId,
  });
  const getPaymentdetailsQuery = useGetPaymentdetailsQuery({});

  const paymentDetails = useMemo(() => {
    if (getPaymentdetailsQuery.data) {
      return getPaymentdetailsQuery.data;
    }

    return null;
  }, [getPaymentdetailsQuery.data]);

  const isLoading = getPaymentdetailsQuery.isPending;

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="flex flex-col">
        <div className="">
          <p className="mb-7 text-sm font-bold">Subscription plan</p>
          {getCompanySubscriptionQuery.data && (
            <SubscriptionForm {...getCompanySubscriptionQuery.data} />
          )}
        </div>

        <div className="w-full mt-[35px] flex flex-col">
          {!isLoading ? (
            <>
              <p className="text-sm font-bold">Payment details</p>
              <div className="w-full mt-7 flex flex-col rounded-xl border border-greyOutlineSecondary">
                <RowItem>
                  <p className="text-sm text-greyPrimary">Payment method</p>
                  <div className="flex items-center gap-5">
                    <p className="text-sm">
                      {paymentDetails?.payment_details?.brand} ending in{" "}
                      {paymentDetails?.payment_details?.last4}, exp:{" "}
                      {paymentDetails?.payment_details?.exp_month}/
                      {paymentDetails?.payment_details?.exp_year}{" "}
                    </p>
                    <Button variant="transparent" className="p-0">
                      <p className="text-sm text-purplePrimary">Update</p>
                    </Button>
                  </div>
                </RowItem>
                <RowItem>
                  <p className="text-sm text-greyPrimary">Billing period</p>
                  <div className="flex items-center gap-5">
                    <p className="text-sm">
                      Plan billed{" "}
                      <span className="font-bold">
                        {paymentDetails?.payment_details?.billing_period}
                      </span>
                    </p>
                    <Button variant="transparent" className="p-0">
                      <p className="text-sm text-purplePrimary">Update</p>
                    </Button>
                  </div>
                </RowItem>
                <RowItem>
                  <p className="text-sm text-greyPrimary">License keys</p>
                  <div className="flex items-center gap-5">
                    <Button variant="transparent" className="p-0">
                      <p className="text-sm text-purplePrimary">Redeem a license key</p>
                    </Button>
                  </div>
                </RowItem>
              </div>
              <p className="mt-[35px] text-sm font-bold">Payment history</p>
              <div className="w-full mt-7 flex flex-col rounded-xl border border-greyOutlineSecondary">
                {!paymentDetails?.payment_history?.length ? (
                  <RowItem>
                    <p className="text-sm text-greyPrimary">No payment history</p>
                  </RowItem>
                ) : (
                  <RowItem>
                    <div className="flex items-center gap-8">
                      <p className="text-sm text-greyPrimary">
                        {format("2024-09-21", "dd MMM yyyy")}
                      </p>
                      <p className="text-sm">
                        {`CRM Pro (${format("2024-09-21", "MM/dd/yyyy")} to ${format("2024-10-21", "MM/dd/yyyy")})`}
                      </p>
                    </div>
                    <div className="flex items-center gap-5">
                      <p className="text-sm font-bold">{formatCurrency(34)}</p>
                      <Button variant="transparent" className="p-0">
                        <p className="text-sm text-purplePrimary">Invoice</p>
                      </Button>
                    </div>
                  </RowItem>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex justify-center">
              <Spinner />
            </div>
          )}
        </div>
      </div>

      <div className="w-full flex items-end justify-between">
        <div className="flex items-center gap-[46px]">
          <Button variant="primary">Update Settings</Button>
          <Button variant="resting" className="py-3">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountBillingScene;
