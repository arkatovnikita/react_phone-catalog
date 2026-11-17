import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './CartDrawer.module.scss';
import { useCart } from '../../context/CartContext';
import CloseIcon from '../../../../assets/icons/close.svg?react';
import MinusIcon from '../../../../assets/icons/minus.svg?react';
import PlusIcon from '../../../../assets/icons/plus.svg?react';

type Props = {
  onClose: () => void;
};

export const CartDrawer = ({ onClose }: Props) => {
  const {
    cartItems,
    totalQuantity,
    totalPrice,
    changeQuantity,
    removeFromCart,
  } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.root}>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />

      <aside
        className={styles.drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Cart"
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            Cart
            {totalQuantity > 0 && (
              <span className={styles.count}>{totalQuantity}</span>
            )}
          </h2>

          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            aria-label="Close cart"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyText}>Your cart is empty</p>

            <Link to="/" className={styles.primary} onClick={onClose}>
              Continue shopping
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {cartItems.map(({ id, quantity, product }) => (
                <li key={id} className={styles.item}>
                  <Link
                    to={`/product/${id}`}
                    className={styles.imageLink}
                    onClick={onClose}
                  >
                    <img
                      src={`${import.meta.env.BASE_URL}${product.image}`}
                      alt={product.name}
                      className={styles.image}
                    />
                  </Link>

                  <div className={styles.info}>
                    <Link
                      to={`/product/${id}`}
                      className={styles.name}
                      onClick={onClose}
                    >
                      {product.name}
                    </Link>

                    <div className={styles.row}>
                      <div className={styles.quantity}>
                        <button
                          type="button"
                          className={styles.quantityButton}
                          aria-label="Decrease quantity"
                          disabled={quantity === 1}
                          onClick={() => changeQuantity(id, -1)}
                        >
                          <MinusIcon />
                        </button>

                        <span className={styles.quantityValue}>{quantity}</span>

                        <button
                          type="button"
                          className={styles.quantityButton}
                          aria-label="Increase quantity"
                          onClick={() => changeQuantity(id, 1)}
                        >
                          <PlusIcon />
                        </button>
                      </div>

                      <p className={styles.price}>
                        ${product.price * quantity}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={styles.remove}
                    aria-label="Remove from cart"
                    onClick={() => removeFromCart(id)}
                  >
                    <CloseIcon />
                  </button>
                </li>
              ))}
            </ul>

            <div className={styles.footer}>
              <p className={styles.subtotal}>
                <span>Subtotal</span>
                <span className={styles.subtotalValue}>${totalPrice}</span>
              </p>

              <p className={styles.note}>
                Free delivery. Promo codes can be applied in the cart.
              </p>

              <Link to="/cart" className={styles.primary} onClick={onClose}>
                Go to cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};
