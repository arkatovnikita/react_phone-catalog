import { Link } from 'react-router-dom';
import styles from './Footer.module.scss';
import logo from '../../../../assets/images/logo.svg';
import ArrowUpIcon from '../../../../assets/icons/arrow-up.svg?react';

const REPO_URL = 'https://github.com/arkatovnikita/react_phone-catalog';

const footerLinks = [
  { title: 'Github', href: REPO_URL },
  { title: 'Contacts', href: 'https://github.com/arkatovnikita' },
  { title: 'Rights', href: `${REPO_URL}/blob/master/LICENSE` },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.content}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="Nice Gadgets" />
      </Link>

      <ul className={styles.links}>
        {footerLinks.map(({ title, href }) => (
          <li key={title}>
            <a
              href={href}
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>

      <button type="button" className={styles.backToTop} onClick={scrollToTop}>
        Back to top
        <span className={styles.arrow}>
          <ArrowUpIcon />
        </span>
      </button>
    </div>
  </footer>
);
