import { ChangeEvent, FormEvent, useId, useState } from 'react';
import classNames from 'classnames';
import styles from './Filters.module.scss';
import { CatalogFilters, NEW_YEAR } from '../../utils/filters';

type OptionCount = {
  value: string;
  count: number;
};

type Props = {
  filters: CatalogFilters;
  priceRange: { min: number; max: number };
  optionLabel?: string;
  options: OptionCount[];
  saleCount: number;
  newCount: number;
  onPriceChange: (min: number | null, max: number | null) => void;
  onToggleOption: (option: string) => void;
  onToggleSale: () => void;
  onToggleNew: () => void;
};

const toPrice = (value: string) => (value ? Number(value) : null);

const onlyDigits = (event: ChangeEvent<HTMLInputElement>) =>
  event.target.value.replace(/\D/g, '');

type PriceProps = Pick<Props, 'filters' | 'priceRange' | 'onPriceChange'>;

const PriceFilter = ({ filters, priceRange, onPriceChange }: PriceProps) => {
  const [min, setMin] = useState(filters.minPrice?.toString() ?? '');
  const [max, setMax] = useState(filters.maxPrice?.toString() ?? '');

  const apply = () => {
    const nextMin = toPrice(min);
    const nextMax = toPrice(max);

    if (nextMin !== filters.minPrice || nextMax !== filters.maxPrice) {
      onPriceChange(nextMin, nextMax);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    apply();
  };

  return (
    <form className={styles.price} onSubmit={handleSubmit}>
      <label className={styles.priceField}>
        <span className={styles.currency}>$</span>
        <input
          className={styles.priceInput}
          inputMode="numeric"
          placeholder={String(priceRange.min)}
          aria-label="Minimum price"
          value={min}
          onChange={event => setMin(onlyDigits(event))}
          onBlur={apply}
        />
      </label>

      <span className={styles.dash} aria-hidden="true">
        –
      </span>

      <label className={styles.priceField}>
        <span className={styles.currency}>$</span>
        <input
          className={styles.priceInput}
          inputMode="numeric"
          placeholder={String(priceRange.max)}
          aria-label="Maximum price"
          value={max}
          onChange={event => setMax(onlyDigits(event))}
          onBlur={apply}
        />
      </label>

      <button type="submit" className="visually-hidden">
        Apply price
      </button>
    </form>
  );
};

type ToggleProps = {
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
};

const Toggle = ({ label, count, checked, onToggle }: ToggleProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    className={styles.toggle}
    disabled={count === 0 && !checked}
    onClick={onToggle}
  >
    <span>
      {label} <span className={styles.count}>{count}</span>
    </span>

    <span
      className={classNames(styles.switch, { [styles.switchOn]: checked })}
      aria-hidden="true"
    />
  </button>
);

export const Filters = ({
  filters,
  priceRange,
  optionLabel,
  options,
  saleCount,
  newCount,
  onPriceChange,
  onToggleOption,
  onToggleSale,
  onToggleNew,
}: Props) => {
  const id = useId();
  const priceTitleId = `${id}-price`;
  const optionsTitleId = `${id}-options`;

  return (
    <div className={styles.filters}>
      <div className={styles.group} role="group" aria-labelledby={priceTitleId}>
        <p id={priceTitleId} className={styles.title}>
          Price
        </p>

        <PriceFilter
          key={`${filters.minPrice}-${filters.maxPrice}`}
          filters={filters}
          priceRange={priceRange}
          onPriceChange={onPriceChange}
        />
      </div>

      {optionLabel && options.length > 1 && (
        <div
          className={styles.group}
          role="group"
          aria-labelledby={optionsTitleId}
        >
          <p id={optionsTitleId} className={styles.title}>
            {optionLabel}
          </p>

          <div className={styles.chips}>
            {options.map(({ value, count }) => {
              const isSelected = filters.options.includes(value);

              return (
                <button
                  key={value}
                  type="button"
                  className={classNames(styles.chip, {
                    [styles.chipSelected]: isSelected,
                  })}
                  aria-pressed={isSelected}
                  disabled={count === 0 && !isSelected}
                  onClick={() => onToggleOption(value)}
                >
                  {value}
                  <span className={styles.count}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className={styles.group}>
        <Toggle
          label="On sale"
          count={saleCount}
          checked={filters.sale}
          onToggle={onToggleSale}
        />

        <Toggle
          label={`New in ${NEW_YEAR}`}
          count={newCount}
          checked={filters.isNew}
          onToggle={onToggleNew}
        />
      </div>
    </div>
  );
};
