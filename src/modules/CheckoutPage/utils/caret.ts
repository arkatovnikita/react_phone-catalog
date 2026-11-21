import { KeyboardEvent } from 'react';

export const isSeparator = (char?: string) =>
  char !== undefined && /\D/.test(char);

export const getDigits = (text: string) => text.replace(/\D/g, '');

export const getCaretAfterDigits = (
  text: string,
  digitCount: number,
  skipSeparators = false,
) => {
  let position = 0;
  let seen = 0;

  while (position < text.length && seen < digitCount) {
    if (!isSeparator(text[position])) {
      seen += 1;
    }

    position += 1;
  }

  while (skipSeparators && isSeparator(text[position])) {
    position += 1;
  }

  return position;
};

const hasModifier = (event: KeyboardEvent<HTMLInputElement>) =>
  event.shiftKey || event.altKey || event.ctrlKey || event.metaKey;

export const moveCaretOverSeparator = (
  event: KeyboardEvent<HTMLInputElement>,
) => {
  const input = event.currentTarget;
  const { value, selectionStart, selectionEnd } = input;

  if (selectionStart === null || selectionStart !== selectionEnd) {
    return false;
  }

  if (hasModifier(event)) {
    return false;
  }

  let position = selectionStart;

  if (event.key === 'ArrowLeft' && isSeparator(value[position - 1])) {
    while (position > 0 && isSeparator(value[position - 1])) {
      position -= 1;
    }
  } else if (event.key === 'ArrowRight' && isSeparator(value[position])) {
    while (position < value.length && isSeparator(value[position])) {
      position += 1;
    }
  } else {
    return false;
  }

  event.preventDefault();
  input.setSelectionRange(position, position);

  return true;
};
