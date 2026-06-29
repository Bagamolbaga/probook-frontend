import { FC } from "react";
import Image from "next/image";
import { cn } from "@/utils/cn";

type Props = {
  className?: string;
  specialists: TSpecialist[];
  selectedSpecialist?: TSpecialist | "ANY";
  selectStaffHandler?: (s: TSpecialist) => void;
};

const SpecialistList: FC<Props> = ({
  className,
  specialists,
  selectedSpecialist,
  selectStaffHandler,
}) => {
  return (
    <>
      {specialists.map((s) => (
        <div
          key={s.id}
          onClick={() => selectStaffHandler && selectStaffHandler(s)}
          className={cn(
            "w-full min-h-[164px] p-5 col-span-2 flex flex-col items-center rounded-lg",
            "border-2 border-greyOutlineSecondary transition-all cursor-pointer hover:border-purplePrimary",
            "md:col-span-1 sm:col-span-1",
            className,
            {
              "hover:border-purplePrimary": selectStaffHandler,
              "bg-purplePrimary/10 border-purplePrimary":
                selectedSpecialist !== "ANY" && s.id === selectedSpecialist?.id,
            }
          )}
        >
          <div className="w-[64px] h-[64px] rounded-lg overflow-hidden bg-greyLight">
            {s.avatar ? (
              <Image
                className="w-full h-full object-cover"
                width={64}
                height={64}
                src={s.avatar}
                alt={s.fullName}
              />
            ) : (
              <div className="w-[64px] h-[64px] rounded-lg bg-greyLight"></div>
            )}
          </div>
          <p className="mt-4 text-sm font-bold text-center">{s.fullName}</p>
          <p
            className="max-w-full text-nowrap text-ellipsis overflow-hidden text-sm text-greyPrimary text-center"
            // title={s.skills ? s.skills : s.bio}
          >
            {/* {s.skills ? s.skills : s.bio} */}
          </p>
        </div>
      ))}
    </>
  );
};

export default SpecialistList;
