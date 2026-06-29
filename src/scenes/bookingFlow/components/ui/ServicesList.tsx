import { FC, ReactNode, useMemo, useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import { useTranslations } from "next-intl";
import RadioButton from "@/components/ui/inputs/RadioButton";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import { cn } from "@/utils/cn";
import { TServiceAndSelectedOption } from "@/scenes/main/bookingCreation/components/BookingCreation";
import { toaster } from "@/components/ui/toaster";

type TServiceData = {
  type: TServiceType_new;
  services: TService[];
};

type Props = {
  services: TServiceData[];
  selectedServices: TServiceAndSelectedOption[];
  selectServiceHandler: (s: TServiceAndSelectedOption) => void;
  renderTypeRow: (type: TServiceType_new) => ReactNode;
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
              {services.map((s) => {
                const isSelected = !!selectedServices.find((i) => i.id === s.id);

                return (
                  <div
                    key={s.id}
                    onClick={() => handleOpenDetailsModal(s)}
                    className={cn(
                      "w-full p-5 flex items-center justify-start rounded-lg border border-greyOutlineSecondary transition-all cursor-pointer hover:border-greyPrimary",
                      {
                        "bg-purpleExtraLight border-purplePrimary": isSelected,
                      }
                    )}
                  >
                    <RadioButton
                      className="!mr-5 pointer-events-none"
                      checked={isSelected}
                    />
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
                      <p className="text-sm font-bold">{s.name}</p>
                      <p className="text-sm text-greyPrimary">
                        {s.options[0]?.duration} {t("booking.servicesStep.mins")}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold">
                        {s.options.length && formatCurrency(s.options[0].price)}
                      </p>
                    </div>
                  </div>
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
