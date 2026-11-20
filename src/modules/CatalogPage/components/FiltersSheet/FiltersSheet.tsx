import { ReactNode, useEffect, useRef } from 'react';
import styles from './FiltersSheet.module.scss';

type Props = {
  resultsCount: number;
  hasFilters: boolean;
  onClearAll: () => void;
  onClose: () => void;
  children: ReactNode;
};

export const FiltersSheet = ({
  resultsCount,
  hasFilters,
  onClearAll,
  onClose,
  children,
}: Props) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    sheetRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        tabIndex={-1}
      >
        <div className={styles.handle} aria-hidden="true" />

        <div className={styles.header}>
          <h2 className={styles.title}>Filters</h2>

          {hasFilters && (
            <button type="button" className={styles.clear} onClick={onClearAll}>
              Clear all
            </button>
          )}
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.footer}>
          <button type="button" className={styles.show} onClick={onClose}>
            {resultsCount === 0
              ? 'No results'
              : `Show ${resultsCount} ${resultsCount === 1 ? 'result' : 'results'}`}
          </button>
        </div>
      </div>
    </div>
  );
};
