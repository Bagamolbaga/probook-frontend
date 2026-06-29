"use client";

import {
  useGetBookingByTokenQuery,
  useUpdateBookingByTokenQuery,
} from "@/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import ServiceSelection from "../components/ServiceSelection";
import Stepper, { TStep } from "@/components/ui/stepper";
import Button from "@/components/ui/button";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import StaffSelection from "../components/StaffSelection";
import TimeSelection from "../components/TimeSelection";
import Spinner from "@/components/ui/loaders/Spinner";
import CompanyCartWidget from "@/components/ui/widgets/companyCart";
import CalendarIcon from "@/components/ui/icons/Calendar";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useRef, useState } from "react";
import { parse } from "date-fns";
import { cn } from "@/utils/cn";
import NoteIcon from "@/components/ui/icons/Note";
import PersonIcon from "@/components/ui/icons/Person";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";
import { Link, useTranslations } from "@/i18n";
import { toaster } from "@/components/ui/toaster";
import { useApiClient } from "@/api/context";
import ConfirmationModal from "@/components/ui/modal/ConfirmationModal";
import {
  DateSection,
  PriceSection,
  ServicesSection,
  StaffSection,
  TimeSection,
} from "@/components/ui/widgets/companyCart/components";
import { useGetCompanyServicesTypesQuery } from "@/api/queries/company/serviceTypes";
import MobileBottomCart from "../components/MobileBottomCart";
import Image from "next/image";
import LocationIcon from "@/components/ui/icons/Location";
import { toSlug } from "@/utils/toSlug";
import { useUpdateBookingLinkOverdue } from "@/hooks/useUpdateBookingLinkOverdue";
import UpdateLinkIsOverdue from "../components/UpdateLinkIsOverdue";
import { DATE_FORMAT, HORS_BEFORE_UPDATE_LINK_IS_OVERDUE } from "@/constants/other";
import { TimeManager } from "@/utils/timeManager";

const STEPS = [
  { id: "services", text: "Services", icon: NoteIcon },
  { id: "staffs", text: "Professional", icon: PersonIcon },
  { id: "time", text: "Time", icon: CalendarIcon },
  // { id: "confirm", text: "Confirm", icon: CheckmarkCircle },
];

export type ManageBookingForm = {
  _stepId: string;
  selectedServices: TServiceAndSelectedOption[];
  selectedStaff?: TSpecialist | "ANY";
  selectedDate: Date;
  selectedTime?: (typeof TIME_SLOTS)[0];
  client?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
};

type Props = {
  companyId: number;
  token: string;
};

