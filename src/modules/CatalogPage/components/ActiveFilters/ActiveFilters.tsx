import styles from './ActiveFilters.module.scss';
import CloseIcon from '../../../../assets/icons/close.svg?react';

export type FilterTag = {
  key: string;
  label: string;
  onRemove: () => void;
};

type Props = {
  tags: FilterTag[];
  onClearAll: () => void;
};

export const ActiveFilters = ({ tags, onClearAll }: Props) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className={styles.list} aria-label="Active filters">
      {tags.map(({ key, label, onRemove }) => (
        <li key={key}>
          <button
            type="button"
            className={styles.tag}
            aria-label={`Remove filter: ${label}`}
            onClick={onRemove}
          >
            {label}
            <span className={styles.remove} aria-hidden="true">
              <CloseIcon />
            </span>
          </button>
        </li>
      ))}

      <li>
        <button type="button" className={styles.clear} onClick={onClearAll}>
          Clear all
        </button>
      </li>
    </ul>
  );
};
