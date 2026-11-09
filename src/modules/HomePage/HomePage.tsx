import { useEffect, useState } from 'react';
import { getProducts } from '../shared/api/products';
import { Product } from '../shared/types/Product';
import { ProductsList } from '../shared/components/ProductsList';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data.slice(0, 8)));
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <ProductsList products={products} />
    </div>
  );
};
