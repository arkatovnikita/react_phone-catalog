import { ReactNode } from 'react';
import styles from './ReviewStep.module.scss';
import { StepCard } from '../StepCard';
import { ContactValues, DeliveryValues, PaymentValues } from '../../types';
import { getDeliveryMethod } from '../../constants';
import { CARD_BRAND_NAMES, getCardBrand } from '../../utils/card';
import { formatExpiry, parseExpiry } from '../../utils/expiry';
import { formatFullPhone } from '../../utils/phone';
import InfoIcon from '../../../../assets/icons/info.svg?react';
import VisaIcon from '../../../../assets/icons/visa.svg?react';
import MastercardIcon from '../../../../assets/icons/mastercard.svg?react';

type Props = {
  contact: ContactValues;
  delivery: DeliveryValues;
  payment: PaymentValues;
  total: number;
  shouldFocus: boolean;
  onEdit: (step: number) => void;
  onBack: () => void;
  onPlaceOrder: () => void;
};

type BlockProps = {
  label: string;
  onEdit: () => void;
  children: ReactNode;
};

const ReviewBlock = ({ label, onEdit, children }: BlockProps) => (
  <div className={styles.block}>
    <div className={styles.content}>
      <h3 className={styles.label}>{label}</h3>
      {children}
    </div>

    <button
      type="button"
      className={styles.edit}
      aria-label={`Edit ${label.toLowerCase()}`}
      onClick={onEdit}
    >
      Edit
    </button>
  </div>
);

export const ReviewStep = ({
  contact,
  delivery,
  payment,
  total,
  shouldFocus,
  onEdit,
  onBack,
  onPlaceOrder,
}: Props) => {
  const method = getDeliveryMethod(delivery.method);
  const brand = getCardBrand(payment.cardNumber);
  const BrandIcon = brand === 'mastercard' ? MastercardIcon : VisaIcon;
  const street = [delivery.address, delivery.apartment]
    .filter(Boolean)
    .join(', ');
  const brandName = brand ? CARD_BRAND_NAMES[brand] : 'Card';
  const expiry = formatExpiry(parseExpiry(payment.expiry)).replace(/ /g, '');
  const cardSummary =
    `${brandName} •••• ${payment.cardNumber.slice(-4)}` +
    ` · Expires ${expiry}`;

  return (
    <StepCard
      title="Review your order"
      subtitle="Check everything before placing the order."
      submitLabel={`Place order · $${total}`}
      shouldFocus={shouldFocus}
      onSubmit={onPlaceOrder}
      onBack={onBack}
    >
      <ReviewBlock label="Contact" onEdit={() => onEdit(0)}>
        <p className={styles.text}>
          {contact.firstName} {contact.lastName}
          <br />
          {contact.email} · {formatFullPhone(contact.phone)}
        </p>
      </ReviewBlock>

      <ReviewBlock label="Delivery" onEdit={() => onEdit(1)}>
        <p className={styles.text}>
          {street}
          <br />
          {delivery.city}, {delivery.state} {delivery.zip}
          <br />
          {method.name} · {method.time}
        </p>
      </ReviewBlock>

      <ReviewBlock label="Payment" onEdit={() => onEdit(2)}>
        <p className={styles.payment}>
          {brand && <BrandIcon className={styles.brand} aria-hidden="true" />}
          <span>{cardSummary}</span>
        </p>
      </ReviewBlock>

      <p className={styles.notice}>
        <InfoIcon className={styles.noticeIcon} aria-hidden="true" />
        <span>
          <strong>Demo store — no real payment.</strong> Placing the order only
          simulates checkout. Nothing is charged or shipped.
        </span>
      </p>
    </StepCard>
  );
};
