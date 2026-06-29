import Image from "next/image";
import { FC, ReactNode } from "react";
import LocationIcon from "../../icons/Location";
import { cn } from "@/utils/cn";

type Props = {
  avatar?: string;
  name: string;
  raiting?: number;
  reviesCount?: number;
  location: string;
  bottomContent?: ReactNode;
};

const CompanyCartWidget: FC<Props> = ({
  avatar,
  name,
  raiting,
  location,
  reviesCount,
  bottomContent,
}) => {
  return (
    <div className="w-full p-5 rounded-xl border border-greyOutlineSecondary">
      <div className="w-full flex items-center gap-2">
        {avatar ? (
          <div
            className={cn(
              "relative rounded-lg bg-greyLight overflow-hidden",
              "min-w-[76px] min-h-[76px] w-[76px] h-[76px]",
              "md:min-w-[56px] md:min-h-[56px] md:w-[56px] md:h-[56px]",
              "md:min-w-[46px] md:min-h-[46px] md:w-[46px] md:h-[46px]",
            )}
          >
            <Image className="w-full h-full object-cover" fill src={avatar} alt={name} />
          </div>
        ) : (
          <div className="min-w-[76px] min-h-[76px] rounded-lg bg-greyLight"></div>
        )}
        <div>
          <h5 className="ml-5 text-base font-bold">{name}</h5>
          {/* <p className="mt-2 text-sm text-greyPrimary">
            {raiting.toFixed(1)} ({reviesCount})
          </p> */}
          <p className="mt-1 flex items-start gap-1 text-sm text-greyPrimary">
            <LocationIcon className="min-w-4 min-h-4" />
            {location}
          </p>
        </div>
      </div>
      {bottomContent && (
        <div className="mt-6 pt-6 border-t border-greyOutlineSecondary">
          {bottomContent}
        </div>
      )}
    </div>
  );
};

export default CompanyCartWidget;
