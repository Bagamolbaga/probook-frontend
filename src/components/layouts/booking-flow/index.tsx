import LandingFooter from "@/components/footers/landing";
import { BookingFlowHeader } from "@/components/headers/landing";
import { PropsWithChildren, ReactNode } from "react";

type Props = {
  header?: ReactNode
  footer?: ReactNode
};

export default function BookingFlowLayout({
  header = BookingFlowHeader,
  footer,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="relative w-full mx-auto">
      {header}

      <div className="max-w-content min-h-screenExHeader mx-auto pt-[158px] pb-[80px] flex flex-col px-layoutLeftRight md:px-layoutLeftRight_md sm:px-layoutLeftRight_sm sm:pt-[100px]">
        {children}
      </div>

      {footer}
    </div>
  );
}
