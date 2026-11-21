export const CHECKOUT_STEPS = [
  { key: 'contact', label: 'Contact' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' },
  { key: 'review', label: 'Review' },
];

export const getStepIndex = (key: string | null) =>
  Math.max(
    CHECKOUT_STEPS.findIndex(step => step.key === key),
    0,
  );

export type DeliveryMethodId = 'standard' | 'express';

export type DeliveryMethod = {
  id: DeliveryMethodId;
  name: string;
  price: number;
  time: string;
};

export const DELIVERY_METHODS: DeliveryMethod[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 0,
    time: '3–5 business days',
  },
  {
    id: 'express',
    name: 'Express',
    price: 20,
    time: '1–2 business days',
  },
];

export const getDeliveryMethod = (id: string) =>
  DELIVERY_METHODS.find(method => method.id === id) ?? DELIVERY_METHODS[0];

export const TEST_CARDS = {
  visa: '4242 4242 4242 4242',
  mastercard: '5555 5555 5555 4444',
};
