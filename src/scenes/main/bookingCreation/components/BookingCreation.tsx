import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Link, useRouter, useTranslations } from "@/i18n";

import { useCreateBookingQuery } from "@/api/queries/booking";
import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyServicesQuery } from "@/api/queries/company/services";
import { useGetCompanyServiceCategoriesQuery } from "@/api/queries/company/serviceCategories";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";
import type { TCreateBookingArgs } from "@/api/entities/booking";

import AuthModal, { AuthForm } from "@/scenes/bookingFlow/components/AuthModal";
import ServiceSelection from "@/scenes/bookingFlow/components/ServiceSelection";
import StaffSelection from "@/scenes/bookingFlow/components/StaffSelection";
import TimeSelection from "@/scenes/bookingFlow/components/TimeSelection";
import Button from "@/components/ui/button";
import CalendarIcon from "@/components/ui/icons/Calendar";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";
import ClockIcon from "@/components/ui/icons/Clock";
import NoteIcon from "@/components/ui/icons/Note";
import PersonIcon from "@/components/ui/icons/Person";
import Spinner from "@/components/ui/loaders/Spinner";
import Stepper, { TStep } from "@/components/ui/stepper";
import { toaster } from "@/components/ui/toaster";
import CompanyCartWidget from "@/components/ui/widgets/companyCart";

import { PREVIOUSLY_BOOKED_SERVICES } from "@/constants/keys";
import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import MobileBottomCart from "@/scenes/bookingFlow/components/MobileBottomCart";

const STEPS = [
  { id: "services", text: "Services", icon: NoteIcon },
  { id: "staffs", text: "Professional", icon: PersonIcon },
  { id: "time", text: "Time", icon: CalendarIcon },
  { id: "confirm", text: "Confirm", icon: CheckmarkCircle },
] as const;

type TStepsId = (typeof STEPS)[number]["id"];

export type TServiceAndSelectedOption = TService & { selectedOption: TServiceOption };

