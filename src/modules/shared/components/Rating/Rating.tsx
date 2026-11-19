import classNames from 'classnames';
import styles from './Rating.module.scss';
import StarIcon from '../../../../assets/icons/star.svg?react';

type Props = {
  rating: number;
  count?: number;
  size?: 'small' | 'medium';
};

const STARS = [1, 2, 3, 4, 5];

export const Rating = ({ rating, count, size = 'medium' }: Props) => (
  <div
    className={classNames(styles.rating, styles[size])}
    aria-label={`Rated ${rating} out of 5`}
  >
    <span className={styles.stars} aria-hidden="true">
      {STARS.map(star => (
        <span key={star} className={styles.star}>
          <StarIcon className={styles.starEmpty} />
          <span
            className={styles.starFill}
            style={{
              width: `${Math.min(Math.max(rating - star + 1, 0), 1) * 100}%`,
            }}
          >
            <StarIcon />
          </span>
        </span>
      ))}
    </span>

    <span className={styles.value}>{rating.toFixed(1)}</span>

    {count !== undefined && (
      <span className={styles.count}>({count} reviews)</span>
    )}
  </div>
);
