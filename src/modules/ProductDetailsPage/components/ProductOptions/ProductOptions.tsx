import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ProductOptions.module.scss';
import { Product } from '../../../shared/types/Product';
import { ProductDetails } from '../../../shared/types/ProductDetails';
import { useProductActions } from '../../../shared/hooks/useProductActions';
import { Rating } from '../../../shared/components/Rating';
import { useInView } from '../../../shared/hooks/useInView';
import { StickyBuyBar } from '../StickyBuyBar';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import HeartFilledIcon from '../../../../assets/icons/heart-filled.svg?react';

type Props = {
  product: Product;
  details: ProductDetails;
  variants: ProductDetails[];
};

const SUMMARY_SPECS_COUNT = 4;

export const ProductOptions = ({ product, details, variants }: Props) => {
  const navigate = useNavigate();
  const { inCart, favorite, handleAddToCart, handleToggleFavorite } =
    useProductActions(product);
  const [buttonsRef, areButtonsInView] = useInView<HTMLDivElement>();

  const findVariant = (color: string, capacity: string) =>
    variants.find(item => item.color === color && item.capacity === capacity);

  const isColorInStock = (color: string) =>
    variants.some(item => item.color === color && item.inStock);

  const selectVariant = (color: string, capacity: string) => {
    const variant =
      findVariant(color, capacity) ??
      variants.find(item => item.color === color);

    if (variant) {
      navigate(`/product/${variant.id}`, { replace: true });
    }
  };

  const selectedColor = details.colors.find(
    color => color.slug === details.color,
  );
  const hasDiscount = details.priceDiscount < details.priceRegular;

  let buttonText = 'Add to cart';

  if (!details.inStock) {
    buttonText = 'Out of stock';
  } else if (inCart) {
    buttonText = 'Added to cart';
  }

  return (
    <div className={styles.options}>
      <div className={styles.top}>
        <Rating rating={details.rating} count={details.reviewsCount} />
        <p className={styles.id}>Item no. {details.sku}</p>
      </div>

      {details.colors.length > 1 && (
        <div className={styles.group}>
          <p className={styles.label}>
            Color: <span className={styles.value}>{selectedColor?.name}</span>
          </p>

          <div className={styles.colors}>
            {details.colors.map(color => {
              const inStock = isColorInStock(color.slug);

              return (
                <label
                  key={color.slug}
                  className={classNames(styles.color, {
                    [styles.colorActive]: color.slug === details.color,
                    [styles.colorOut]: !inStock,
                  })}
                  title={inStock ? color.name : `${color.name} — out of stock`}
                >
                  <input
                    type="radio"
                    name="color"
                    value={color.slug}
                    checked={color.slug === details.color}
                    disabled={!inStock}
                    onChange={() => selectVariant(color.slug, details.capacity)}
                    className="visually-hidden"
                  />
                  <span className="visually-hidden">{color.name}</span>
                  <span
                    className={styles.swatch}
                    style={{ backgroundColor: color.hex }}
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      {details.capacityAvailable.length > 1 && (
        <div className={styles.group}>
          <p className={styles.label}>{details.capacityLabel}</p>

          <div className={styles.capacities}>
            {details.capacityAvailable.map(capacity => {
              const variant = findVariant(details.color, capacity);
              const inStock = Boolean(variant?.inStock);

              return (
                <label
                  key={capacity}
                  className={classNames(styles.capacity, {
                    [styles.capacityActive]: capacity === details.capacity,
                    [styles.capacityOut]: !inStock,
                  })}
                >
                  <input
                    type="radio"
                    name="capacity"
                    value={capacity}
                    checked={capacity === details.capacity}
                    disabled={!inStock}
                    onChange={() => selectVariant(details.color, capacity)}
                    className="visually-hidden"
                  />
                  {capacity}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <p className={styles.prices}>
        <span className={styles.price}>${details.priceDiscount}</span>

        {hasDiscount && (
          <span className={styles.fullPrice}>${details.priceRegular}</span>
        )}
      </p>

      <p
        className={classNames(styles.stock, {
          [styles.stockOut]: !details.inStock,
        })}
      >
        {details.inStock
          ? 'In stock · Free delivery in 2–3 days'
          : 'Out of stock · This configuration is unavailable'}
      </p>

      <div className={styles.buttons} ref={buttonsRef}>
        <button
          type="button"
          className={classNames(styles.addButton, {
            [styles.addButtonActive]: inCart,
          })}
          disabled={!details.inStock}
          onClick={handleAddToCart}
        >
          {buttonText}
        </button>

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

      <dl className={styles.specs}>
        {details.specs.slice(0, SUMMARY_SPECS_COUNT).map(({ label, value }) => (
          <div key={label} className={styles.spec}>
            <dt className={styles.specLabel}>{label}</dt>
            <dd className={styles.specValue}>{value}</dd>
          </div>
        ))}
      </dl>

      <StickyBuyBar
        isVisible={!areButtonsInView}
        image={details.images[0]}
        title={`${details.modelName} · ${details.capacity}`}
        price={details.priceDiscount}
        fullPrice={details.priceRegular}
        buttonText={buttonText}
        isAdded={inCart}
        isDisabled={!details.inStock}
        onAdd={handleAddToCart}
      />
    </div>
  );
};
