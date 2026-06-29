/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, PanInfo, Variant } from "framer-motion";
import { OutputFormat, setDefaults } from "react-geocode";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";

import Button from "@/components/ui/button";
import ArrowSecondaryDownIcon from "@/components/ui/icons/ArrowSecondaryDown";
import CloseIcon from "@/components/ui/icons/Close";
import useWindowWidth from "@/hooks/useWindowWidth";
import StoreCard from "./StoreCard";
import { cn } from "@/utils/cn";
import HeartIcon from "@/components/ui/icons/Heart";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FAVORITE_STORES } from "@/constants/keys";
import Search from "../../Search";
import { UseFormReturn } from "react-hook-form";
import { SearchForm } from "../../..";
import { format } from "date-fns";
import Spinner from "@/components/ui/loaders/Spinner";

type NonNullablePos = {
  lat: NonNullable<TCompany["pos"]["lat"]>;
  lng: NonNullable<TCompany["pos"]["lng"]>;
};

type Props = {
  isOpen?: boolean;
  isLoading?: boolean;
  title?: string;
  findedStores: TCompany[];
  form: UseFormReturn<SearchForm>;
  loadMoreIsActive?: boolean;
  handleClose: () => void;
  handleSearch: () => void;
  handleLoadMore: () => void;
};

