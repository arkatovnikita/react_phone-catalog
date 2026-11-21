import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './CartPage.module.scss';
import { useCart } from '../shared/context/CartContext';
import { BackButton } from '../shared/components/BackButton';
import { CartItem } from './components/CartItem';
import { PromoCode } from '../shared/components/PromoCode';
import { EmptyState } from '../shared/components/EmptyState';
import CartIcon from '../../assets/icons/cart.svg?react';

const EMPTY_CART_TEXT =
  "Looks like you haven't added anything yet. Explore the latest " +
  'Apple devices and find something you love.';

export const CartPage = () => {
  const { cartItems, totalPrice, totalQuantity, discount, finalPrice } =
    useCart();

  return (
    <section className={styles.page}>
      <BackButton />

      <h1 className={styles.title}>Cart</h1>

      {cartItems.length === 0 ? (
        <EmptyState
          icon={<CartIcon />}
          title="Your cart is empty"
          text={EMPTY_CART_TEXT}
        >
          <Link to="/" className={styles.emptyLink}>
            Continue shopping
          </Link>
        </EmptyState>
      ) : (
        <div className={styles.content}>
          <div className={styles.list}>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order summary</h2>

            <dl className={styles.rows}>
              <div className={styles.row}>
                <dt>
                  Subtotal ({totalQuantity}{' '}
                  {totalQuantity === 1 ? 'item' : 'items'})
                </dt>
                <dd>${totalPrice}</dd>
              </div>

              {discount > 0 && (
                <div className={classNames(styles.row, styles.rowDiscount)}>
                  <dt>Discount</dt>
                  <dd>−${discount}</dd>
                </div>
              )}

              <div className={styles.row}>
                <dt>Standard delivery</dt>
                <dd className={styles.free}>Free</dd>
              </div>
            </dl>

            <PromoCode />

            <p className={styles.total}>
              <span>Total</span>
              <span className={styles.totalValue}>${finalPrice}</span>
            </p>

            <Link to="/checkout" className={styles.checkout}>
              Checkout
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};
