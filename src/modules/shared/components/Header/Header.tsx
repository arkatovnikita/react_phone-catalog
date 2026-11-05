import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Header.module.scss';
import { navItems } from '../../constants/navItems';
import logo from '../../../../assets/images/logo.svg';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import CartIcon from '../../../../assets/icons/cart.svg?react';
import MenuIcon from '../../../../assets/icons/menu.svg?react';
import CloseIcon from '../../../../assets/icons/close.svg?react';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.navLink, { [styles.active]: isActive });

const getIconLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.iconLink, { [styles.active]: isActive });

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <img src={logo} alt="Nice Gadgets" />
      </Link>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map(({ title, path }) => (
            <li key={path}>
              <NavLink to={path} className={getNavLinkClass}>
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.actions}>
        <NavLink
          to="/favorites"
          className={getIconLinkClass}
          aria-label="Favorites"
        >
          <HeartIcon />
        </NavLink>

        <NavLink to="/cart" className={getIconLinkClass} aria-label="Cart">
          <CartIcon />
        </NavLink>
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>
    </header>
  );
};
