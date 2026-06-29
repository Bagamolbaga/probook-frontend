import { PropsWithChildren } from "react";
import LandingFooter from "@/components/footers/landing";
import { LandingHeader } from "@/components/headers/landing";

export default function LandingLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative w-full mx-auto">
      {LandingHeader}
      <div className="min-h-screenExHeaderAndFooter pt-header">{children}</div>
      <LandingFooter />
    </div>
  );
}
