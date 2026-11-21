import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './OrderConfirmed.module.scss';
import { PlacedOrder } from '../../types';
import CheckIcon from '../../../../assets/icons/check.svg?react';

type Props = {
  order: PlacedOrder;
};

export const OrderConfirmed = ({ order }: Props) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className={styles.confirmed}>
      <div className={styles.icon} aria-hidden="true">
        <CheckIcon />
      </div>

      <h1 ref={titleRef} className={styles.title} tabIndex={-1}>
        Order confirmed
      </h1>

      <p className={styles.lead}>
        Thanks, {order.firstName}! This is a demo order, so nothing was charged
        and nothing will be shipped.
      </p>

      <p className={styles.number}>
        <span className={styles.numberLabel}>Order number</span>
        <strong>{order.number}</strong>
      </p>

      <dl className={styles.details}>
        <div className={styles.row}>
          <dt>Items</dt>
          <dd>{order.itemCount}</dd>
        </div>
        <div className={styles.row}>
          <dt>Delivery</dt>
          <dd>{order.delivery}</dd>
        </div>
        <div className={styles.row}>
          <dt>Ship to</dt>
          <dd>{order.shipTo}</dd>
        </div>
        <div className={styles.total}>
          <dt>Total</dt>
          <dd>${order.total}</dd>
        </div>
      </dl>

      <Link to="/" className={styles.continue}>
        Continue shopping
      </Link>
    </div>
  );
};
