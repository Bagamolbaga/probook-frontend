"use client";

import { FC, useMemo, useState } from "react";
import Image from "next/image";
import { format, parse } from "date-fns";
import { Link } from "@/i18n";

import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetBookingByTokenQuery } from "@/api/queries/booking";
import CompanyCartWidget from "@/components/ui/widgets/companyCart";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";
import CalendarIcon from "@/components/ui/icons/Calendar";
import Spinner from "@/components/ui/loaders/Spinner";
import ClockIcon from "@/components/ui/icons/Clock";
import Button from "@/components/ui/button";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import { useApiClient } from "@/api/context";
import { TIME_SLOTS } from "@/constants/timeSlots";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import { toaster } from "@/components/ui/toaster";
import {
  DateSection,
  PriceSection,
  ServicesSection,
  StaffSection,
  TimeSection,
} from "@/components/ui/widgets/companyCart/components";
import { toSlug } from "@/utils/toSlug";
import { useUpdateBookingLinkOverdue } from "@/hooks/useUpdateBookingLinkOverdue";
import { HORS_BEFORE_UPDATE_LINK_IS_OVERDUE } from "@/constants/other";
import UpdateLinkIsOverdue from "../components/UpdateLinkIsOverdue";

type Props = {
  companyId: number;
  token: string;
};

const BookingConfirmationScene: FC<Props> = ({ token: tokenFromUrl }) => {
  const token = new URLSearchParams(`t=${tokenFromUrl}`).get("t") || "";
  const apiClient = useApiClient();

  const getBookingByTokenQuery = useGetBookingByTokenQuery({ token });

  const companyId = String(getBookingByTokenQuery.data?.company || "");
  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });

  const [bookingIsConfirmed, setBookingIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmBookingHandler = async () => {
    try {
      setIsLoading(true);
      await apiClient.bookings.confirmBooking({ token });
      setBookingIsConfirmed(true);

      toaster.success("Booking confirmed successfully");
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const companyLocation = useMemo(() => {
    const arr = [];

    if (getCompanyDetailsQuery.data?.country?.name) {
      arr.push(getCompanyDetailsQuery.data?.country?.name);
    }

    if (getCompanyDetailsQuery.data?.city) {
      arr.push(getCompanyDetailsQuery.data?.city);
    }

    if (getCompanyDetailsQuery.data?.address1) {
      arr.push(getCompanyDetailsQuery.data?.address1);
    }

    return arr.join(", ");
  }, [getCompanyDetailsQuery.data]);

  const bookingData = useMemo(() => {
    if (getBookingByTokenQuery.data) {
      return {
        selectedDate: parse(getBookingByTokenQuery.data.date, "yyyy-MM-dd", new Date()),
        selectedTime: TIME_SLOTS.find(
          (s) => s.slot === getBookingByTokenQuery.data!.slots[0]
        ),
        selectedServices: getBookingByTokenQuery.data.services,
        selectedStaff: getBookingByTokenQuery.data.specialist,
        status: getBookingByTokenQuery.data.status,
      };
    }
  }, [getBookingByTokenQuery.data]);

  const mainActionBtnContent = useMemo(() => {
    if (isLoading) {
      return <Spinner className="size-5" />;
    }

    if (bookingIsConfirmed || getBookingByTokenQuery.data?.status === "COMPLETED") {
      return null;
    }

    return "Confirm";
  }, [getBookingByTokenQuery.data, bookingIsConfirmed, isLoading]);

  const hoursBeforeStartBooking = useUpdateBookingLinkOverdue({
    date: bookingData?.selectedDate,
    time: bookingData?.selectedTime,
  });

  if (
    typeof hoursBeforeStartBooking === "number" &&
    hoursBeforeStartBooking < HORS_BEFORE_UPDATE_LINK_IS_OVERDUE &&
    getBookingByTokenQuery.data?.status !== "OFF" &&
    getBookingByTokenQuery.data?.status !== "BLOCKED"
  ) {
    return <UpdateLinkIsOverdue />;
  }

  if (bookingIsConfirmed || bookingData?.status === "OFF") {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[530px] flex flex-col items-center">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-greenPrimary">
            <CheckmarkCircle className="w-9 h-9 stroke-white" />
          </div>
          <h5 className="mt-5 text-[26px] font-bold text-center">
            Appointment Confirmed Successfully
          </h5>
          <p className="mt-4  text-center text-greyPrimary">
            If you need to reschedule, please feel free to book another appointment at
            your convenience.
          </p>
          <div className="w-full mt-[76px] flex justify-between gap-5">
            <Link href="/" className="w-full">
              <Button className="px-10 w-full" variant="resting">
                Back to homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center gap-2">
          <Link
            href={`/company/${toSlug(getCompanyDetailsQuery.data?.name)}?storeId=${getCompanyDetailsQuery.data?.id}`}
          >
            <Button className="!p-2" variant="resting">
              <ArrowSecondaryDownIcon className="rotate-90 stroke-greyPrimary" />
            </Button>
          </Link>
          <h4 className="text-[32px] font-bold sm:text-[26px]">Your booking</h4>
        </div>

        <div className={cn("w-full mt-6 flex items-stretch justify-center", {})}>
          <div className={cn("w-2/3 h-fit sm:w-full")}>
            {!bookingData ? (
              <div className="w-full mt-6 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <CompanyCartWidget
                avatar={getCompanyDetailsQuery.data?.logo ?? undefined}
                name={getCompanyDetailsQuery.data?.name || ""}
                location={companyLocation}
                bottomContent={
                  <>
                    <DateSection date={bookingData.selectedDate} />
                    {bookingData.selectedTime && (
                      <TimeSection
                        slot={bookingData.selectedTime}
                        selectedServices={bookingData.selectedServices.map((s) => ({
                          ...s.service,
                          selectedOption: s.service_option,
                        }))}
                      />
                    )}
                    <div className="flex flex-col">
                      <ServicesSection
                        services={bookingData.selectedServices.map((s) => ({
                          ...s.service,
                          selectedOption: s.service_option,
                        }))}
                      />
                      {bookingData.selectedStaff && (
                        <StaffSection staff={bookingData.selectedStaff} />
                      )}
                      <PriceSection
                        services={bookingData.selectedServices.map((s) => ({
                          ...s.service,
                          selectedOption: s.service_option,
                        }))}
                      />
                      <div className="flex gap-5">
                        {bookingIsConfirmed ||
                        getBookingByTokenQuery.data?.status === "COMPLETED" ? null : (
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={confirmBookingHandler}
                            disabled={isLoading}
                          >
                            {mainActionBtnContent}
                          </Button>
                        )}
                        <Link
                          href={`/company/${toSlug(getCompanyDetailsQuery.data?.name)}/booking-manage/${token}`}
                          className="w-full"
                        >
                          <Button className="w-full" variant="dark">
                            Reschedule
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </>
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingConfirmationScene;
