/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { isAxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useRouter, useTranslations } from "@/i18n";
import { useLocale } from "next-intl";

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
import BookingOtpVerification from "./components/BookingOtpVerification";
import AuthModal, { AuthForm } from "../components/AuthModal";
import CustomerDetailsSelection from "../components/CustomerDetailsSelection";
import MobileBottomCart from "../components/MobileBottomCart";
import Button from "@/components/ui/button";
import Spinner from "@/components/ui/loaders/Spinner";
import Stepper, { TStep } from "@/components/ui/stepper";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CalendarIcon from "@/components/ui/icons/Calendar";
import ClockIcon from "@/components/ui/icons/Clock";
import NoteIcon from "@/components/ui/icons/Note";
import PersonIcon from "@/components/ui/icons/Person";
import { toaster } from "@/components/ui/toaster";

import { TIME_SLOTS, TTimeSlot } from "@/constants/timeSlots";
import { PREVIOUSLY_BOOKED_SERVICES } from "@/constants/keys";
import { useAppSession } from "@/hooks/useAppSession";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getUserCompanies } from "@/utils/permissions";
import DraftModal from "./components/DraftModal";
import { Player } from "@lottiefiles/react-lottie-player";
import BlackLogoAnimation from "@/assets/lottiefiles/blackLogoAnimation.json";
import { cn } from "@/utils/cn";
import { formatCurrency } from "@/utils/formatCurrency";
import Image from "next/image";
import LocationIcon from "@/components/ui/icons/Location";
import { Lock } from "lucide-react";

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
  client?: AuthForm;
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

type BookingSummaryCardProps = {
  avatar?: string;
  name: string;
  surname: string;
  location: string;
  selectedServices: TServiceAndSelectedOption[];
  selectedStaff?: TSpecialist | "ANY";
  selectedDate?: Date;
  selectedTime?: TTimeSlot;
};

const SummaryRow = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 text-sm text-darkPrimary">
    {icon}
    {children}
  </div>
);

