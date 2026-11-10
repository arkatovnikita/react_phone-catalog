import { useEffect, useMemo, useState } from 'react';
import styles from './HomePage.module.scss';
import { getProducts } from '../shared/api/products';
import { Product } from '../shared/types/Product';
import { Loader } from '../shared/components/Loader';
import { ProductsSlider } from '../shared/components/ProductsSlider';
import { PicturesSlider } from './components/PicturesSlider';
import { ShopByCategory } from './components/ShopByCategory';

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

  return (
    <div className={styles.page}>
      <h1 className="visually-hidden">Product Catalog</h1>

      <h2 className={styles.title}>Welcome to Nice Gadgets store!</h2>

      <PicturesSlider />

      <div className={styles.content}>
        {isLoading && <Loader />}

        {hasError && (
          <p className={styles.error}>
            Something went wrong. Please reload the page.
          </p>
        )}

        {!isLoading && !hasError && (
          <>
            <ProductsSlider
              title="Brand new models"
              products={newModels}
              showFullPrice={false}
            />

            <ShopByCategory products={products} />

            <ProductsSlider title="Hot prices" products={hotPrices} />
          </>
        )}
      </div>
    </div>
  );
};
