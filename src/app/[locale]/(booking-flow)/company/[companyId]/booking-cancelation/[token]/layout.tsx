import { PropsWithChildren } from "react";
import BookingFlowLayout from "@/src/components/layouts/booking-flow";

export default function Layout({ children }: PropsWithChildren) {
  return <BookingFlowLayout>{children}</BookingFlowLayout>;
}
