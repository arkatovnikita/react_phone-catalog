import { useCallback, useEffect, useState } from 'react';

type Values = Record<string, string>;

type Transform = (value: string) => string;

type Options<T extends Values> = {
  validators: Partial<Record<keyof T, Transform>>;
  formatters?: Partial<Record<keyof T, Transform>>;
  storageKey?: string;
};

const readStoredValues = <T extends Values>(
  storageKey: string | undefined,
  initialValues: T,
): T => {
  if (!storageKey) {
    return initialValues;
  }

  try {
    const stored = sessionStorage.getItem(storageKey);

    return stored ? { ...initialValues, ...JSON.parse(stored) } : initialValues;
  } catch {
    return initialValues;
  }
};

export const useForm = <T extends Values>(
  initialValues: T,
  { validators, formatters = {}, storageKey }: Options<T>,
) => {
  const [values, setValues] = useState(() =>
    readStoredValues(storageKey, initialValues),
  );
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  useEffect(() => {
    if (storageKey) {
      sessionStorage.setItem(storageKey, JSON.stringify(values));
    }
  }, [storageKey, values]);

  const keys = Object.keys(initialValues) as (keyof T)[];

  const getError = (key: keyof T) => validators[key]?.(values[key]) ?? '';

  const setValue = useCallback((key: keyof T, value: string) => {
    setValues(current => ({ ...current, [key]: value }));
  }, []);

  const touch = (key: keyof T) => {
    const format = formatters[key];

    if (format) {
      setValues(current => ({ ...current, [key]: format(current[key]) }));
    }

    setTouched(current => ({ ...current, [key]: true }));
  };

  const isTouched = (key: keyof T) => Boolean(touched[key]);

  const isValid = () => keys.every(key => !getError(key));

  const validate = () => {
    setTouched(
      Object.fromEntries(keys.map(key => [key, true])) as typeof touched,
    );

    return keys.find(key => getError(key)) ?? null;
  };

  const field = (key: keyof T): FieldBinding => ({
    id: `checkout-${String(key)}`,
    value: values[key],
    error: touched[key] ? getError(key) : '',
    onChange: (value: string) => setValue(key, value),
    onBlur: () => touch(key),
  });

  const submit = (onValid: () => void) => {
    const invalidKey = validate();

    if (invalidKey) {
      document.getElementById(field(invalidKey).id)?.focus();

      return;
    }

    onValid();
  };

  const reset = () => {
    setValues(initialValues);
    setTouched({});
  };

  return { values, setValue, field, isTouched, isValid, submit, reset };
};

export type Form<T extends Values> = ReturnType<typeof useForm<T>>;

export type FieldBinding = {
  id: string;
  value: string;
  error: string;
  onChange: (value: string) => void;
  onBlur: () => void;
};
