import { useTranslations } from "next-intl";
import { formatCurrency } from "@/utils/formatCurrency";
import { TServiceAndSelectedOption } from "@/scenes/bookingFlow/bookingCreation";

type Props = {
  services: TServiceAndSelectedOption[];
};

export const PriceSection = ({ services }: Props) => {
  const t = useTranslations();

  return (
    <div className="mt-6 py-6 border-t border-greyOutlineSecondary">
      <p className="font-bold text-sm">{t("booking.bookingCard.price.total")}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs">({t("booking.bookingCard.price.payAtStore")})</p>
        <h6 className="font-bold">
          {formatCurrency(services.reduce((acc, c) => (acc += Number(c.selectedOption.price)), 0))}
        </h6>
      </div>
    </div>
  );
};
