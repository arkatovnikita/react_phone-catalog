import { ChangeEvent, KeyboardEvent, useRef } from 'react';
import classNames from 'classnames';
import { FieldBinding } from '../../hooks/useForm';
import { getInputProps } from '../Field';
import {
  getCaretAfterDigits,
  getDigits,
  isSeparator,
  moveCaretOverSeparator,
} from '../../utils/caret';

type Props = FieldBinding & {
  format: (digits: string) => string;
  toDigits: (text: string) => string;
  placeholder: string;
  autoComplete?: string;
  className?: string;
};

export const MaskedInput = ({
  id,
  value,
  error,
  onChange,
  onBlur,
  format,
  toDigits,
  placeholder,
  autoComplete = 'off',
  className,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputProps = getInputProps(id, error);

  const applyDigits = (
    digits: string,
    digitsBeforeCaret: number,
    isAfterSeparator = false,
  ) => {
    const input = inputRef.current;
    const text = format(digits);

    if (input) {
      const caret = getCaretAfterDigits(
        text,
        Math.min(digitsBeforeCaret, digits.length),
        isAfterSeparator,
      );

      input.value = text;
      input.setSelectionRange(caret, caret);
    }

    onChange(digits);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    const head = text.slice(0, event.target.selectionStart ?? text.length);
    const allDigits = getDigits(text);
    const digits = toDigits(text);
    const removedFromStart = allDigits.startsWith(digits)
      ? 0
      : allDigits.length - digits.length;
    const digitsBeforeCaret = getDigits(head).length - removedFromStart;

    applyDigits(digits, Math.max(digitsBeforeCaret, 0), /\D$/.test(head));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (moveCaretOverSeparator(event)) {
      return;
    }

    const { selectionStart, selectionEnd, value: text } = event.currentTarget;

    if (selectionStart === null || selectionStart !== selectionEnd) {
      return;
    }

    const digits = getDigits(text);
    const before = getDigits(text.slice(0, selectionStart)).length;
    const isBackspace =
      event.key === 'Backspace' && isSeparator(text[selectionStart - 1]);
    const isDelete =
      event.key === 'Delete' && isSeparator(text[selectionStart]);

    if (isBackspace) {
      event.preventDefault();

      if (before > 0) {
        applyDigits(
          digits.slice(0, before - 1) + digits.slice(before),
          before - 1,
        );
      }
    }

    if (isDelete) {
      event.preventDefault();

      if (before < digits.length) {
        applyDigits(digits.slice(0, before) + digits.slice(before + 1), before);
      }
    }
  };

  return (
    <input
      {...inputProps}
      ref={inputRef}
      className={classNames(inputProps.className, className)}
      type="text"
      inputMode="numeric"
      autoComplete={autoComplete}
      placeholder={placeholder}
      value={format(value)}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
    />
  );
};
