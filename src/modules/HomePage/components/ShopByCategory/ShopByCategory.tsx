import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ShopByCategory.module.scss';
import { Category } from '../../../shared/types/Category';
import { Product } from '../../../shared/types/Product';

type Props = {
  products: Product[];
};

const CATEGORIES: { category: Category; title: string }[] = [
  { category: 'phones', title: 'Mobile phones' },
  { category: 'tablets', title: 'Tablets' },
  { category: 'accessories', title: 'Accessories' },
];

export const ShopByCategory = ({ products }: Props) => (
  <section>
    <h2 className={styles.title}>Shop by category</h2>

    <div className={styles.list}>
      {CATEGORIES.map(({ category, title }) => {
        const count = products.filter(
          product => product.category === category,
        ).length;

        return (
          <Link key={category} to={`/${category}`} className={styles.link}>
            <div className={classNames(styles.imageWrapper, styles[category])}>
              <img
                src={`${import.meta.env.BASE_URL}img/category-${category}.png`}
                alt={title}
                className={styles.image}
              />
            </div>

            <h3 className={styles.name}>{title}</h3>

            <p className={styles.count}>{count} models</p>
          </Link>
        );
      })}
    </div>
  </section>
);
