import styles from './ProductReviews.module.scss';
import { Review } from '../../../shared/types/Review';
import { Rating } from '../../../shared/components/Rating';

type Props = {
  rating: number;
  count: number;
  reviews: Review[];
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

export const ProductReviews = ({ rating, count, reviews }: Props) => (
  <section className={styles.reviews}>
    <div className={styles.header}>
      <h2 className={styles.title}>Reviews</h2>

      <Rating rating={rating} count={count} />
    </div>

    <ul className={styles.list}>
      {reviews.map(review => (
        <li key={review.title} className={styles.review}>
          <Rating rating={review.rating} size="small" />

          <h3 className={styles.reviewTitle}>{review.title}</h3>

          <p className={styles.text}>{review.text}</p>

          <p className={styles.meta}>
            {review.author} · {formatDate(review.date)}
          </p>
        </li>
      ))}
    </ul>
  </section>
);
