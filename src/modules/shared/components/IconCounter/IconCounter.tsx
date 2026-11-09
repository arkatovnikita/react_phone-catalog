import { ReactNode } from 'react';
import styles from './IconCounter.module.scss';

type Props = {
  icon: ReactNode;
  count: number;
};

export const IconCounter = ({ icon, count }: Props) => (
  <span className={styles.wrapper}>
    {icon}
    {count > 0 && <span className={styles.count}>{count}</span>}
  </span>
);
