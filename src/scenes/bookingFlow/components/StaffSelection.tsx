import { FC } from "react";
import { cn } from "@/utils/cn";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import SpecialistList from "./ui/SpecialistList";
import { TTimeSlot } from "@/constants/timeSlots";
import AvatarPlaceholder from "@/assets/staffManagement/specialistWithoutAvatar.png";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  isHideAny?: boolean;
  specialists: TSpecialist[];
  selectedSpecialist?: TSpecialist | "ANY";
  selectSpecialistHandler: (st?: TSpecialist | "ANY") => void;
  selectTimeHandler: (time?: TTimeSlot) => void;
};

const StaffSelection: FC<Props> = ({
  isHideAny,
  specialists,
  selectedSpecialist,
  selectSpecialistHandler,
  selectTimeHandler,
}) => {
  const t = useTranslations();
  const selectStaffHandler = (staff: TSpecialist | "ANY") => {
    const alreadySelectedStaff = selectedSpecialist;

    if (staff === "ANY") {
      selectSpecialistHandler("ANY");
      return;
    }

    if (!alreadySelectedStaff || alreadySelectedStaff === "ANY") {
      selectSpecialistHandler(staff);
    } else if (alreadySelectedStaff.id === staff.id) {
      selectSpecialistHandler(undefined);
    } else {
      selectSpecialistHandler(staff);
    }

    selectTimeHandler(undefined);
  };

  return (
    <div className="w-2/3 min-h-[590px] h-[calc(100vh-124px-100px-52px)] pr-6 flex flex-col gap-6 border-r border-greyOutlineSecondary sm:w-full sm:border-none sm:pr-0 sm:pb-[40px]">
      <p className="text-sm font-bold text-greyPrimary">
        {t("booking.professionalStep.selectProfessional")}
      </p>

      <div
        className={cn(
          "w-full max-h-[800px] pr-2 grid grid-cols-6 gap-4 overflow-y-auto md:grid-cols-2 sm:grid-cols-2",
          CustomScrollbar.CustomScrollbar
        )}
      >
        {!isHideAny && (
          <div
            onClick={() => selectStaffHandler("ANY")}
            className={cn(
              "w-full min-h-[164px] p-5 col-span-2 flex flex-col items-center rounded-lg",
              "border border-greyOutlineSecondary transition-all cursor-pointer hover:border-purplePrimary",
              "md:col-span-1 sm:col-span-1",
              {
                "bg-purplePrimary/10 border-purplePrimary": selectedSpecialist === "ANY",
              }
            )}
          >
            <div className="w-[64px] h-[64px] rounded-lg overflow-hidden bg-greyLight">
              <Image width={64} height={64} src={AvatarPlaceholder} alt="Bowers" />
            </div>
            <p className="mt-4 text-sm font-bold text-center">
              {t("booking.professionalStep.anyProf")}
            </p>
            <p className="max-w-full text-nowrap text-ellipsis overflow-hidden text-sm text-greyPrimary text-center">
              {t("booking.professionalStep.forMaxAvailability")}
            </p>
          </div>
        )}
        <SpecialistList
          specialists={specialists}
          selectedSpecialist={selectedSpecialist}
          selectStaffHandler={selectStaffHandler}
        />
      </div>
    </div>
  );
};

export default StaffSelection;
