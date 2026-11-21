import { CARD_NUMBER_LENGTH, getCardBrand, passesLuhnCheck } from './card';
import { parseExpiry } from './expiry';
import { PHONE_LENGTH } from './phone';
import { hasLetter, isCity, isName } from './text';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const required = (message: string) => (value: string) =>
  value.trim() ? '' : message;

export const validateName = (emptyMessage: string) => (value: string) => {
  if (!value.trim()) {
    return emptyMessage;
  }

  return isName(value) ? '' : 'Use letters only';
};

export const validateEmail = (value: string) => {
  if (!value.trim()) {
    return 'Enter your email';
  }

  return EMAIL_PATTERN.test(value.trim())
    ? ''
    : 'Enter a valid email, like name@example.com';
};

export const validatePhone = (digits: string) => {
  if (!digits) {
    return 'Enter your phone number';
  }

  if (digits.length < PHONE_LENGTH) {
    return 'Enter a 10-digit phone number';
  }

  return /^[2-9]\d{2}[2-9]/.test(digits) ? '' : 'Enter a valid US phone number';
};

export const validateAddress = (value: string) => {
  if (!value.trim()) {
    return 'Enter your street address';
  }

  return /\d/.test(value) && hasLetter(value)
    ? ''
    : 'Enter a full street address, like 221 Market Street';
};

export const validateCity = (value: string) => {
  if (!value.trim()) {
    return 'Enter your city';
  }

  return isCity(value) ? '' : 'Use letters only';
};

export const validateZip = (value: string) => {
  if (!value) {
    return 'Enter your ZIP code';
  }

  return /^\d{5}$/.test(value) ? '' : 'Enter a 5-digit ZIP code';
};

export const validateCardNumber = (digits: string) => {
  if (!digits) {
    return 'Enter your card number';
  }

  if (digits.length < CARD_NUMBER_LENGTH || !passesLuhnCheck(digits)) {
    return 'Card number is not valid';
  }

  return getCardBrand(digits) ? '' : 'Only Visa and Mastercard are accepted';
};

export const validateExpiry = (value: string, now = new Date()) => {
  const { month, year } = parseExpiry(value);

  if (!month && !year) {
    return 'Enter the expiry date';
  }

  if (month.length < 2 || year.length < 2) {
    return 'Enter the full date, like 08 / 29';
  }

  const monthNumber = Number(month);

  if (monthNumber < 1 || monthNumber > 12) {
    return 'Enter a valid month';
  }

  const firstDayAfterExpiry = new Date(2000 + Number(year), monthNumber, 1);

  return firstDayAfterExpiry > now ? '' : 'This card has expired';
};

export const validateCvc = (value: string) => {
  if (!value) {
    return 'Enter the CVC';
  }

  return /^\d{3}$/.test(value) ? '' : 'Enter the 3-digit CVC';
};
