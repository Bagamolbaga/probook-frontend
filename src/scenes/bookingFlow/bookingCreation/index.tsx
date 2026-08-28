/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter, useTranslations } from "@/i18n";

import { useCreateBookingQuery } from "@/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyServicesQuery } from "@/api/queries/company/services";
import { useGetCompanyServicesTypesQuery } from "@/api/queries/company/serviceTypes";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import { useApiClient } from "@/api/context";
import type { TCreateBookingArgs } from "@/api/entities/booking";

import SuccessBooked from "./components/SuccessBooked";
import ServiceSelection from "../components/ServiceSelection";
import StaffSelection from "../components/StaffSelection";
import TimeSelection from "../components/TimeSelection";
import PhoneVerifyModal, { PhoneVerifyForm } from "../components/PhoneVerifyModal";
import AuthModal, { AuthForm } from "../components/AuthModal";
import MobileBottomCart from "../components/MobileBottomCart";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/loaders/Spinner";
import Stepper from "@/components/ui/stepper";
import CompanyCartWidget from "@/components/ui/widgets/companyCart";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CalendarIcon from "@/components/ui/icons/Calendar";
import NoteIcon from "@/components/ui/icons/Note";
import PersonIcon from "@/components/ui/icons/Person";
import { toaster } from "@/components/ui/toaster";

import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { PREVIOUSLY_BOOKED_SERVICES } from "@/constants/keys";
import { useAppSession } from "@/hooks/useAppSession";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import DraftModal from "./components/DraftModal";
import {
  DateSection,
  PriceSection,
  ServicesSection,
  StaffSection,
  TimeSection,
} from "@/components/ui/widgets/companyCart/components";
import { Player } from "@lottiefiles/react-lottie-player";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import { cn } from "@/utils/cn";
import Image from "next/image";
import LocationIcon from "@/components/ui/icons/Location";

const STEPS = [
  { id: "services", text: "Services", icon: NoteIcon },
  { id: "staffs", text: "Professional", icon: PersonIcon },
  { id: "time", text: "Time", icon: CalendarIcon },
  // { id: "confirm", text: "Confirm", icon: CheckmarkCircle },
];

export type TServiceAndSelectedOption = TService & { selectedOption: TServiceOption };

export type CreateBookingForm = {
  _stepId: string;
  selectedServices: TServiceAndSelectedOption[];
  selectedStaff?: TSpecialist | "ANY";
  selectedAnyStaff?: TSpecialist;
  selectedDate: Date;
  selectedTime?: (typeof TIME_SLOTS)[0];
  client?: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
  isPhoneVerified: boolean;
};

type Props = {
  companyId: string;
};

type DraftBookingDataInLocalStorage = {
  _createdAt: Date;
  services: { id: string; optionId: number }[];
  staffId: string;
  date: Date;
  time: TTimeSlot;
};

