import type { PropsWithChildren } from "react";
import CustomerLayout from "@/src/components/layouts/customer";

export default function Layout({ children }: PropsWithChildren) {
  return <CustomerLayout>{children}</CustomerLayout>;
}
