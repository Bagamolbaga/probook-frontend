import { getYandexMapsUrl } from "@/src/utils/getYandexMapsUrl";

const Map = ({ centerOfMap }: { centerOfMap?: TCompany["pos"] }) => {
  const yandexMapsUrl = getYandexMapsUrl({
    lat: centerOfMap?.lat ?? null,
    lng: centerOfMap?.lng ?? null,
  });

  if (!yandexMapsUrl) {
    return (
      <div className="flex size-full items-center justify-center rounded-[14px] bg-greyBackground px-6 text-center font-bold text-greyPrimary">
        Location is not available
      </div>
    );
  }

  return (
    <a
      href={yandexMapsUrl}
      target="_blank"
      rel="noreferrer"
      className="flex size-full items-center justify-center rounded-[14px] bg-greyBackground px-6 text-center font-bold text-purplePrimary hover:bg-purpleExtraLight"
    >
      Open location in Yandex Maps
    </a>
  );
};

export default Map;
