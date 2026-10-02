import LandingFooter from "@/src/components/footers/landing";
import { BookingFlowHeader } from "@/src/components/headers/landing";
import { cn } from "@/src/utils/cn";
import { PropsWithChildren, ReactNode } from "react";

type Props = {
  header?: ReactNode;
  footer?: ReactNode;
};

export default function BookingFlowLayout({
  header = <BookingFlowHeader />,
  footer,
  children,
}: PropsWithChildren<Props>) {
  return (
    <div className="relative min-h-screen w-full mx-auto bg-[#F5F5FA]">
      {header}

      <div
        className={cn(
          "max-w-content min-h-screenExHeader max-h-dvh mx-auto pt-[90px] pb-[80px] flex flex-col px-layoutLeftRight  ",
          "md:flex md:flex-col md:px-layoutLeftRight_md",
          "sm:px-layoutLeftRight_sm sm:pt-[100px]"
        )}
      >
        {children}
      </div>

      {footer}
    </div>
  );
}
