import { Category } from './Category';
import { ProductColor } from './ProductColor';
import { Review } from './Review';

export interface ProductDescription {
  title: string;
  text: string[];
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductDetails {
  id: string;
  category: Category;
  namespaceId: string;
  name: string;
  modelName: string;
  year: number;
  capacityAvailable: string[];
  capacity: string;
  capacityLabel: string;
  priceRegular: number;
  priceDiscount: number;
  colors: ProductColor[];
  color: string;
  images: string[];
  description: ProductDescription[];
  specs: ProductSpec[];
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  inStock: boolean;
}
