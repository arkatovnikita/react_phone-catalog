import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './ProductsSlider.module.scss';
import { Product } from '../../types/Product';
import { ProductCard } from '../ProductCard';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Props = {
  title: string;
  products: Product[];
  showFullPrice?: boolean;
};

const GAP = 16;

export const ProductsSlider = ({
  title,
  products,
  showFullPrice = true,
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
  }, [products, updateButtons]);

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
            disabled={!canScrollPrev}
            onClick={() => scroll(-1)}
          >
            <ArrowLeftIcon />
          </button>

          <button
            type="button"
            className={styles.button}
            aria-label="Next products"
            disabled={!canScrollNext}
            onClick={() => scroll(1)}
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div className={styles.list} ref={listRef} onScroll={updateButtons}>
        {products.map(product => (
          <div key={product.itemId} className={styles.item}>
            <ProductCard product={product} showFullPrice={showFullPrice} />
          </div>
        ))}
      </div>
    </section>
  );
};
