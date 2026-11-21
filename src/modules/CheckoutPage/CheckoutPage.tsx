import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styles from './CheckoutPage.module.scss';
import { useCart } from '../shared/context/CartContext';
import { BackButton } from '../shared/components/BackButton';
import { EmptyState } from '../shared/components/EmptyState';
import { Stepper } from './components/Stepper';
import { ContactStep } from './components/ContactStep';
import { DeliveryStep } from './components/DeliveryStep';
import { PaymentStep } from './components/PaymentStep';
import { ReviewStep } from './components/ReviewStep';
import { OrderSummary } from './components/OrderSummary';
import { OrderConfirmed } from './components/OrderConfirmed';
import { useForm } from './hooks/useForm';
import { CHECKOUT_STEPS, getDeliveryMethod, getStepIndex } from './constants';
import { ContactValues, DeliveryValues, PaymentValues } from './types';
import {
  required,
  validateAddress,
  validateCardNumber,
  validateCity,
  validateCvc,
  validateEmail,
  validateExpiry,
  validateName,
  validatePhone,
  validateZip,
} from './utils/validators';
import { capitalizeWords, collapseSpaces } from './utils/text';
import { readLastOrder, saveLastOrder } from './utils/lastOrder';
import CartIcon from '../../assets/icons/cart.svg?react';

const EMPTY_CART_TEXT =
  'Add something to your cart first, then come back to place a demo order.';

const STEP_LABELS = CHECKOUT_STEPS.map(({ label }) => label);

const PAYMENT_STEP = 2;

const createOrderNumber = () =>
  `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

export const CheckoutPage = () => {
  const { totalQuantity, finalPrice, cartItems, clearCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [hasNavigated, setHasNavigated] = useState(false);
  const isFirstStepRef = useRef(true);
  const isCardNamePrefilledRef = useRef(false);

  const contact = useForm<ContactValues>(
    { firstName: '', lastName: '', email: '', phone: '' },
    {
      validators: {
        firstName: validateName('Enter your first name'),
        lastName: validateName('Enter your last name'),
        email: validateEmail,
        phone: validatePhone,
      },
      formatters: {
        firstName: capitalizeWords,
        lastName: capitalizeWords,
        email: value => value.trim(),
      },
      storageKey: 'orchard-checkout-contact',
    },
  );

  const delivery = useForm<DeliveryValues>(
    {
      address: '',
      apartment: '',
      city: '',
      state: '',
      zip: '',
      method: 'standard',
    },
    {
      validators: {
        address: validateAddress,
        city: validateCity,
        state: required('Select your state'),
        zip: validateZip,
      },
      formatters: {
        address: capitalizeWords,
        apartment: collapseSpaces,
        city: capitalizeWords,
      },
      storageKey: 'orchard-checkout-delivery',
    },
  );

  const payment = useForm<PaymentValues>(
    { cardNumber: '', expiry: '', cvc: '', cardName: '' },
    {
      validators: {
        cardNumber: validateCardNumber,
        expiry: value => validateExpiry(value),
        cvc: validateCvc,
        cardName: validateName('Enter the name on the card'),
      },
      formatters: {
        cardName: collapseSpaces,
      },
    },
  );

  const orderNumber = searchParams.get('order');
  const order = orderNumber ? readLastOrder(orderNumber) : null;

  const requestedStep = getStepIndex(searchParams.get('step'));
  const firstInvalidStep = [contact, delivery, payment].findIndex(
    form => !form.isValid(),
  );
  const lastAllowedStep =
    firstInvalidStep === -1 ? CHECKOUT_STEPS.length - 1 : firstInvalidStep;
  const step = Math.min(requestedStep, lastAllowedStep);

  const method = getDeliveryMethod(delivery.values.method);
  const total = finalPrice + method.price;
  const { city, state, zip } = delivery.values;

  useEffect(() => {
    if (!order && step !== requestedStep) {
      setSearchParams(step ? { step: CHECKOUT_STEPS[step].key } : {}, {
        replace: true,
      });
    }
  }, [order, step, requestedStep, setSearchParams]);

  useEffect(() => {
    if (isFirstStepRef.current) {
      isFirstStepRef.current = false;

      return;
    }

    setHasNavigated(true);
  }, [step]);

  const { cardName } = payment.values;
  const fullName = `${contact.values.firstName} ${contact.values.lastName}`;
  const setPaymentValue = payment.setValue;

  useEffect(() => {
    if (step === PAYMENT_STEP && !isCardNamePrefilledRef.current) {
      isCardNamePrefilledRef.current = true;

      if (!cardName) {
        setPaymentValue('cardName', fullName);
      }
    }
  }, [step, cardName, fullName, setPaymentValue]);

  const goToStep = (index: number) => {
    setSearchParams(index ? { step: CHECKOUT_STEPS[index].key } : {});
  };

  const placeOrder = () => {
    const placedOrder = {
      number: createOrderNumber(),
      firstName: contact.values.firstName,
      itemCount: totalQuantity,
      delivery: `${method.name} · ${method.time}`,
      shipTo: `${city}, ${state} ${zip}`,
      total,
    };

    saveLastOrder(placedOrder);
    setSearchParams({ order: placedOrder.number }, { replace: true });
    clearCart();
    contact.reset();
    delivery.reset();
    payment.reset();
  };

  if (order) {
    return (
      <section className={styles.page}>
        <OrderConfirmed order={order} />
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className={styles.page}>
        <EmptyState
          icon={<CartIcon />}
          title="Your cart is empty"
          text={EMPTY_CART_TEXT}
          isPageTitle
        >
          <Link to="/" className={styles.emptyLink}>
            Continue shopping
          </Link>
        </EmptyState>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <BackButton to="/cart" label="Back to cart" />

      <h1 className={styles.title}>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.main}>
          <Stepper steps={STEP_LABELS} current={step} onSelect={goToStep} />

          {step === 0 && (
            <ContactStep
              form={contact}
              shouldFocus={hasNavigated}
              onNext={() => goToStep(1)}
            />
          )}

          {step === 1 && (
            <DeliveryStep
              form={delivery}
              shouldFocus={hasNavigated}
              onNext={() => goToStep(PAYMENT_STEP)}
              onBack={() => goToStep(0)}
            />
          )}

          {step === 2 && (
            <PaymentStep
              form={payment}
              shouldFocus={hasNavigated}
              onNext={() => goToStep(3)}
              onBack={() => goToStep(1)}
            />
          )}

          {step === 3 && (
            <ReviewStep
              contact={contact.values}
              delivery={delivery.values}
              payment={payment.values}
              total={total}
              shouldFocus={hasNavigated}
              onEdit={goToStep}
              onBack={() => goToStep(2)}
              onPlaceOrder={placeOrder}
            />
          )}
        </div>

        <OrderSummary
          deliveryName={method.name}
          deliveryPrice={method.price}
          total={total}
        />
      </div>
    </section>
  );
};
