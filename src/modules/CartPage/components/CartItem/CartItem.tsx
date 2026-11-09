import { Link } from 'react-router-dom';
import styles from './CartItem.module.scss';
import { CartItem as CartItemType } from '../../../shared/types/CartItem';
import { useCart } from '../../../shared/context/CartContext';
import CloseIcon from '../../../../assets/icons/close.svg?react';
import MinusIcon from '../../../../assets/icons/minus.svg?react';
import PlusIcon from '../../../../assets/icons/plus.svg?react';

type Props = {
  item: CartItemType;
};

export const CartItem = ({ item }: Props) => {
  const { id, quantity, product } = item;
  const { removeFromCart, changeQuantity } = useCart();
  const productLink = `/product/${id}`;

  return (
    <article className={styles.item}>
      <div className={styles.info}>
        <button
          type="button"
          className={styles.remove}
          aria-label="Remove from cart"
          onClick={() => removeFromCart(id)}
        >
          <CloseIcon />
        </button>

        <Link to={productLink} className={styles.imageLink}>
          <img
            src={`${import.meta.env.BASE_URL}${product.image}`}
            alt={product.name}
            className={styles.image}
          />
        </Link>

        <Link to={productLink} className={styles.name}>
          {product.name}
        </Link>
      </div>

      <div className={styles.controls}>
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

          <span className={styles.count}>{quantity}</span>

          <button
            type="button"
            className={styles.quantityButton}
            aria-label="Increase quantity"
            onClick={() => changeQuantity(id, 1)}
          >
            <PlusIcon />
          </button>
        </div>

        <p className={styles.price}>${product.price * quantity}</p>
      </div>
    </article>
  );
};
