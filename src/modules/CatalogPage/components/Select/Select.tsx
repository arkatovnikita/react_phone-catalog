import classNames from 'classnames';
import styles from './Select.module.scss';
import ArrowDownIcon from '../../../../assets/icons/arrow-down.svg?react';

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
};

export const Select = ({
  label,
  value,
  options,
  onChange,
  className,
}: Props) => (
  <label className={classNames(styles.field, className)}>
    <span className={styles.label}>{label}</span>

    <span className={styles.wrapper}>
      <select
        className={styles.select}
        value={value}
        onChange={event => onChange(event.target.value)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ArrowDownIcon className={styles.icon} />
    </span>
  </label>
);
