import {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './SearchPanel.module.scss';
import { getProducts } from '../../api/products';
import { Product } from '../../types/Product';
import { CATEGORY_TITLES } from '../../constants/categories';
import { POPULAR_SEARCHES } from '../../constants/popularSearches';
import { useDebounce } from '../../hooks/useDebounce';
import { getSearchWords, searchProducts } from '../../utils/searchProducts';
import SearchIcon from '../../../../assets/icons/search.svg?react';
import CloseIcon from '../../../../assets/icons/close.svg?react';

type Props = {
  onClose: () => void;
};

const DEBOUNCE_DELAY = 300;
const MAX_RESULTS = 6;

const escapeRegExp = (text: string) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlight = (text: string, words: string[]) => {
  if (words.length === 0) {
    return text;
  }

  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'gi');

  return text
    .split(pattern)
    .map((part, index) =>
      index % 2 === 1 ? <mark key={index}>{part}</mark> : part,
    );
};

export const SearchPanel = ({ onClose }: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const listId = useId();

  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const words = getSearchWords(debouncedQuery);

  const results = useMemo(
    () => searchProducts(products, debouncedQuery),
    [products, debouncedQuery],
  );
  const visibleResults = results.slice(0, MAX_RESULTS);
  const trimmedQuery = debouncedQuery.trim();

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [debouncedQuery]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const openSearchPage = () => {
    const value = query.trim();

    if (value) {
      navigate(`/search?query=${encodeURIComponent(value)}`);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && visibleResults.length > 0) {
      event.preventDefault();
      setActiveIndex(index => (index + 1) % visibleResults.length);
    }

    if (event.key === 'ArrowUp' && visibleResults.length > 0) {
      event.preventDefault();
      setActiveIndex(index =>
        index <= 0 ? visibleResults.length - 1 : index - 1,
      );
    }

    if (event.key === 'Enter') {
      event.preventDefault();

      if (activeIndex >= 0 && visibleResults[activeIndex]) {
        navigate(`/product/${visibleResults[activeIndex].itemId}`);
      } else {
        openSearchPage();
      }
    }
  };

  const renderSuggestions = () => (
    <div className={styles.chips}>
      {POPULAR_SEARCHES.map(item => (
        <button
          key={item}
          type="button"
          className={styles.chip}
          onClick={() => {
            setQuery(item);
            inputRef.current?.focus();
          }}
        >
          <SearchIcon />
          {item}
        </button>
      ))}
    </div>
  );

  const renderContent = () => {
    if (!trimmedQuery) {
      return (
        <>
          <p className={styles.heading}>Popular searches</p>
          {renderSuggestions()}
        </>
      );
    }

    if (results.length === 0) {
      return (
        <>
          <p className={styles.heading}>No results for “{trimmedQuery}”</p>
          <p className={styles.hint}>Check the spelling or try one of these:</p>
          {renderSuggestions()}
        </>
      );
    }

    return (
      <>
        <p className={styles.heading}>Products</p>

        <ul id={listId} className={styles.results} role="listbox">
          {visibleResults.map((product, index) => (
            <li
              key={product.itemId}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
            >
              <Link
                to={`/product/${product.itemId}`}
                className={classNames(styles.result, {
                  [styles.resultActive]: index === activeIndex,
                })}
                tabIndex={-1}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${product.image}`}
                  alt=""
                  className={styles.resultImage}
                />

                <span className={styles.resultInfo}>
                  <span className={styles.resultName}>
                    {highlight(product.name, words)}
                  </span>

                  <span className={styles.resultCategory}>
                    {CATEGORY_TITLES[product.category]}
                  </span>
                </span>

                <span className={styles.resultPrice}>
                  ${product.price}
                  {product.fullPrice > product.price && (
                    <s className={styles.resultFullPrice}>
                      ${product.fullPrice}
                    </s>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <button type="button" className={styles.all} onClick={openSearchPage}>
          See all {results.length} {results.length === 1 ? 'result' : 'results'}
          <kbd className={styles.kbd}>Enter ↵</kbd>
        </button>
      </>
    );
  };

  return (
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className={styles.inner}>
          <div className={styles.field}>
            <SearchIcon className={styles.fieldIcon} />

            <input
              ref={inputRef}
              type="search"
              className={styles.input}
              placeholder="Search products"
              value={query}
              onChange={handleChange}
              onKeyDown={handleInputKeyDown}
              role="combobox"
              aria-label="Search products"
              aria-expanded={visibleResults.length > 0}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
              }
            />

            {query && (
              <button
                type="button"
                className={styles.clear}
                aria-label="Clear search"
                onClick={handleClear}
              >
                <CloseIcon />
              </button>
            )}
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};
