import { Category } from '../types/Category';
import { Product } from '../types/Product';
import { ProductDetails } from '../types/ProductDetails';

const API_URL = `${import.meta.env.BASE_URL}api`;

async function get<T>(fileName: string): Promise<T> {
  const response = await fetch(`${API_URL}/${fileName}`);

  if (!response.ok) {
    throw new Error(`Failed to load ${fileName}`);
  }

  return response.json();
}

export const getProducts = () => get<Product[]>('products.json');

export const getProductsByCategory = async (category: Category) => {
  const products = await getProducts();

  return products.filter(product => product.category === category);
};

export const getCategoryDetails = (category: Category) =>
  get<ProductDetails[]>(`${category}.json`);

export const getProductData = async (productId: string) => {
  const products = await getProducts();
  const product = products.find(item => item.itemId === productId);

  if (!product) {
    return null;
  }

  const variants = await getCategoryDetails(product.category);
  const details = variants.find(item => item.id === productId);

  return details ? { product, details, variants } : null;
};

export const getSuggestedProducts = async (count: number) => {
  const products = await getProducts();

  return [...products].sort(() => Math.random() - 0.5).slice(0, count);
};
