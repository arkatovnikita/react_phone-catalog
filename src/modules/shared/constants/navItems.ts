import { CATEGORIES } from './categories';

export const navItems = [
  { title: 'Home', path: '/' },
  ...CATEGORIES.map(({ category, title }) => ({
    title,
    path: `/${category}`,
  })),
];
