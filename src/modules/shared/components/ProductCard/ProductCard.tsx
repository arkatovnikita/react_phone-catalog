import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ProductCard.module.scss';
import { Product } from '../../types/Product';
import { useProductActions } from '../../hooks/useProductActions';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import HeartFilledIcon from '../../../../assets/icons/heart-filled.svg?react';
import PlusIcon from '../../../../assets/icons/plus.svg?react';
import CheckIcon from '../../../../assets/icons/check.svg?react';

const MAX_COLORS = 5;

type Props = {
  product: Product;
  showFullPrice?: boolean;
};

export const ProductCard = ({ product, showFullPrice = true }: Props) => {
  const {
    itemId,
    modelName,
    image,
    price,
    fullPrice,
    summary,
    colors,
    inStock,
    isNew,
  } = product;

  const { inCart, favorite, handleAddToCart, handleToggleFavorite } =
    useProductActions(product);

  const productLink = `/product/${itemId}`;
  const hasDiscount = showFullPrice && fullPrice > price;
  const discount = Math.round(((fullPrice - price) / fullPrice) * 100);
  let addLabel = 'Add to cart';

  if (!inStock) {
    addLabel = 'Out of stock';
  } else if (inCart) {
    addLabel = 'Added to cart';
  }

  const visibleColors = colors.slice(0, MAX_COLORS);
  const hiddenColorsCount = colors.length - visibleColors.length;

  return (
    <article
      className={classNames(styles.card, { [styles.cardOutOfStock]: !inStock })}
    >
      <div className={styles.media}>
        <Link to={productLink} className={styles.imageLink}>
          <img
            src={`${import.meta.env.BASE_URL}${image}`}
            alt={modelName}
            className={styles.image}
            loading="lazy"
          />
        </Link>

        {hasDiscount && <span className={styles.badge}>−{discount}%</span>}

        {!hasDiscount && isNew && (
          <span className={classNames(styles.badge, styles.badgeNew)}>New</span>
        )}

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
        <div className={styles.colors}>
          {colors.length > 1 && (
            <ul className={styles.colorList} aria-label="Available colors">
              {visibleColors.map(color => (
                <li
                  key={color.name}
                  className={styles.color}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}

              {hiddenColorsCount > 0 && (
                <li className={styles.moreColors}>+{hiddenColorsCount}</li>
              )}
            </ul>
          )}
        </div>

        <Link to={productLink} className={styles.name}>
          {modelName}
        </Link>

        <p className={styles.specs}>{summary}</p>

        <p
          className={classNames(styles.stock, {
            [styles.stockOut]: !inStock,
          })}
        >
          {inStock ? 'In stock' : 'Out of stock'}
        </p>

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
            aria-label={addLabel}
            title={addLabel}
            disabled={!inStock}
            onClick={handleAddToCart}
          >
            {inCart ? <CheckIcon /> : <PlusIcon />}
          </button>
        </div>
      </div>
    </article>
  );
};
