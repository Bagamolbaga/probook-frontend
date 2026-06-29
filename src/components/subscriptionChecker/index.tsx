"use client";

import { PropsWithChildren, ReactNode } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { Link, redirect } from "@/i18n";
import { useAppSession } from "@/hooks/useAppSession";
import { cn } from "@/utils/cn";
import { useGetCompanySubscriptionQuery } from "@/api/queries/company/subscription";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

const TYPO = {
  TRIAL_OVER: {
    title: "Your subscription is over",
    text: (
      <>
        Please pay from the{" "}
        <Link href={"/account/billing"} className="underline text-purplePrimary">
          billing
        </Link>{" "}
        page
      </>
    ),
  },
  DONT_PAID_SUBS: {
    title: "Your subscription is not paid",
    text: (
      <>
        Please pay from the{" "}
        <Link href={"/account/billing"} className="underline text-purplePrimary">
          billing
        </Link>{" "}
        page
      </>
    ),
  },
  DEACTIVATED: {
    title: "Your account is deactivated",
    text: (
      <>
        Please contact us from the{" "}
        <Link href={"/contact"} className="underline text-purplePrimary">
          contact
        </Link>{" "}
        page
      </>
    ),
  },
};

const Popup = ({
  title,
  text,
  children,
  className,
}: PropsWithChildren<{
  title: string;
  text: ReactNode | string;
  className?: string;
}>) => {
  return (
    <div className="relative w-full h-[calc(100vh-62px-52px)] overflow-hidden">
      <div className="absolute z-50 top-0 left-0 w-full h-screen flex items-center justify-center">
        <div className="w-[620px] p-5 rounded-xl border border-greyLight bg-white shadow-primary">
          <h5 className="mt-5 text-[26px] font-bold text-center">{title}</h5>
          <p className="mt-4 text-center text-greyPrimary">{text}</p>
        </div>
      </div>
      <div className={cn("w-full h-full blur-md pointer-events-none", className)}>
        {children}
      </div>
    </div>
  );
};

const SubscriptionChecker = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  const { data: session } = useAppSession();
  const {companyId} = useGetCompanyId()

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId
  });
  const getCompanySubscriptionQuery = useGetCompanySubscriptionQuery({
    companyId,
    queryOptions: {
      retry: 1,
    },
  });

  //@ts-ignore
  if (process.env.NEXT_PUBLIC_APP_ENV === "development" || process.env.NEXT_PUBLIC_APP_ENV === "staging") {
    return <div className={cn("w-full h-[inherit]", className)}>{children}</div>;
  }

  if (!session || !session.user) {
    redirect("/sign-in");
    return null;
  }

  if (session.user.is_superuser) {
    return <div className={cn("w-full h-[inherit]", className)}>{children}</div>;
  }

  if (getCompanySubscriptionQuery.isPending) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (
    getCompanyDetailsQuery.data &&
    getCompanyDetailsQuery.data.status === "deactivated"
  ) {
    return (
      <Popup
        title={TYPO.DEACTIVATED.title}
        text={TYPO.DEACTIVATED.text}
        className={className}
      >
        {children}
      </Popup>
    );
  }

  if (
    getCompanySubscriptionQuery.data &&
    getCompanySubscriptionQuery.data.status === "active" &&
    getCompanySubscriptionQuery.data.remaining_days <= 0
  ) {
    return (
      <Popup
        title={TYPO.DONT_PAID_SUBS.title}
        text={TYPO.DONT_PAID_SUBS.text}
        className={className}
      >
        {children}
      </Popup>
    );
  }

  if (
    getCompanySubscriptionQuery.data &&
    getCompanySubscriptionQuery.data.status === "trialing" &&
    getCompanySubscriptionQuery.data.remaining_days <= 0
  ) {
    return (
      <Popup
        title={TYPO.TRIAL_OVER.title}
        text={TYPO.TRIAL_OVER.text}
        className={className}
      >
        {children}
      </Popup>
    );
  }

  return <div className={cn("w-full h-[inherit]", className)}>{children}</div>;
};

export default SubscriptionChecker;
