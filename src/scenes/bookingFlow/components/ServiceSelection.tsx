import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import ServicesList from "./ui/ServicesList";
import { TServiceAndSelectedOption } from "@/scenes/main/bookingCreation/components/BookingCreation";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import { cn } from "@/utils/cn";

export type ServiceCategoryTab = {
  id: string | number;
  name: string;
  text?: string;
};

type TServiceData = {
  type: ServiceCategoryTab;
  services: TService[];
};

type Props = {
  className?: string;
  rightPanelHeight?: number;
  hideTitle?: boolean;
  serviceTypes: ServiceCategoryTab[];
  services: TService[];
  selectedServices: TServiceAndSelectedOption[];
  selectServiceHandler: (services: TServiceAndSelectedOption[]) => void;
  variant?: "default" | "booking";
};

const TypeRow = ({
  rootElement,
  disableChangeType,
  type,
  setServiceType,
}: {
  rootElement: Element | null;
  disableChangeType?: boolean;
  type: ServiceCategoryTab;
  setServiceType: (type: ServiceCategoryTab) => void;
}) => {
  const { ref, inView } = useInView({
    // delay: 200,
    threshold: 0.5,
    root: rootElement,
    rootMargin: "0px 0px -60% 0px",
  });

  useEffect(() => {
    if (inView && !disableChangeType) {
      setServiceType(type);
    }
  }, [inView, disableChangeType, setServiceType, type]);

  return (
    <div ref={ref} id={`type-${type.id}`} className="text-lg font-bold py-2">
      {type.name}
    </div>
  );
};

const SelectedTypeRow = ({ name }: { name?: string }) => <h5>{name}</h5>;

const ServiceSelection: FC<Props> = ({
  className,
  hideTitle,
  serviceTypes,
  services,
  selectedServices,
  selectServiceHandler,
  variant = "default",
}) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableListRef = useRef<HTMLDivElement>(null);

  const [serviceType, setServiceType] = useState<ServiceCategoryTab>();
  const [isSmoothScrolling, setIsSmoothScrolling] = useState(false);

  const selectServiceTypeLocalHandler = (tab: { id: string | number; text: string }) => {
    const fullServiceType = servicesTabs.find((st) => st.id === tab.id);

    if (fullServiceType) {
      if (tab.id === "all") {
        setIsSmoothScrolling(true);
        scrollableListRef.current?.scrollTo({ top: 0, behavior: "smooth" });
        setServiceType(fullServiceType);
        setTimeout(() => setIsSmoothScrolling(false), 500);
        return;
      }

      const el = document.getElementById(`type-${tab.id}`) as Element | undefined;

      if (el) {
        setIsSmoothScrolling(true);

        el.scrollIntoView({
          behavior: "smooth",
        });

        setServiceType(fullServiceType);

        setTimeout(() => {
          setIsSmoothScrolling(false);
        }, 500);
      }
    }
  };

  const selectServiceHandlerLocal = (service: TServiceAndSelectedOption) => {
    const alreadySelectedServices = selectedServices;

    const currentServiceAlreadySelected = alreadySelectedServices.find(
      (s) => s.id === service.id
    );

    if (currentServiceAlreadySelected) {
      selectServiceHandler(alreadySelectedServices.filter((s) => s.id !== service.id));
    } else {
      selectServiceHandler([...alreadySelectedServices, service]);
    }
  };

  const servicesTabs = useMemo(() => {
    const serviceTypesThatHaveServices = serviceTypes.filter((serviceType) =>
      services.some((service) => {
        const categoryId =
          typeof service.category === "string" ? service.category : service.category.id;

        return categoryId === String(serviceType.id);
      })
    );

    return [
      {
        id: "all",
        name: t("booking.servicesStep.allDirections" as any),
        text: t("booking.servicesStep.allDirections" as any),
      },
      ...serviceTypesThatHaveServices.map((st) => ({ ...st, text: st.name })),
    ];
  }, [serviceTypes, services, t]);

  useEffect(() => {
    setServiceType(
      (current) => servicesTabs.find((tab) => tab.id === current?.id) || servicesTabs[0]
    );
  }, [servicesTabs]);

  const serviceData: TServiceData[] = useMemo(() => {
    if (serviceType?.id === "all") {
      return [{ type: { id: "all", name: "All", text: "All" }, services }];
    }

    return servicesTabs.map((serviceType) => ({
      type: serviceType,
      services: services.filter((service) => {
        const categoryId =
          typeof service.category === "string" ? service.category : service.category.id;

        return categoryId === String(serviceType.id);
      }),
    }));
  }, [servicesTabs, services, serviceType?.id]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-2/3 min-h-[590px] h-[calc(100vh-124px-100px-52px)] pr-6 flex flex-col gap-6 border-r border-greyOutlineSecondary",
        "sm:w-full sm:border-none sm:pr-0",
        className
      )}
    >
      {!hideTitle && variant === "default" && (
        <p className="text-sm font-bold text-greyPrimary">
          {t("booking.servicesStep.selectServices")}
        </p>
      )}
      {variant === "booking" && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] font-bold tracking-[0.5px] text-purplePrimary">
            {t("booking.servicesStep.stepLabel" as any)}
          </p>
          <h2 className="font-funnel text-[32px] font-bold leading-tight text-darkPrimary sm:text-[26px]">
            {t("booking.servicesStep.title" as any)}
          </h2>
          <p className="text-[13px] text-greyPrimary">
            {t("booking.servicesStep.description" as any)}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {servicesTabs.map((tab) => {
          const isActive = serviceType?.id === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => selectServiceTypeLocalHandler(tab)}
              className={cn(
                "shrink-0 rounded-[17px] border px-[14px] py-2 text-[10px] font-semibold transition-colors",
                isActive
                  ? "border-purplePrimary bg-purplePrimary text-white"
                  : "border-greyOutline bg-white text-grey-800 hover:border-purplePrimary hover:text-purplePrimary"
              )}
            >
              {tab.text}
            </button>
          );
        })}
      </div>

      {variant === "default" && <SelectedTypeRow name={serviceType?.name} />}

      <div
        ref={scrollableListRef}
        className={cn(
          `w-full pr-2 flex flex-col gap-3 overflow-y-auto`,
          CustomScrollbar.CustomScrollbar
        )}
      >
        <ServicesList
          services={serviceData}
          selectedServices={selectedServices}
          selectServiceHandler={selectServiceHandlerLocal}
          renderTypeRow={(type) =>
            type.id !== "all" && (
              <TypeRow
                rootElement={scrollableListRef.current}
                disableChangeType={Boolean(
                  isSmoothScrolling ||
                  (scrollableListRef.current &&
                    scrollableListRef.current.scrollHeight <=
                      scrollableListRef.current.clientHeight)
                )}
                type={type}
                setServiceType={setServiceType}
              />
            )
          }
        />
      </div>
    </div>
  );
};

export default ServiceSelection;
