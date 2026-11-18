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

const findCard = (products: Product[], productId: string) =>
  products
    .filter(
      item =>
        productId === item.namespaceId ||
        productId.startsWith(`${item.namespaceId}-`),
    )
    .sort((a, b) => b.namespaceId.length - a.namespaceId.length)[0];

export const toProduct = (details: ProductDetails, card: Product): Product => ({
  ...card,
  itemId: details.id,
  name: details.name,
  fullPrice: details.priceRegular,
  price: details.priceDiscount,
  color: details.colors.find(color => color.slug === details.color)?.name ?? '',
  capacity: details.capacity,
  image: details.images[0],
  inStock: details.inStock,
});

export const getProductData = async (productId: string) => {
  const products = await getProducts();
  const card = findCard(products, productId);

  if (!card) {
    return null;
  }

  const variants = (await getCategoryDetails(card.category)).filter(
    item => item.namespaceId === card.namespaceId,
  );
  const details = variants.find(item => item.id === productId);

  return details
    ? { product: toProduct(details, card), details, variants }
    : null;
};

export const getSuggestedProducts = async (count: number) => {
  const products = await getProducts();

  return [...products].sort(() => Math.random() - 0.5).slice(0, count);
};
