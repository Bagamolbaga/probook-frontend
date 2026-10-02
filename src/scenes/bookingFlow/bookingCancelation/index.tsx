"use client";

import { FC, useMemo, useState } from "react";
import Image from "next/image";
import { differenceInHours, format, parse, setDate, setHours } from "date-fns";
import { Link } from "@/src/i18n";

import { useGetCompanyDetailsQuery } from "@/src/api/queries/company";
import { useGetBookingByTokenQuery } from "@/src/api/queries/booking";
import CompanyCartWidget from "@/src/components/ui/widgets/companyCart";
import ArrowSecondaryDownIcon from "@/src/components/ui/icons/ArrowSecondaryDown";
import ConfirmationModal from "@/src/components/ui/modal/ConfirmationModal";
import CheckmarkCircle from "@/src/components/ui/icons/CheckmarkCircle";
import CalendarIcon from "@/src/components/ui/icons/Calendar";
import Spinner from "@/src/components/ui/loaders/Spinner";
import ClockIcon from "@/src/components/ui/icons/Clock";
import { Button } from "@/src/components/ui/button";
import CustomScrollbar from "@/src/styles/scrollbar.module.sass";
import { useApiClient } from "@/src/api/context";
import { TIME_SLOTS } from "@/src/constants/timeSlots";
import { formatCurrency } from "@/src/utils/formatCurrency";
import { cn } from "@/src/utils/cn";
import {
  DateSection,
  PriceSection,
  ServicesSection,
  StaffSection,
  TimeSection,
} from "@/src/components/ui/widgets/companyCart/components";
import { toSlug } from "@/src/utils/toSlug";
import UpdateLinkIsOverdue from "../components/UpdateLinkIsOverdue";
import { HORS_BEFORE_UPDATE_LINK_IS_OVERDUE } from "@/src/constants/other";
import { useUpdateBookingLinkOverdue } from "@/src/hooks/useUpdateBookingLinkOverdue";
import { useGetCompanyId } from "@/src/hooks/useGetCompanyId";

type Props = {
  companyId: number;
  token: string;
};

const BookingCancelation: FC<Props> = ({ token: tokenFromUrl }) => {
  const token = new URLSearchParams(`t=${tokenFromUrl}`).get("t") || "";
  const apiClient = useApiClient();

  const getBookingByTokenQuery = useGetBookingByTokenQuery({ token });

  const { companyId } = useGetCompanyId();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [bookingIsCanceled, setBookingIsCanceled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const showCancelConfirmationModalHandler = () => {
    setShowCancelConfirmationModal(true);
  };

  const hideCancelConfirmationModalHandler = () => {
    setShowCancelConfirmationModal(false);
  };

  const cancelBookingHandler = async () => {
    setIsLoading(true);
    hideCancelConfirmationModalHandler();

    await apiClient.bookings.cancelBooking({ token });
    setBookingIsCanceled(true);

    setIsLoading(false);
  };

  const companyLocation = useMemo(() => {
    const arr = [];

    if (getCompanyDetailsQuery.data?.country?.name) {
      arr.push(getCompanyDetailsQuery.data?.country?.name);
    }

    if (getCompanyDetailsQuery.data?.city) {
      arr.push(getCompanyDetailsQuery.data?.city);
    }

    if (getCompanyDetailsQuery.data?.address) {
      arr.push(getCompanyDetailsQuery.data?.address);
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
      return <Spinner className="size-5" color="red" />;
    }

    if (
      bookingIsCanceled ||
      getBookingByTokenQuery.data?.status === "CANCELLED" ||
      getBookingByTokenQuery.data?.status === "BLOCKED"
    ) {
      return null;
    }

    return "Cancel booking";
  }, [getBookingByTokenQuery.data, bookingIsCanceled, isLoading]);

  const hoursBeforeStartBooking = useUpdateBookingLinkOverdue({
    date: bookingData?.selectedDate,
    time: bookingData?.selectedTime,
  });

  if (
    typeof hoursBeforeStartBooking === "number" &&
    hoursBeforeStartBooking < HORS_BEFORE_UPDATE_LINK_IS_OVERDUE &&
    getBookingByTokenQuery.data?.status !== "CANCELLED" &&
    getBookingByTokenQuery.data?.status !== "BLOCKED"
  ) {
    return <UpdateLinkIsOverdue />;
  }

  if (
    bookingIsCanceled ||
    bookingData?.status === "CANCELLED" ||
    bookingData?.status === "BLOCKED"
  ) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[530px] flex flex-col items-center">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-greenPrimary">
            <CheckmarkCircle className="w-9 h-9 stroke-white" />
          </div>
          <h5 className="mt-5 text-[26px] font-bold text-center">
            Appointment Canceled Successfully
          </h5>
          <p className="mt-4  text-center text-greyPrimary">
            If you need to reschedule, please feel free to book another appointment at
            your convenience.
          </p>
          <div className="w-full mt-[76px] flex justify-between gap-5">
            <Link href="/" className="w-full">
              <Button className="px-10 w-full" variant="outline">
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
      <ConfirmationModal
        title="Are you sure you want to cancel this booking?"
        subTitle="This booking will be cancelled"
        isOpen={showCancelConfirmationModal}
        pozitiveHandler={cancelBookingHandler}
        negativeHandler={hideCancelConfirmationModalHandler}
      />
      <div className="w-full">
        <div className="flex items-center gap-2">
          <Link
            href={`/company/${toSlug(getCompanyDetailsQuery.data?.name)}?storeId=${getCompanyDetailsQuery.data?.id}`}
          >
            <Button className="!p-2" variant="outline">
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
                        <Button
                          className="w-full"
                          variant="outline"
                          disabled={isLoading}
                          onClick={showCancelConfirmationModalHandler}
                        >
                          {mainActionBtnContent}
                        </Button>
                        <Link
                          href={`/company/${toSlug(getCompanyDetailsQuery.data?.name)}/booking-manage/${token}`}
                          className="w-full"
                        >
                          <Button className="w-full" variant="outline">
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

export default BookingCancelation;
