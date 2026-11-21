import { Category } from '../../shared/types/Category';
import { Product } from '../../shared/types/Product';

export type CatalogFilters = {
  minPrice: number | null;
  maxPrice: number | null;
  options: string[];
  sale: boolean;
  isNew: boolean;
};

type FilterKey = keyof CatalogFilters;

type OptionFilter = {
  param: string;
  label: string;
};

export const OPTION_FILTERS: Partial<Record<Category, OptionFilter>> = {
  iphone: { param: 'storage', label: 'Storage' },
  ipad: { param: 'storage', label: 'Storage' },
  mac: { param: 'storage', label: 'Storage' },
  watch: { param: 'size', label: 'Case size' },
};

export const NEW_YEAR = 2026;

const UNIT_SIZE: Record<string, number> = { TB: 1024, GB: 1, mm: 1 };

export const getOptionSize = (option: string) => {
  const [, amount, unit] = option.match(/^(\d+)(TB|GB|mm)$/) ?? [];

  return amount ? Number(amount) * UNIT_SIZE[unit] : 0;
};

export const isOnSale = (product: Product) => product.fullPrice > product.price;

const matches = (product: Product, filters: CatalogFilters, skip?: FilterKey) =>
  (skip === 'minPrice' ||
    filters.minPrice === null ||
    product.price >= filters.minPrice) &&
  (skip === 'maxPrice' ||
    filters.maxPrice === null ||
    product.price <= filters.maxPrice) &&
  (skip === 'options' ||
    filters.options.length === 0 ||
    filters.options.some(option =>
      product.capacityAvailable.includes(option),
    )) &&
  (skip === 'sale' || !filters.sale || isOnSale(product)) &&
  (skip === 'isNew' || !filters.isNew || product.year === NEW_YEAR);

export const filterProducts = (products: Product[], filters: CatalogFilters) =>
  products.filter(product => matches(product, filters));

export const getFilterCounts = (
  products: Product[],
  filters: CatalogFilters,
) => {
  const withoutOptions = products.filter(product =>
    matches(product, filters, 'options'),
  );
  const options = Array.from(
    new Set(products.flatMap(product => product.capacityAvailable)),
  ).sort((a, b) => getOptionSize(a) - getOptionSize(b));

  return {
    options: options.map(option => ({
      value: option,
      count: withoutOptions.filter(product =>
        product.capacityAvailable.includes(option),
      ).length,
    })),
    sale: products.filter(
      product => matches(product, filters, 'sale') && isOnSale(product),
    ).length,
    isNew: products.filter(
      product =>
        matches(product, filters, 'isNew') && product.year === NEW_YEAR,
    ).length,
  };
};

export const getPriceRange = (products: Product[]) => {
  const prices = products.map(product => product.price);

  return {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  };
};

export const countActiveFilters = (filters: CatalogFilters) =>
  filters.options.length +
  Number(filters.minPrice !== null || filters.maxPrice !== null) +
  Number(filters.sale) +
  Number(filters.isNew);
