import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styles from './ProductDetailsPage.module.scss';
import { getProductData, getSuggestedProducts } from '../shared/api/products';
import { Product } from '../shared/types/Product';
import { ProductDetails } from '../shared/types/ProductDetails';
import { Breadcrumbs } from '../shared/components/Breadcrumbs';
import { BackButton } from '../shared/components/BackButton';
import { Loader } from '../shared/components/Loader';
import { ProductsSlider } from '../shared/components/ProductsSlider';
import { ProductGallery } from './components/ProductGallery';
import { ProductOptions } from './components/ProductOptions';
import { ProductInfo } from './components/ProductInfo';
import { ProductReviews } from './components/ProductReviews';
import { CATEGORY_TITLES } from '../shared/constants/categories';
import { EmptyState } from '../shared/components/EmptyState';
import { useRecentlyViewed } from '../shared/hooks/useRecentlyViewed';
import SearchIcon from '../../assets/icons/search.svg?react';

type ProductData = {
  product: Product;
  details: ProductDetails;
  variants: ProductDetails[];
};

const SUGGESTED_COUNT = 12;

const NOT_FOUND_TEXT =
  'This product may no longer be available, or the link is incorrect. ' +
  'Try browsing the catalog instead.';

export const ProductDetailsPage = () => {
  const { productId = '' } = useParams();

  const [data, setData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [suggested, setSuggested] = useState<Product[]>([]);
  const { addViewed } = useRecentlyViewed();

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    getProductData(productId)
      .then(setData)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [productId]);

  const namespaceId = data?.details.namespaceId;
  const viewedItemId = data?.product.itemId;

  useEffect(() => {
    if (viewedItemId) {
      addViewed(viewedItemId);
    }
  }, [viewedItemId, addViewed]);

  useEffect(() => {
    if (!namespaceId) {
      return;
    }

    getSuggestedProducts(namespaceId, SUGGESTED_COUNT)
      .then(setSuggested)
      .catch(() => setSuggested([]));
  }, [namespaceId]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [namespaceId]);

  if (isLoading && !data) {
    return (
      <section className={styles.page}>
        <Loader />
      </section>
    );
  }

  if (hasError) {
    return (
      <section className={styles.page}>
        <BackButton />

        <h1 className={styles.title}>Something went wrong</h1>
      </section>
    );
  }

  if (!data) {
    return (
      <section className={styles.page}>
        <BackButton />

        <EmptyState
          isPageTitle
          icon={<SearchIcon />}
          title="Product not found"
          text={NOT_FOUND_TEXT}
        >
          <Link to="/" className={styles.primary}>
            Go to home
          </Link>

          <Link to="/iphone" className={styles.secondary}>
            Browse iPhone
          </Link>
        </EmptyState>
      </section>
    );
  }

  const { product, details, variants } = data;
  const categoryTitle = CATEGORY_TITLES[details.category];

  return (
    <section className={styles.page}>
      <Breadcrumbs
        links={[
          { title: categoryTitle, path: `/${details.category}` },
          { title: details.name },
        ]}
      />

      <BackButton />

      <h1 className={styles.title}>{details.name}</h1>

      <div className={styles.top}>
        <ProductGallery
          key={details.id}
          images={details.images}
          name={details.name}
        />

        <ProductOptions
          product={product}
          details={details}
          variants={variants}
        />
      </div>

      <div className={styles.info}>
        <ProductInfo details={details} />
      </div>

      <div className={styles.info}>
        <ProductReviews
          rating={details.rating}
          count={details.reviewsCount}
          reviews={details.reviews}
        />
      </div>

      {suggested.length > 0 && (
        <ProductsSlider title="You may also like" products={suggested} />
      )}
    </section>
  );
};
