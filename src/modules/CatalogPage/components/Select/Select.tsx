import { KeyboardEvent, useEffect, useId, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './Select.module.scss';
import ArrowDownIcon from '../../../../assets/icons/arrow-down.svg?react';
import CheckIcon from '../../../../assets/icons/check.svg?react';

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
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const id = useId();
  const labelId = `${id}-label`;
  const listId = `${id}-list`;

  const selectedIndex = Math.max(
    0,
    options.findIndex(option => option.value === value),
  );

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const open = () => {
    setActiveIndex(selectedIndex);
    setIsOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();

        if (!isOpen) {
          open();

          return;
        }

        const step = event.key === 'ArrowDown' ? 1 : -1;

        setActiveIndex(
          index => (index + step + options.length) % options.length,
        );

        return;
      }

      case 'Enter':
      case ' ':
        event.preventDefault();

        if (isOpen) {
          choose(activeIndex);
        } else {
          open();
        }

        return;

      case 'Escape':
      case 'Tab':
        setIsOpen(false);

        return;

      default:
    }
  };

  return (
    <div className={classNames(styles.field, className)} ref={rootRef}>
      <span className={styles.label} id={labelId}>
        {label}
      </span>

      <button
        type="button"
        className={classNames(styles.trigger, {
          [styles.triggerOpen]: isOpen,
        })}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelId}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
      >
        <span className={styles.value}>{options[selectedIndex]?.label}</span>
        <ArrowDownIcon className={styles.icon} />
      </button>

      {isOpen && (
        <ul
          className={styles.list}
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              className={classNames(styles.option, {
                [styles.optionActive]: index === activeIndex,
                [styles.optionSelected]: index === selectedIndex,
              })}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={event => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
              {index === selectedIndex && (
                <CheckIcon className={styles.check} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
