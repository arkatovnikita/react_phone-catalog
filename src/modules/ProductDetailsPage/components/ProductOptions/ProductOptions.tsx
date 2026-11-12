import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ProductOptions.module.scss';
import { Product } from '../../../shared/types/Product';
import { ProductDetails } from '../../../shared/types/ProductDetails';
import { useCart } from '../../../shared/context/CartContext';
import { useFavorites } from '../../../shared/context/FavoritesContext';
import { COLORS } from '../../../shared/constants/colors';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import HeartFilledIcon from '../../../../assets/icons/heart-filled.svg?react';

type Props = {
  product: Product;
  details: ProductDetails;
  variants: ProductDetails[];
};

const formatCapacity = (capacity: string) =>
  capacity.replace(/(\d)([a-zA-Z])/, '$1 $2');

export const ProductOptions = ({ product, details, variants }: Props) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const inCart = isInCart(product.itemId);
  const favorite = isFavorite(product.itemId);

  const specs = [
    { label: 'Screen', value: details.screen },
    { label: 'Resolution', value: details.resolution },
    { label: 'Processor', value: details.processor },
    { label: 'RAM', value: details.ram },
  ];

  const selectVariant = (color: string, capacity: string) => {
    const variant = variants.find(
      item =>
        item.namespaceId === details.namespaceId &&
        item.color === color &&
        item.capacity === capacity,
    );

    if (variant) {
      navigate(`/product/${variant.id}`, { replace: true });
    }
  };

  return (
    <div className={styles.options}>
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <p className={styles.label}>Available colors</p>
          <p className={styles.id}>ID: {product.id}</p>
        </div>

        <div className={styles.colors}>
          {details.colorsAvailable.map(color => (
            <label
              key={color}
              className={classNames(styles.color, {
                [styles.colorActive]: color === details.color,
              })}
              title={color}
            >
              <input
                type="radio"
                name="color"
                value={color}
                checked={color === details.color}
                onChange={() => selectVariant(color, details.capacity)}
                className="visually-hidden"
              />
              <span className="visually-hidden">{color}</span>
              <span
                className={styles.swatch}
                style={{ backgroundColor: COLORS[color] ?? color }}
              />
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <p className={styles.label}>Select capacity</p>

        <div className={styles.capacities}>
          {details.capacityAvailable.map(capacity => (
            <label
              key={capacity}
              className={classNames(styles.capacity, {
                [styles.capacityActive]: capacity === details.capacity,
              })}
            >
              <input
                type="radio"
                name="capacity"
                value={capacity}
                checked={capacity === details.capacity}
                onChange={() => selectVariant(details.color, capacity)}
                className="visually-hidden"
              />
              {formatCapacity(capacity)}
            </label>
          ))}
        </div>
      </div>

      <p className={styles.prices}>
        <span className={styles.price}>${details.priceDiscount}</span>

        {details.priceDiscount !== details.priceRegular && (
          <span className={styles.fullPrice}>${details.priceRegular}</span>
        )}
      </p>

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

      <dl className={styles.specs}>
        {specs.map(({ label, value }) => (
          <div key={label} className={styles.spec}>
            <dt className={styles.specLabel}>{label}</dt>
            <dd className={styles.specValue}>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
