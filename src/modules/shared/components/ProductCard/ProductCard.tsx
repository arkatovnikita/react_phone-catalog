import { Link } from 'react-router-dom';
import styles from './ProductCard.module.scss';
import { Product } from '../../types/Product';
import HeartIcon from '../../../../assets/icons/heart.svg?react';

type Props = {
  product: Product;
  showFullPrice?: boolean;
};

export const ProductCard = ({ product, showFullPrice = true }: Props) => {
  const { itemId, name, image, price, fullPrice, screen, capacity, ram } =
    product;

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
        <button type="button" className={styles.addButton}>
          Add to cart
        </button>

        <button
          type="button"
          className={styles.favoriteButton}
          aria-label="Add to favorites"
        >
          <HeartIcon />
        </button>
      </div>
    </article>
  );
};
