import { useEffect, useMemo } from "react";
import { OutputFormat, setDefaults } from "react-geocode";
import { GoogleMap, Libraries, Marker, useLoadScript } from "@react-google-maps/api";
import MainLoader from "@/components/ui/loaders/MainLoader";

const Map = ({ centerOfMap }: { centerOfMap?: TCompany["pos"] }) => {
  useEffect(() => {
    setDefaults({
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      language: "en",
      region: "es",
      outputFormat: OutputFormat.JSON,
    });
  }, []);

  const libraries: Libraries = useMemo(() => ["places"], []);
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
    libraries: libraries,
  });

  return (
    <>
      {!isLoadedGoogleMap && <MainLoader />}
      {isLoadedGoogleMap && (
        <GoogleMap
          options={mapOptions}
          zoom={10}
          center={
            centerOfMap?.lat && centerOfMap?.lng
              ? { lat: centerOfMap.lat, lng: centerOfMap.lng }
              : { lat: 0, lng: 0 }
          }
          mapTypeId={google.maps.MapTypeId.ROADMAP}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={() => console.log("Map Component Loaded...")}
        >
          <Marker
            position={{
              lat: centerOfMap?.lat || 0,
              lng: centerOfMap?.lng || 0,
            }}
          />
        </GoogleMap>
      )}
    </>
  );
};

export default Map;
