export type CardBrand = 'visa' | 'mastercard';

export const CARD_NUMBER_LENGTH = 16;

export const CARD_BRAND_NAMES: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
};

export const getCardBrand = (digits: string): CardBrand | null => {
  if (/^4/.test(digits)) {
    return 'visa';
  }

  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'mastercard';
  }

  return null;
};

export const formatCardNumber = (digits: string) =>
  digits.replace(/(\d{4})(?=\d)/g, '$1 ');

export const passesLuhnCheck = (digits: string) => {
  const sum = digits
    .split('')
    .reverse()
    .reduce((total, char, index) => {
      let digit = Number(char);

      if (index % 2 === 1) {
        digit *= 2;

        if (digit > 9) {
          digit -= 9;
        }
      }

      return total + digit;
    }, 0);

  return sum % 10 === 0;
};
