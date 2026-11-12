import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

type ProductData = {
  product: Product;
  details: ProductDetails;
  variants: ProductDetails[];
};

const SUGGESTED_COUNT = 12;

export const ProductDetailsPage = () => {
  const { productId = '' } = useParams();

  const [data, setData] = useState<ProductData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [suggested, setSuggested] = useState<Product[]>([]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    getProductData(productId)
      .then(setData)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [productId]);

  useEffect(() => {
    getSuggestedProducts(SUGGESTED_COUNT)
      .then(setSuggested)
      .catch(() => setSuggested([]));
  }, [productId]);

  const namespaceId = data?.details.namespaceId;

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

        <h1 className={styles.title}>Product was not found</h1>

        <img
          src={`${import.meta.env.BASE_URL}img/product-not-found.png`}
          alt="Product not found"
          className={styles.notFoundImage}
        />
      </section>
    );
  }

  const { product, details, variants } = data;
  const categoryTitle =
    details.category[0].toUpperCase() + details.category.slice(1);

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

      {suggested.length > 0 && (
        <ProductsSlider title="You may also like" products={suggested} />
      )}
    </section>
  );
};
