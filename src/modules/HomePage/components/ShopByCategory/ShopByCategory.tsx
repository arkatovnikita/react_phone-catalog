import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ShopByCategory.module.scss';
import { Category } from '../../../shared/types/Category';
import { Product } from '../../../shared/types/Product';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Props = {
  products: Product[];
};

const CATEGORIES: { category: Category; title: string }[] = [
  { category: 'phones', title: 'Phones' },
  { category: 'tablets', title: 'Tablets' },
  { category: 'accessories', title: 'Accessories' },
];

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

            <p className={styles.count}>{count} models</p>

            <span className={styles.shop}>
              Shop {title.toLowerCase()}
              <ArrowRightIcon />
            </span>

            <img
              src={`${import.meta.env.BASE_URL}img/category-${category}.png`}
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
