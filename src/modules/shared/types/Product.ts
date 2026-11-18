import { Category } from './Category';

export interface Product {
  id: number;
  category: Category;
  itemId: string;
  namespaceId: string;
  name: string;
  modelName: string;
  fullPrice: number;
  price: number;
  color: string;
  capacity: string;
  year: number;
  image: string;
  imageCover?: boolean;
  summary: string;
  colors: { name: string; hex: string }[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNew: boolean;
}
