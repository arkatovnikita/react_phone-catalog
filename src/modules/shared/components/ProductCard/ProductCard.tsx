import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ProductCard.module.scss';
import { Product } from '../../types/Product';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import HeartFilledIcon from '../../../../assets/icons/heart-filled.svg?react';

type Props = {
  product: Product;
  showFullPrice?: boolean;
};

export const ProductCard = ({ product, showFullPrice = true }: Props) => {
  const { itemId, name, image, price, fullPrice, screen, capacity, ram } =
    product;

  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const inCart = isInCart(itemId);
  const favorite = isFavorite(itemId);
  const productLink = `/product/${itemId}`;

  const specs = [
    { label: 'Screen', value: screen },
    { label: 'Capacity', value: capacity },
    { label: 'RAM', value: ram },
  ];

  return (
    <article className={styles.card}>
      <Link to={productLink} className={styles.imageLink}>
        <img
          src={`${import.meta.env.BASE_URL}${image}`}
          alt={name}
          className={styles.image}
        />
      </Link>

      <Link to={productLink} className={styles.name}>
        {name}
      </Link>

      <p className={styles.prices}>
        <span className={styles.price}>${price}</span>

        {showFullPrice && fullPrice !== price && (
          <span className={styles.fullPrice}>${fullPrice}</span>
        )}
      </p>

      <dl className={styles.specs}>
        {specs.map(({ label, value }) => (
          <div key={label} className={styles.spec}>
            <dt className={styles.specLabel}>{label}</dt>
            <dd className={styles.specValue}>{value}</dd>
          </div>
        ))}
      </dl>

      <div className={styles.buttons}>
        <button
          type="button"
          className={classNames(styles.addButton, {
            [styles.addButtonActive]: inCart,
          })}
          onClick={() => addToCart(product)}
        >
          {inCart ? 'Added to cart' : 'Add to cart'}
        </button>

        <button
          type="button"
          className={classNames(styles.favoriteButton, {
            [styles.favoriteButtonActive]: favorite,
          })}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => toggleFavorite(product)}
        >
          {favorite ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
      </div>
    </article>
  );
};
