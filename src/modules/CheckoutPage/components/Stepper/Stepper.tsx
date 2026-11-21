import classNames from 'classnames';
import styles from './Stepper.module.scss';
import CheckIcon from '../../../../assets/icons/check.svg?react';

type Props = {
  steps: string[];
  current: number;
  onSelect: (index: number) => void;
};

export const Stepper = ({ steps, current, onSelect }: Props) => (
  <ol className={styles.stepper}>
    {steps.map((label, index) => {
      const isDone = index < current;
      const isCurrent = index === current;

      return (
        <li
          key={label}
          className={classNames(styles.step, {
            [styles.stepDone]: isDone,
            [styles.stepCurrent]: isCurrent,
          })}
          aria-current={isCurrent ? 'step' : undefined}
        >
          {index > 0 && (
            <span
              className={classNames(styles.line, {
                [styles.lineDone]: index <= current,
              })}
              aria-hidden="true"
            />
          )}

          <button
            type="button"
            className={styles.button}
            disabled={!isDone}
            onClick={() => onSelect(index)}
          >
            <span className={styles.number}>
              {isDone ? <CheckIcon aria-hidden="true" /> : index + 1}
            </span>
            <span className={styles.label}>
              {label}
              {isDone && <span className="visually-hidden"> (done)</span>}
            </span>
          </button>
        </li>
      );
    })}
  </ol>
);
