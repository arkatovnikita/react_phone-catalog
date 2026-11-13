import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Header.module.scss';
import { navItems } from '../../constants/navItems';
import Logo from '../../../../assets/images/logo.svg?react';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import CartIcon from '../../../../assets/icons/cart.svg?react';
import MenuIcon from '../../../../assets/icons/menu.svg?react';
import CloseIcon from '../../../../assets/icons/close.svg?react';
import SunIcon from '../../../../assets/icons/sun.svg?react';
import MoonIcon from '../../../../assets/icons/moon.svg?react';
import { BurgerMenu } from '../BurgerMenu';
import { IconCounter } from '../IconCounter';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.navLink, { [styles.active]: isActive });

const getIconLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.iconLink, { [styles.active]: isActive });

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { totalQuantity } = useCart();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.logo} aria-label="Nice Gadgets">
          <Logo />
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

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.themeButton}
            aria-label={
              theme === 'light'
                ? 'Switch to dark theme'
                : 'Switch to light theme'
            }
            onClick={toggleTheme}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>

          <div className={styles.actions}>
            <NavLink
              to="/favorites"
              className={getIconLinkClass}
              aria-label="Favorites"
            >
              <IconCounter icon={<HeartIcon />} count={favorites.length} />
            </NavLink>

            <NavLink to="/cart" className={getIconLinkClass} aria-label="Cart">
              <IconCounter icon={<CartIcon />} count={totalQuantity} />
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
        </div>
      </header>

      {isMenuOpen && <BurgerMenu onClose={closeMenu} />}
    </>
  );
};
