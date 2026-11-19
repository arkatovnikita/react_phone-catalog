import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';
import { EmptyState } from '../shared/components/EmptyState';
import Mark from '../../assets/images/mark.svg?react';

export const NotFoundPage = () => (
  <section className={styles.page}>
    <EmptyState
      isPageTitle
      art={
        <span className={styles.code} aria-hidden="true">
          <span className={styles.digit}>4</span>
          <span className={styles.zero}>
            <Mark className={styles.mark} />
          </span>
          <span className={styles.digit}>4</span>
        </span>
      }
      title="Page not found"
      text="The page you are looking for doesn't exist or has been moved."
    >
      <Link to="/" className={styles.primary}>
        Back to home
      </Link>
    </EmptyState>
  </section>
);
