import { InputHTMLAttributes, ReactNode } from 'react';
import classNames from 'classnames';
import styles from './Field.module.scss';
import { FieldBinding } from '../../hooks/useForm';
import { Select } from '../../../shared/components/Select';
import { useMediaQuery } from '../../../shared/hooks/useMediaQuery';
import ArrowDownIcon from '../../../../assets/icons/arrow-down.svg?react';

const MOUSE_QUERY = '(hover: hover) and (pointer: fine)';

export const getInputProps = (id: string, error: string) => ({
  id,
  className: classNames(styles.input, { [styles.inputError]: error }),
  'aria-invalid': Boolean(error),
  'aria-describedby': error ? `${id}-error` : undefined,
});

type FieldProps = {
  id: string;
  label: string;
  error: string;
  isOptional?: boolean;
  isWide?: boolean;
  isCompact?: boolean;
  hint?: ReactNode;
  children: ReactNode;
};

export const Field = ({
  id,
  label,
  error,
  isOptional = false,
  isWide = false,
  isCompact = false,
  hint = null,
  children,
}: FieldProps) => (
  <div
    className={classNames(styles.field, {
      [styles.wide]: isWide,
      [styles.compact]: isCompact,
    })}
  >
    <label htmlFor={id} id={`${id}-label`} className={styles.label}>
      {label}
      {isOptional && <span className={styles.optional}> (optional)</span>}
    </label>

    {children}

    {error && (
      <p id={`${id}-error`} className={styles.error}>
        {error}
      </p>
    )}

    {!error && hint && (
      <p className={styles.hint} aria-live="polite">
        {hint}
      </p>
    )}
  </div>
);

type InputAttribute =
  | 'type'
  | 'inputMode'
  | 'autoComplete'
  | 'placeholder'
  | 'maxLength';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

type InputAttributes = Pick<InputProps, InputAttribute>;

type LabelProps = {
  label: string;
  isOptional?: boolean;
  isWide?: boolean;
  isCompact?: boolean;
  hint?: ReactNode;
};

type TextFieldProps = FieldBinding & InputAttributes & LabelProps;

export const TextField = ({
  id,
  value,
  error,
  onChange,
  onBlur,
  label,
  isOptional,
  isWide,
  isCompact,
  hint,
  type = 'text',
  ...attributes
}: TextFieldProps) => (
  <Field
    id={id}
    label={label}
    error={error}
    isOptional={isOptional}
    isWide={isWide}
    isCompact={isCompact}
    hint={hint}
  >
    <input
      {...getInputProps(id, error)}
      {...attributes}
      type={type}
      value={value}
      onChange={event => onChange(event.target.value)}
      onBlur={onBlur}
    />
  </Field>
);

type Option = {
  value: string;
  label: string;
};

type SelectOwnProps = {
  options: Option[];
  placeholder: string;
  autoComplete?: string;
};

type SelectLabelProps = Pick<LabelProps, 'label' | 'isWide' | 'isCompact'>;

type SelectFieldProps = FieldBinding & SelectLabelProps & SelectOwnProps;

export const SelectField = ({
  id,
  value,
  error,
  onChange,
  onBlur,
  label,
  isWide,
  isCompact,
  options,
  placeholder,
  autoComplete,
}: SelectFieldProps) => {
  const inputProps = getInputProps(id, error);
  const hasMouse = useMediaQuery(MOUSE_QUERY);

  return (
    <Field
      id={id}
      label={label}
      error={error}
      isWide={isWide}
      isCompact={isCompact}
    >
      {hasMouse ? (
        <Select
          id={id}
          labelledBy={`${id}-label`}
          value={value}
          options={options}
          placeholder={placeholder}
          isInvalid={Boolean(error)}
          describedBy={inputProps['aria-describedby']}
          variant="field"
          onChange={onChange}
          onBlur={onBlur}
        />
      ) : (
        <div className={styles.selectWrapper}>
          <select
            {...inputProps}
            className={classNames(inputProps.className, styles.select, {
              [styles.selectEmpty]: !value,
            })}
            value={value}
            autoComplete={autoComplete}
            onChange={event => onChange(event.target.value)}
            onBlur={onBlur}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowDownIcon className={styles.selectIcon} aria-hidden="true" />
        </div>
      )}
    </Field>
  );
};

type SuggestionProps = {
  value: string;
  onApply: () => void;
};

export const Suggestion = ({ value, onApply }: SuggestionProps) => (
  <>
    Did you mean{' '}
    <button type="button" className={styles.suggestion} onClick={onApply}>
      {value}
    </button>
    ?
  </>
);

type FieldGroupProps = {
  children: ReactNode;
};

export const FieldGroup = ({ children }: FieldGroupProps) => (
  <div className={styles.group}>{children}</div>
);
