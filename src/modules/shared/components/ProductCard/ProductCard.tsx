import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ProductCard.module.scss';
import { Product } from '../../types/Product';
import { useProductActions } from '../../hooks/useProductActions';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import HeartFilledIcon from '../../../../assets/icons/heart-filled.svg?react';
import PlusIcon from '../../../../assets/icons/plus.svg?react';
import CheckIcon from '../../../../assets/icons/check.svg?react';

type Props = {
  product: Product;
  showFullPrice?: boolean;
};

export const ProductCard = ({ product, showFullPrice = true }: Props) => {
  const { itemId, name, image, price, fullPrice, screen, capacity, ram } =
    product;

  const { inCart, favorite, handleAddToCart, handleToggleFavorite } =
    useProductActions(product);

  const productLink = `/product/${itemId}`;
  const hasDiscount = showFullPrice && fullPrice > price;
  const discount = Math.round(((fullPrice - price) / fullPrice) * 100);
  const specs = [screen, capacity, ram && `${ram} RAM`].filter(Boolean);

  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Link to={productLink} className={styles.imageLink}>
          <img
            src={`${import.meta.env.BASE_URL}${image}`}
            alt={name}
            className={styles.image}
            loading="lazy"
          />
        </Link>

        {hasDiscount && <span className={styles.badge}>−{discount}%</span>}

        <button
          type="button"
          className={classNames(styles.favoriteButton, {
            [styles.favoriteButtonActive]: favorite,
          })}
          aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={handleToggleFavorite}
        >
          {favorite ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
      </div>

      <div className={styles.body}>
        <Link to={productLink} className={styles.name}>
          {name}
        </Link>

        <p className={styles.specs}>{specs.join(' · ')}</p>

        <div className={styles.footer}>
          <p className={styles.prices}>
            <span className={styles.price}>${price}</span>

            {hasDiscount && (
              <span className={styles.fullPrice}>${fullPrice}</span>
            )}
          </p>

          <button
            type="button"
            className={classNames(styles.addButton, {
              [styles.addButtonActive]: inCart,
            })}
            aria-label={inCart ? 'Added to cart' : 'Add to cart'}
            title={inCart ? 'Added to cart' : 'Add to cart'}
            onClick={handleAddToCart}
          >
            {inCart ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>
    </article>
  );
};
