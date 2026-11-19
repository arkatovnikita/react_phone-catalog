import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './SearchPage.module.scss';
import { getProducts } from '../shared/api/products';
import { Product } from '../shared/types/Product';
import { Breadcrumbs } from '../shared/components/Breadcrumbs';
import { Loader } from '../shared/components/Loader';
import { ProductsList } from '../shared/components/ProductsList';
import { EmptyState } from '../shared/components/EmptyState';
import { POPULAR_SEARCHES } from '../shared/constants/popularSearches';
import { searchProducts } from '../shared/utils/searchProducts';
import SearchIcon from '../../assets/icons/search.svg?react';

const getSearchLink = (query: string) =>
  `/search?query=${encodeURIComponent(query)}`;

export const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('query') ?? '').trim();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [query]);

  const results = useMemo(
    () => searchProducts(products, query),
    [products, query],
  );

  const suggestions = (
    <div className={styles.suggestions}>
      {POPULAR_SEARCHES.map(item => (
        <Link key={item} to={getSearchLink(item)} className={styles.suggestion}>
          {item}
        </Link>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (hasError) {
      return (
        <h1 className={styles.title}>
          Something went wrong. Please reload the page.
        </h1>
      );
    }

    if (!query) {
      return (
        <EmptyState
          isPageTitle
          icon={<SearchIcon />}
          title="Search Orchard"
          text="Use the search icon in the header or try one of these:"
        >
          {suggestions}
        </EmptyState>
      );
    }

    if (results.length === 0) {
      return (
        <EmptyState
          isPageTitle
          icon={<SearchIcon />}
          title={`No results for “${query}”`}
          text="Check the spelling or try one of these:"
        >
          {suggestions}
        </EmptyState>
      );
    }

    return (
      <>
        <h1 className={styles.title}>Results for “{query}”</h1>

        <p className={styles.count}>
          {results.length} {results.length === 1 ? 'product' : 'products'}
        </p>

        <ProductsList products={results} />
      </>
    );
  };

  return (
    <section className={styles.page}>
      <Breadcrumbs links={[{ title: 'Search' }]} />

      {renderContent()}
    </section>
  );
};
