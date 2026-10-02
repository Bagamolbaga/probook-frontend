import { PropsWithChildren } from "react";
import LandingLayout from "@/src/components/layouts/landing";

export default function Layout({ children }: PropsWithChildren) {
  return <LandingLayout>{children}</LandingLayout>;
}
