import { FC } from "react";
import { Sparkles, Star } from "lucide-react";
import { cn } from "@/src/utils/cn";
import CustomScrollbar from "@/src/styles/scrollbar.module.sass";
import SpecialistList from "./ui/SpecialistList";
import { TTimeSlot } from "@/src/constants/timeSlots";
import AvatarPlaceholder from "@/src/assets/staffManagement/specialistWithoutAvatar.png";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Props = {
  isHideAny?: boolean;
  specialists: TSpecialist[];
  selectedSpecialist?: TSpecialist | "ANY";
  selectSpecialistHandler: (st?: TSpecialist | "ANY") => void;
  selectTimeHandler: (time?: TTimeSlot) => void;
  variant?: "default" | "booking";
};

const StaffSelection: FC<Props> = ({
  isHideAny,
  specialists,
  selectedSpecialist,
  selectSpecialistHandler,
  selectTimeHandler,
  variant = "default",
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

  if (variant === "booking") {
    return (
      <div className="flex min-h-[590px] h-[calc(100vh-124px-100px-52px)] w-2/3 flex-col gap-6 border-r border-greyOutlineSecondary pr-6 sm:w-full sm:border-none sm:pr-0 sm:pb-[40px]">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold tracking-[0.5px] text-purplePrimary">
            {t("booking.professionalStep.stepLabel" as any)}
          </p>
          <h2 className="font-funnel text-[32px] font-bold leading-tight text-darkPrimary sm:text-[26px]">
            {t("booking.professionalStep.title" as any)}
          </h2>
          <p className="text-[13px] text-greyPrimary">
            {t("booking.professionalStep.description" as any)}
          </p>
        </div>

        <div
          className={cn(
            "grid w-full grid-cols-6 gap-3 overflow-y-auto pr-2",
            CustomScrollbar.CustomScrollbar
          )}
        >
          {!isHideAny && (
            <button
              type="button"
              onClick={() => selectStaffHandler("ANY")}
              className={cn(
                "col-span-6 flex min-h-[84px] w-full items-center gap-4 rounded-[14px] border bg-white p-[18px] text-left transition-all hover:border-purplePrimary",
                selectedSpecialist === "ANY"
                  ? "border-2 border-purplePrimary bg-[#603FEF0A]"
                  : "border-greyOutline"
              )}
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-purpleExtraLight">
                <Sparkles className="size-5 stroke-purplePrimary" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="text-sm font-bold text-darkPrimary">
                  {t("booking.professionalStep.anyFree" as any)}
                </span>
                <span className="truncate text-[11px] text-greyPrimary">
                  {t("booking.professionalStep.anyFreeDescription" as any)}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                  selectedSpecialist === "ANY"
                    ? "border-[6px] border-purplePrimary"
                    : "border-greyLight"
                )}
              />
            </button>
          )}

          {specialists.map((specialist) => {
            const isSelected =
              selectedSpecialist !== "ANY" && selectedSpecialist?.id === specialist.id;

            return (
              <button
                key={specialist.id}
                type="button"
                onClick={() => selectStaffHandler(specialist)}
                className={cn(
                  "col-span-2 flex h-[230px] flex-col items-center gap-[11px] rounded-[14px] border p-4 text-center transition-all hover:border-purplePrimary md:col-span-3 sm:col-span-3",
                  isSelected
                    ? "border-2 border-purplePrimary bg-[#603FEF0A]"
                    : "border-greyOutline bg-white"
                )}
              >
                <span className="flex size-[72px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-greyBackgroundLight">
                  {specialist.avatar ? (
                    <Image
                      className="h-full w-full object-cover"
                      width={72}
                      height={72}
                      src={specialist.avatar}
                      alt={specialist.fullName}
                    />
                  ) : (
                    <Image
                      width={72}
                      height={72}
                      src={AvatarPlaceholder}
                      alt={specialist.fullName}
                    />
                  )}
                </span>
                <span className="max-w-full truncate text-sm font-bold text-darkPrimary">
                  {specialist.fullName}
                </span>
                <span className="max-w-full truncate text-[10px] text-greyPrimary">
                  {specialist.specialties?.[0] || specialist.role}
                </span>
                <span className="flex items-center gap-[5px] text-[11px] font-semibold text-darkPrimary">
                  <Star className="size-[14px] fill-yellowPrimary stroke-yellowPrimary" />
                  {specialist.rating ?? "—"}
                </span>
                <span className="truncate text-[11px] font-semibold text-purplePrimary">
                  {t("booking.professionalStep.available" as any)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

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
