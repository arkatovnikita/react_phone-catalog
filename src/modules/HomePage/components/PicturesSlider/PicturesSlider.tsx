import { TouchEvent, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './PicturesSlider.module.scss';
import { Product } from '../../../shared/types/Product';
import ArrowLeftIcon from '../../../../assets/icons/arrow-left.svg?react';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Props = {
  products: Product[];
};

const BANNERS = [
  {
    namespaceId: 'iphone-18-pro',
    title: 'iPhone 18 Pro',
    text: 'Variable aperture camera. A20 Pro. Now in Burgundy.',
    image: 'img/products/iphone-18-pro/burgundy-0.webp',
    buyLink: '/product/iphone-18-pro-256gb-burgundy',
    learnLink: '/iphone',
    tint: 'iphone',
  },
  {
    namespaceId: 'macbook-pro-14',
    title: 'MacBook Pro',
    text: 'M6 and M5 Pro. Up to 24 hours of battery life.',
    image: 'img/products/macbook-pro-14-m5-pro/spaceblack-0.webp',
    buyLink: '/product/macbook-pro-14-1tb-spaceblack',
    learnLink: '/mac',
    tint: 'mac',
  },
  {
    namespaceId: 'apple-watch-ultra-4',
    title: 'Apple Watch Ultra 4',
    text: 'Up to 50 hours of battery. Built for adventure.',
    image: 'img/products/apple-watch-ultra-4/natural-0.webp',
    buyLink: '/product/apple-watch-ultra-4-49mm-natural',
    learnLink: '/watch',
    tint: 'watch',
  },
];

const SLIDE_DELAY = 5000;
const SWIPE_DISTANCE = 50;

export const PicturesSlider = ({ products }: Props) => {
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

  const getStartPrice = (namespaceId: string) =>
    products.find(product => product.namespaceId === namespaceId)?.price;

  return (
    <section className={styles.slider} aria-label="Featured products">
      <div className={styles.main}>
        <button
          type="button"
          className={classNames(styles.arrow, styles.arrowPrev)}
          aria-label="Previous slide"
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
            {BANNERS.map((banner, index) => {
              const isActive = index === activeIndex;
              const price = getStartPrice(banner.namespaceId);
              const tabIndex = isActive ? 0 : -1;

              return (
                <div
                  key={banner.namespaceId}
                  className={classNames(styles.slide, styles[banner.tint])}
                  aria-hidden={!isActive}
                >
                  <div className={styles.content}>
                    <p className={styles.eyebrow}>New</p>

                    <h2 className={styles.title}>{banner.title}</h2>

                    <p className={styles.text}>{banner.text}</p>

                    {price && <p className={styles.price}>From ${price}</p>}

                    <div className={styles.actions}>
                      <Link
                        to={banner.buyLink}
                        className={styles.buy}
                        tabIndex={tabIndex}
                      >
                        Buy
                      </Link>

                      <Link
                        to={banner.learnLink}
                        className={styles.learn}
                        tabIndex={tabIndex}
                      >
                        Learn more
                      </Link>
                    </div>
                  </div>

                  <img
                    src={`${import.meta.env.BASE_URL}${banner.image}`}
                    alt={banner.title}
                    className={styles.image}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className={classNames(styles.arrow, styles.arrowNext)}
          aria-label="Next slide"
          onClick={showNext}
        >
          <ArrowRightIcon />
        </button>
      </div>

      <div className={styles.dashes}>
        {BANNERS.map(({ namespaceId }, index) => (
          <button
            key={namespaceId}
            type="button"
            className={classNames(styles.dash, {
              [styles.dashActive]: index === activeIndex,
            })}
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};
