"use client";

import Button from "@/components/ui/button";
import ImagesDetails from "./components/ImagesDetails";
import AvatarImage from "./components/AvatarImage";
import GeoPosition from "./components/GeoPosition";
import { useForm } from "react-hook-form";
import {
  useGetCompanyDetailsQuery,
  useUpdateCompanyDetailsQuery,
} from "@/api/queries/company";
import { useEffect } from "react";
import { TTimeSlot } from "@/constants/timeSlots";
import WorkingShedule from "./components/WorkingShedule";
import { toaster } from "@/components/ui/toaster";
import CompanyLogo from "./components/CompanyLogo";
import { TimeManager } from "@/utils/timeManager";
import { useGetCompanyId } from "@/hooks/useGetCompanyId";

export type Form = {
  address?: {
    address1: string;
    address2: string;
    zip_code: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  workingShedule: {
    Monday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
    Tuesday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
    Wednesday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
    Thursday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
    Friday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
    Saturday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
    Sunday: {
      slots: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
      break: {
        from?: TTimeSlot;
        to?: TTimeSlot;
      };
    };
  };
};

const AccountScene = () => {
  const { companyId } = useGetCompanyId();

  const form = useForm<Form>();

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({
    companyId,
  });
  const updateCompanyDetailsQuery = useUpdateCompanyDetailsQuery();

  useEffect(() => {
    if (getCompanyDetailsQuery.data) {
      const data = getCompanyDetailsQuery.data;

      if (data.working_schedule) {
        const tm = new TimeManager();
        const weekDaysWithSlots = tm.getWorkingTimeSlotsForAllWeekDaysCompany(
          data.working_schedule
        );

        const formattedData: Record<string, Form["workingShedule"]["Monday"]> = {};
        Object.entries(weekDaysWithSlots).forEach(([day, value]) => {
          formattedData[day] = {
            slots: {
              from: value.slots.length ? value.slots[0] : undefined,
              to: value.slots.length ? value.slots.at(-1) : undefined,
            },
            break: {
              from: value.break.length ? value.break[0] : undefined,
              to: value.break.length ? value.break.at(-1) : undefined,
            },
          };
        });

        form.setValue("workingShedule", formattedData as Form["workingShedule"]);
      }

      data.city && form.setValue("address.city", data.city);
      data.address1 && form.setValue("address.address1", data.address1);
      data.address2 && form.setValue("address.address2", data.address2);
      data.zip_code && form.setValue("address.zip_code", data.zip_code);
    }
  }, [getCompanyDetailsQuery.data]);

  const updateInformationHandler = async (formData: Form) => {
    try {
      if (formData.address && formData.workingShedule) {
        console.log({ formData });
        const bodyData: Partial<TCompany> = {
          city: formData.address.city,
          address1: formData.address.address1,
          address2: formData.address.address2,
          zip_code: formData.address.zip_code,
          working_schedule: {} as TCompany["working_schedule"],
        };

        if (formData.address.lat && formData.address.lng) {
          bodyData.pos = {
            lat: formData.address.lat,
            lng: formData.address.lng,
          };
        }

        const WEEK_DAYS = Object.keys(form.watch("workingShedule")) as Array<
          keyof Form["workingShedule"]
        >;

        WEEK_DAYS.forEach((fullKey) => {
          const data = form.getValues(`workingShedule.${fullKey}`);

          let value: {
            times: string[];
            breaks: string[];
          } = {
            times: [],
            breaks: [],
          };

          if (bodyData.working_schedule) {
            if (data.slots.from && data.slots.to) {
              value = {
                ...value,
                times: [`${data.slots.from?.label}-${data.slots.to?.label}`],
              };
            }

            if (data.break.from && data.break.to) {
              value = {
                ...value,
                breaks: [`${data.break.from?.label}-${data.break.to?.label}`],
              };
            }

            bodyData.working_schedule[fullKey] = value;
          }
        });

        console.log({ bodyData });

        const res = await updateCompanyDetailsQuery.mutateAsync({
          companyId,
          data: bodyData,
        });

        if (res.data) {
          toaster.success("Company information updated successfully");
        }
      }
    } catch (error) {
      toaster.error("Something went wrong");
    }
  };

  const cancelUpdateHandler = async () => {
    form.reset();
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
          <Button variant="primary" onClick={form.handleSubmit(updateInformationHandler)}>
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
