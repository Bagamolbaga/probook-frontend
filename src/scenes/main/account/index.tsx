"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsQuery,
} from "@/api/queries/company";
import Button from "@/components/ui/button";
import { toaster } from "@/components/ui/toaster";
import { TTimeSlot } from "@/constants/timeSlots";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";
import { TimeManager } from "@/utils/timeManager";
import AvatarImage from "./components/AvatarImage";
import CompanyLogo from "./components/CompanyLogo";
import GeoPosition from "./components/GeoPosition";
import ImagesDetails from "./components/ImagesDetails";
import WorkingShedule from "./components/WorkingShedule";

type TimeRange = {
  from?: TTimeSlot;
  to?: TTimeSlot;
};

type WorkingScheduleFormDay = {
  slots: TimeRange;
  break: TimeRange;
};

export type Form = {
  address: {
    address: string;
    zipCode: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  workingSchedule: Record<WorkingScheduleWeekDays, WorkingScheduleFormDay>;
};

const WEEK_DAYS: WorkingScheduleWeekDays[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const createEmptyWorkingSchedule = (): Form["workingSchedule"] =>
  Object.fromEntries(
    WEEK_DAYS.map((day) => [day, { slots: {}, break: {} }])
  ) as Form["workingSchedule"];

const toTimeRange = (slots: number[], slotManager: TimeManager): TimeRange => {
  const fullSlots = slotManager.getFullSlots(slots);

  return {
    from: fullSlots[0],
    to: fullSlots.at(-1),
  };
};

const toWorkingScheduleForm = (
  workingSchedule: TCompany["workingSchedule"]
): Form["workingSchedule"] => {
  const slotManager = new TimeManager();

  return Object.fromEntries(
    WEEK_DAYS.map((day) => {
      const daySchedule = workingSchedule[day];

      return [
        day,
        {
          slots: toTimeRange(daySchedule?.workingSlots ?? [], slotManager),
          break: toTimeRange(daySchedule?.breakSlots ?? [], slotManager),
        },
      ];
    })
  ) as Form["workingSchedule"];
};

const toSlotRange = ({ from, to }: TimeRange, slotManager: TimeManager) => {
  if (!from || !to) return [];

  return slotManager.getSlotsInRange(from.slot, to.slot);
};

const getFormValues = (company: TCompany): Form => ({
  address: {
    address: company.address ?? "",
    zipCode: company.zipCode ?? "",
    city: company.city ?? "",
    lat: company.pos?.lat ?? undefined,
    lng: company.pos?.lng ?? undefined,
  },
  workingSchedule: company.workingSchedule
    ? toWorkingScheduleForm(company.workingSchedule)
    : createEmptyWorkingSchedule(),
});

const AccountScene = () => {
  const { companyId } = useGetCompanyId();
  const form = useForm<Form>({
    defaultValues: {
      address: {
        address: "",
        zipCode: "",
        city: "",
      },
      workingSchedule: createEmptyWorkingSchedule(),
    },
  });

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });
  const updateCompanyDetailsQuery = useUpdateCompanyDetailsQuery();

  useEffect(() => {
    const company = getCompanyDetailsQuery.data;
    if (!company) return;

    form.reset(getFormValues(company));
  }, [form, getCompanyDetailsQuery.data]);

  const updateInformationHandler = async (formData: Form) => {
    const slotManager = new TimeManager();
    const workingSchedule = Object.fromEntries(
      WEEK_DAYS.map((day) => {
        const daySchedule = formData.workingSchedule[day];

        return [
          day,
          {
            workingSlots: toSlotRange(daySchedule.slots, slotManager),
            breakSlots: toSlotRange(daySchedule.break, slotManager),
          },
        ];
      })
    ) as TCompany["workingSchedule"];

    try {
      await updateCompanyDetailsQuery.mutateAsync({
        companyId,
        data: {
          city: formData.address.city,
          address: formData.address.address,
          zipCode: formData.address.zipCode,
          pos:
            formData.address.lat !== undefined && formData.address.lng !== undefined
              ? { lat: formData.address.lat, lng: formData.address.lng }
              : undefined,
          workingSchedule,
        },
      });

      toaster.success("Company information updated successfully");
    } catch (_error) {
      toaster.error("Something went wrong");
    }
  };

  const cancelUpdateHandler = () => {
    const company = getCompanyDetailsQuery.data;
    if (!company) return;

    form.reset(getFormValues(company));
  };

  return (
    <div className="w-full flex flex-col justify-between">
      <div className="w-full flex flex-col">
        <p className="mb-5 text-base font-bold">Account details</p>
        <div className="w-full flex items-center gap-16">
          <AvatarImage />
          <CompanyLogo />
        </div>

        <ImagesDetails />

        <WorkingShedule form={form} isLoading={getCompanyDetailsQuery.isPending} />

        <GeoPosition form={form} isLoading={getCompanyDetailsQuery.isPending} />
      </div>

      <div className="w-full mt-10 flex items-end justify-between">
        <div className="flex items-center gap-[46px]">
          <Button
            variant="primary"
            onClick={form.handleSubmit(updateInformationHandler)}
            disabled={updateCompanyDetailsQuery.isPending}
          >
            Update Settings
          </Button>
          <Button variant="resting" className="py-3" onClick={cancelUpdateHandler}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountScene;
