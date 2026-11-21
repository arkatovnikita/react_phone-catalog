import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
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
import SearchIcon from '../../../../assets/icons/search.svg?react';
import { BurgerMenu } from '../BurgerMenu';
import { CartDrawer } from '../CartDrawer';
import { SearchPanel } from '../SearchPanel';
import { IconCounter } from '../IconCounter';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useTheme } from '../../context/ThemeContext';

const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.navLink, { [styles.navLinkActive]: isActive });

const getIconLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.iconButton, { [styles.iconButtonActive]: isActive });

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { pathname, search } = useLocation();
  const isCheckout = pathname === '/checkout';

  useEffect(() => {
    setIsMenuOpen(false);
    setIsCartOpen(false);
    setIsSearchOpen(false);
  }, [pathname, search]);

  const { totalQuantity } = useCart();
  const { favorites } = useFavorites();
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeCart = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const toggleSearch = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(prev => !prev);
  };

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.content}>
          <Link
            to="/"
            className={styles.logo}
            aria-label="Orchard"
            onClick={closeMenu}
          >
            <Logo />
          </Link>

          {!isCheckout && (
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
          )}

          <div
            className={classNames(styles.controls, {
              [styles.controlsEnd]: isCheckout,
            })}
          >
            {!isCheckout && (
              <button
                type="button"
                className={classNames(styles.iconButton, {
                  [styles.iconButtonActive]: isSearchOpen,
                })}
                aria-label={isSearchOpen ? 'Close search' : 'Search'}
                aria-expanded={isSearchOpen}
                onClick={toggleSearch}
              >
                <SearchIcon />
              </button>
            )}

            <button
              type="button"
              className={styles.iconButton}
              aria-label={
                theme === 'light'
                  ? 'Switch to dark theme'
                  : 'Switch to light theme'
              }
              onClick={toggleTheme}
            >
              {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>

            {!isCheckout && (
              <>
                <div className={styles.actions}>
                  <NavLink
                    to="/favorites"
                    className={getIconLinkClass}
                    aria-label="Favorites"
                  >
                    <IconCounter
                      icon={<HeartIcon />}
                      count={favorites.length}
                    />
                  </NavLink>

                  <button
                    type="button"
                    className={classNames(styles.iconButton, {
                      [styles.iconButtonActive]: pathname === '/cart',
                    })}
                    aria-label="Open cart"
                    aria-haspopup="dialog"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <IconCounter icon={<CartIcon />} count={totalQuantity} />
                  </button>
                </div>

                <button
                  type="button"
                  className={classNames(styles.iconButton, styles.menuButton)}
                  aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMenuOpen}
                  onClick={toggleMenu}
                >
                  {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {isMenuOpen && <BurgerMenu onClose={closeMenu} />}

      {isCartOpen && <CartDrawer onClose={closeCart} />}

      {isSearchOpen && <SearchPanel onClose={closeSearch} />}
    </>
  );
};
