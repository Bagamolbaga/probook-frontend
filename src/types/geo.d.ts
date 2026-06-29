type Types = "route" | "street_address" | "postal_code";

type AddressComponent = {
  long_name: string;
  short_name: string;
  types: Types[];
};

type GeocodeRes = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
    location_type: string;
  };
  types: Types[];
};
