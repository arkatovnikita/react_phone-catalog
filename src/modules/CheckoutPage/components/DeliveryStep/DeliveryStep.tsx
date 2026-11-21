import classNames from 'classnames';
import styles from './DeliveryStep.module.scss';
import { StepCard } from '../StepCard';
import { FieldGroup, SelectField, TextField } from '../Field';
import { Form } from '../../hooks/useForm';
import { DeliveryValues } from '../../types';
import { DELIVERY_METHODS } from '../../constants';
import { US_STATES } from '../../usStates';
import { getDigits } from '../../utils/caret';

const STATE_OPTIONS = US_STATES.map(({ code, name }) => ({
  value: code,
  label: name,
}));

type Props = {
  form: Form<DeliveryValues>;
  shouldFocus: boolean;
  onNext: () => void;
  onBack: () => void;
};

export const DeliveryStep = ({ form, shouldFocus, onNext, onBack }: Props) => {
  const zip = form.field('zip');

  return (
    <StepCard
      title="Delivery"
      subtitle="We deliver within the United States."
      submitLabel="Continue to payment"
      shouldFocus={shouldFocus}
      onSubmit={() => form.submit(onNext)}
      onBack={onBack}
    >
      <FieldGroup>
        <TextField
          {...form.field('address')}
          label="Street address"
          autoComplete="address-line1"
          placeholder="221 Market Street"
          maxLength={100}
          isWide
        />
        <TextField
          {...form.field('apartment')}
          label="Apartment, suite"
          autoComplete="address-line2"
          maxLength={50}
          isOptional
          isWide
        />
        <TextField
          {...form.field('city')}
          label="City"
          autoComplete="address-level2"
          maxLength={50}
          isWide
        />
        <SelectField
          {...form.field('state')}
          label="State"
          options={STATE_OPTIONS}
          placeholder="Select state"
          autoComplete="address-level1"
          isCompact
        />
        <TextField
          {...zip}
          onChange={value => zip.onChange(getDigits(value).slice(0, 5))}
          label="ZIP code"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="94105"
          isCompact
        />
      </FieldGroup>

      <div
        className={styles.methods}
        role="radiogroup"
        aria-labelledby="delivery-method-title"
      >
        <p id="delivery-method-title" className={styles.title}>
          Delivery method
        </p>

        <div className={styles.options}>
          {DELIVERY_METHODS.map(method => {
            const isSelected = form.values.method === method.id;

            return (
              <label
                key={method.id}
                className={classNames(styles.option, {
                  [styles.optionSelected]: isSelected,
                })}
              >
                <input
                  type="radio"
                  name="delivery-method"
                  className="visually-hidden"
                  value={method.id}
                  checked={isSelected}
                  onChange={() => form.setValue('method', method.id)}
                />
                <span className={styles.radio} aria-hidden="true" />
                <span className={styles.name}>{method.name}</span>
                <span
                  className={classNames(styles.price, {
                    [styles.priceFree]: !method.price,
                  })}
                >
                  {method.price ? `$${method.price}` : 'Free'}
                </span>
                <span className={styles.time}>{method.time}</span>
              </label>
            );
          })}
        </div>
      </div>
    </StepCard>
  );
};
