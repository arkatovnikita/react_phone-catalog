import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Product } from '../types/Product';
import { useLocalStorage } from '../hooks/useLocalStorage';

type FavoritesContextValue = {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (itemId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export const FavoritesProvider = ({ children }: Props) => {
  const [favorites, setFavorites] = useLocalStorage<Product[]>('favorites', []);

  const value = useMemo(() => {
    const toggleFavorite = (product: Product) => {
      setFavorites(items =>
        items.some(item => item.itemId === product.itemId)
          ? items.filter(item => item.itemId !== product.itemId)
          : [...items, product],
      );
    };

    const isFavorite = (itemId: string) =>
      favorites.some(item => item.itemId === itemId);

    return { favorites, toggleFavorite, isFavorite };
  }, [favorites, setFavorites]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }

  return context;
};
