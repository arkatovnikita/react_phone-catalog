import { Category } from '../types/Category';

export const CATEGORIES: { category: Category; title: string }[] = [
  { category: 'iphone', title: 'iPhone' },
  { category: 'ipad', title: 'iPad' },
  { category: 'mac', title: 'Mac' },
  { category: 'watch', title: 'Watch' },
  { category: 'airpods', title: 'AirPods' },
  { category: 'accessories', title: 'Accessories' },
];

export const CATEGORY_TITLES = Object.fromEntries(
  CATEGORIES.map(({ category, title }) => [category, title]),
) as Record<Category, string>;
