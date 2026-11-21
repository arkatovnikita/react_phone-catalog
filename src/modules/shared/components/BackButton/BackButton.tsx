import { Link, useNavigate } from 'react-router-dom';
import styles from './BackButton.module.scss';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';

type Props = {
  to?: string;
  label?: string;
};

export const BackButton = ({ to, label = 'Back' }: Props) => {
  const navigate = useNavigate();

  if (to) {
    return (
      <Link to={to} className={styles.back}>
        <ArrowLeftIcon />
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={styles.back} onClick={() => navigate(-1)}>
      <ArrowLeftIcon />
      {label}
    </button>
  );
};
