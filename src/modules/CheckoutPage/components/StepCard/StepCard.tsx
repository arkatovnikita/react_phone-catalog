import { FormEvent, ReactNode, useEffect, useRef } from 'react';
import styles from './StepCard.module.scss';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';

type Props = {
  title: string;
  subtitle: string;
  submitLabel: string;
  shouldFocus: boolean;
  onSubmit: () => void;
  onBack?: () => void;
  children: ReactNode;
};

export const StepCard = ({
  title,
  subtitle,
  submitLabel,
  shouldFocus,
  onSubmit,
  onBack,
  children,
}: Props) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (shouldFocus) {
      titleRef.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [shouldFocus]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <h2 ref={titleRef} className={styles.title} tabIndex={-1}>
        {title}
      </h2>
      <p className={styles.subtitle}>{subtitle}</p>

      {children}

      <div className={styles.actions}>
        {onBack && (
          <button type="button" className={styles.back} onClick={onBack}>
            <ArrowLeftIcon />
            Back
          </button>
        )}

        <button type="submit" className={styles.submit}>
          {submitLabel}
        </button>
      </div>
    </form>
  );
};
