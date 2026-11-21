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
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  label?: string;
  labelledBy?: string;
  id?: string;
  placeholder?: string;
  isInvalid?: boolean;
  describedBy?: string;
  onBlur?: () => void;
  className?: string;
  variant?: 'pill' | 'field';
};

const TYPE_AHEAD_RESET = 700;

export const Select = ({
  value,
  options,
  onChange,
  label,
  labelledBy,
  id,
  placeholder = '',
  isInvalid = false,
  describedBy,
  onBlur,
  className,
  variant = 'pill',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef('');
  const typedTimerRef = useRef(0);
  const uid = useId();
  const labelId = labelledBy ?? `${uid}-label`;
  const listId = `${uid}-list`;

  const selectedIndex = options.findIndex(option => option.value === value);
  const selectedOption = options[selectedIndex];

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

  useEffect(() => {
    if (isOpen) {
      document
        .getElementById(`${listId}-${activeIndex}`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }, [isOpen, activeIndex, listId]);

  useEffect(() => () => window.clearTimeout(typedTimerRef.current), []);

  const open = () => {
    setActiveIndex(Math.max(selectedIndex, 0));
    setIsOpen(true);
  };

  const choose = (index: number) => {
    onChange(options[index].value);
    setIsOpen(false);
  };

  const findByTyping = (key: string) => {
    window.clearTimeout(typedTimerRef.current);
    typedRef.current += key.toLowerCase();
    typedTimerRef.current = window.setTimeout(() => {
      typedRef.current = '';
    }, TYPE_AHEAD_RESET);

    const index = options.findIndex(option =>
      option.label.toLowerCase().startsWith(typedRef.current),
    );

    if (index === -1) {
      return;
    }

    if (isOpen) {
      setActiveIndex(index);
    } else {
      onChange(options[index].value);
    }
  };

  const moveActive = (index: number) => {
    if (isOpen) {
      setActiveIndex(index);
    } else {
      open();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const isTyping =
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      (event.key !== ' ' || typedRef.current !== '');

    if (isTyping) {
      event.preventDefault();
      findByTyping(event.key);

      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();

        const step = event.key === 'ArrowDown' ? 1 : -1;

        moveActive((activeIndex + step + options.length) % options.length);

        return;
      }

      case 'Home':
      case 'End':
        event.preventDefault();
        moveActive(event.key === 'Home' ? 0 : options.length - 1);

        return;

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
      {label && (
        <span className={styles.label} id={labelId}>
          {label}
        </span>
      )}

      <button
        id={id}
        type="button"
        className={classNames(styles.trigger, {
          [styles.triggerField]: variant === 'field',
          [styles.triggerOpen]: isOpen,
          [styles.triggerInvalid]: isInvalid,
        })}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${labelId} ${id ?? ''}`.trim()}
        aria-controls={listId}
        aria-activedescendant={isOpen ? `${listId}-${activeIndex}` : undefined}
        aria-invalid={isInvalid || undefined}
        aria-describedby={describedBy}
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
      >
        <span
          className={classNames(styles.value, {
            [styles.placeholder]: !selectedOption,
          })}
        >
          {selectedOption?.label ?? placeholder}
        </span>
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
