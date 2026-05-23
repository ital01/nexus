export interface Coordinates {
  longitude: string | null;
  latitude: string | null;
}

export interface Location {
  type: 'Point';
  coordinates: Coordinates;
}

export interface AddressV1 {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export interface AddressV2 {
  cep: string;
  state: string;
  city: string;
  neighborhood: string | null;
  street: string | null;
  timezoneName: string | null;
  location: Location;
}
