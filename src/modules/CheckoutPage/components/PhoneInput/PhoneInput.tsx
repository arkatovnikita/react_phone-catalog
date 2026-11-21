import styles from './PhoneInput.module.scss';
import { FieldBinding } from '../../hooks/useForm';
import { MaskedInput } from '../MaskedInput';
import { PHONE_PREFIX, formatPhone, toPhoneDigits } from '../../utils/phone';

export const PhoneInput = (props: FieldBinding) => (
  <div className={styles.wrapper}>
    <span className={styles.prefix} aria-hidden="true">
      {PHONE_PREFIX}
    </span>

    <MaskedInput
      {...props}
      className={styles.input}
      format={formatPhone}
      toDigits={toPhoneDigits}
      placeholder="(415) 555-0123"
      autoComplete="tel-national"
    />
  </div>
);
