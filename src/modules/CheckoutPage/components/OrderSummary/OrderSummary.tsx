import { useId, useState } from 'react';
import classNames from 'classnames';
import styles from './OrderSummary.module.scss';
import { useCart } from '../../../shared/context/CartContext';
import { PromoCode } from '../../../shared/components/PromoCode';
import ArrowDownIcon from '../../../../assets/icons/arrow-down.svg?react';

type Props = {
  deliveryName: string;
  deliveryPrice: number;
  total: number;
};

export const OrderSummary = ({ deliveryName, deliveryPrice, total }: Props) => {
  const { cartItems, totalQuantity, totalPrice, discount, promoCode } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();
  const itemsLabel = `${totalQuantity} ${totalQuantity === 1 ? 'item' : 'items'}`;

  return (
    <aside
      className={classNames(styles.summary, { [styles.summaryOpen]: isOpen })}
      aria-label="Order summary"
    >
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(current => !current)}
      >
        <span className={styles.toggleLabel}>
          Order summary · {itemsLabel}
          <ArrowDownIcon className={styles.toggleIcon} aria-hidden="true" />
        </span>
        <span>${total}</span>
      </button>

      <div id={contentId} className={styles.content}>
        <h2 className={styles.title}>Order summary</h2>

        <ul className={styles.items}>
          {cartItems.map(({ id, quantity, product }) => (
            <li key={id} className={styles.item}>
              <span className={styles.thumb}>
                <img
                  src={`${import.meta.env.BASE_URL}${product.image}`}
                  alt=""
                  className={styles.image}
                />
                {quantity > 1 && (
                  <span className={styles.quantity}>{quantity}</span>
                )}
              </span>
              <span className={styles.name}>
                {product.name}
                {quantity > 1 && (
                  <span className="visually-hidden">, {quantity} pcs</span>
                )}
              </span>
              <span className={styles.price}>${product.price * quantity}</span>
            </li>
          ))}
        </ul>

        <dl className={styles.rows}>
          <div className={styles.row}>
            <dt>Subtotal ({itemsLabel})</dt>
            <dd>${totalPrice}</dd>
          </div>

          {discount > 0 && (
            <div className={classNames(styles.row, styles.rowGreen)}>
              <dt>Discount · {promoCode}</dt>
              <dd>−${discount}</dd>
            </div>
          )}

          <div
            className={classNames(styles.row, {
              [styles.rowGreen]: !deliveryPrice,
            })}
          >
            <dt>{deliveryName} delivery</dt>
            <dd>{deliveryPrice ? `$${deliveryPrice}` : 'Free'}</dd>
          </div>
        </dl>

        <div className={styles.promo}>
          <PromoCode />
        </div>

        <p className={styles.total}>
          <span>Total</span>
          <span className={styles.totalValue}>${total}</span>
        </p>
      </div>
    </aside>
  );
};
