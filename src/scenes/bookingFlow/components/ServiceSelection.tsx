import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useInView } from "react-intersection-observer";

import ServicesList from "./ui/ServicesList";
import { TServiceAndSelectedOption } from "@/scenes/main/bookingCreation/components/BookingCreation";
import HorizontalList from "@/components/ui/horizontalList";
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
}) => {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollableListRef = useRef<HTMLDivElement>(null);

  const [serviceType, setServiceType] = useState<ServiceCategoryTab>();
  const [isSmoothScrolling, setIsSmoothScrolling] = useState(false);

  const selectServiceTypeLocalHandler = (tab: { id: string | number; text: string }) => {
    const fullServiceType = servicesTabs.find((st) => st.id === tab.id);

    if (fullServiceType) {
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

    return serviceTypesThatHaveServices.map((st) => ({ ...st, text: st.name }));
  }, [serviceTypes, services]);

  useEffect(() => {
    setServiceType(
      (current) => servicesTabs.find((tab) => tab.id === current?.id) || servicesTabs[0]
    );
  }, [servicesTabs]);

  const serviceData: TServiceData[] = useMemo(() => {
    if (!servicesTabs.length) {
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
  }, [servicesTabs, services]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-2/3 min-h-[590px] h-[calc(100vh-124px-100px-52px)] pr-6 flex flex-col gap-6 border-r border-greyOutlineSecondary",
        "sm:w-full sm:border-none sm:pr-0",
        className
      )}
    >
      {!hideTitle && (
        <p className="text-sm font-bold text-greyPrimary">
          {t("booking.servicesStep.selectServices")}
        </p>
      )}
      <HorizontalList
        activelTabId={serviceType?.id}
        tabs={servicesTabs}
        onSelect={selectServiceTypeLocalHandler}
      />

      <SelectedTypeRow name={serviceType?.name} />

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
          renderTypeRow={(type) => (
            <TypeRow
              rootElement={scrollableListRef.current}
              disableChangeType={Boolean(
                isSmoothScrolling ||
                (scrollableListRef.current &&
                  scrollableListRef.current.scrollHeight <=
                    scrollableListRef.current.clientHeight) //disable change type when dont have scroll
              )}
              type={type}
              setServiceType={setServiceType}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ServiceSelection;
