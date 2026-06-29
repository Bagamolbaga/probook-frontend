"use client";

import { FC, useMemo, useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n";

import { useGetCompanyDetailsQuery } from "@/api/queries/company";
import { useGetCompanyServicesQuery } from "@/api/queries/company/services";
import { useGetCompanyServicesTypesQuery } from "@/api/queries/company/serviceTypes";
import { useGetCompanySpecialistsQuery } from "@/api/queries/company/specialists";

import ServiceSelection from "../components/ServiceSelection";
import Tabs, { Tab } from "./components/Tabs";
import Map from "./components/Map";
import ImagesSwiper from "./components/ImagesSwiper";
import { TimeManager } from "@/utils/timeManager";
import { toSlug } from "@/utils/toSlug";
import { cn } from "@/utils/cn";

import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import SpecialistList from "../components/ui/SpecialistList";
import LocationIcon from "@/components/ui/icons/Location";
import CloseIcon from "@/components/ui/icons/Close";
import { toaster } from "@/components/ui/toaster";
import CopyIcon from "@/components/ui/icons/Copy";
import ShareIcon from "@/components/ui/icons/Share";

const tabs = [
  {
    id: "our-service",
    text: "Our Service",
  },
  {
    id: "team",
    text: "Team",
  },
  {
    id: "working-hours",
    text: "Working Hours",
  },
];

type TServiceData = {
  type: TServiceType_new;
  services: TService[];
};

type Props = {
  companyId: string;
};

const CompanyDetailsScene: FC<Props> = ({ companyId }) => {
  const [isOpenShareModal, setIsOpenShareModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);
  const [selectedServices, setSelectedServices] = useState<TServiceAndSelectedOption[]>(
    []
  );

  const getCompanyDetailsQuery = useGetCompanyDetailsQuery({ companyId });

  const getCompanyServicesTypesQuery = useGetCompanyServicesTypesQuery({ companyId });
  const getCompanyServicesQuery = useGetCompanyServicesQuery({ companyId });
  const getCompanySpecialistsQuery = useGetCompanySpecialistsQuery({ companyId });

  console.log({
    getCompanyDetailsQuery,
    getCompanyServicesTypesQuery,
    getCompanyServicesQuery,
    getCompanySpecialistsQuery,
  });

  const serviceTypes = useMemo(() => {
    if (getCompanyServicesTypesQuery.data?.results) {
      return getCompanyServicesTypesQuery.data.results;
    }

    return [];
  }, [getCompanyServicesTypesQuery.data]);

  const location = useMemo(() => {
    const arr = [];

    if (getCompanyDetailsQuery.data?.city) {
      arr.push(getCompanyDetailsQuery.data?.city);
    }

    if (getCompanyDetailsQuery.data?.country?.name) {
      arr.push(getCompanyDetailsQuery.data?.country?.name);
    }

    return arr.join(", ");
  }, [getCompanyDetailsQuery.data]);

  const getOpeningTime = (times: string[]) => {
    if (!times.length) return "Closed";

    if (times.length) {
      return times.join(", ");
    }
  };

  const store = useMemo(
    () => getCompanyDetailsQuery?.data,
    [getCompanyDetailsQuery?.data]
  );

  const getShareLink = () => {
    return (
      window?.location?.href ||
      `${process.env.NEXT_PUBLIC_FRONTEND_URL}/company/${toSlug(getCompanyDetailsQuery.data?.name)}?storeId=${getCompanyDetailsQuery.data?.id}`
    );
  };

  const handleCopyShareLink = () => {
    void navigator.clipboard.writeText(getShareLink());
    toaster.success("Share link copied to clipboard!");
  };

  return (
    <>
      <Modal isOpen={isOpenShareModal} handleClose={() => setIsOpenShareModal(false)}>
        <div className="w-[450px] max-h-[calc(100vh-80px)] p-6 flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <h5 className="text-[26px] leading-[38px] font-bold">Share this place</h5>
            <div className="flex items-center gap-4">
              <Button
                className="w-9 h-9 p-0"
                variant="resting-active"
                onClick={() => setIsOpenShareModal(false)}
              >
                <CloseIcon className="w-5 h-5 stroke-greyPrimary" />
              </Button>
            </div>
          </div>

          <div className="w-full flex flex-col">
            <div className="flex items-center gap-[14px]">
              <div className="relative size-20 rounded-[16px] overflow-hidden border border-greyOutlineSecondary">
                {store?.logo && (
                  <Image
                    fill
                    className="object-cover"
                    src={store.logo}
                    alt={`${store.name} - Bowers`}
                  />
                )}
              </div>
              <div className="flex-1">
                <h6 className="text-base font-bold">{store?.name}</h6>
                <div className="mt-2 flex items-center">
                  <p className="pr-4 flex items-center gap-1 text-sm text-greyPrimary border-r border-greyOutlineSecondary">
                    <LocationIcon className="w-4 h-4" />
                    {location}
                  </p>
                  <p className="pl-4 text-sm">{store?.businessType?.split(",")[0]}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm">Share link</p>
            <div className="w-full mt-2 px-3 py-2 flex items-center gap-2 rounded-xl border border-greyOutlineSecondary">
              {getShareLink()}

              <Button
                variant="transparent"
                className="!rounded-full !px-6 !py-3"
                iconLeft={<CopyIcon className="w-6 h-6 fill-purplePrimary" />}
                onClick={handleCopyShareLink}
              ></Button>
            </div>
          </div>
        </div>
      </Modal>

      <div className="w-full h-[calc(100vh-78px-80px)] -mt-[35px] flex gap-10 sm:flex-col sm:h-auto sm:mt-10 bg-[#FDFDFD]">
        <div className="relative w-3/5 sm:w-full sm:h-[300px]">
          <div className="absolute z-10 top-4 right-4 flex items-center gap-3">
            {store?.businessType?.split(",").map((type) => (
              <span
                key={type}
                className="px-4 py-3 rounded-full text-sm font-bold bg-white"
              >
                {type}
              </span>
            ))}
            <Button
              variant="transparent"
              className="!rounded-full !px-6 !py-3 flex items-center gap-2 bg-white"
              iconLeft={<ShareIcon className="stroke-darkPrimary" />}
              onClick={() => setIsOpenShareModal(true)}
            >
              Share
            </Button>
          </div>

          <ImagesSwiper images={store?.images || []} />
        </div>
        <div className="w-2/5 flex flex-col gap-6 sm:w-full">
          <div className="flex items-center gap-3">
            <div className="relative size-20 rounded-[16px] overflow-hidden border border-greyOutlineSecondary">
              {store?.logo && (
                <Image
                  fill
                  className="object-cover"
                  src={store.logo}
                  alt={`${store.name} - Bowers`}
                />
              )}
            </div>
            <div>
              <h2 className="text-[26px] leading-[38px] font-bold">{store?.name}</h2>
              <div className="mt-2 flex items-center">
                <p className="pr-4 flex items-center gap-1 text-sm text-greyPrimary border-r border-greyOutlineSecondary">
                  <LocationIcon className="w-4 h-4" />
                  {location}
                </p>

                <Link
                  target="_blank"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${store?.pos.lat},${store?.pos.lng}`}
                  className="pl-4 text-sm font-bold text-purplePrimary"
                >
                  Get direction
                </Link>
              </div>
            </div>
          </div>

          <Tabs
            tabs={tabs}
            activelTab={selectedTab}
            handleSelect={(tab) => setSelectedTab(tab)}
          />

          {selectedTab.id === "our-service" && (
            <ServiceSelection
              hideTitle
              className="w-full min-h-0 h-[calc(100vh-124px-100px-92px)] pr-0 border-none"
              serviceTypes={serviceTypes}
              services={getCompanyServicesQuery?.data?.results || []}
              selectedServices={selectedServices}
              selectServiceHandler={(s) => {
                setSelectedServices(s);
              }}
            />
          )}

          {selectedTab.id === "team" && (
            <div className="grid grid-cols-3 gap-3">
              <SpecialistList
                className="col-span-1"
                specialists={getCompanySpecialistsQuery.data?.results || []}
              />
            </div>
          )}

          {selectedTab.id === "working-hours" && (
            <>
              <div className="w-full aspect-video">
                <Map centerOfMap={store?.pos} />
              </div>
              <div className="w-full mt-2 flex flex-col gap-2 justify-between md:w-1/2 sm:w-full">
                {Object.entries(getCompanyDetailsQuery.data?.working_schedule || {}).map(
                  ([weekDay, value]) => (
                    <div
                      key={weekDay}
                      className="w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("w-2 h-2 rounded-full bg-greyLight", {
                            "bg-greenPrimary": value.times.length,
                          })}
                        ></div>
                        <p
                          className={cn("text-sm", {
                            "text-greyPrimary": !value.times.length,
                          })}
                        >
                          {weekDay}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p
                          className={cn("text-sm", {
                            "text-greyPrimary": !value.times.length,
                          })}
                        >
                          {getOpeningTime(value.times)}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          <div className="w-full flex items-center justify-between">
            <p
              className={cn("text-sm text-grey-800", {
                visible: selectedServices.length > 0,
                invisible: !selectedServices.length,
              })}
            >
              {selectedServices.length} service selected
            </p>
            <Link
              href={`/company/${toSlug(getCompanyDetailsQuery.data?.name)}/booking-creation?storeId=${store?._id}${selectedServices.length ? `&services=${selectedServices.map((s) => s.id).join(",")}&options=${selectedServices.map((s) => s.selectedOption.id).join(",")}` : ""}`}
            >
              <Button variant="primary" className={cn("px-8 !rounded-full")}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDetailsScene;
