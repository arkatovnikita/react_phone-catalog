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
  capacityAvailable: string[];
  capacityLabel: string;
  year: number;
  image: string;
  summary: string;
  colors: { name: string; hex: string }[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNew: boolean;
}
