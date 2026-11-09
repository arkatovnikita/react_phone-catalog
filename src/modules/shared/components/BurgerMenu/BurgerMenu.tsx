import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './BurgerMenu.module.scss';
import { navItems } from '../../constants/navItems';
import HeartIcon from '../../../../assets/icons/heart.svg?react';
import CartIcon from '../../../../assets/icons/cart.svg?react';
import { IconCounter } from '../IconCounter';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';

type Props = {
  onClose: () => void;
};

const getLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.link, { [styles.active]: isActive });

const getIconLinkClass = ({ isActive }: { isActive: boolean }) =>
  classNames(styles.iconLink, { [styles.active]: isActive });

export const BurgerMenu = ({ onClose }: Props) => {
  const { totalQuantity } = useCart();
  const { favorites } = useFavorites();

  return (
    <aside className={styles.menu}>
      <nav className={styles.nav}>
        <ul className={styles.list}>
          {navItems.map(({ title, path }) => (
            <li key={path}>
              <NavLink to={path} className={getLinkClass} onClick={onClose}>
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
          onClick={onClose}
        >
          <IconCounter icon={<HeartIcon />} count={favorites.length} />
        </NavLink>

        <NavLink
          to="/cart"
          className={getIconLinkClass}
          aria-label="Cart"
          onClick={onClose}
        >
          <IconCounter icon={<CartIcon />} count={totalQuantity} />
        </NavLink>
      </div>
    </aside>
  );
};
