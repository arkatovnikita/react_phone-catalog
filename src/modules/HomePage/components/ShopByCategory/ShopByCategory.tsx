import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ShopByCategory.module.scss';
import { Category } from '../../../shared/types/Category';
import { Product } from '../../../shared/types/Product';
import { CATEGORIES } from '../../../shared/constants/categories';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Props = {
  products: Product[];
};

const COVERS: Record<Category, string> = {
  iphone: 'img/products/iphone-18-pro/burgundy-0.webp',
  ipad: 'img/products/ipad-air-13/purple-0.webp',
  mac: 'img/products/macbook-air-15/skyblue-0.webp',
  watch: 'img/products/apple-watch-ultra-4/natural-0.webp',
  airpods: 'img/products/airpods-max/orange-0.webp',
  accessories: 'img/products/airtag-4-pack/default-0.webp',
};

export const ShopByCategory = ({ products }: Props) => (
  <section>
    <h2 className={styles.title}>Shop by category</h2>

    <div className={styles.grid}>
      {CATEGORIES.map(({ category, title }) => {
        const count = products.filter(
          product => product.category === category,
        ).length;

        return (
          <Link
            key={category}
            to={`/${category}`}
            className={classNames(styles.tile, styles[category])}
          >
            <h3 className={styles.name}>{title}</h3>

            <p className={styles.count}>
              {count} {count === 1 ? 'model' : 'models'}
            </p>

            <span className={styles.shop}>
              Shop {title}
              <ArrowRightIcon />
            </span>

            <img
              src={`${import.meta.env.BASE_URL}${COVERS[category]}`}
              alt=""
              className={styles.image}
              loading="lazy"
            />
          </Link>
        );
      })}
    </div>
  </section>
);
