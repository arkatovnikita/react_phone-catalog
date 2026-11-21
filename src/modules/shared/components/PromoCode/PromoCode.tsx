import { FormEvent, useState } from 'react';
import classNames from 'classnames';
import styles from './PromoCode.module.scss';
import { useCart } from '../../context/CartContext';
import { PROMO_CODES } from '../../constants/promoCodes';
import CloseIcon from '../../../../assets/icons/close.svg?react';

export const PromoCode = () => {
  const { promoCode, applyPromoCode, removePromoCode } = useCart();
  const [code, setCode] = useState('');
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!code.trim()) {
      return;
    }

    if (applyPromoCode(code)) {
      setCode('');
      setHasError(false);
    } else {
      setHasError(true);
    }
  };

  if (promoCode) {
    return (
      <div className={styles.applied}>
        <span>
          <span className={styles.code}>{promoCode}</span> applied ·{' '}
          {PROMO_CODES[promoCode]}% off
        </span>

        <button
          type="button"
          className={styles.remove}
          aria-label="Remove promo code"
          onClick={removePromoCode}
        >
          <CloseIcon />
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <label htmlFor="promo-code" className="visually-hidden">
        Promo code
      </label>

      <div className={styles.row}>
        <input
          id="promo-code"
          type="text"
          className={classNames(styles.input, {
            [styles.inputError]: hasError,
          })}
          placeholder="Promo code"
          value={code}
          autoComplete="off"
          aria-invalid={hasError}
          aria-describedby="promo-code-message"
          onChange={event => {
            setCode(event.target.value);
            setHasError(false);
          }}
        />

        <button type="submit" className={styles.apply} disabled={!code.trim()}>
          Apply
        </button>
      </div>

      <p
        id="promo-code-message"
        className={classNames(styles.message, {
          [styles.messageError]: hasError,
        })}
      >
        {hasError
          ? 'This promo code is not valid'
          : 'Try ORCHARD10 for 10% off'}
      </p>
    </form>
  );
};
