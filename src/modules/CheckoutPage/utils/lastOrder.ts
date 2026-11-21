import { PlacedOrder } from '../types';

const LAST_ORDER_KEY = 'orchard-last-order';

export const saveLastOrder = (order: PlacedOrder) => {
  sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
};

export const readLastOrder = (orderNumber: string): PlacedOrder | null => {
  try {
    const stored = sessionStorage.getItem(LAST_ORDER_KEY);
    const order = stored ? (JSON.parse(stored) as PlacedOrder) : null;

    return order?.number === orderNumber ? order : null;
  } catch {
    return null;
  }
};
