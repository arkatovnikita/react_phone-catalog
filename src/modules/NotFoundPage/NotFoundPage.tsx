import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.scss';

export const NotFoundPage = () => (
  <section className={styles.page}>
    <h1 className={styles.title}>Page not found</h1>

    <img
      src={`${import.meta.env.BASE_URL}img/page-not-found.png`}
      alt="Page not found"
      className={styles.image}
    />

    <Link to="/" className={styles.link}>
      Back to home
    </Link>
  </section>
);
