import pageStyles from '../../ProductDetailsPage.module.scss';
import styles from './ProductDetailsSkeleton.module.scss';
import { BackButton } from '../../../shared/components/BackButton';
import { LoadingStatus, Skeleton } from '../../../shared/components/Skeleton';

const THUMBS_COUNT = 3;
const COLORS_COUNT = 3;
const CAPACITIES_COUNT = 4;
const SPEC_WIDTHS = [
  [56, 180],
  [80, 140],
  [40, 72],
  [64, 160],
];

export const ProductDetailsSkeleton = () => (
  <section className={pageStyles.page}>
    <LoadingStatus label="Loading product" />

    <Skeleton width={220} height={14} className={styles.breadcrumbs} />

    <BackButton />

    <div className={pageStyles.title}>
      <Skeleton width="60%" className={styles.titleLine} />
    </div>

    <div className={pageStyles.top}>
      <div className={styles.gallery}>
        <Skeleton className={styles.main} />

        <div className={styles.thumbs}>
          {Array.from({ length: THUMBS_COUNT }, (_, index) => (
            <Skeleton key={index} className={styles.thumb} />
          ))}
        </div>
      </div>

      <div className={styles.options}>
        <div className={styles.group}>
          <Skeleton width={190} height={14} />
        </div>

        <div className={styles.group}>
          <Skeleton width={110} height={12} />
          <div className={styles.row}>
            {Array.from({ length: COLORS_COUNT }, (_, index) => (
              <Skeleton key={index} width={36} height={36} radius="50%" />
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <Skeleton width={70} height={12} />
          <div className={styles.row}>
            {Array.from({ length: CAPACITIES_COUNT }, (_, index) => (
              <Skeleton key={index} width={72} height={40} radius={999} />
            ))}
          </div>
        </div>

        <Skeleton width={130} height={36} />
        <Skeleton width={220} height={12} className={styles.stock} />

        <div className={styles.row}>
          <Skeleton height={52} radius={999} className={styles.button} />
          <Skeleton width={52} height={52} radius="50%" />
        </div>

        <div className={styles.specs}>
          {SPEC_WIDTHS.map(([label, value]) => (
            <div key={label + value} className={styles.spec}>
              <Skeleton width={label} height={12} />
              <Skeleton width={value} height={12} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
