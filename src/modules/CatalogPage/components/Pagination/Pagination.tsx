import classNames from 'classnames';
import styles from './Pagination.module.scss';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Props = {
  pagesCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

const VISIBLE_PAGES = 5;

export const Pagination = ({
  pagesCount,
  currentPage,
  onPageChange,
}: Props) => {
  const start = Math.max(
    1,
    Math.min(
      currentPage - Math.floor(VISIBLE_PAGES / 2),
      pagesCount - VISIBLE_PAGES + 1,
    ),
  );
  const end = Math.min(pagesCount, start + VISIBLE_PAGES - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav aria-label="Pagination" className={styles.pagination}>
      <button
        type="button"
        className={styles.arrow}
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ArrowLeftIcon />
      </button>

      <ul className={styles.pages}>
        {pages.map(page => (
          <li key={page}>
            <button
              type="button"
              className={classNames(styles.page, {
                [styles.pageActive]: page === currentPage,
              })}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className={styles.arrow}
        aria-label="Next page"
        disabled={currentPage === pagesCount}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ArrowRightIcon />
      </button>
    </nav>
  );
};
