/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { GoogleMap, OverlayView, useLoadScript } from "@react-google-maps/api";
import { OutputFormat, setDefaults } from "react-geocode";
import { motion, Variant } from "framer-motion";
import { Link } from "@/i18n";

import MainLoader from "@/components/ui/loaders/MainLoader";
import { toSlug } from "@/utils/toSlug";
import StoreCard from "./StoreCard";
import { cn } from "@/utils/cn";
import CustomScrollbar from "@/styles/scrollbar.module.sass";
import Button from "@/components/ui/button";
import CloseIcon from "@/components/ui/icons/Close";
import HeartIcon from "@/components/ui/icons/Heart";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { FAVORITE_STORES } from "@/constants/keys";
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
  loadMoreIsActive?: boolean;
  handleLoadMore: () => void;
};

const FindedStores: FC<Props> = ({
  isOpen,
  isLoading,
  title,
  findedStores,
  loadMoreIsActive,
  handleLoadMore,
}) => {
  const storeListContainer = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(10);
  const [centerOfMap, setCenterOfMap] = useState<NonNullablePos | undefined>();
  const [hoveredStoreMarker, setHoveredStoreMarker] = useState<number>();
  const [hoveredStoreCard, setHoveredStoreCard] = useState<number>();
  const [selectedStore, setSelectedStore] = useState<TCompany>();

  const [favoriteStores, setFavoriteStores] = useLocalStorage<TCompany[]>(
    FAVORITE_STORES,
    []
  );

  useEffect(() => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      language: "en",
      region: "es",
      outputFormat: OutputFormat.JSON,
    });
  }, []);

  useEffect(() => {
    if (!centerOfMap) {
      if (findedStores[0]?.pos?.lat && findedStores[0]?.pos?.lng) {
        setCenterOfMap(findedStores[0].pos as NonNullablePos);
      }
    }
  }, [centerOfMap, findedStores]);

  useEffect(() => {
    const element = document.getElementById(`store_cart_id-${hoveredStoreMarker}`);

    if (storeListContainer.current && element) {
      const containerRect = storeListContainer.current.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();

      const scrollTop =
        elementRect.top -
        containerRect.top -
        containerRect.height / 2 +
        elementRect.height / 2;

      storeListContainer.current.scrollTo({
        top: storeListContainer.current.scrollTop + scrollTop,
        behavior: "smooth",
      });
    }
  }, [hoveredStoreMarker]);

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

  const handleSelectStore = (s: TCompany) => {
    if (selectedStore?.id === s.id) {
      handleCloseSelectedStoreWidget();
      return;
    }

    setSelectedStore(s);
    setHoveredStoreMarker(s.id);
    setHoveredStoreCard(s.id);
  };

  const handleAddStoreToFavorit = (s: TCompany) => {
    if (favoriteStores.find((fs) => fs.id === s.id)) {
      setFavoriteStores(favoriteStores.filter((fs) => fs.id !== s.id));
    } else {
      setFavoriteStores([...favoriteStores, s]);
    }
  };

  const handleCloseSelectedStoreWidget = () => {
    setSelectedStore(undefined);
    setHoveredStoreMarker(undefined);
    setHoveredStoreCard(undefined);
  };

  const getContainerAnimate = (): Variant | undefined => {
    if (isOpen && findedStores.length) {
      return {
        // height: "calc(100vh - 140px)",
        height: "auto",
      };
    }

    if (isOpen && !findedStores.length) {
      return {
        height: "auto",
      };
    }

    return {
      height: "0px",
    };
  };

  const content = () => {
    // if (isOpen && isLoading) {
    //   return (
    //     <div className="w-full h-[calc(100vh-140px-124px-70px)] flex justify-center items-center">
    //       <MainLoader />
    //     </div>
    //   );
    // }

    if (isOpen && !isLoading && !findedStores.length) {
      return (
        <>
          <div className="w-[calc((1440px-100px)/2)] pt-10 md:w-[calc((1440px-50px)/5)]">
            <h3 className="text-[26px] leading-[38px] font-bold">
              Hmm, no results found
            </h3>
            <p className="text-greyPrimary">
              No stores found. Try adjusting your filters or search criteria.
            </p>
          </div>
          <div className="w-1/2 pl-3 md:w-3/4"></div>
        </>
      );
    }

    if (isOpen) {
      return (
        <>
          <div className="w-[calc((1440px-100px)/2)] pt-10 md:w-[calc((1440px-50px)/5)]">
            <h3 className="text-[26px] leading-[38px] font-bold">
              {title || "Explore All Services"}
            </h3>
            <p className="text-greyPrimary">
              Ready to treat yourself? These are our picks for you
            </p>

            <div
              ref={storeListContainer}
              className={cn(
                CustomScrollbar.CustomScrollbar,
                "mt-5 pr-3 grid grid-cols-2 gap-5 overflow-y-auto max-h-[calc(100vh-140px-124px-70px)] md:grid-cols-1 md:max-h-[calc(100vh-290px-70px)]"
              )}
            >
              {findedStores.map((s) => (
                <StoreCard
                  key={s.id}
                  company={s as TCompany<{ price_from: string; price_to: string }>}
                  isDark={hoveredStoreMarker === s.id || selectedStore?.id === s.id}
                  setHover={(id) => {
                    setHoveredStoreCard(id);
                    setCenterOfMap(s.pos as NonNullablePos);
                  }}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                variant="primary-resting"
                className="w-[150px] px-10 py-3 !rounded-full"
                disabled={!loadMoreIsActive}
                onClick={handleLoadMore}
              >
                {isLoading ? <Spinner className="size-5" /> : "Load more"}
              </Button>
            </div>
          </div>
          <div className="w-1/2 pl-3 md:w-3/4">
            {isLoadedGoogleMap && (
              <GoogleMap
                options={mapOptions}
                zoom={zoom}
                center={centerOfMap}
                mapTypeId={"roadmap"}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                onLoad={() => console.log("Map Component Loaded...")}
              >
                {(findedStores as TCompany<{ price_from: string; price_to: string }>[]).map((c, idx) => (
                  <OverlayView
                    key={idx}
                    position={getStorePosition(c.pos)}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                  >
                    <div
                      // href={`/company/${toSlug(c.name)}?storeId=${c.id}`}
                      className={cn(
                        "relative w-fit px-4 py-2 rounded-full text-sm font-bold text-nowrap shadow-2xl bg-white cursor-pointer",
                        {
                          "text-white bg-darkPrimary":
                            c.id === hoveredStoreCard ||
                            c.id === hoveredStoreMarker ||
                            c.id === selectedStore?.id,
                        }
                      )}
                      onMouseEnter={() => setHoveredStoreMarker(c.id)}
                      onMouseLeave={() => setHoveredStoreMarker(undefined)}
                      onClick={() => handleSelectStore(c)}
                    >
                      {c.name}

                      <div
                        className={cn(
                          "absolute left-[calc(100%+4px)] top-1/2 -translate-y-1/2 transition-all opacity-0 pointer-events-none",
                          "w-[300px] rounded-[14px] overflow-hidden bg-white",
                          "flex flex-col gap-4",
                          {
                            "opacity-100 pointer-events-auto": c.id === selectedStore?.id,
                          }
                        )}
                      >
                        <div className="absolute z-10 top-4 right-4 flex gap-[10px]">
                          <Button
                            variant={
                              favoriteStores.find((fs) => fs.id === c.id)
                                ? "outline"
                                : "resting-active"
                            }
                            className="size-8 !rounded-full p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddStoreToFavorit(c);
                            }}
                          >
                            <HeartIcon className="w-4 h-4 fill-darkPrimary stroke-transparent" />
                          </Button>
                          <Button
                            variant="resting-active"
                            className="size-8 !rounded-full p-0"
                            onClick={() => handleCloseSelectedStoreWidget()}
                          >
                            <CloseIcon className="w-4 h-4 stroke-darkPrimary" />
                          </Button>
                        </div>

                        {c.logo && (
                          <div className="relative w-full h-[200px]">
                            <Image
                              fill
                              src={c.logo}
                              alt={`${c.name} | Bowers`}
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div
                          className={cn("w-full px-4 pb-4", {
                            "pt-4": !c.logo,
                          })}
                        >
                          <h5 className="text-lg font-bold">{c.name}</h5>
                          <div className="pb-3 flex items-center justify-between border-b border-greyOutlineSecondary">
                            <p className="text-sm font-normal text-greyPrimary">Price</p>
                            <p className="text-sm font-normal">{c.price_from && c.price_to ? `From ฿${Number(c.price_from)} - To ฿${Number(c.price_to)}` : "No info"}</p>
                          </div>
                          <div className="pt-3 flex items-center justify-between">
                            <p className="text-sm font-normal text-greyPrimary">
                              Location
                            </p>
                            <p className="text-sm font-normal">
                              {c.city}, {c.country?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </OverlayView>
                ))}
              </GoogleMap>
            )}
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <section className="relative z-[1] w-full max-w-[100vw]">
      <motion.div
        className="w-full mt-20 overflow-hidden sm:hidden"
        initial={{
          height: "0px",
        }}
        animate={{ ...getContainerAnimate() }}
      >
        <div
          className={cn(
            "w-full h-[calc(100vh-140px)] pl-layoutLeftRight md:pl-layoutLeftRight_md sm:pl-layoutLeftRight_sm flex justify-end sm:hidden"
          )}
        >
          {content()}
        </div>
      </motion.div>
    </section>
  );
};

export default FindedStores;
