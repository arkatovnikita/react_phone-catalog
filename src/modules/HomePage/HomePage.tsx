import { useEffect, useMemo, useState } from 'react';
import styles from './HomePage.module.scss';
import { getProducts } from '../shared/api/products';
import { Product } from '../shared/types/Product';
import { ProductsSlider } from '../shared/components/ProductsSlider';
import { PicturesSlider } from './components/PicturesSlider';
import { ShopByCategory } from './components/ShopByCategory';
import { Faq } from './components/Faq';
import { useRecentlyViewed } from '../shared/hooks/useRecentlyViewed';

const SLIDER_LIMIT = 12;

export const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  const newModels = useMemo(
    () => [...products].sort((a, b) => b.year - a.year).slice(0, SLIDER_LIMIT),
    [products],
  );

  const hotPrices = useMemo(
    () =>
      products
        .filter(product => product.fullPrice > product.price)
        .sort((a, b) => b.fullPrice - b.price - (a.fullPrice - a.price))
        .slice(0, SLIDER_LIMIT),
    [products],
  );

  const { viewedIds } = useRecentlyViewed();

  const recentlyViewed = useMemo(
    () =>
      viewedIds
        .map(itemId => products.find(product => product.itemId === itemId))
        .filter((product): product is Product => Boolean(product)),
    [products, viewedIds],
  );

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Orchard — Apple devices store</h1>

      <PicturesSlider products={products} />

      <div className={styles.content}>
        {hasError ? (
          <p className={styles.error}>
            Something went wrong. Please reload the page.
          </p>
        ) : (
          <>
            <ProductsSlider
              title="Brand new models"
              products={newModels}
              showFullPrice={false}
              isLoading={isLoading}
            />

            <ShopByCategory products={products} isLoading={isLoading} />

            <ProductsSlider
              title="Hot prices"
              products={hotPrices}
              isLoading={isLoading}
            />

            {recentlyViewed.length > 0 && (
              <ProductsSlider
                title="Recently viewed"
                products={recentlyViewed}
              />
            )}

            <Faq />
          </>
        )}
      </div>
    </div>
  );
};
