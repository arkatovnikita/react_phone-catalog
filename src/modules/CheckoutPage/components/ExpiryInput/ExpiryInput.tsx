import { ChangeEvent, useEffect, useRef } from 'react';
import { FieldBinding } from '../../hooks/useForm';
import { getInputProps } from '../Field';
import { getDigits, moveCaretOverSeparator } from '../../utils/caret';
import {
  deleteExpiryBackward,
  deleteExpiryForward,
  formatExpiry,
  insertExpiryDigit,
  parseExpiry,
  replaceExpiryText,
  serializeExpiry,
} from '../../utils/expiry';

const getEdit = (input: HTMLInputElement, event: InputEvent, value: string) => {
  const text = input.value;
  const start = input.selectionStart ?? text.length;
  const end = input.selectionEnd ?? start;
  const type = event.inputType;
  const expiry = parseExpiry(value);
  const isPaste = type.startsWith('insertFrom');

  if (start !== end || isPaste) {
    const pasted = event.dataTransfer?.getData('text/plain') ?? event.data;
    const typed = type.startsWith('insert') ? event.data : '';

    return replaceExpiryText(
      text,
      start,
      end,
      (isPaste ? pasted : typed) ?? '',
    );
  }

  if (type.startsWith('insert')) {
    return getDigits(event.data ?? '')
      .split('')
      .reduce(
        (edit, digit) => insertExpiryDigit(edit.expiry, edit.caret, digit),
        { expiry, caret: start },
      );
  }

  if (type.includes('Backward')) {
    return deleteExpiryBackward(expiry, start);
  }

  if (type.includes('Forward')) {
    return deleteExpiryForward(expiry, start);
  }

  return { expiry, caret: start };
};

export const ExpiryInput = ({
  id,
  value,
  error,
  onChange,
  onBlur,
}: FieldBinding) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const latest = useRef({ value, onChange });

  latest.current = { value, onChange };

  useEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return undefined;
    }

    const handleBeforeInput = (event: InputEvent) => {
      const isLineBreak = /LineBreak|Paragraph/.test(event.inputType);

      if (!event.cancelable || isLineBreak) {
        return;
      }

      event.preventDefault();

      const edit = getEdit(input, event, latest.current.value);

      input.value = formatExpiry(edit.expiry);
      input.setSelectionRange(edit.caret, edit.caret);
      latest.current.onChange(serializeExpiry(edit.expiry));
    };

    input.addEventListener('beforeinput', handleBeforeInput);

    return () => input.removeEventListener('beforeinput', handleBeforeInput);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const digits = getDigits(event.target.value).slice(0, 4);

    onChange(
      serializeExpiry({ month: digits.slice(0, 2), year: digits.slice(2) }),
    );
  };

  return (
    <input
      {...getInputProps(id, error)}
      ref={inputRef}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="MM / YY"
      value={formatExpiry(parseExpiry(value))}
      onChange={handleChange}
      onKeyDown={moveCaretOverSeparator}
      onBlur={onBlur}
    />
  );
};
