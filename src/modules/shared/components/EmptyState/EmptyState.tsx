import { ReactNode } from 'react';
import styles from './EmptyState.module.scss';

type Props = {
  icon?: ReactNode;
  art?: ReactNode;
  title: string;
  text: string;
  isPageTitle?: boolean;
  children?: ReactNode;
};

export const EmptyState = ({
  icon,
  art,
  title,
  text,
  isPageTitle = false,
  children,
}: Props) => {
  const Title = isPageTitle ? 'h1' : 'h2';

  return (
    <div className={styles.state}>
      {icon && (
        <div className={styles.icon} aria-hidden="true">
          {icon}
        </div>
      )}

      {art && <div className={styles.art}>{art}</div>}

      <Title className={styles.title}>{title}</Title>

      <p className={styles.text}>{text}</p>

      {children && <div className={styles.actions}>{children}</div>}
    </div>
  );
};
