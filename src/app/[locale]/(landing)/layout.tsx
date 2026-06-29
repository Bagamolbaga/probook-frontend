import { PropsWithChildren } from "react";
import LandingLayout from "@/components/layouts/landing";

export default function Layout({ children }: PropsWithChildren) {
  return <LandingLayout>{children}</LandingLayout>;
}
