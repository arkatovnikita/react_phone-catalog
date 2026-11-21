export type ContactValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type DeliveryValues = {
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  method: string;
};

export type PaymentValues = {
  cardNumber: string;
  expiry: string;
  cvc: string;
  cardName: string;
};

export type PlacedOrder = {
  number: string;
  firstName: string;
  itemCount: number;
  delivery: string;
  shipTo: string;
  total: number;
};
