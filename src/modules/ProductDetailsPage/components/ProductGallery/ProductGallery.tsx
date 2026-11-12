import { useState } from 'react';
import classNames from 'classnames';
import styles from './ProductGallery.module.scss';

type Props = {
  images: string[];
  name: string;
};

export const ProductGallery = ({ images, name }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={styles.gallery}>
      <img
        src={`${import.meta.env.BASE_URL}${images[activeIndex]}`}
        alt={name}
        className={styles.mainImage}
      />

      <ul className={styles.thumbs}>
        {images.map((image, index) => (
          <li key={image}>
            <button
              type="button"
              className={classNames(styles.thumb, {
                [styles.thumbActive]: index === activeIndex,
              })}
              aria-label={`Show image ${index + 1}`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={`${import.meta.env.BASE_URL}${image}`}
                alt=""
                className={styles.thumbImage}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
