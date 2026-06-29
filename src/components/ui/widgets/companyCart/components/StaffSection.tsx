import Image from "next/image";
import { useTranslations } from "next-intl";
import AnyAvatarPlaceholder from "@/assets/staffManagement/specialistWithoutAvatar.png";

type Props = {
  staff: TBooking["specialist"] | "ANY";
};

export const StaffSection = ({ staff }: Props) => {
  const t = useTranslations();
  return (
    <div className="mt-4">
      <p className="text-sm">{t("booking.bookingCard.professional")}</p>
      <div className="mt-2 flex items-center gap-2">
        <div className="size-5 rounded-full border-2 border-greyLight"></div>

        {/* <div className="w-[48px] h-[48px] mr-5 rounded-lg overflow-hidden bg-greyLight">
          {staff === "ANY" && (
            <Image
              className="w-full h-full object-cover"
              width={48}
              height={48}
              src={AnyAvatarPlaceholder}
              alt={t("booking.professionalStep.anyProf")}
            />
          )}
          {staff !== "ANY" && staff?.specialist_details?.avatar && (
            <Image
              className="w-full h-full object-cover"
              width={48}
              height={48}
              src={staff.specialist_details.avatar}
              alt={staff.full_name}
            />
          )}
          {staff !== "ANY" && staff?.specialist_details?.avatar && (
            <div className="w-[48px] h-[48px] rounded-lg bg-greyLight"></div>
          )}
        </div> */}
        <div className="flex-1 flex flex-col gap-1">
          <p className="text-sm font-bold">
            {staff === "ANY" ? t("booking.professionalStep.anyProf") : staff.fullName}
          </p>
          <p className="text-sm text-greyPrimary">
            {staff === "ANY"
              ? t("booking.professionalStep.forMaxAvailability")
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
};
