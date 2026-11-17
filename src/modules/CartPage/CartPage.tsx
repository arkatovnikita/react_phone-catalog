import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './CartPage.module.scss';
import { useCart } from '../shared/context/CartContext';
import { BackButton } from '../shared/components/BackButton';
import { CartItem } from './components/CartItem';
import { PromoCode } from './components/PromoCode';

const CHECKOUT_MESSAGE =
  'Checkout is not implemented yet. Do you want to clear the Cart?';

export const CartPage = () => {
  const {
    cartItems,
    totalPrice,
    totalQuantity,
    discount,
    finalPrice,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    if (window.confirm(CHECKOUT_MESSAGE)) {
      clearCart();
    }
  };

  return (
    <section className={styles.page}>
      <BackButton />

      <h1 className={styles.title}>Cart</h1>

      {cartItems.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Your cart is empty</p>

          <img
            src={`${import.meta.env.BASE_URL}img/cart-is-empty.png`}
            alt="Empty cart"
            className={styles.emptyImage}
          />

          <Link to="/" className={styles.emptyLink}>
            Continue shopping
          </Link>
        </div>
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
                <dt>Delivery</dt>
                <dd className={styles.free}>Free</dd>
              </div>
            </dl>

            <PromoCode />

            <p className={styles.total}>
              <span>Total</span>
              <span className={styles.totalValue}>${finalPrice}</span>
            </p>

            <button
              type="button"
              className={styles.checkout}
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
