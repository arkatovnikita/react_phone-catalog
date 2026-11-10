import { TouchEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './PicturesSlider.module.scss';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

const BANNERS = [
  { image: 'img/banner-phones.png', alt: 'Phones', link: '/phones' },
  { image: 'img/banner-tablets.png', alt: 'Tablets', link: '/tablets' },
  {
    image: 'img/banner-accessories.png',
    alt: 'Accessories',
    link: '/accessories',
  },
];

const SLIDE_DELAY = 5000;
const SWIPE_DISTANCE = 50;

export const PicturesSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);

  const showPrev = () => {
    setActiveIndex(index => (index - 1 + BANNERS.length) % BANNERS.length);
  };

  const showNext = () => {
    setActiveIndex(index => (index + 1) % BANNERS.length);
  };

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setActiveIndex(index => (index + 1) % BANNERS.length);
    }, SLIDE_DELAY);

    return () => window.clearTimeout(timerId);
  }, [activeIndex]);

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: TouchEvent) => {
    const distance = event.changedTouches[0].clientX - touchStartX.current;

    if (distance > SWIPE_DISTANCE) {
      showPrev();
    }

    if (distance < -SWIPE_DISTANCE) {
      showNext();
    }
  };

  return (
    <section className={styles.slider}>
      <div className={styles.main}>
        <button
          type="button"
          className={styles.arrow}
          aria-label="Previous picture"
          onClick={showPrev}
        >
          <ArrowLeftIcon />
        </button>

        <div
          className={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className={styles.track}
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {BANNERS.map(({ image, alt, link }) => (
              <Link key={image} to={link} className={styles.slide}>
                <img
                  src={`${import.meta.env.BASE_URL}${image}`}
                  alt={alt}
                  className={styles.image}
                />
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          className={styles.arrow}
          aria-label="Next picture"
          onClick={showNext}
        >
          <ArrowRightIcon />
        </button>
      </div>

      <div className={styles.dashes}>
        {BANNERS.map(({ image }, index) => (
          <button
            key={image}
            type="button"
            className={classNames(styles.dash, {
              [styles.dashActive]: index === activeIndex,
            })}
            aria-label={`Show picture ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};
