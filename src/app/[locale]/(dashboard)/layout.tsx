import MainLayout from "@/components/layouts/main";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {

  return <MainLayout>{children}</MainLayout>;
}
