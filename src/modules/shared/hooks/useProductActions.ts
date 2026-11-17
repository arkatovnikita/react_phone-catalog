import { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useToast } from '../context/ToastContext';

export const useProductActions = (product: Product) => {
  const { addToCart, isInCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { showToast } = useToast();

  const inCart = isInCart(product.itemId);
  const favorite = isFavorite(product.itemId);

  const handleAddToCart = () => {
    if (inCart) {
      return;
    }

    addToCart(product);
    showToast(`${product.name} added to cart`, {
      label: 'View cart',
      to: '/cart',
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product);

    if (favorite) {
      showToast('Removed from favorites');
    } else {
      showToast('Added to favorites', { label: 'View', to: '/favorites' });
    }
  };

  return { inCart, favorite, handleAddToCart, handleToggleFavorite };
};
