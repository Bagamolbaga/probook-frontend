/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api";
import { setDefaults, OutputFormat, fromLatLng, fromAddress } from "react-geocode";

import Button from "@/components/ui/button";
import TextField from "@/components/ui/inputs/TextField";
import { SignUpForm } from "..";
import { useDebounce } from "@/hooks/useDebounce";
import { useTranslations } from "next-intl";

type TPos = {
  lat: number;
  lng: number;
};

type Props = {
  form: UseFormReturn<SignUpForm, any, undefined>;
  handleSignUpStep: (value: SignUpForm) => void;
};

const CompanyAddressStep: FC<Props> = ({ form, handleSignUpStep }) => {
  const [pos, setPos] = useState<TPos>();
  const [zoom, setZoom] = useState(1);

  const cityDebounce = useDebounce(form.watch("city"), 300);

  useEffect(() => {
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

    cityDebounce && getAddress();
  }, [cityDebounce]);

  useEffect(() => {
    const getPos = async () => {
      const res: { results: GeocodeRes[] } = await fromLatLng(pos!.lat, pos!.lng);

      if (res.results.length) {
        const postalCode = res.results[0].address_components.find(
          (i) => i.types.length === 1 && i.types.includes("postal_code")
        )?.long_name;

        form.setValue("address1", res.results[0].formatted_address);
        postalCode && form.setValue("zip_code", postalCode);
      }
    };

    pos && getPos();
  }, [pos]);

  const onSelectPositionInMapHandler = (data: google.maps.MapMouseEvent) => {
    if (data.latLng) {
      const lat = data.latLng.lat();
      const lng = data.latLng.lng();

      setPos({
        lat,
        lng,
      });

      form.setValue("lat", lat);
      form.setValue("lng", lng);
    }
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

  const t = useTranslations();
  const isNextBtnActive =
    form.watch("country") &&
    form.watch("city") &&
    form.watch("address1") &&
    form.watch("zip_code") &&
    form.watch("lat") &&
    form.watch("lng");

  return (
    <div className="w-full mt-16">
      {/* <div className="">
        <TextField
          id="country"
          label="Country code"
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
            minLength: 2,
            maxLength: 2,
          }}
          error={form.formState.errors.country}
          requiredHideSymbol
        />
      </div> */}
      <div className="mt-2">
        <TextField
          id="city"
          label={t("ui.labels.city")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
          }}
          error={form.formState.errors.city}
          requiredHideSymbol
        />
      </div>
      <div className="mt-2">
        <TextField
          id="address1"
          label={t("ui.labels.firstAddress")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
          }}
          error={form.formState.errors.address1}
          requiredHideSymbol
        />
      </div>
      <div className="mt-2">
        <TextField
          id="address2"
          label={t("ui.labels.apartAddress")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          error={form.formState.errors.address2}
          requiredHideSymbol
        />
      </div>
      <div className="mt-2">
        <TextField
          id="zip_code"
          label={t("ui.labels.zipCode")}
          placeholder={t("ui.labels.startTyping")}
          type="text"
          register={form.register}
          rules={{
            required: t("ui.errors.fieldIsRequired"),
          }}
          error={form.formState.errors.zip_code}
          requiredHideSymbol
        />
      </div>
      <div className="mt-5">
        <p className="mb-2 text-sm text-greyPrimary">
          Enter value on <span className="font-bold">city</span> field end select adress
          on <span className="font-bold">map</span>
        </p>
        {isLoaded && (
          <GoogleMap
            options={mapOptions}
            zoom={zoom}
            center={pos ? pos : { lat: 0, lng: 0 }}
            mapTypeId={"roadmap"}
            mapContainerStyle={{ width: "100%", height: "600px" }}
            onLoad={() => console.log("Map Component Loaded...")}
            onClick={onSelectPositionInMapHandler}
          >
            {pos && <Marker position={pos} />}
          </GoogleMap>
        )}
      </div>
      <div className="py-12 flex gap-[100px] sm:gap-0 sm:justify-between">
        <Button variant="resting" onClick={() => form.setValue("_step", 2)}>
          {t("ui.actions.cancel")}
        </Button>
        <Button
          variant="primary"
          onClick={form.handleSubmit(handleSignUpStep)}
          disabled={!isNextBtnActive}
        >
          {t("ui.actions.next")}
        </Button>
      </div>
    </div>
  );
};

export default CompanyAddressStep;
