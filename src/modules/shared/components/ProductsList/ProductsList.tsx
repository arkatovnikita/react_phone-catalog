import classNames from 'classnames';
import styles from './ProductsList.module.scss';
import { Product } from '../../types/Product';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import { LoadingStatus } from '../Skeleton';

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

type SkeletonProps = {
  count?: number;
};

export const ProductsListSkeleton = ({ count = 6 }: SkeletonProps) => (
  <div className={classNames(styles.list, styles.listSkeleton)}>
    <LoadingStatus label="Loading products" />

    {Array.from({ length: count }, (_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);
