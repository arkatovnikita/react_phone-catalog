import styles from './ProductsList.module.scss';
import { Product } from '../../types/Product';
import { ProductCard } from '../ProductCard';

type Props = {
  products: Product[];
};

export const ProductsList = ({ products }: Props) => (
  <div className={styles.list}>
    {products.map(product => (
      <ProductCard key={product.itemId} product={product} />
    ))}
  </div>
);
