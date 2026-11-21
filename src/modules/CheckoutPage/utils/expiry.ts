import { getDigits } from './caret';

export type Expiry = {
  month: string;
  year: string;
};

type Edit = {
  expiry: Expiry;
  caret: number;
};

const SEPARATOR = ' / ';

export const parseExpiry = (value: string): Expiry => {
  const [month = '', year = ''] = value.split('/');

  return { month, year };
};

export const serializeExpiry = ({ month, year }: Expiry) =>
  month || year ? `${month}/${year}` : '';

const hasSeparator = ({ month, year }: Expiry) =>
  month.length === 2 || year.length > 0;

const getYearStart = ({ month }: Expiry) => month.length + SEPARATOR.length;

export const formatExpiry = (expiry: Expiry) =>
  hasSeparator(expiry)
    ? `${expiry.month}${SEPARATOR}${expiry.year}`
    : expiry.month;

type Part = 'month' | 'year' | 'separator';

const locate = (expiry: Expiry, caret: number): [Part, number] => {
  if (caret <= expiry.month.length) {
    return ['month', caret];
  }

  if (hasSeparator(expiry) && caret >= getYearStart(expiry)) {
    return ['year', caret - getYearStart(expiry)];
  }

  return ['separator', 0];
};

const putDigit = (text: string, index: number, digit: string) =>
  text.length < 2
    ? text.slice(0, index) + digit + text.slice(index)
    : text.slice(0, index) + digit + text.slice(index + 1);

const removeDigit = (text: string, index: number) =>
  text.slice(0, index) + text.slice(index + 1);

export const insertExpiryDigit = (
  expiry: Expiry,
  caret: number,
  digit: string,
): Edit => {
  let [part, index] = locate(expiry, caret);

  if (part === 'separator' || (part === 'month' && index === 2)) {
    part = part === 'separator' && expiry.month.length < 2 ? 'month' : 'year';
    index = part === 'month' ? expiry.month.length : 0;
  }

  if (part === 'month') {
    if (!expiry.month && digit > '1') {
      const next = { ...expiry, month: `0${digit}` };

      return { expiry: next, caret: getYearStart(next) };
    }

    const next = { ...expiry, month: putDigit(expiry.month, index, digit) };
    const isMonthDone = next.month.length === 2 && index + 1 === 2;

    return {
      expiry: next,
      caret: isMonthDone ? getYearStart(next) : index + 1,
    };
  }

  if (expiry.year.length === 2 && index >= 2) {
    return { expiry, caret: getYearStart(expiry) + 2 };
  }

  const next = { ...expiry, year: putDigit(expiry.year, index, digit) };

  return { expiry: next, caret: getYearStart(next) + index + 1 };
};

export const deleteExpiryBackward = (expiry: Expiry, caret: number): Edit => {
  const [part, index] = locate(expiry, caret);

  if (part === 'year' && index > 0) {
    const next = { ...expiry, year: removeDigit(expiry.year, index - 1) };

    return { expiry: next, caret: getYearStart(next) + index - 1 };
  }

  if (part === 'month' && index > 0) {
    const next = { ...expiry, month: removeDigit(expiry.month, index - 1) };

    return { expiry: next, caret: index - 1 };
  }

  if (part !== 'month' && expiry.month) {
    const next = { ...expiry, month: expiry.month.slice(0, -1) };

    return { expiry: next, caret: next.month.length };
  }

  return { expiry, caret };
};

export const deleteExpiryForward = (expiry: Expiry, caret: number): Edit => {
  const [part, index] = locate(expiry, caret);

  if (part === 'month' && index < expiry.month.length) {
    const next = { ...expiry, month: removeDigit(expiry.month, index) };

    return { expiry: next, caret: index };
  }

  if (part === 'year' && index < expiry.year.length) {
    const next = { ...expiry, year: removeDigit(expiry.year, index) };

    return { expiry: next, caret: getYearStart(next) + index };
  }

  if (part !== 'year' && expiry.year) {
    const next = { ...expiry, year: expiry.year.slice(1) };

    return { expiry: next, caret: next.month.length };
  }

  return { expiry, caret };
};

export const replaceExpiryText = (
  text: string,
  start: number,
  end: number,
  inserted: string,
): Edit => {
  const head = getDigits(text.slice(0, start)) + getDigits(inserted);
  const digits = (head + getDigits(text.slice(end))).slice(0, 4);
  const expiry = { month: digits.slice(0, 2), year: digits.slice(2) };
  const digitsBefore = Math.min(head.length, digits.length);
  const isInMonth = digitsBefore < 2 || (digitsBefore === 2 && !expiry.year);

  return {
    expiry,
    caret: isInMonth ? digitsBefore : getYearStart(expiry) + digitsBefore - 2,
  };
};
