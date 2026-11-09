import styles from './FavoritesPage.module.scss';
import { useFavorites } from '../shared/context/FavoritesContext';
import { ProductsList } from '../shared/components/ProductsList';

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
        <p className={styles.empty}>You have no favourites yet</p>
      )}
    </section>
  );
};
