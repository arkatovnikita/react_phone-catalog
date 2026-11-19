import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from './CatalogPage.module.scss';
import { getProductsByCategory } from '../shared/api/products';
import { Category } from '../shared/types/Category';
import { CATEGORY_TITLES } from '../shared/constants/categories';
import { Product } from '../shared/types/Product';
import { Breadcrumbs } from '../shared/components/Breadcrumbs';
import { Loader } from '../shared/components/Loader';
import { ProductsList } from '../shared/components/ProductsList';
import { Select } from './components/Select';
import { Pagination } from './components/Pagination';

const SORT_OPTIONS = [
  { value: 'age', label: 'Newest' },
  { value: 'price', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'discount', label: 'Biggest discount' },
];

const PER_PAGE_OPTIONS = [
  { value: '4', label: '4' },
  { value: '8', label: '8' },
  { value: '16', label: '16' },
  { value: 'all', label: 'All' },
];

const sortProducts = (products: Product[], sort: string) => {
  const sorted = [...products];

  switch (sort) {
    case 'price':
      return sorted.sort((a, b) => a.price - b.price);

    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);

    case 'discount':
      return sorted.sort(
        (a, b) =>
          (b.fullPrice - b.price) / b.fullPrice -
          (a.fullPrice - a.price) / a.fullPrice,
      );

    default:
      return sorted.sort((a, b) => b.year - a.year);
  }
};

export const CatalogPage = () => {
  const { pathname } = useLocation();
  const category = pathname.slice(1) as Category;
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const sort = searchParams.get('sort') || 'age';
  const perPage = searchParams.get('perPage') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    getProductsByCategory(category)
      .then(setProducts)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [category, reloadKey]);

  const sortedProducts = useMemo(
    () => sortProducts(products, sort),
    [products, sort],
  );

  const itemsPerPage =
    perPage === 'all' ? sortedProducts.length : Number(perPage);
  const pagesCount = Math.max(
    1,
    Math.ceil(sortedProducts.length / itemsPerPage),
  );
  const currentPage = Math.min(page, pagesCount);
  const visibleProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const updateParams = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    updateParams({ sort: value, page: null });
  };

  const handlePerPageChange = (value: string) => {
    updateParams({ perPage: value === 'all' ? null : value, page: null });
  };

  const handlePageChange = (newPage: number) => {
    updateParams({ page: newPage === 1 ? null : String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }

    if (hasError) {
      return (
        <div className={styles.message}>
          <p className={styles.messageText}>Something went wrong</p>

          <button
            type="button"
            className={styles.reload}
            onClick={() => setReloadKey(key => key + 1)}
          >
            Reload
          </button>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <p className={styles.messageText}>
          There are no {CATEGORY_TITLES[category]} products yet
        </p>
      );
    }

    return (
      <>
        <div className={styles.controls}>
          <Select
            label="Sort by"
            value={sort}
            options={SORT_OPTIONS}
            onChange={handleSortChange}
            className={styles.sort}
          />

          <Select
            label="Items on page"
            value={perPage}
            options={PER_PAGE_OPTIONS}
            onChange={handlePerPageChange}
            className={styles.perPage}
          />
        </div>

        <ProductsList products={visibleProducts} />

        {pagesCount > 1 && (
          <Pagination
            pagesCount={pagesCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </>
    );
  };

  return (
    <section className={styles.page}>
      <Breadcrumbs links={[{ title: CATEGORY_TITLES[category] }]} />

      <h1 className={styles.title}>{CATEGORY_TITLES[category]}</h1>

      {!isLoading && !hasError && (
        <p className={styles.count}>{products.length} models</p>
      )}

      {renderContent()}
    </section>
  );
};
