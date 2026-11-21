export const PHONE_LENGTH = 10;

export const PHONE_PREFIX = '+1';

export const formatPhone = (digits: string) => {
  if (!digits) {
    return '';
  }

  const area = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  const line = digits.slice(6);

  if (digits.length <= 3) {
    return `(${area}`;
  }

  if (digits.length <= 6) {
    return `(${area}) ${exchange}`;
  }

  return `(${area}) ${exchange}-${line}`;
};

export const toPhoneDigits = (text: string) => {
  const digits = text.replace(/\D/g, '');
  const isWithCountryCode = digits.length > PHONE_LENGTH && digits[0] === '1';

  return (isWithCountryCode ? digits.slice(1) : digits).slice(0, PHONE_LENGTH);
};

export const formatFullPhone = (digits: string) =>
  `${PHONE_PREFIX} ${formatPhone(digits)}`;
