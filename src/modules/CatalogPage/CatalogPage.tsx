import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import styles from './CatalogPage.module.scss';
import { getProductsByCategory } from '../shared/api/products';
import { Category } from '../shared/types/Category';
import { CATEGORY_TITLES } from '../shared/constants/categories';
import { Product } from '../shared/types/Product';
import { Breadcrumbs } from '../shared/components/Breadcrumbs';
import { Loader } from '../shared/components/Loader';
import { ProductsList } from '../shared/components/ProductsList';
import { Select } from '../shared/components/Select';
import { Pagination } from './components/Pagination';
import { Filters } from './components/Filters';
import { FiltersSheet } from './components/FiltersSheet';
import { ActiveFilters, FilterTag } from './components/ActiveFilters';
import {
  CatalogFilters,
  NEW_YEAR,
  OPTION_FILTERS,
  countActiveFilters,
  filterProducts,
  getFilterCounts,
  getPriceRange,
} from './utils/filters';

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

const FILTER_PARAMS = ['minPrice', 'maxPrice', 'sale', 'new'];

type ParamValue = string | string[] | null;

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

const parsePrice = (value: string | null) => {
  const price = Number(value);

  return value && Number.isFinite(price) && price >= 0 ? price : null;
};

export const CatalogPage = () => {
  const { pathname } = useLocation();
  const category = pathname.slice(1) as Category;
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const optionFilter = OPTION_FILTERS[category];
  const sort = searchParams.get('sort') || 'age';
  const perPage = searchParams.get('perPage') || 'all';
  const page = Number(searchParams.get('page')) || 1;

  const filters: CatalogFilters = useMemo(
    () => ({
      minPrice: parsePrice(searchParams.get('minPrice')),
      maxPrice: parsePrice(searchParams.get('maxPrice')),
      options: optionFilter ? searchParams.getAll(optionFilter.param) : [],
      sale: searchParams.get('sale') === '1',
      isNew: searchParams.get('new') === '1',
    }),
    [searchParams, optionFilter],
  );

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);

    getProductsByCategory(category)
      .then(setProducts)
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  }, [category, reloadKey]);

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters],
  );

  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, sort),
    [filteredProducts, sort],
  );

  const counts = useMemo(
    () => getFilterCounts(products, filters),
    [products, filters],
  );

  const priceRange = useMemo(() => getPriceRange(products), [products]);
  const resultsCount = sortedProducts.length;
  const activeFiltersCount = countActiveFilters(filters);

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

  const updateParams = (params: Record<string, ParamValue>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      newParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach(item => newParams.append(key, item));
      } else if (value !== null) {
        newParams.set(key, value);
      }
    });

    setSearchParams(newParams);
  };

  const updateFilters = (params: Record<string, ParamValue>) => {
    updateParams({ ...params, page: null });
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

  const handlePriceChange = (min: number | null, max: number | null) => {
    updateFilters({
      minPrice: min === null ? null : String(min),
      maxPrice: max === null ? null : String(max),
    });
  };

  const setOptions = (options: string[]) => {
    if (optionFilter) {
      updateFilters({ [optionFilter.param]: options });
    }
  };

  const toggleOption = (option: string) => {
    setOptions(
      filters.options.includes(option)
        ? filters.options.filter(item => item !== option)
        : [...filters.options, option],
    );
  };

  const toggleSale = () => {
    updateFilters({ sale: filters.sale ? null : '1' });
  };

  const toggleNew = () => {
    updateFilters({ new: filters.isNew ? null : '1' });
  };

  const clearFilters = () => {
    const params: Record<string, null> = {};

    [...FILTER_PARAMS, optionFilter?.param]
      .filter((key): key is string => Boolean(key))
      .forEach(key => {
        params[key] = null;
      });

    updateFilters(params);
  };

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);

  const tags: FilterTag[] = filters.options.map(option => ({
    key: option,
    label: option,
    onRemove: () => toggleOption(option),
  }));

  if (filters.minPrice !== null || filters.maxPrice !== null) {
    const min = filters.minPrice ?? priceRange.min;
    const max = filters.maxPrice ?? priceRange.max;

    tags.unshift({
      key: 'price',
      label: `$${min} – $${max}`,
      onRemove: () => handlePriceChange(null, null),
    });
  }

  if (filters.sale) {
    tags.push({ key: 'sale', label: 'On sale', onRemove: toggleSale });
  }

  if (filters.isNew) {
    tags.push({ key: 'new', label: `New in ${NEW_YEAR}`, onRemove: toggleNew });
  }

  const filtersPanel = (
    <Filters
      filters={filters}
      priceRange={priceRange}
      optionLabel={optionFilter?.label}
      options={counts.options}
      saleCount={counts.sale}
      newCount={counts.isNew}
      onPriceChange={handlePriceChange}
      onToggleOption={toggleOption}
      onToggleSale={toggleSale}
      onToggleNew={toggleNew}
    />
  );

  const renderProducts = () => {
    if (sortedProducts.length === 0) {
      return (
        <div className={styles.message}>
          <p className={styles.messageText}>No models match these filters</p>

          <button
            type="button"
            className={styles.reload}
            onClick={clearFilters}
          >
            Clear all filters
          </button>
        </div>
      );
    }

    return (
      <>
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
      <div className={styles.layout}>
        <aside className={styles.sidebar} aria-label="Filters">
          {filtersPanel}
        </aside>

        <div className={styles.main}>
          <div className={styles.toolbar}>
            <button
              type="button"
              className={styles.filtersButton}
              aria-haspopup="dialog"
              onClick={() => setIsSheetOpen(true)}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className={styles.filtersCount}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <div className={styles.tags}>
              <ActiveFilters tags={tags} onClearAll={clearFilters} />
            </div>

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
          </div>

          {renderProducts()}
        </div>

        {isSheetOpen && (
          <FiltersSheet
            resultsCount={sortedProducts.length}
            hasFilters={activeFiltersCount > 0}
            onClearAll={clearFilters}
            onClose={closeSheet}
          >
            {filtersPanel}
          </FiltersSheet>
        )}
      </div>
    );
  };

  return (
    <section className={styles.page}>
      <Breadcrumbs links={[{ title: CATEGORY_TITLES[category] }]} />

      <h1 className={styles.title}>{CATEGORY_TITLES[category]}</h1>

      {!isLoading && !hasError && (
        <p className={styles.count}>
          {activeFiltersCount > 0 ? (
            <>
              <span className={styles.countValue}>{resultsCount}</span> of{' '}
              {products.length} models
            </>
          ) : (
            `${products.length} models`
          )}
        </p>
      )}

      {renderContent()}
    </section>
  );
};
