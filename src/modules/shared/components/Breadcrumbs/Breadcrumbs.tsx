import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.scss';
import HomeIcon from '../../../../assets/icons/home.svg?react';
import ArrowRightIcon from '../../../../assets/icons/arrow-right.svg?react';

type Crumb = {
  title: string;
  path?: string;
};

type Props = {
  links: Crumb[];
};

export const Breadcrumbs = ({ links }: Props) => (
  <nav aria-label="Breadcrumbs" className={styles.breadcrumbs}>
    <ul className={styles.list}>
      <li className={styles.item}>
        <Link to="/" className={styles.home} aria-label="Home">
          <HomeIcon />
        </Link>
      </li>

      {links.map(({ title, path }) => (
        <li key={title} className={styles.item}>
          <ArrowRightIcon className={styles.separator} />

          {path ? (
            <Link to={path} className={styles.link}>
              {title}
            </Link>
          ) : (
            <span className={styles.current}>{title}</span>
          )}
        </li>
      ))}
    </ul>
  </nav>
);
