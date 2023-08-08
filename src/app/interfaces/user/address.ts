export interface Address {
  country: string;
  administrativeArea: string;
  locality: string;
  dependentLocality: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  lat: string | number;
  lng: string | number;
}