export type CreateBookingForm = {
  _stepId: TStepsId;
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

const BookingCreation = () => {
  const t = useTranslations();
  const { companyId } = useGetCompanyId();

  const router = useRouter();
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const [prevBookedServiceToLocalStorage, setBookedServiceToLocalStorage] =
    useLocalStorage(PREVIOUSLY_BOOKED_SERVICES, [] as TService[]);

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const getCompanyServicesQuery = useGetCompanyServicesQuery({
    companyId,
  });
  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({ companyId });
  const getCompanyServiceCategoriesQuery = useGetCompanyServiceCategoriesQuery({
    companyId,
  });

  const createBookingQuery = useCreateBookingQuery();

  const [isOpenAuthModal, setIsOpenAuthModal] = useState(false);
  const [isSuccessBooked, setIsSuccessBooked] = useState(false);
  const [isCreateBookingLoading, setIsCreateBookingLoading] = useState(false);

  const form = useForm<CreateBookingForm>({
    defaultValues: {
      _stepId: "services",
      selectedServices: [],
      selectedDate: new Date(),
      isPhoneVerified: true,
    },
  });

  const confirmHandler = () => {
    setIsSuccessBooked(true);
    form.reset();
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
        setIsCreateBookingLoading(true);
        const specialist =
          formData.selectedStaff === "ANY"
            ? formData.selectedAnyStaff
            : formData.selectedStaff;

        if (!specialist || !formData.client.email) {
          toaster.error("Client email and specialist are required");
          return false;
        }

        const data: TCreateBookingArgs["data"] = {
          services: formData.selectedServices.map((service) => service.id),
          specialist: specialist.id,
          customer: {
            email: formData.client.email,
            first_name: formData.client.first_name,
            last_name: formData.client.last_name || "",
          },
          date: formData.selectedDate,
          slots: [],
        };

        const timeSlots = [...TIME_SLOTS];
        const selectedTimeIdx = timeSlots.findIndex(
          (s) => s.slot === formData.selectedTime!.slot
        );
        const allTimeDurationInSlotsCount = Math.ceil(
          formData.selectedServices.reduce(
            (acc, c) => (acc += c.selectedOption.duration),
            0
          ) / 15
        );
        const slots = timeSlots
          .slice(selectedTimeIdx, selectedTimeIdx + allTimeDurationInSlotsCount)
          .map((s) => s.slot);

        data.slots = slots;

        const res = await createBookingQuery.mutateAsync({ companyId, data });

        if (res.data) {
          setBookedServiceToLocalStorage([
            ...formData.selectedServices,
            ...prevBookedServiceToLocalStorage,
          ]);

          toaster.success("Booking created successfully");
          // router.push(
          //   `/company/${companyId}/booking-cancelation/${res.data.results.id}/`
          // );

          return true;
        }
      }
    } catch (error) {
      toaster.error("Something went wrong");
    } finally {
      setIsCreateBookingLoading(false);
    }
  };

  const handleNextStep = () => {
    const idx = STEPS.findIndex((s) => s.id === form.watch("_stepId"));

    if (form.watch("_stepId") === "time") {
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

  const handleSelectStep = (step: TStep) => {
    form.setValue("_stepId", step.id as TStepsId);
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

  const authModalContinueHandler = async (authModalFormData: AuthForm) => {
    try {
      // form.setValue("_stepId", "confirm");
      form.setValue("client", authModalFormData);
      const isCreated = await createBookingHandler();
      if (!isCreated) return;

      closeAuthModalHandler();

      if (!form.watch("isPhoneVerified")) {
        // setIsOpenPhoneVerifyModal(true);
      } else {
        form.setValue("_stepId", "confirm");
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
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

    if (getCompanyDetailsQuery.data?.city) {
      arr.push(getCompanyDetailsQuery.data?.city);
    }

    if (getCompanyDetailsQuery.data?.address) {
      arr.push(getCompanyDetailsQuery.data.address);
    }

    return arr.join(", ");
  }, [getCompanyDetailsQuery.data]);

  const duration = useMemo(() => {
    const mins = form
      .watch("selectedServices")
      .reduce((acc, s) => (acc += s.selectedOption.duration), 0);

    if (mins % 60 === 0) {
      return mins / 60;
    }

    return (mins / 60).toFixed(1);
  }, [form.watch("selectedServices")]);

  const companyServiceCategories = getCompanyServiceCategoriesQuery.data?.results || [];

  const servicesCanSelect = useMemo(() => {
    if (getCompanyServicesQuery.data?.results) {
      return getCompanyServicesQuery.data.results.filter((s) => s.specialists.length);
    }

    return [];
  }, [getCompanyServicesQuery.data]);

  const specialistForOnlySelectedServices = useMemo(() => {
    const services = form.watch("selectedServices");

    if (getCompanySpecialistsQuery.data?.results) {
      const serviceSpecialistIds = services.map(
        (service) =>
          new Set(
            service.specialists.map((specialist) =>
              typeof specialist === "string" ? specialist : specialist.id
            )
          )
      );

      return getCompanySpecialistsQuery.data.results.filter((specialist) =>
        serviceSpecialistIds.every((ids) => ids.has(specialist.id))
      );
    }

    return [];
  }, [getCompanySpecialistsQuery.data, form.watch("selectedServices")]);

  const STEPS_i18n = useMemo(
    () => STEPS.map((s) => ({ ...s, text: t(`booking.steps.${s.id}` as any) })),
    []
  );

  if (isSuccessBooked) {
    return (
      <div className="absolute left-0 right-0 top-[78px] w-full h-full pt-[100px] flex flex-col items-center">
        <CheckmarkCircle className="w-20 h-20 stroke-greenPrimary" />
        <h4 className="mt-5 text-[32px] font-bold text-center">
          Schedule appointment successfully
        </h4>
        <p className="text-center">We will send a confirmation via your phone.</p>
        <Link href="/search" className="mt-10">
          <Button variant="primary">Search page</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthModal
        isDashboard
        hideLabelRequiredSymbol
        nameInputPlaceholder={t(
          "booking.clientInformationStep.name.placeholderEnterClientName"
        )}
        isOpen={isOpenAuthModal}
        isLoading={isCreateBookingLoading}
        handleClose={closeAuthModalHandler}
        handleContinue={authModalContinueHandler}
      />
      <div className="w-full h-full px-7 py-10 rounded-xl bg-white sm:px-5 sm:py-6">
        <div className="w-full">
          <Stepper
            activeStepId={form.watch("_stepId")}
            steps={STEPS_i18n}
            canSelectStep
            selectStepHandler={handleSelectStep}
          />
        </div>

        <div className={cn("w-full pt-14 flex items-stretch justify-center", {})}>
          {form.watch("_stepId") === "services" && (
            <ServiceSelection
              rightPanelHeight={rightPanelRef.current?.clientHeight}
              serviceTypes={companyServiceCategories}
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
          <div
            ref={rightPanelRef}
            className={cn("w-1/3 h-fit pl-6 md:w-1/2", {
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
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="stroke-darkPrimary" />
                        <p className="text-sm text-greyPrimary">
                          {format(form.watch("selectedDate"), "EEEE d MMM")}
                        </p>
                      </div>
                    )}
                    {form.watch("selectedTime") && (
                      <div className="mt-2 flex items-center gap-2">
                        <ClockIcon className="stroke-darkPrimary" />
                        <p className="text-sm text-greyPrimary">
                          {form.watch("selectedTime")?.label} ({duration} hr duration)
                        </p>
                      </div>
                    )}
                    {!!form.watch("selectedServices").length && (
                      <div className="flex flex-col">
                        <div
                          className={cn(
                            "max-h-[227px] mt-2 pr-2 flex flex-col gap-2 overflow-y-auto"
                            // CustomScrollbar.CustomScrollbar
                          )}
                        >
                          <p className="text-sm">{t("booking.steps.services")}</p>
                          {form.watch("selectedServices").map((s) => (
                            <div key={s.id} className="flex items-center gap-2">
                              <div className="size-5 rounded-full border-2 border-greyLight"></div>
                              {/* <div className="w-[48px] h-[48px] mr-5 rounded-lg overflow-hidden bg-greyLight">
                                {s.image ? (
                                  <Image
                                    className="w-full h-full object-cover"
                                    width={48}
                                    height={48}
                                    src={s.image}
                                    alt={s.name}
                                  />
                                ) : (
                                  <div className="w-[48px] h-[48px] rounded-lg bg-greyLight"></div>
                                )}
                              </div> */}
                              <div className="flex-1 flex flex-col gap-1">
                                <p className="text-sm font-bold">
                                  {s.selectedOption.name ? s.selectedOption.name : s.name}
                                </p>
                                <p className="text-sm text-greyPrimary">
                                  {s.selectedOption.duration}{" "}
                                  {t("booking.servicesStep.mins")}
                                </p>
                              </div>
                              <div>
                                <p className="font-bold">
                                  {formatCurrency(s.selectedOption.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {selectedStaff && selectedStaff === "ANY" && (
                          <div className="mt-4">
                            <p className="text-sm">{t("booking.steps.staffs")}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="size-5 rounded-full border-2 border-greyLight"></div>

                              {/* <div className="w-[48px] h-[48px] mr-5 rounded-lg overflow-hidden bg-greyLight">
                                <Image
                                  className="w-full h-full object-cover"
                                  width={48}
                                  height={48}
                                  src={AnyAvatarPlaceholder}
                                  alt={t("booking.professionalStep.anyProf")}
                                />
                              </div> */}
                              <div className="flex-1 flex flex-col gap-1">
                                <p className="text-sm font-bold">
                                  {t("booking.professionalStep.anyProf")}
                                </p>
                                <p className="text-sm text-greyPrimary">
                                  {t("booking.professionalStep.forMaxAvailability")}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {selectedStaff && selectedStaff !== "ANY" && (
                          <div className="mt-4">
                            <p className="text-sm">{t("booking.steps.staffs")}</p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="size-5 rounded-full border-2 border-greyLight"></div>

                              {/* <div className="w-[48px] h-[48px] mr-5 rounded-lg overflow-hidden bg-greyLight">
                                {selectedStaff.avatar ? (
                                  <Image
                                    className="w-full h-full object-cover"
                                    width={48}
                                    height={48}
                                    src={selectedStaff.avatar}
                                    alt={selectedStaff.fullName}
                                  />
                                ) : (
                                  <div className="w-[48px] h-[48px] rounded-lg bg-greyLight"></div>
                                )}
                              </div> */}
                              <div className="flex-1 flex flex-col gap-1">
                                <p className="text-sm font-bold">
                                  {selectedStaff.fullName}
                                </p>
                                <p className="text-sm text-greyPrimary">
                                  {/* {selectedStaff.bio} */}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className="mt-6 py-6 border-t border-greyOutlineSecondary">
                          <p className="font-bold text-sm">
                            {t("booking.bookingCard.price.total")}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs">
                              ({t("booking.bookingCard.price.payAtStore")})
                            </p>
                            <h6 className="font-bold">
                              {formatCurrency(
                                form
                                  .watch("selectedServices")
                                  .reduce(
                                    (acc, c) => (acc += Number(c.selectedOption.price)),
                                    0
                                  )
                              )}
                            </h6>
                          </div>
                        </div>
                        {isShowContinueButton && (
                          <Button
                            variant="dark"
                            onClick={
                              form.watch("_stepId") === "confirm"
                                ? confirmHandler
                                : handleNextStep
                            }
                          >
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
        isDashboard
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

export default BookingCreation;
