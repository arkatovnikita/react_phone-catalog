import styles from './PaymentStep.module.scss';
import { StepCard } from '../StepCard';
import { Field, FieldGroup, TextField } from '../Field';
import { CardNumberInput } from '../CardNumberInput';
import { ExpiryInput } from '../ExpiryInput';
import { Form } from '../../hooks/useForm';
import { PaymentValues } from '../../types';
import { TEST_CARDS } from '../../constants';
import { getDigits } from '../../utils/caret';
import InfoIcon from '../../../../assets/icons/info.svg?react';
import LockIcon from '../../../../assets/icons/lock.svg?react';

type Props = {
  form: Form<PaymentValues>;
  shouldFocus: boolean;
  onNext: () => void;
  onBack: () => void;
};

export const PaymentStep = ({ form, shouldFocus, onNext, onBack }: Props) => {
  const cardNumber = form.field('cardNumber');
  const expiry = form.field('expiry');
  const cvc = form.field('cvc');

  return (
    <StepCard
      title="Payment"
      subtitle="Enter your card details."
      submitLabel="Continue to review"
      shouldFocus={shouldFocus}
      onSubmit={() => form.submit(onNext)}
      onBack={onBack}
    >
      <p className={styles.hint}>
        <InfoIcon className={styles.hintIcon} aria-hidden="true" />
        <span>
          {'Demo payment — use a test card: Visa '}
          <span className={styles.card}>{TEST_CARDS.visa}</span>
          {' or Mastercard '}
          <span className={styles.card}>{TEST_CARDS.mastercard}</span>
          {', any future date and any CVC.'}
        </span>
      </p>

      <FieldGroup>
        <Field
          id={cardNumber.id}
          label="Card number"
          error={cardNumber.error}
          isWide
        >
          <CardNumberInput {...cardNumber} />
        </Field>

        <Field
          id={expiry.id}
          label="Expiry date"
          error={expiry.error}
          isCompact
        >
          <ExpiryInput {...expiry} />
        </Field>

        <TextField
          {...cvc}
          onChange={value => cvc.onChange(getDigits(value).slice(0, 3))}
          label="CVC"
          inputMode="numeric"
          autoComplete="off"
          placeholder="123"
          isCompact
        />

        <TextField
          {...form.field('cardName')}
          label="Name on card"
          autoComplete="off"
          maxLength={50}
          isWide
        />
      </FieldGroup>

      <p className={styles.note}>
        <LockIcon className={styles.noteIcon} aria-hidden="true" />
        Card details are not saved or sent anywhere.
      </p>
    </StepCard>
  );
};
