import classNames from 'classnames';
import styles from './CardNumberInput.module.scss';
import { FieldBinding } from '../../hooks/useForm';
import { MaskedInput } from '../MaskedInput';
import {
  CARD_BRAND_NAMES,
  CARD_NUMBER_LENGTH,
  formatCardNumber,
  getCardBrand,
} from '../../utils/card';
import { getDigits } from '../../utils/caret';
import VisaIcon from '../../../../assets/icons/visa.svg?react';
import MastercardIcon from '../../../../assets/icons/mastercard.svg?react';

const toCardDigits = (text: string) =>
  getDigits(text).slice(0, CARD_NUMBER_LENGTH);

export const CardNumberInput = (props: FieldBinding) => {
  const brand = getCardBrand(props.value);

  return (
    <div className={styles.wrapper}>
      <MaskedInput
        {...props}
        className={styles.input}
        format={formatCardNumber}
        toDigits={toCardDigits}
        placeholder="1234 1234 1234 1234"
      />

      <span
        className={classNames(styles.brands, { [styles.brandsIdle]: !brand })}
        aria-hidden="true"
      >
        {brand !== 'mastercard' && <VisaIcon className={styles.brand} />}
        {brand !== 'visa' && <MastercardIcon className={styles.brand} />}
      </span>

      <span className="visually-hidden" aria-live="polite">
        {brand ? `${CARD_BRAND_NAMES[brand]} card` : ''}
      </span>
    </div>
  );
};
