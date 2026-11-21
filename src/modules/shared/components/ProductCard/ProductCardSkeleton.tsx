import classNames from 'classnames';
import styles from './ProductCard.module.scss';
import { Skeleton } from '../Skeleton';

export const ProductCardSkeleton = () => (
  <div className={classNames(styles.card, styles.cardSkeleton)}>
    <Skeleton className={styles.mediaSkeleton} />

    <div className={styles.body}>
      <div className={styles.colors}>
        <Skeleton width={54} height={12} radius={6} />
      </div>

      <Skeleton width="72%" height={14} className={styles.nameSkeleton} />
      <Skeleton width="88%" height={11} className={styles.specsSkeleton} />
      <Skeleton width={64} height={10} className={styles.stockSkeleton} />

      <div className={styles.footer}>
        <Skeleton width={76} height={22} />
        <Skeleton width={40} height={40} radius="50%" />
      </div>
    </div>
  </div>
);
