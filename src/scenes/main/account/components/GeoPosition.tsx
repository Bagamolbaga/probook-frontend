/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-floating-promises */
"use client";

import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { fromAddress, fromLatLng, OutputFormat, setDefaults } from "react-geocode";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useTranslations } from "next-intl";

import { Form } from "..";
import { useDebounce } from "@/hooks/useDebounce";
import TextField from "@/components/ui/inputs/TextField";
import Spinner from "@/components/ui/loaders/Spinner";
import Button from "@/components/ui/button";

type Props = {
  form: UseFormReturn<Form>;
  isLoading?: boolean;
};

type TPos = {
  lat: number;
  lng: number;
};

const GeoPosition = ({ form, isLoading }: Props) => {
  const t = useTranslations();
  const [pos, setPos] = useState<TPos>();
  const [zoom, setZoom] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const cityDebounce: string = useDebounce(form.watch("address.city"), 500);
  const addressDebounce: string = useDebounce(form.watch("address.address1"), 500);

  useEffect(() => {
    //FIX: add billing to google account
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
      outputFormat: OutputFormat.JSON,
    });
  }, []);

  useEffect(() => {
    const getAddress = async () => {
      const res: { results: GeocodeRes[] } = await fromAddress(cityDebounce);

      if (res.results.length) {
        const { lat, lng } = res.results[0].geometry.location;
        setPos({ lat, lng });
        setZoom(8);
      }
    };

    cityDebounce && isOpen && getAddress();
  }, [cityDebounce, isOpen]);

  useEffect(() => {
    const getAddress = async () => {
      const res: { results: GeocodeRes[] } = await fromAddress(addressDebounce);

      if (res.results.length) {
        const { lat, lng } = res.results[0].geometry.location;
        setPos({ lat, lng });
        setZoom(8);
      }
    };

    addressDebounce && isOpen && getAddress();
  }, [addressDebounce, isOpen]);

  useEffect(() => {
    const getPos = async () => {
      const res: { results: GeocodeRes[] } = await fromLatLng(pos!.lat, pos!.lng);

      if (res.results.length) {
        const postalCode = res.results[0].address_components.find(
          (i) => i.types.length === 1 && i.types.includes("postal_code")
        )?.long_name;

        form.setValue("address.address1", res.results[0].formatted_address);
        pos && form.setValue("address.lat", pos.lat);
        pos && form.setValue("address.lng", pos.lng);
        postalCode && form.setValue("address.zip_code", postalCode);
      }
    };

    pos && isOpen && getPos();
  }, [pos, isOpen]);

  const onSelectPositionInMapHandler = (data: google.maps.MapMouseEvent) => {
    if (data.latLng) {
      const lat = data.latLng.lat();
      const lng = data.latLng.lng();

      setPos({
        lat,
        lng,
      });

      form.setValue("address.lat", lat);
      form.setValue("address.lng", lng);
    }
  };

  const toggleShowMapHandler = () => {
    setIsOpen(p => !p);
  };

  const libraries = useMemo(() => ["places"], []);
  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: false,
      clickableIcons: true,
      scrollwheel: true,
    }),
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  return (
    <div className="w-full pt-10 flex flex-col">
      <p className="text-sm font-bold">Your salon geo position</p>
      <p className="text-sm text-greyPrimary">
        These position will be displayed on the page with detailed information about your
        salon
      </p>

      {isLoading ? (
        <div className="w-full mt-5 flex justify-center">
          <Spinner />
        </div>
      ) : (
        <div>
          <div className="mt-2">
            <TextField
              id="address.city"
              label={t("ui.labels.city")}
              placeholder={t("ui.labels.startTyping")}
              type="text"
              register={form.register}
              rules={{
                required: t("ui.errors.fieldIsRequired"),
              }}
              error={form.formState.errors.address?.city}
              requiredHideSymbol
            />
          </div>
          <div className="mt-2">
            <TextField
              id="address.address1"
              label={"Address"}
              placeholder={t("ui.labels.startTyping")}
              type="text"
              register={form.register}
              rules={{
                required: t("ui.errors.fieldIsRequired"),
              }}
              error={form.formState.errors.address?.address1}
              requiredHideSymbol
            />
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm text-greyPrimary">
              Enter value on <span className="font-bold">city</span> field end select
              adress on <span className="font-bold">map</span>
            </p>
            <div className="py-2 flex gap-[100px] sm:gap-0 sm:justify-between">
              <Button variant={isOpen ? "outline" : "resting-active"} size="sm" onClick={toggleShowMapHandler}>
              {isOpen ? "Hide map" : "Show map"}
              </Button>
            </div>
            {isLoaded && isOpen && (
              <GoogleMap
                options={mapOptions}
                zoom={zoom}
                center={pos ? pos : { lat: 0, lng: 0 }}
                mapTypeId={"roadmap"}
                mapContainerStyle={{ width: "70%", height: "400px" }}
                onLoad={() => console.log("Map Component Loaded...")}
                onClick={onSelectPositionInMapHandler}
              >
                {pos && <Marker position={pos} />}
              </GoogleMap>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoPosition;
