import { Product } from '../types/Product';

export const getSearchWords = (query: string) =>
  query.toLowerCase().trim().split(/\s+/).filter(Boolean);

export const searchProducts = (products: Product[], query: string) => {
  const words = getSearchWords(query);

  if (words.length === 0) {
    return [];
  }

  return products.filter(product => {
    const name = product.name.toLowerCase();

    return words.every(word => name.includes(word));
  });
};
