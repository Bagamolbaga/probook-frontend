type Coordinates = {
  lat: number | null;
  lng: number | null;
};

export const getYandexMapsUrl = ({ lat, lng }: Coordinates) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return undefined;
  }

  return `https://yandex.ru/maps/?ll=${lng},${lat}&z=16&pt=${lng},${lat},pm2rdm`;
};

export const getYandexMapsWidgetUrl = ({ lat, lng }: Coordinates) => {
  if (lat === null || lat === undefined || lng === null || lng === undefined) {
    return undefined;
  }

  return `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm`;
};