const BookingFlowBookingCreation: FC<Props> = ({ companyId }) => {
  const t = useTranslations();
  const { data: session } = useAppSession();
  const router = useRouter();
  const apiClient = useApiClient();
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const socialAuth = searchParams.get("socialAuth");
  const showAuthModalParams = Boolean(searchParams.get("showAuthModal"));

  const [prevBookedServiceToLocalStorage, setBookedServiceToLocalStorage] =
    useLocalStorage(PREVIOUSLY_BOOKED_SERVICES, [] as TService[]);
  const [draftBookingInLS, setDraftBookingInLS] =
    useLocalStorage<DraftBookingDataInLocalStorage | null>("draft_booking", null);

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });
  const getCompanyServicesQuery = useGetCompanyServicesQuery({ companyId });
  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const getCompanyServicesTypesQuery = useGetCompanyServicesTypesQuery({ companyId });

  const createBookingQuery = useCreateBookingQuery();

  const [createdBooking, setCreatedBooking] = useState<
    TApiBooking & {
      otp_sent?: boolean;
    }
  >();

  const [showDraftBookingConfirmationModal, setshowDraftBookingConfirmationModal] =
    useState(false);
  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [isOpenPhoneVerifyModal, setIsOpenPhoneVerifyModal] = useState(false);
  const [isSuccessBooked, setIsSuccessBooked] = useState(false);
  const [isCreateBookingLoading, setIsCreateBookingLoading] = useState(false);

  const [isCreatedBookingAfterLoginWithSocial, setIsCreatedBookingAfterLoginWithSocial] =
    useState(false);

  const [reloadPageTryCount, setReloadPageTryCount] = useLocalStorage(
    "customer_booking_flow_reload_page_try_count",
    0
  );

  const [isGlobalLoading, setIsGlobalLoading] = useState(false);

  const form = useForm<CreateBookingForm>({
    defaultValues: {
      _stepId: "services",
      selectedServices: [],
      selectedDate: new Date(),
    },
  });

  useEffect(() => {
    const servicesStr = searchParams.get("services");
    const optionsStr = searchParams.get("options");

    if (
      !form.watch("selectedServices").length &&
      getCompanyServicesQuery.data?.results.length &&
      servicesStr &&
      optionsStr
    ) {
      const options = optionsStr.split(",");
      const services: TServiceAndSelectedOption[] = servicesStr
        .split(",")
        .map((id) => getCompanyServicesQuery.data.results.find((s) => s.id === id))
        .filter((s) => !!s)
        .map((s, idx) => {
          const selectedOption = s.options.find((so) => so.id === Number(options[idx]));

          return {
            ...s,
            selectedOption,
          };
        })
        .filter((s) => s.selectedOption) as TServiceAndSelectedOption[];

      form.setValue("selectedServices", services);
    }
  }, [getCompanyServicesQuery.data?.results]);

  useEffect(() => {
    return () => {
      if (isSuccessBooked) {
        // signOut();
      }
    };
  }, [isSuccessBooked]);

  useEffect(() => {
    if (socialAuth && showAuthModalParams && !session && reloadPageTryCount < 2) {
      setReloadPageTryCount(reloadPageTryCount + 1);
      window.location.reload();
    } else {
      setReloadPageTryCount(0);
    }
  }, []);

  useEffect(() => {
    const createBookigAfterLoginWithSocial = async () => {
      if (
        socialAuth &&
        draftBookingInLS &&
        session?.user &&
        getCompanyServicesQuery.data?.results.length &&
        getCompanySpecialistsQuery.data?.results &&
        !isCreatedBookingAfterLoginWithSocial
      ) {
        setIsGlobalLoading(true);

        const staffFromDraft = getCompanySpecialistsQuery.data.results.find(
          (st) => st.id === String(draftBookingInLS.staffId)
        );

        const servicesFromDraft = getCompanyServicesQuery.data?.results.filter((s) =>
          draftBookingInLS.services.find((ds) => String(ds.id) === s.id)
        );
        const selectedServicesWithSelectedOption = servicesFromDraft
          .map((s) => {
            const draftOptionId = draftBookingInLS.services.find(
              (ds) => String(ds.id) === s.id
            )?.optionId;
            const option = s.options.find((so) => so.id === draftOptionId);

            return {
              ...s,
              selectedOption: option as TServiceOption,
            };
          })
          .filter((s) => s.selectedOption);

        form.setValue("selectedStaff", staffFromDraft);
        form.setValue("selectedServices", selectedServicesWithSelectedOption);
        form.setValue("selectedDate", draftBookingInLS.date);
        form.setValue("selectedTime", draftBookingInLS.time);

        form.setValue("client", {
          email: session.user.email,
          first_name: (session?.user as any)?.name,
          last_name: (session?.user as any)?.name,
          phone: session.user.email,
        });

        if (showAuthModalParams) {
          setIsOpenAuthModal(true);
        }

        setIsGlobalLoading(false);
      }
    };

    createBookigAfterLoginWithSocial();
  }, [getCompanyServicesQuery.data?.results, getCompanySpecialistsQuery.data?.results]);

  useEffect(() => {
    if (!socialAuth && draftBookingInLS) {
      setshowDraftBookingConfirmationModal(true);
    }
  }, []);

  const continueEditDraftBookingHandler = () => {
    if (
      draftBookingInLS &&
      getCompanyServicesQuery.data?.results.length &&
      getCompanySpecialistsQuery.data?.results.length
    ) {
      const staffFromDraft = getCompanySpecialistsQuery.data?.results.find(
        (s) => s.id === String(draftBookingInLS.staffId)
      );
      const servicesFromDraft = getCompanyServicesQuery.data?.results.filter((s) =>
          draftBookingInLS.services.find((ds) => String(ds.id) === s.id)
      );
      const selectedServicesWithSelectedOption = servicesFromDraft
        .map((s) => {
          const draftOptionId = draftBookingInLS.services.find(
            (ds) => String(ds.id) === s.id
          )?.optionId;
          const option = s.options.find((so) => so.id === draftOptionId);

          return {
            ...s,
            selectedOption: option as TServiceOption,
          };
        })
        .filter((s) => s.selectedOption);

      if (staffFromDraft) {
        form.setValue("selectedStaff", staffFromDraft);
        form.setValue("selectedServices", selectedServicesWithSelectedOption);
        form.setValue("selectedDate", draftBookingInLS.date);
        form.setValue("selectedTime", draftBookingInLS.time);

        setIsOpenAuthModal(true);
      }
    }
  };

  const closeDraftBookingHandler = () => {
    setshowDraftBookingConfirmationModal(false);
  };

  const deleteDraftBookingHandler = () => {
    form.reset();
    setDraftBookingInLS(null);
    setshowDraftBookingConfirmationModal(false);
  };

  const createBooking = async (
    data: Parameters<typeof createBookingQuery.mutateAsync>[0]
  ) => {
    return createBookingQuery.mutateAsync(data);
  };

  const afterCreatedBookingWithSocialAuth = () => {
    setIsSuccessBooked(true);
    setIsCreatedBookingAfterLoginWithSocial(true);
    setDraftBookingInLS(null);

    const params = new URLSearchParams(searchParams);
    params.delete("socialAuth");
    params.delete("showAuthModal");
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const afterCreatedBookingWithPhoneOrEmail = (otp_sent?: boolean) => {
    if (form.watch("client.email")) {
      setIsSuccessBooked(true);
    } else {
      if (otp_sent) {
        setIsOpenPhoneVerifyModal(true);
      } else {
        setIsSuccessBooked(true);
      }
    }

    setDraftBookingInLS(null);
  };

  const createBookingHandler = async () => {
    try {
      const formData = form.getValues();
      if (
        formData.selectedServices.length &&
        formData.selectedStaff &&
        formData.selectedDate &&
        formData.selectedTime &&
        formData.client
      ) {
        toaster("Booking creating please wait");
        setIsCreateBookingLoading(true);

        const data: TCreateBookingArgs["data"] = {
          services: formData.selectedServices.map((service) => ({
            serviceId: service.id,
            optionId: String(service.selectedOption._id || service.selectedOption.id),
          })),
          specialist:
            formData.selectedStaff === "ANY"
              ? formData.selectedAnyStaff!.id
              : formData.selectedStaff.id,
          date: formData.selectedDate,
          slots: [],
          customer: {
            first_name: formData.client.first_name,
            last_name: formData.client.last_name,
            email: formData.client.email || "",
          },
        };

        // if (formData.client.email) {
        //   data.email = formData.client.email;
        //   socialAuth && (data.auth = socialAuth);
        // } else {
        //   data.phone = formData.client.phone;
        //   data.auth = "sms";
        // }

        const timeSlots = [...TIME_SLOTS];
        const selectedTimeIdx = timeSlots.findIndex(
          (s) => s.slot === formData.selectedTime!.slot
        );
        const allTimeDurationInSlotsCount =
          formData.selectedServices.reduce(
            (acc, c) => (acc += c.selectedOption.duration),
            0
          ) / 15;
        const slots = timeSlots
          .splice(selectedTimeIdx, allTimeDurationInSlotsCount + 1)
          .map((s) => s.slot);

        data.slots = slots;

        const res = await createBooking({ companyId, data });

        if (res.data) {
          setCreatedBooking(res.data);

          setBookedServiceToLocalStorage([
            ...formData.selectedServices,
            ...prevBookedServiceToLocalStorage,
          ]);

          setDraftBookingInLS(null);

          if (res.data.customer.avatar) {
            form.setValue("isPhoneVerified", true);
          }

          toaster.success("Booking created successfully");
          // router.push(
          //   `/company/${companyId}/booking-cancelation/${res.data.results.id}/`
          // );

          return res.data;
        }
      }
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      setIsCreateBookingLoading(false);
    }
  };

  const saveDraftBookingInLocalStorage = () => {
    const bookingData = form.getValues();
    const services = bookingData.selectedServices.map((s) => ({
      id: s.id,
      optionId: s.selectedOption.id,
    }));
    const staffId =
      bookingData.selectedStaff === "ANY"
        ? bookingData.selectedAnyStaff?.id
        : bookingData.selectedStaff?.id;

    if (staffId && bookingData.selectedTime) {
      setDraftBookingInLS({
        _createdAt: new Date(),
        services,
        staffId,
        date: bookingData.selectedDate,
        time: bookingData.selectedTime,
      });
    }
  };

  const autoSelectAnyStaff = () => {
    const formData = form.getValues();

    const everySelectedServicesHaveDontShowStaff = formData.selectedServices.every(
      (s) => !s.specialists.length
    );
    const selectedStaff = formData.selectedStaff;

    if (
      everySelectedServicesHaveDontShowStaff &&
      (!selectedStaff || selectedStaff === "ANY")
    ) {
      selectSpecialistHandler("ANY");
      form.setValue("_stepId", "time");

      return true;
    }

    return false;
  };

  const handleNextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === form.watch("_stepId"));

    if (form.watch("_stepId") === "time") {
      saveDraftBookingInLocalStorage();
      setIsOpenAuthModal(true);
      return;
    }

    if (idx >= 0 && idx < STEPS.length - 1) {
      form.setValue("_stepId", STEPS[idx + 1].id);
    } else {
      //TODO handle confirm last step
      // createBookingHandler();
      // router.push(`/company/${companyId}/booking-cancelation/${createdBooking?.id}/`);
      setIsSuccessBooked(true);
    }
  };

  const handlePrevStep = () => {
    const idx = STEPS.findIndex((s) => s.id === form.getValues("_stepId"));
    if (idx > 0) {
      form.setValue("_stepId", STEPS[idx - 1].id);
      return;
    }

    router.back();
  };

  const selectServiceHandler = (services: TServiceAndSelectedOption[]) => {
    form.setValue("selectedServices", services);

    if (form.getValues("selectedTime")) {
      form.setValue("selectedTime", undefined);
    }
  };

  const selectSpecialistHandler = (st?: TSpecialist | "ANY") => {
    form.setValue("selectedStaff", st);
  };

  const selectAnySpecialistHandler = (st?: TSpecialist) => {
    form.setValue("selectedAnyStaff", st);
  };

  const selectDateHandler = (date: Date) => {
    form.setValue("selectedDate", date);
  };

  const selectTimeHandler = (timeSlot?: TTimeSlot) => {
    form.setValue("selectedTime", timeSlot);
  };

  const closeAuthModalHandler = () => {
    setIsOpenAuthModal(false);
  };

  const closePhoneVerifyHandler = () => {
    setIsOpenPhoneVerifyModal(false);
  };

  const authModalContinueHandler = async (authModalFormData: AuthForm) => {
    try {
      form.setValue("client", authModalFormData);
      if (!createdBooking) {
        setIsGlobalLoading(true);

        const booking = await createBookingHandler();

        if (socialAuth) {
          afterCreatedBookingWithSocialAuth();
        } else {
          afterCreatedBookingWithPhoneOrEmail(booking?.otp_sent);
        }

        form.reset();

        setIsGlobalLoading(false);
        closeAuthModalHandler();
      } else {
        closeAuthModalHandler();
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const phoneVerifyContinueHandler = (phoneVerifyFormData: PhoneVerifyForm) => {
    setIsSuccessBooked(true);

    closePhoneVerifyHandler();
  };

  const codeVerifyHandler = async ({ code }: { code: string }) => {
    if (createdBooking) {
      await apiClient.customerUser.sendCreateBookingOTPCode({
        otp: Number(code),
        bookingId: Number(createdBooking.id),
      });

      form.setValue("isPhoneVerified", true);

      return true;
    }

    return false;
  };

  const resendVerifyCodeHandler = async () => {
    if (createdBooking) {
      const res = await apiClient.customerUser.resendBookingOTPCode({
        bookingId: Number(createdBooking.id),
      });

      if (res.status === 204) {
        return true;
      }
    }

    return false;
  };

  const selectedStaff = form.watch("selectedStaff");

  const isShowContinueButton = useMemo(() => {
    if (form.watch("_stepId") === "services" && !form.watch("selectedServices").length) {
      return false;
    }

    if (form.watch("_stepId") === "staffs" && !form.watch("selectedStaff")) {
      return false;
    }

    if (form.watch("_stepId") === "time" && !form.watch("selectedTime")) {
      return false;
    }

    return true;
  }, [
    form.watch("_stepId"),
    form.watch("selectedServices"),
    form.watch("selectedStaff"),
    form.watch("selectedTime"),
  ]);

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

  const servicesCanSelect = useMemo(() => {
    if (getCompanyServicesQuery.data?.results) {
      return getCompanyServicesQuery.data.results;
      // return getCompanyServicesQuery.data.results.filter((s) => s.specialists.length);
    }

    return [];
  }, [getCompanyServicesQuery.data]);

  const specialistForOnlySelectedServices = useMemo(() => {
    const services = form.watch("selectedServices");

    if (services.length && !services[0].specialists.length) {
      return [];
    }

    if (getCompanySpecialistsQuery.data?.results) {
      const servicesStaffIds = services.flatMap((service) =>
        service.specialists.map((specialist) =>
          typeof specialist === "string" ? specialist : specialist.id
        )
      );

      return getCompanySpecialistsQuery.data.results.filter((st) =>
        servicesStaffIds.includes(st.id)
      );
    }

    return [];
  }, [getCompanySpecialistsQuery.data, form.watch("selectedServices")]);

  const STEPS_i18n = useMemo(
    () => STEPS.map((s) => ({ ...s, text: t(`booking.steps.${s.id}` as any) })),
    []
  );

  const renderLeftPanel = () => {
    if (isGlobalLoading) {
      return null;
    }

    return (
      <>
        {form.watch("_stepId") === "services" && (
          <ServiceSelection
            rightPanelHeight={rightPanelRef.current?.clientHeight}
            serviceTypes={companyServicesTypes}
            services={servicesCanSelect}
            selectedServices={form.watch("selectedServices")}
            selectServiceHandler={selectServiceHandler}
          />
        )}
        {form.watch("_stepId") === "staffs" && (
          <StaffSelection
            specialists={specialistForOnlySelectedServices}
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
            selectSpecialistHandler={selectAnySpecialistHandler}
          />
        )}
      </>
    );
  };

  if (isGlobalLoading) {
    return (
      <div className="absolute top-0 left-0 w-full h-screen flex flex-col items-center justify-center">
        <Player src={BlackLogoAnimation} autoplay loop className="w-[200px] h-[200px]" />
      </div>
    );
  }

  if (isSuccessBooked && getCompanyDetailsQuery.data && createdBooking) {
    return (
      <SuccessBooked company={getCompanyDetailsQuery.data} booking={createdBooking} />
    );
  }

  return (
    <>
      <DraftModal
        isOpen={showDraftBookingConfirmationModal}
        handleContinue={continueEditDraftBookingHandler}
        handleClose={closeDraftBookingHandler}
        handleDelete={deleteDraftBookingHandler}
      />
      <AuthModal
        isDashboard
        isOpen={isOpenAuthModal}
        isLoading={isCreateBookingLoading}
        handleClose={closeAuthModalHandler}
        handleContinue={authModalContinueHandler}
      />
      <PhoneVerifyModal
        phone={form.watch("client.phone")}
        isOpen={isOpenPhoneVerifyModal}
        handleCodeVerify={codeVerifyHandler}
        handleClose={closePhoneVerifyHandler}
        handleContinue={phoneVerifyContinueHandler}
        handleResendCodeVerify={resendVerifyCodeHandler}
      />
      <div className="w-full">
        <div className="flex items-center gap-2">
          {form.watch("_stepId") === "services" ? (
            // <Link href={`/company/${companyId}`}>
            <Button className="!p-2" variant="resting" onClick={handlePrevStep}>
              <ArrowSecondaryDownIcon className="rotate-90 stroke-greyPrimary" />
            </Button>
          ) : (
            // </Link>
            <Button className="!p-2" variant="resting" onClick={handlePrevStep}>
              <ArrowSecondaryDownIcon className="rotate-90 stroke-greyPrimary" />
            </Button>
          )}
          <h4 className="text-[32px] font-bold sm:text-[26px]">
            {t("booking.bookAnAppointment")}
          </h4>
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
          <Stepper activeStepId={form.watch("_stepId")} steps={STEPS_i18n} />
        </div>

        <div className={cn("w-full mt-6 flex items-stretch justify-center", {})}>
          {renderLeftPanel()}
          <div
            ref={rightPanelRef}
            className={cn("w-1/3 h-fit pl-6", {
              "pl-0 sm:w-full": form.watch("_stepId") === "confirm",
              "sm:hidden": form.watch("_stepId") !== "confirm",
            })}
          >
            {getCompanyDetailsQuery.isPending || isGlobalLoading ? (
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
                        {selectedStaff && <StaffSection staff={selectedStaff} />}
                        <PriceSection services={form.watch("selectedServices")} />
                        {isShowContinueButton && (
                          <Button variant="dark" onClick={handleNextStep}>
                            {form.watch("_stepId") === "confirm"
                              ? t("booking.steps.confirm")
                              : t("booking.bookingCard.continueBtn")}
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
          <Button
            variant={isShowContinueButton ? "dark" : "primary"}
            disabled={!isShowContinueButton}
            onClick={handleNextStep}
          >
            {form.watch("_stepId") === "confirm"
              ? t("booking.steps.confirm")
              : t("booking.bookingCard.continueBtn")}
          </Button>
        }
      />
    </>
  );
};

export default BookingFlowBookingCreation;
