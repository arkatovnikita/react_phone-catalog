import { useEffect, useState } from 'react';
import { getProducts } from '../shared/api/products';
import { Product } from '../shared/types/Product';
import { ProductCard } from '../shared/components/ProductCard';

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(data => setProducts(data.slice(0, 4)));
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(229px, 1fr))',
        gap: 16,
        padding: 16,
      }}
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
