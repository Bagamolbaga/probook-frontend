/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { fromAddress, OutputFormat, setDefaults } from "react-geocode";
import { format } from "date-fns";
import { Link, useRouter } from "@/i18n";

import CalendarIcon from "@/components/ui/icons/Calendar";
import CheckmarkCircle from "@/components/ui/icons/CheckmarkCircle";
import ClockIcon from "@/components/ui/icons/Clock";
import EmployeeIcon from "@/components/ui/icons/Employee";
import HotIcon from "@/components/ui/icons/Hot";
import PersonIcon from "@/components/ui/icons/Person";
import SpeedIcon from "@/components/ui/icons/Speed";
import { useAppSession } from "@/hooks/useAppSession";
import { TimeManager } from "@/utils/timeManager";

type TPos = {
  lat: number;
  lng: number;
};

type Props = {
  booking: TBooking;
  company: TCompany;
};

const SuccessBooked = ({ company, booking }: Props) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useAppSession();

  const [pos, setPos] = useState<TPos>();

  useEffect(() => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, // Your API key here.
      language: "en", // Default language for responses.
      region: "es", // Default region for responses.
      outputFormat: OutputFormat.JSON,
    });

    const logoutHandler = () => {
      if (session?.user) {
        void signOut();
      }
    };

    window?.addEventListener("beforeunload", logoutHandler);

    return () => {
      window?.removeEventListener("beforeunload", logoutHandler);
    };
  }, []);

  useEffect(() => {
    const getAddress = async () => {
      const res: { results: GeocodeRes[] } = await fromAddress(company.address1!);

      if (res.results.length) {
        const { lat, lng } = res.results[0].geometry.location;
        setPos({ lat, lng });
      }
    };

    company.address1 && void getAddress();
  }, [company]);

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

  const time = useMemo(() => {
    const fullSlots = new TimeManager().getFullSlotsFromArr(booking.slots);

    return {
      from: fullSlots[0],
      to: fullSlots.at(-1),
    };
  }, [booking]);

  const duration = useMemo(() => {
    const allMins = booking.services.reduce(
      (acc, s) => acc + s.options[0]?.duration,
      0
    );

    const hours = Math.floor(allMins / 60);
    const mins = allMins - hours * 60;

    return {
      hours,
      mins,
    };
  }, [booking]);

  return (
    <div className="absolute left-0 right-0 top-[78px] w-full min-h-screen pb-[180px] flex flex-col items-center justify-center bg-fromTopLeftToBottomRight sm:py-5">
      <div className="w-[650px] h-auto pt-12 pb-6 px-6 flex flex-col items-center rounded-xl bg-white sm:w-[calc(100vw-40px)] sm:1mt-5">
        <CheckmarkCircle className="size-20 fill-greenPrimary stroke-white sm:size-12" />
        <h4 className="mt-5 text-[32px] font-bold text-center sm:text-xl">
          {t("booking.bookedSuccessStep.title")}
        </h4>

        <div className="w-full mt-10">
          <div className="w-full py-2 px-3 rounded-lg bg-greyBackgroundLight">
            <p className="text-sm font-bold">Store Info</p>
          </div>

          <div className="w-full mt-4 flex justify-between gap-6 rounded-xl border border-greyOutlineSecondary sm:flex-col">
            <div className="w-1/2 py-4 px-5">
              <h5>{company.name}</h5>
              <p className="mt-1 text-sm text-greyPrimary">{company.address1}</p>
              <Link
                target="_blank"
                href={`https://www.google.com/maps/dir/?api=1&destination=${company.pos.lat},${company.pos.lng}`}
                className="mt-[6px] text-sm font-bold underline text-purplePrimary"
              >
                Get Direction
              </Link>
            </div>
            <div className="w-1/2 bg-greyOutline">
              {isLoaded && (
                <GoogleMap
                  options={mapOptions}
                  zoom={15}
                  center={pos}
                  mapTypeId={"roadmap"}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                  {pos && <Marker position={pos} />}
                </GoogleMap>
              )}
            </div>
          </div>

          <div className="w-full mt-4 py-2 px-3 rounded-lg bg-greyBackgroundLight">
            <p className="text-sm font-bold">Appointment Details</p>
          </div>

          <div className="w-full mt-4 pb-4 flex flex-col gap-2 border-b border-greyOutlineSecondary">
            <div className="w-full flex ">
              <div className="w-1/2">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="stroke-greyPrimary" />
                  <p className="text-sm text-greyPrimary">Date</p>
                </div>
              </div>
              <div className="w-1/2">
                <p className="text-sm">{format(booking.date, "EEEE d MMM")}</p>
              </div>
            </div>
            <div className="w-full flex ">
              <div className="w-1/2">
                <div className="flex items-center gap-3">
                  <ClockIcon className="stroke-greyPrimary" />
                  <p className="text-sm text-greyPrimary">Time</p>
                </div>
              </div>
              <div className="w-1/2">
                <p className="text-sm">
                  {time.from.label}-{time?.to?.label}
                </p>
              </div>
            </div>
            <div className="w-full flex ">
              <div className="w-1/2">
                <div className="flex items-center gap-3">
                  <SpeedIcon className="stroke-greyPrimary" />
                  <p className="text-sm text-greyPrimary">Duration</p>
                </div>
              </div>
              <div className="w-1/2">
                <p className="text-sm">
                  {duration.hours ? `${duration.hours} hr` : ""}{" "}
                  {duration.mins ? `${duration.mins} min` : ""}
                </p>
              </div>
            </div>
            <div className="w-full flex ">
              <div className="w-1/2">
                <div className="flex items-center gap-3">
                  <HotIcon className="stroke-greyPrimary" />
                  <p className="text-sm text-greyPrimary">Selected services</p>
                </div>
              </div>
              <div className="w-1/2 flex flex-col gap-2">
                {booking.services.map((s) => (
                  <p key={s.options[0]?.id} className="text-sm">
                    {s.options[0]?.name ? s.options[0]?.name : s.service.name}
                  </p>
                ))}
              </div>
            </div>
            <div className="w-full flex ">
              <div className="w-1/2">
                <div className="flex items-center gap-3">
                  <EmployeeIcon className="stroke-greyPrimary" />
                  <p className="text-sm text-greyPrimary">Professional</p>
                </div>
              </div>
              <div className="w-1/2 flex items-center gap-2">
                {booking.specialist.avatar ? (
                  <div className="relative size-6 flex items-center justify-center rounded-lg overflow-hidden">
                    <Image
                      className="size-6 object-cover"
                      fill
                      src={booking.specialist.avatar}
                      alt={`${booking.specialist.firstName} ${booking.specialist.lastName} - Bowers`}
                    />
                  </div>
                ) : (
                  <div className="size-6 flex items-center justify-center rounded-lg">
                    <PersonIcon />
                  </div>
                )}
                <p className="text-sm text-greyPrimary">
                  {booking.specialist.firstName}{" "}
                  {booking.specialist.lastName}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 py-2 px-3 flex items-center gap-2 rounded-lg bg-purpleExtraLight">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-purplePrimary"
            >
              <path
                d="M2 12C2 8.46252 2 6.69377 3.0528 5.5129C3.22119 5.32403 3.40678 5.14935 3.60746 4.99087C4.86213 4 6.74142 4 10.5 4H13.5C17.2586 4 19.1379 4 20.3925 4.99087C20.5932 5.14935 20.7788 5.32403 20.9472 5.5129C22 6.69377 22 8.46252 22 12C22 15.5375 22 17.3062 20.9472 18.4871C20.7788 18.676 20.5932 18.8506 20.3925 19.0091C19.1379 20 17.2586 20 13.5 20H10.5C6.74142 20 4.86213 20 3.60746 19.0091C3.40678 18.8506 3.22119 18.676 3.0528 18.4871C2 17.3062 2 15.5375 2 12Z"
                stroke="#603FEF"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 16H11.5"
                stroke="#603FEF"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14.5 16H18"
                stroke="#603FEF"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 9H22"
                stroke="#603FEF"
                stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>

            <p className="text-sm font-bold text-purplePrimary">
              Service will be paid at the store
            </p>
          </div>

          <p className="mt-4 text-center text-sm text-greyPrimary">Powered by Bowers</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessBooked;
