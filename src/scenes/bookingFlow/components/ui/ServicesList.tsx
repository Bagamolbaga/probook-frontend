import { FC, ReactNode, useMemo, useState } from "react";
import {
  Activity,
  Dumbbell,
  HandHeart,
  HeartPulse,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTranslations } from "next-intl";
import RadioButton from "@/components/ui/inputs/RadioButton";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import { cn } from "@/utils/cn";
import { TServiceAndSelectedOption } from "@/scenes/main/bookingCreation/components/BookingCreation";
import { toaster } from "@/components/ui/toaster";
import type { ServiceCategoryTab } from "../ServiceSelection";

type TServiceData = {
  type: ServiceCategoryTab;
  services: TService[];
};

type Props = {
  services: TServiceData[];
  selectedServices: TServiceAndSelectedOption[];
  selectServiceHandler: (s: TServiceAndSelectedOption) => void;
  renderTypeRow: (type: ServiceCategoryTab) => ReactNode;
};

const ServicesList: FC<Props> = ({
  services,
  selectedServices,
  selectServiceHandler,
  renderTypeRow,
}) => {
  const t = useTranslations();

  const [selectedService, setSelectedService] = useState<TService>();
  const [selectedServiceOption, setSelectedServiceOption] = useState<TServiceOption>();

  const handleOpenDetailsModal = (s: TService) => {
    if (selectedServices.find((i) => i.id === s.id)) {
      selectServiceHandler(s as TServiceAndSelectedOption);
    } else {
      if (selectedServices.length) {
        toaster.warn("You can select only 1 service!");
        return;
      }

      if (s.options.length > 1) {
        setSelectedService(s);
      }

      if (s.options.length === 1) {
        setSelectedService(s);
        setSelectedServiceOption(s.options[0]);
      }
    }
  };

  const handleCloseDetailsModal = () => {
    setSelectedService(undefined);
    setSelectedServiceOption(undefined);
  };

  const addServiceToBookingHandler = () => {
    if (selectedService && selectedServiceOption) {
      selectServiceHandler({ ...selectedService, selectedOption: selectedServiceOption });
      handleCloseDetailsModal();
    }
  };

  const isShowDetailsModal = useMemo(() => {
    if (selectedService) {
      if (selectedService.options.length > 1) {
        return true;
      }

      if (selectedService.description) {
        return true;
      }

      addServiceToBookingHandler();
    }

    return false;
  }, [selectedService]);

  const getServiceIcon = (service: TService, index: number) => {
    const serviceName = service.name.toLowerCase();

    if (serviceName.includes("диагност") || serviceName.includes("consult")) {
      return Stethoscope;
    }

    if (serviceName.includes("массаж") || serviceName.includes("massage")) {
      return HandHeart;
    }

    if (serviceName.includes("трениров") || serviceName.includes("training")) {
      return Dumbbell;
    }

    if (serviceName.includes("восстанов") || serviceName.includes("recover")) {
      return HeartPulse;
    }

    return [Activity, HeartPulse, HandHeart, Sparkles][index % 4];
  };

  return (
    <>
      <Modal isOpen={isShowDetailsModal} handleClose={handleCloseDetailsModal}>
        <div className="relative w-[620px] p-6 sm:w-full">
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold text-greyPrimary">Service Details</h5>
            <div className="flex items-center gap-4">
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={handleCloseDetailsModal}
              >
                <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
              </Button>
            </div>
          </div>

          <div>
            <p className="mt-3 text-sm text-greyPrimary">
              {selectedService?.description}
            </p>

            <div className="w-full mt-8">
              {selectedService && selectedService.options.length > 1 && (
                <p className="text-sm font-bold">Select an option *</p>
              )}
              <div className="mt-4 flex flex-col">
                {selectedService &&
                  selectedService.options.map((so, idx) => (
                    <>
                      <div
                        key={so.id}
                        className={cn("mb-2 flex items-center justify-between", {
                          "cursor-pointer": selectedService.options.length > 1,
                        })}
                        onClick={() => setSelectedServiceOption(so)}
                      >
                        {selectedService.options.length > 1 && (
                          <RadioButton
                            className="!mr-2 pointer-events-none"
                            checked={selectedServiceOption?.id === so.id}
                          />
                        )}

                        <div className="flex-1 flex flex-col gap-1">
                          <p className="text-sm font-bold">{so?.name}</p>
                          <p className="text-sm text-greyPrimary">
                            {so?.duration} {t("booking.servicesStep.mins")}
                          </p>
                        </div>
                        <div>
                          <p className="font-bold">{formatCurrency(so?.price || 0)}</p>
                        </div>
                      </div>
                      {selectedService &&
                        selectedService.options.length > 1 &&
                        idx < selectedService.options.length - 1 && (
                          <div className="w-full h-[1px] my-2 bg-greyOutlineSecondary" />
                        )}
                    </>
                  ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full mt-3"
            variant="dark-outline"
            onClick={addServiceToBookingHandler}
            disabled={
              selectedService &&
              selectedService.options.length > 1 &&
              !selectedServiceOption
                ? true
                : false
            }
          >
            Add to booking
          </Button>
        </div>
      </Modal>
      {services.map(({ type, services }) => {
        return (
          <div key={type.id}>
            {renderTypeRow(type)}
            <div className="flex flex-col gap-2">
              {services.map((s, index) => {
                const isSelected = !!selectedServices.find((i) => i.id === s.id);

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleOpenDetailsModal(s)}
                    className={cn(
                      "flex min-h-[86px] w-full items-center gap-4 rounded-[14px] border p-4 text-left transition-all hover:border-purplePrimary",
                      {
                        "border-2 border-purplePrimary bg-[#603FEF0A]": isSelected,
                        "border-greyOutline bg-white": !isSelected,
                      }
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-xl",
                        isSelected ? "bg-purpleExtraLight" : "bg-greyBackgroundLight"
                      )}
                    >
                      {(() => {
                        const Icon = getServiceIcon(s, index);
                        return (
                          <Icon
                            className={cn(
                              "size-[19px]",
                              isSelected ? "stroke-purplePrimary" : "stroke-greyPrimary"
                            )}
                          />
                        );
                      })()}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
                      <span className="truncate text-[13px] font-bold text-darkPrimary">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-greyPrimary">
                        {s.options[0]?.duration} {t("booking.servicesStep.mins")}
                      </span>
                    </span>
                    <span className="shrink-0 text-[13px] font-bold text-darkPrimary">
                      {s.options.length && formatCurrency(s.options[0].price)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white",
                        isSelected
                          ? "border-[6px] border-purplePrimary"
                          : "border-greyLight"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ServicesList;