const BookingManageScene = ({ token: tokenFromUrl }: Props) => {
  const t = useTranslations();
  const apiClient = useApiClient();
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const token = new URLSearchParams(`t=${tokenFromUrl}`).get("t") || "";
  const getBookingByTokenQuery = useGetBookingByTokenQuery({ token });
  const companyId = getBookingByTokenQuery.data?.company || "";

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });
  const getCompanyServicesTypesQuery = useGetCompanyServicesTypesQuery({ companyId });

  const updateBookingByTokenQuery = useUpdateBookingByTokenQuery();
  const [selectedNewDate, setSelectedNewDate] = useState<Date>();
  const [selectedNewTime, setSelectedNewTime] = useState<TTimeSlot>();

  const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false);
  const [bookingIsCanceled, setBookingIsCanceled] = useState(false);
  const [bookingIsUpdated, setBookingIsUpdated] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ManageBookingForm>({
    defaultValues: {
      _stepId: "time",
      selectedServices: [],
      selectedDate: new Date(),
    },
  });

  useEffect(() => {
    if (getBookingByTokenQuery.data) {
      const data = getBookingByTokenQuery.data;
      form.setValue(
        "selectedServices",
        data.services.map((s) => ({ ...s.service, selectedOption: s.service_option }))
      );
      form.setValue("selectedStaff", data.specialist); //! type error
      form.setValue("selectedDate", parse(data.date, "yyyy-MM-dd", new Date()));
      form.setValue(
        "selectedTime",
        TIME_SLOTS.find((s) => s.slot === data.slots[0])
      );
      form.setValue("client", data.client);

      setSelectedNewDate(parse(data.date, "yyyy-MM-dd", new Date()));
    }
  }, [getBookingByTokenQuery.data]);

  const selectStepHandler = (step: TStep) => {
    form.setValue("_stepId", step.id);
  };

  const selectServiceHandler = (services: TServiceAndSelectedOption[]) => {
    form.setValue("selectedServices", services);
  };

  const selectSpecialistHandler = (st?: TSpecialist | "ANY") => {
    // form.setValue("selectedStaff", st);
  };

  const selectDateHandler = (date: Date) => {
    form.setValue("selectedDate", date);
    setSelectedNewDate(date);
  };

  const selectTimeHandler = (timeSlot?: TTimeSlot) => {
    form.setValue("selectedTime", timeSlot);
    setSelectedNewTime(timeSlot);
  };

  const showCancelConfirmationModalHandler = () => {
    setShowCancelConfirmationModal(true);
  };

  const hideCancelConfirmationModalHandler = () => {
    setShowCancelConfirmationModal(false);
  };

  const cancelBookingHandler = async () => {
    await apiClient.bookings.cancelBooking({ token });
    setBookingIsCanceled(true);
    hideCancelConfirmationModalHandler();
  };

  const updateBookingHandler = async () => {
    try {
      const selectedStaff = form.getValues("selectedStaff");

      if (
        selectedNewDate &&
        selectedNewTime &&
        selectedStaff &&
        selectedStaff !== "ANY"
      ) {
        setIsLoading(true);

        const data: {
          services: { id: number; option_id: number }[];
          specialist: number;
          date: Date;
          slots: number[];
        } = {
          services: form
            .getValues("selectedServices")
            .map((s) => ({ id: s.id, option_id: s.selectedOption.id })),
          specialist: selectedStaff.id,
          date: selectedNewDate,
          slots: [],
        };

        const timeSlots = [...TIME_SLOTS];
        const selectedTimeIdx = timeSlots.findIndex(
          (s) => s.slot === selectedNewTime.slot
        );
        const allTimeDurationInSlotsCount =
          form
            .getValues("selectedServices")
            .reduce((acc, c) => (acc += c.selectedOption.duration), 0) / 15;
        const slots = timeSlots
          .splice(selectedTimeIdx, allTimeDurationInSlotsCount + 1)
          .map((s) => s.slot);

        data.slots = slots;

        const res = await updateBookingByTokenQuery.mutateAsync({ token, data });

        if (res.data) {
          setSelectedNewDate(undefined);
          setSelectedNewTime(undefined);
          setBookingIsUpdated(true);

          toaster.success("Booking updated successfully");
          // router.push(`/company/${companyId}/booking-cancelation/${token}/`);
        }
      }
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

  const companyServicesTypes = useMemo(() => {
    if (getCompanyServicesTypesQuery.data?.results) {
      return getCompanyServicesTypesQuery.data.results;
    }

    return [];
  }, [getCompanyServicesTypesQuery.data]);

  const isShowUpdateBtn = selectedNewDate && selectedNewTime;

  const hoursBeforeStartBooking = useUpdateBookingLinkOverdue({
    date: getBookingByTokenQuery.data?.date
      ? parse(getBookingByTokenQuery.data.date, DATE_FORMAT, new Date())
      : undefined,
    time: new TimeManager().getFullSlotsFromArr(
      getBookingByTokenQuery.data?.slots || []
    )[0],
  });

  if (
    typeof hoursBeforeStartBooking === "number" &&
    hoursBeforeStartBooking < HORS_BEFORE_UPDATE_LINK_IS_OVERDUE &&
    getBookingByTokenQuery.data?.status !== "OFF" &&
    getBookingByTokenQuery.data?.status !== "BLOCKED"
  ) {
    return <UpdateLinkIsOverdue />;
  }

  if (bookingIsUpdated) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[530px] flex flex-col items-center">
          <div className="w-16 h-16 rounded-lg flex items-center justify-center bg-greenPrimary">
            <CheckmarkCircle className="w-9 h-9 stroke-white" />
          </div>
          <h5 className="mt-5 text-[26px] font-bold text-center">
            Appointment Rescheduling Successfully
          </h5>
          <p className="mt-4  text-center text-greyPrimary">
            If you need to reschedule, please feel free to book another appointment at
            your convenience.
          </p>
          <div className="w-full mt-[76px] flex justify-between gap-5">
            <Button
              className="w-full"
              variant="red-outline"
              onClick={showCancelConfirmationModalHandler}
            >
              Cancel booking
            </Button>
            <Button
              className="w-full"
              variant="dark"
              onClick={() => setBookingIsUpdated(false)}
            >
              Reschedule
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (
    bookingIsCanceled ||
    getBookingByTokenQuery.data?.status === "OFF" ||
    getBookingByTokenQuery.data?.status === "BLOCKED"
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
      <ConfirmationModal
        title="Are you sure you want to cancel this booking?"
        subTitle="This booking will be cancelled. Your money will be refunded within 24 hours."
        isOpen={showCancelConfirmationModal}
        pozitiveHandler={cancelBookingHandler}
        negativeHandler={hideCancelConfirmationModalHandler}
      />
      <div className="w-full">
        <div className="flex items-center gap-2">
          <Link
            href={`/company/${toSlug(getCompanyDetailsQuery.data?.name)}?storeId=${getCompanyDetailsQuery.data?.id}`}
          >
            <Button className="!p-2" variant="resting">
              <ArrowSecondaryDownIcon className="rotate-90 stroke-greyPrimary" />
            </Button>
          </Link>

          <h4 className="text-[32px] font-bold sm:text-[26px]">Booking manage</h4>
        </div>

        <div className="hidden w-full py-7 items-center gap-2 sm:flex">
          {getCompanyDetailsQuery.data?.logo && (
            <div className="min-w-[76px] min-h-[76px] w-[76px] h-[76px] rounded-lg bg-greyLight overflow-hidden">
              <Image
                className="!relative w-full h-full object-cover"
                fill
                src={getCompanyDetailsQuery.data.logo}
                alt={getCompanyDetailsQuery.data.name}
              />
            </div>
          )}
          <div>
            <h5 className="ml-5 text-base font-bold">
              {getCompanyDetailsQuery?.data?.name}
            </h5>
            <p className="mt-1 flex items-start gap-1 text-sm text-greyPrimary">
              {getCompanyDetailsQuery?.data?.address1 && (
                <LocationIcon className="min-w-4 min-h-4" />
              )}
              {getCompanyDetailsQuery?.data?.address1}
            </p>
          </div>
        </div>

        <div className="w-full pb-9">
          <Stepper
            activeStepId={form.watch("_stepId")}
            steps={STEPS}
            canSelectStep
            selectStepHandler={selectStepHandler}
          />
        </div>

        <div className={cn("w-full mt-6 flex items-stretch justify-center", {})}>
          {form.watch("_stepId") === "services" && (
            <ServiceSelection
              rightPanelHeight={rightPanelRef.current?.clientHeight}
              serviceTypes={companyServicesTypes}
              services={form.watch("selectedServices")}
              selectedServices={form.watch("selectedServices")}
              selectServiceHandler={() => {}}
            />
          )}
          {form.watch("_stepId") === "staffs" && (
            <StaffSelection
              isHideAny
              specialists={
                form.watch("selectedStaff") && form.watch("selectedStaff") !== "ANY"
                  ? [form.watch("selectedStaff")! as TSpecialist]
                  : []
              }
              selectedSpecialist={form.watch("selectedStaff")}
              selectSpecialistHandler={selectSpecialistHandler}
              selectTimeHandler={selectTimeHandler}
            />
          )}
          {form.watch("_stepId") === "time" && (
            <TimeSelection
              companyId={companyId}
              selectedServices={form.watch("selectedServices")}
              selectedSpecialist={form.watch("selectedStaff")}
              selectedDate={form.watch("selectedDate")}
              selectedTime={form.watch("selectedTime")}
              selectDateHandler={selectDateHandler}
              selectTimeHandler={selectTimeHandler}
              selectSpecialistHandler={selectSpecialistHandler}
            />
          )}
          <div
            ref={rightPanelRef}
            className={cn("w-1/3 h-fit pl-6", {
              "pl-0 sm:w-full": form.watch("_stepId") === "confirm",
              "sm:hidden": form.watch("_stepId") !== "confirm",
            })}
          >
            {getCompanyDetailsQuery.isPending ? (
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
                    {form.watch("selectedDate") && (
                      <DateSection date={form.watch("selectedDate")} />
                    )}
                    {form.watch("selectedTime") && (
                      <TimeSection
                        slot={form.watch("selectedTime")!}
                        selectedServices={form.watch("selectedServices")}
                      />
                    )}
                    {!!form.watch("selectedServices").length && (
                      <div className="flex flex-col">
                        <ServicesSection services={form.watch("selectedServices")} />
                        {form.watch("selectedStaff") && (
                          <StaffSection staff={form.watch("selectedStaff")!} />
                        )}
                        <PriceSection services={form.watch("selectedServices")} />
                        {isShowUpdateBtn && (
                          <Button
                            variant="dark"
                            disabled={isLoading}
                            onClick={updateBookingHandler}
                          >
                            {isLoading && (
                              <Spinner color="white" className="size-6 mr-2" />
                            )}
                            Update booking
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                }
              />
            )}
          </div>
        </div>
      </div>
      <MobileBottomCart
        _stepId={form.watch("_stepId")}
        company={getCompanyDetailsQuery.data}
        selectedServices={form.watch("selectedServices")}
        selectedStaff={form.watch("selectedStaff")}
        selectedDate={form.watch("selectedDate")}
        selectedTime={form.watch("selectedTime")}
        renderContinueButton={
          isShowUpdateBtn && (
            <Button variant="dark" disabled={isLoading} onClick={updateBookingHandler}>
              {isLoading && <Spinner color="white" className="size-5 mr-2" />}
              Update booking
            </Button>
          )
        }
      />
    </>
  );
};

export default BookingManageScene;
