import { Link } from 'react-router-dom';
import styles from './Toaster.module.scss';
import { Toast } from '../../types/Toast';
import CheckIcon from '../../../../assets/icons/check.svg?react';
import CloseIcon from '../../../../assets/icons/close.svg?react';

type Props = {
  toasts: Toast[];
  onClose: (id: number) => void;
};

export const Toaster = ({ toasts, onClose }: Props) => (
  <div className={styles.toaster} role="status" aria-live="polite">
    {toasts.map(({ id, message, link }) => (
      <div key={id} className={styles.toast}>
        <span className={styles.icon}>
          <CheckIcon />
        </span>

        <p className={styles.message}>{message}</p>

        {link && (
          <Link
            to={link.to}
            className={styles.link}
            onClick={() => onClose(id)}
          >
            {link.label}
          </Link>
        )}

        <button
          type="button"
          className={styles.close}
          aria-label="Close notification"
          onClick={() => onClose(id)}
        >
          <CloseIcon />
        </button>
      </div>
    ))}
  </div>
);
