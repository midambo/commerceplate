export interface CartAddressInput {
  address1: string;
  address2?: string;
  city: string;
  countryCode: string;
  firstName: string;
  lastName?: string;
  phone: string;
  provinceCode?: string;
  zip?: string;
}

export interface DeliveryAddressInput {
  deliveryAddress: CartAddressInput;
  validationStrategy?: "STRICT" | "LENIENT";
}
