import pageStyles from '../../CatalogPage.module.scss';
import styles from './CatalogSkeleton.module.scss';
import { Skeleton } from '../../../shared/components/Skeleton';
import { ProductsListSkeleton } from '../../../shared/components/ProductsList';

const CHIPS_COUNT = 4;

const SelectSkeleton = ({ className }: { className: string }) => (
  <div className={className}>
    <Skeleton width={56} height={10} className={styles.selectLabel} />
    <Skeleton height={44} radius={999} />
  </div>
);

export const CatalogSkeleton = () => (
  <div className={pageStyles.layout}>
    <div className={pageStyles.sidebar}>
      <div className={styles.filters}>
        <Skeleton width={44} height={12} />
        <Skeleton height={40} radius={12} />

        <Skeleton width={64} height={12} className={styles.groupTitle} />
        <div className={styles.chips}>
          {Array.from({ length: CHIPS_COUNT }, (_, index) => (
            <Skeleton key={index} height={36} radius={999} />
          ))}
        </div>

        <Skeleton width={120} height={12} className={styles.groupTitle} />
        <Skeleton width={104} height={12} />
      </div>
    </div>

    <div className={pageStyles.main}>
      <div className={pageStyles.toolbar}>
        <Skeleton
          width={96}
          height={44}
          radius={999}
          className={styles.filtersButton}
        />

        <div className={pageStyles.controls}>
          <SelectSkeleton className={pageStyles.sort} />
          <SelectSkeleton className={pageStyles.perPage} />
        </div>
      </div>

      <ProductsListSkeleton />
    </div>
  </div>
);