const FindedStoresMobile: FC<Props> = ({
  isOpen,
  isLoading,
  findedStores,
  form,
  loadMoreIsActive,
  handleSearch,
  handleClose,
  handleLoadMore,
}) => {
  const { deviceType } = useWindowWidth();
  const [zoom, setZoom] = useState(10);
  const [centerOfMap, setCenterOfMap] = useState<NonNullablePos | undefined>();

  const [selectedStore, setSelectedStore] = useState<TCompany>();

  const [isOpenSearchForm, setIsOpenSearchForm] = useState(false);

  useEffect(() => {
    if (deviceType === "mobile") {
      document.body.style.overflow = isOpen ? "hidden" : "unset";
    }
  }, [deviceType, isOpen]);

  useEffect(() => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      language: "en",
      region: "es",
      outputFormat: OutputFormat.JSON,
    });
  }, []);

  useEffect(() => {
    const firstFindedPos = findedStores.find((s) => s.pos?.lat && s.pos?.lng)
      ?.pos as NonNullablePos;

    if (firstFindedPos) {
      setCenterOfMap(firstFindedPos);
    }
  }, [findedStores]);

  const libraries = useMemo(() => ["places"], []);
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const { isLoaded: isLoadedGoogleMap } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  const getStorePosition = (pos?: TCompany["pos"]) => {
    if (pos?.lat && pos?.lng) {
      return pos as NonNullablePos;
    }
  };

  const handleCloseLocal = () => {
    setSelectedStore(undefined);
    handleClose();
  };

  const handleCloseStoreWidget = () => {
    setSelectedStore(undefined);
  };

  const handleOpenSearchForm = () => {
    setIsOpenSearchForm(true);
  };

  const handleCloseSearchForm = () => {
    setIsOpenSearchForm(false);
  };

  const handleSearchLocal = () => {
    handleSearch();
    handleCloseSearchForm();
  };

  const getSearchValue = () => {
    const searchValue = form.watch("search");
    const st = form.watch("serviceTypes");

    if (searchValue) {
      return searchValue;
    }

    if (st.length) {
      return st.map((i) => i.shortLabel).join(", ");
    }

    return "Enter search query";
  };

  return (
    <>
      {isOpen
        ? createPortal(
            <div className="fixed z-[200] top-0 left-0 w-screen h-screen bg-white hidden sm:block">
              {isOpenSearchForm && (
                <div className="fixed z-[210] top-0 left-0 w-screen h-screen px-5 py-6 bg-white">
                  <div className="w-full flex justify-end">
                    <Button
                      variant="transparent"
                      className="size-9 flex items-center justify-center border border-greyOutlineSecondary"
                      onClick={handleCloseSearchForm}
                    >
                      <CloseIcon />
                    </Button>
                  </div>
                  <h3 className="mt-8 text-[26px] leading-[38px] font-bold">Search</h3>

                  <div className="w-full mt-8">
                    <Search
                      className="mt-0 !px-0"
                      isLoading={isLoading}
                      form={form}
                      findedStores={findedStores}
                      handleSearch={handleSearchLocal}
                    />
                  </div>
                </div>
              )}

              <div className="px-5 py-4 flex items-center gap-2 bg-white">
                <Button variant="resting" onClick={handleCloseLocal}>
                  <ArrowSecondaryDownIcon className="rotate-90" />
                </Button>

                <div
                  className="flex-1 px-5 py-2 rounded-[14px] border border-greyOutlineSecondary"
                  onClick={handleOpenSearchForm}
                >
                  <h5
                    className={cn("text-base font-bold text-greyPrimary", {
                      "text-darkPrimary":
                        form.watch("search")?.length || form.watch("serviceTypes").length,
                    })}
                  >
                    {getSearchValue()}
                  </h5>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-greyPrimary">
                      {form.watch("date")
                        ? format(form.watch("date")!, "MMM, dd/MM/yyyy")
                        : "Select date"}
                    </p>
                    <p className="text-sm text-greyPrimary">
                      {form.watch("time.from") && form.watch("time.to")
                        ? form.watch("time.from").label +
                          " - " +
                          form.watch("time.to").label
                        : "Select time"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="w-[100vw] h-[calc(100vh-94px)]">
                {isLoadedGoogleMap && (
                  <GoogleMap
                    options={mapOptions}
                    zoom={zoom}
                    center={centerOfMap}
                    mapTypeId={"roadmap"}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    onLoad={() => console.log("Map Component Loaded...")}
                  >
                    {findedStores.map((c, idx) => (
                      <OverlayView
                        key={idx}
                        position={getStorePosition(c.pos)}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                      >
                        <div
                          className={cn(
                            "group relative w-fit px-4 py-2 rounded-full text-sm font-bold text-nowrap shadow-2xl bg-white cursor-pointer",
                            {
                              "text-white bg-darkPrimary": c.id === selectedStore?.id,
                            }
                          )}
                          onClick={() => setSelectedStore(c)}
                        >
                          {c.name}
                        </div>
                      </OverlayView>
                    ))}
                  </GoogleMap>
                )}
              </div>

              {selectedStore && (
                <StoreWidget
                  store={selectedStore as TCompany<{ price_from: string, price_to: string }>}
                  handleClose={handleCloseStoreWidget}
                />
              )}

              <StoreList
                isLoading={isLoading}
                stores={findedStores}
                loadMoreIsActive={loadMoreIsActive}
                handleLoadMore={handleLoadMore}
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
};

const StoreList = ({
  isLoading,
  stores,
  loadMoreIsActive,
  handleLoadMore,
}: {
  isLoading?: boolean;
  stores: TCompany[];
  loadMoreIsActive?: boolean;
  handleLoadMore: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<"full" | "default" | "close">("default");

  const onDragHandle = (e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y <= -70) {
      setIsOpen("full");
    }

    if (info.offset.y >= 70) {
      setIsOpen("default");
    }
  };

  const getContainerAnimate = (): Variant => {
    if (isOpen === "full") {
      return {
        height: "calc(100vh - 98px)",
      };
    }

    if (isOpen === "close") {
      return {
        height: "24px",
      };
    }

    return {
      height: "94px",
    };
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 w-full pb-4 pl-5 pr-2 flex flex-col items-center rounded-t-[20px] border-t border-greyOutlineSecondary bg-white"
      initial={{
        height: "94px",
      }}
      animate={{ ...getContainerAnimate() }}
    >
      <motion.div
        className="w-full min-h-6 flex items-center justify-center rounded-full"
        drag="y"
        dragConstraints={{ bottom: 0, top: 0 }}
        onDrag={onDragHandle}
      >
        <div className="w-[42px] h-1 rounded-full bg-greyLight"></div>
      </motion.div>

      <div className="w-full pr-3 flex flex-col gap-4 overflow-y-auto">
        {stores.map((s) => (
          <StoreCard
            key={s.id}
            company={s as TCompany<{ price_from: string, price_to: string }>}
            setHover={() => {}}
          />
        ))}
        <div className="w-full mt-4 flex justify-center">
          <Button
            variant="primary-resting"
            className="w-[150px] !px-10 !py-3 !rounded-full"
            disabled={!loadMoreIsActive}
            onClick={handleLoadMore}
          >
            {isLoading ? <Spinner className="size-5"/> : "Load more"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const StoreWidget = ({
  store,
  handleClose,
}: {
  store: TCompany<{ price_from: string, price_to: string }>;
  handleClose: () => void;
}) => {
  const [favoriteStores, setFavoriteStores] = useLocalStorage<TCompany[]>(
    FAVORITE_STORES,
    []
  );

  const handleAddStoreToFavorit = (s: TCompany) => {
    if (favoriteStores.find((fs) => fs.id === s.id)) {
      setFavoriteStores(favoriteStores.filter((fs) => fs.id !== s.id));
    } else {
      setFavoriteStores([...favoriteStores, s]);
    }
  };

  return (
    <div className="fixed z-[40] bottom-[120px] left-0 w-full px-5">
      <div className="w-full flex items-center gap-2 rounded-[14px] overflow-hidden bg-white">
        <div className="relative w-[120px] h-[130px] bg-greyOutlineSecondary">
          <Button
            variant="transparent"
            className="absolute z-[41] top-2 left-2 size-8 flex items-center justify-center !rounded-full border border-greyOutlineSecondary bg-white"
            onClick={handleClose}
          >
            <CloseIcon />
          </Button>

          {store.logo && (
            <Image
              fill
              src={store.logo}
              alt={`${store.name} - Bowers`}
              className="object-cover"
            />
          )}
        </div>
        <div className={cn("flex-1 py-3 pr-3", {})}>
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-bold">{store.name}</h5>
            <Button
              variant={
                favoriteStores.find((fs) => fs.id === store.id)
                  ? "outline"
                  : "resting-active"
              }
              className="size-8 !rounded-full p-0"
              onClick={() => handleAddStoreToFavorit(store)}
            >
              <HeartIcon className="w-4 h-4 fill-darkPrimary stroke-transparent" />
            </Button>
          </div>
          <div className="mt-3 pb-2 flex items-center justify-between border-b border-greyOutlineSecondary">
            <p className="text-sm text-greyPrimary">Price</p>
            <p className="text-sm font-semibold">
              {store.price_from && store.price_to ? `From ฿${Number(store.price_from)} - To ฿${Number(store.price_to)}` : "No info"}
            </p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-greyPrimary">Location</p>
            <p className="text-sm font-semibold">
              {store.city}, {store.country?.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindedStoresMobile;