const BookingSummaryCard: FC<BookingSummaryCardProps> = ({
  avatar,
  name,
  surname,
  location,
  selectedServices,
  selectedStaff,
  selectedDate,
  selectedTime,
}) => {
  const selectedService = selectedServices[0];
  const selectedOption = selectedService?.selectedOption;
  const total = selectedServices.reduce(
    (sum, service) => sum + Number(service.selectedOption.price),
    0
  );
  const durationSlots = selectedServices.reduce(
    (sum, service) => sum + Math.ceil(service.selectedOption.duration / 15),
    0
  );
  const endTime = selectedTime && TIME_SLOTS[selectedTime.slot + durationSlots];
  const formattedDate = selectedDate
    ? new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(selectedDate)
    : null;

  return (
    <div className="w-full rounded-[14px] border border-greyOutlineSecondary bg-white p-5 shadow-primary">
      <div className="flex items-center gap-3">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-purplePrimary">
          {avatar ? (
            <Image fill src={avatar} alt="" className="object-cover" />
          ) : (
            <span className="text-xs font-bold text-white">PB</span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-funnel text-base font-bold">{name}</h3>
          <p className="text-xs text-greyPrimary">{surname}</p>
        </div>
      </div>

      <p className="mt-7 text-[10px] font-bold tracking-[0.5px] text-purplePrimary">
        ПРОВЕРЬТЕ ДЕТАЛИ
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {selectedService && (
          <SummaryRow icon={<NoteIcon className="size-4 stroke-purplePrimary" />}>
            <span className="min-w-0 flex-1 truncate font-bold">
              {selectedOption?.name || selectedService.name}
            </span>
          </SummaryRow>
        )}
        {selectedStaff && (
          <SummaryRow icon={<PersonIcon className="size-4 stroke-purplePrimary" />}>
            <span className="truncate">
              {selectedStaff === "ANY" ? "Любой специалист" : selectedStaff.fullName}
            </span>
          </SummaryRow>
        )}
        {selectedDate && (
          <SummaryRow icon={<CalendarIcon className="size-4 stroke-purplePrimary" />}>
            {formattedDate}
          </SummaryRow>
        )}
        {selectedTime && (
          <SummaryRow icon={<ClockIcon className="size-4 stroke-purplePrimary" />}>
            {selectedTime.label}
            {endTime ? `–${endTime.label}` : ""}
          </SummaryRow>
        )}
        {location && (
          <SummaryRow icon={<LocationIcon className="size-4 stroke-purplePrimary" />}>
            <span className="truncate">{location}</span>
          </SummaryRow>
        )}
      </div>

      {selectedService && (
        <div className="mt-6 flex items-center justify-between border-t border-greyOutlineSecondary pt-5">
          <span className="text-xs text-greyPrimary">К оплате на месте</span>
          <span className="font-funnel text-base font-bold">{formatCurrency(total)}</span>
        </div>
      )}

      <div className="flex items-center gap-2 mt-5 px-3 py-2 rounded-xl bg-purpleExtraLight text-[10px] text-grey-800">
        <Lock className="size-3 stroke-purplePrimary" /> Данные защищены и не передаются
        третьим лицам
      </div>
    </div>
  );
};

const BookingFlowBookingCreation: FC<Props> = ({ companyId }) => {
  const t = useTranslations();
  const locale = useLocale() as "en" | "ru";
  const { data: session, update: updateSession } = useAppSession();
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
  const [createdClientEmail, setCreatedClientEmail] = useState("");
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

  const authenticatedClient = useMemo<AuthForm | undefined>(() => {
    const user = session?.user;
    if (!user || getUserCompanies(user).length) return undefined;

    const fullNameParts = user.fullName?.trim().split(/\s+/) ?? [];

    return {
      first_name: user.firstName || fullNameParts[0] || "",
      last_name: user.lastName || fullNameParts.slice(1).join(" "),
      phone: user.phone || "",
      email: user.email || "",
      preferredLocale: user.preferredLocale || locale,
    };
  }, [locale, session?.user]);

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
      const requestedServiceIds = servicesStr.split(",");
      const services: TServiceAndSelectedOption[] = requestedServiceIds
        .map((id) =>
          getCompanyServicesQuery.data.results.find((s) => String(s.id) === id)
        )
        .filter((s) => !!s)
        .map((s, idx) => {
          const selectedOption = s.options.find(
            (option) => String(option._id || option.id) === options[idx]
          );

          return {
            ...s,
            selectedOption,
          };
        })
        .filter((s) => s.selectedOption) as TServiceAndSelectedOption[];

      form.setValue("selectedServices", services);
      if (
        searchParams.get("repeat") === "1" &&
        services.length < requestedServiceIds.length
      ) {
        toaster.warn(t("booking.bookedSuccessStep.repeatUnavailable"));
      }
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
          preferredLocale: session.user.preferredLocale || locale,
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
    const client = form.getValues("client");
    setCreatedClientEmail(client?.email || "");

    if (otp_sent || client?.email) {
      setIsOpenPhoneVerifyModal(true);
    } else {
      setIsSuccessBooked(true);
    }

    setDraftBookingInLS(null);
  };

  const getCreateBookingData = (): TCreateBookingArgs["data"] | undefined => {
    const formData = form.getValues();
    if (
      !formData.selectedServices.length ||
      !formData.selectedStaff ||
      !formData.selectedDate ||
      !formData.selectedTime ||
      !formData.client
    ) {
      return;
    }

    const selectedTimeIdx = TIME_SLOTS.findIndex(
      (slot) => slot.slot === formData.selectedTime!.slot
    );
    if (selectedTimeIdx < 0) return;

    const durationInSlots = Math.ceil(
      formData.selectedServices.reduce(
        (total, service) => total + service.selectedOption.duration,
        0
      ) / 15
    );

    return {
      services: formData.selectedServices.map((service) => ({
        serviceId: service.id,
        optionId: String(service.selectedOption._id || service.selectedOption.id),
      })),
      specialist:
        formData.selectedStaff === "ANY"
          ? formData.selectedAnyStaff!.id
          : formData.selectedStaff.id,
      date: formData.selectedDate,
      slots: TIME_SLOTS.slice(selectedTimeIdx, selectedTimeIdx + durationInSlots).map(
        (slot) => slot.slot
      ),
      customer: {
        first_name: formData.client.first_name,
        last_name: formData.client.last_name,
        email: formData.client.email || "",
        phone: formData.client.phone,
      },
      customerLocale: formData.client.preferredLocale,
    };
  };

  const showBookingError = (error: unknown, fallback: string) => {
    const responseMessage = isAxiosError(error) ? error.response?.data?.message : null;
    const message = Array.isArray(responseMessage)
      ? responseMessage.join(". ")
      : typeof responseMessage === "string"
        ? responseMessage
        : fallback;
    toaster.error(message);
  };

  const createBookingHandler = async () => {
    try {
      const formData = form.getValues();
      const data = getCreateBookingData();
      if (data) {
        toaster("Booking creating please wait");
        setIsCreateBookingLoading(true);

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
      showBookingError(error, t("booking.errors.createFailed" as any));
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
      form.setValue("_stepId", "data");
      return;
    }

    if (form.watch("_stepId") === "data") {
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
      setIsGlobalLoading(true);

      const bookingData = getCreateBookingData();
      if (!bookingData) throw new Error("Incomplete booking data");

      await apiClient.bookings.validateBooking({ companyId, data: bookingData });

      await apiClient.customerUser.requestEmailOtp({
        email: authModalFormData.email,
        locale: authModalFormData.preferredLocale,
      });

      setCreatedClientEmail(authModalFormData.email);
      setIsOpenPhoneVerifyModal(true);
      closeAuthModalHandler();
    } catch (error) {
      showBookingError(error, t("booking.otp.requestFailed" as any));
    } finally {
      setIsGlobalLoading(false);
    }
  };

  const phoneVerifyContinueHandler = async (phoneVerifyFormData: PhoneVerifyForm) => {
    void phoneVerifyFormData;
    if (!session?.accessToken) {
      toaster.error(t("booking.otp.authFailed" as any));
      return;
    }

    const booking = await createBookingHandler();
    if (!booking) return;

    setIsSuccessBooked(true);
    setDraftBookingInLS(null);
    closePhoneVerifyHandler();
  };

  const codeVerifyHandler = async ({ code }: { code: string }) => {
    const client = form.getValues("client");
    if (!client?.email) return false;

    try {
      const result = await signIn("email-otp", {
        email: client.email,
        code,
        firstName: client.first_name,
        lastName: client.last_name,
        phone: client.phone,
        redirect: false,
      });

      if (!result?.ok) {
        toaster.error(t("booking.otp.invalidCode" as any));
        return false;
      }

      await updateSession();
      form.setValue("isPhoneVerified", true);
      return true;
    } catch {
      toaster.error(t("booking.otp.invalidCode" as any));
      return false;
    }
  };

  const resendVerifyCodeHandler = async () => {
    const client = form.getValues("client");
    if (!client?.email) return false;

    await apiClient.customerUser.requestEmailOtp({
      email: client.email,
      locale: client.preferredLocale,
    });
    return true;
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

    if (getCompanyDetailsQuery.data?.address) {
      arr.push(getCompanyDetailsQuery.data?.address);
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

  const PROGRESS_STEPS = useMemo<TStep[]>(
    () => [
      { id: "services", text: t("booking.steps.services" as any) },
      { id: "staffs", text: t("booking.steps.staffs" as any) },
      { id: "time", text: t("booking.steps.dateTime" as any) },
      { id: "data", text: t("booking.steps.data" as any) },
      { id: "code", text: t("booking.steps.code" as any) },
      { id: "done", text: t("booking.steps.done" as any) },
    ],
    []
  );

  const progressStepId = isOpenPhoneVerifyModal
    ? "code"
    : isOpenAuthModal
      ? "data"
      : form.watch("_stepId");

  const progressStepIndex = PROGRESS_STEPS.findIndex(
    (step) => step.id === progressStepId
  );
  const clickableProgressSteps = PROGRESS_STEPS.map((step, index) => ({
    ...step,
    disabled: index > progressStepIndex,
  }));

  const handleProgressStepSelect = (step: TStep) => {
    closeAuthModalHandler();
    closePhoneVerifyHandler();

    if (step.id === "services" || step.id === "staffs" || step.id === "time") {
      form.setValue("_stepId", step.id);
      return;
    }

    if (step.id === "data" && !createdBooking) {
      setIsOpenAuthModal(true);
      return;
    }

    if (step.id === "code" && createdBooking) {
      setIsOpenPhoneVerifyModal(true);
    }
  };

  const renderLeftPanel = () => {
    if (isGlobalLoading) {
      return null;
    }

    return (
      <>
        {isOpenPhoneVerifyModal && (
          <BookingOtpVerification
            email={createdClientEmail}
            handleCodeVerify={codeVerifyHandler}
            handleResend={resendVerifyCodeHandler}
            handleEdit={() => {
              closePhoneVerifyHandler();
              form.setValue("_stepId", "data");
            }}
            handleComplete={() => void phoneVerifyContinueHandler({ code: "" })}
          />
        )}
        {!isOpenPhoneVerifyModal && form.watch("_stepId") === "services" && (
          <ServiceSelection
            rightPanelHeight={rightPanelRef.current?.clientHeight}
            serviceTypes={companyServicesTypes}
            services={servicesCanSelect}
            selectedServices={form.watch("selectedServices")}
            selectServiceHandler={selectServiceHandler}
            variant="booking"
          />
        )}
        {!isOpenPhoneVerifyModal && form.watch("_stepId") === "staffs" && (
          <StaffSelection
            specialists={specialistForOnlySelectedServices}
            selectedSpecialist={form.watch("selectedStaff")}
            selectSpecialistHandler={selectSpecialistHandler}
            selectTimeHandler={selectTimeHandler}
            variant="booking"
          />
        )}
        {!isOpenPhoneVerifyModal && form.watch("_stepId") === "time" && (
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
        {!isOpenPhoneVerifyModal && form.watch("_stepId") === "data" && (
          <CustomerDetailsSelection
            key={authenticatedClient?.email || "guest"}
            initialClient={authenticatedClient}
            onSubmit={authModalContinueHandler}
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
        isOpen={false}
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
              {getCompanyDetailsQuery?.data?.address && (
                <LocationIcon className="min-w-4 min-h-4" />
              )}
            </p>
          </div>
        </div>

        <div className="w-full border-b border-b-greyOutlineSecondary bg-white">
          <Stepper
            activeStepId={progressStepId}
            steps={clickableProgressSteps}
            canSelectStep
            selectStepHandler={handleProgressStepSelect}
            variant="booking-progress"
          />
        </div>

        <div className={cn("w-full mt-6 flex items-stretch justify-center", {})}>
          {renderLeftPanel()}
          <div
            ref={rightPanelRef}
            className={cn("w-1/3 h-fit pl-6", {
              "pl-0 sm:w-full": form.watch("_stepId") === "confirm",
              "sm:hidden": form.watch("_stepId") !== "confirm",
              hidden: isOpenPhoneVerifyModal,
            })}
          >
            {getCompanyDetailsQuery.isPending || isGlobalLoading ? (
              <div className="w-full mt-6 flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                <BookingSummaryCard
                  avatar={getCompanyDetailsQuery.data?.logo ?? undefined}
                  name={getCompanyDetailsQuery.data?.name || ""}
                  surname={getCompanyDetailsQuery.data?.businessType || ""}
                  location={companyLocation}
                  selectedServices={form.watch("selectedServices")}
                  selectedStaff={selectedStaff}
                  selectedDate={form.watch("selectedDate")}
                  selectedTime={form.watch("selectedTime")}
                />
                <Button
                  className="mt-4 w-full"
                  variant="dark"
                  disabled={!isShowContinueButton}
                  type={form.watch("_stepId") === "data" ? "submit" : "button"}
                  form={
                    form.watch("_stepId") === "data" ? "booking-contact-form" : undefined
                  }
                  onClick={form.watch("_stepId") === "data" ? undefined : handleNextStep}
                >
                  {form.watch("_stepId") === "data"
                    ? t("booking.clientInformationStep.confirmBtn" as any)
                    : form.watch("_stepId") === "confirm"
                      ? t("booking.steps.confirm")
                      : t("booking.bookingCard.continueBtn")}
                </Button>
              </>
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
            type={form.watch("_stepId") === "data" ? "submit" : "button"}
            form={form.watch("_stepId") === "data" ? "booking-contact-form" : undefined}
            onClick={form.watch("_stepId") === "data" ? undefined : handleNextStep}
          >
            {form.watch("_stepId") === "data"
              ? t("booking.clientInformationStep.confirmBtn" as any)
              : form.watch("_stepId") === "confirm"
                ? t("booking.steps.confirm")
                : t("booking.bookingCard.continueBtn")}
          </Button>
        }
      />
    </>
  );
};

export default BookingFlowBookingCreation;
