import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ProductsSlider.module.scss';
import { Product } from '../../types/Product';
import { ProductCard, ProductCardSkeleton } from '../ProductCard';
import { LoadingStatus } from '../Skeleton';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Props = {
  title: string;
  products: Product[];
  showFullPrice?: boolean;
  isLoading?: boolean;
};

const SKELETON_COUNT = 4;

const skeletonItems = Array.from({ length: SKELETON_COUNT }, (_, index) => (
  <div key={index} className={styles.item}>
    <ProductCardSkeleton />
  </div>
));

const GAP = 16;

export const ProductsSlider = ({
  title,
  products,
  showFullPrice = true,
  isLoading = false,
}: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateButtons = useCallback(() => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    setCanScrollPrev(list.scrollLeft > 0);
    setCanScrollNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateButtons();
    window.addEventListener('resize', updateButtons);

    return () => window.removeEventListener('resize', updateButtons);
  }, [products, isLoading, updateButtons]);

  const scroll = (direction: number) => {
    const list = listRef.current;

    if (!list) {
      return;
    }

    const item = list.firstElementChild as HTMLElement | null;
    const step = item ? item.offsetWidth + GAP : list.clientWidth;

    list.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  return (
    <section className={styles.slider}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.button}
            aria-label="Previous products"
            disabled={isLoading || !canScrollPrev}
            onClick={() => scroll(-1)}
          >
            <ArrowLeftIcon />
          </button>

          <button
            type="button"
            className={styles.button}
            aria-label="Next products"
            disabled={isLoading || !canScrollNext}
            onClick={() => scroll(1)}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      {isLoading && <LoadingStatus label={`Loading ${title}`} />}

      <div className={styles.list} ref={listRef} onScroll={updateButtons}>
        {isLoading && skeletonItems}

        {!isLoading &&
          products.map(product => (
            <div key={product.itemId} className={styles.item}>
              <ProductCard product={product} showFullPrice={showFullPrice} />
            </div>
          ))}
      </div>
    </section>
  );
};
