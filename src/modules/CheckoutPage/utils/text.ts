const LETTER = '\\p{L}';
const NAME_SEPARATOR = "[ '’-]";

const NAME_PATTERN = new RegExp(
  `^${LETTER}+(?:${NAME_SEPARATOR}${LETTER}+)*$`,
  'u',
);

const CITY_PATTERN = new RegExp(`^${LETTER}+(?:[ .'’-]+${LETTER}+)*\\.?$`, 'u');

const HAS_LETTER = new RegExp(LETTER, 'u');

const WORD_START = new RegExp(`(?<=^|${NAME_SEPARATOR})${LETTER}`, 'gu');

export const isName = (value: string) => NAME_PATTERN.test(value.trim());

export const isCity = (value: string) => CITY_PATTERN.test(value.trim());

export const hasLetter = (value: string) => HAS_LETTER.test(value);

export const collapseSpaces = (value: string) =>
  value.trim().replace(/\s+/g, ' ');

export const capitalizeWords = (value: string) =>
  collapseSpaces(value).replace(WORD_START, letter => letter.toUpperCase());
