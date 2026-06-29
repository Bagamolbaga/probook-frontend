import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import { TServiceAndSelectedOption } from "@/scenes/bookingFlow/bookingCreation";

type Props = {
  services: TServiceAndSelectedOption[];
};

export const ServicesSection = ({ services }: Props) => {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "max-h-[227px] mt-2 pr-2 flex flex-col gap-2 overflow-y-auto",
        CustomScrollbar.CustomScrollbar
      )}
    >
      <p className="text-sm">{t("booking.bookingCard.services")}</p>
      {services.map((s) => (
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
            <p className="text-sm font-bold">{s.selectedOption.name ? s.selectedOption.name : s.name}</p>
            <p className="text-sm text-greyPrimary">
              {s.selectedOption.duration} {t("booking.servicesStep.mins")}
            </p>
          </div>
          <div>
            <p className="font-bold">{formatCurrency(s.selectedOption.price)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
