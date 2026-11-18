import { Link } from 'react-router-dom';
import styles from './FavoritesPage.module.scss';
import { useFavorites } from '../shared/context/FavoritesContext';
import { ProductsList } from '../shared/components/ProductsList';
import { EmptyState } from '../shared/components/EmptyState';
import HeartIcon from '../../assets/icons/heart.svg?react';

const EMPTY_FAVORITES_TEXT =
  'Tap the heart on any product to save it here and compare later.';

export const FavoritesPage = () => {
  const { favorites } = useFavorites();
  const count = favorites.length;

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Favourites</h1>

      <p className={styles.count}>
        {count} {count === 1 ? 'item' : 'items'}
      </p>

      {count > 0 ? (
        <ProductsList products={favorites} />
      ) : (
        <EmptyState
          icon={<HeartIcon />}
          title="No favourites yet"
          text={EMPTY_FAVORITES_TEXT}
        >
          <Link to="/" className={styles.emptyLink}>
            Start shopping
          </Link>
        </EmptyState>
      )}
    </section>
  );
};
