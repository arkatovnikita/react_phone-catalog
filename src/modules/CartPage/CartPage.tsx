import styles from './CartPage.module.scss';
import { useCart } from '../shared/context/CartContext';
import { BackButton } from '../shared/components/BackButton';
import { CartItem } from './components/CartItem';

const CHECKOUT_MESSAGE =
  'Checkout is not implemented yet. Do you want to clear the Cart?';

export const CartPage = () => {
  const { cartItems, totalPrice, totalQuantity, clearCart } = useCart();

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
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.list}>
            {cartItems.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          <div className={styles.summary}>
            <p className={styles.total}>${totalPrice}</p>

            <p className={styles.totalLabel}>
              Total for {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
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
