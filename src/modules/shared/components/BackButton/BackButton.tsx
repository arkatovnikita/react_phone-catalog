import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.scss';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button type="button" className={styles.back} onClick={() => navigate(-1)}>
      <ArrowLeftIcon />
      Back
    </button>
  );
};
