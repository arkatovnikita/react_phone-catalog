import { createContext, ReactNode, useContext, useMemo } from 'react';
import { CartItem } from '../types/CartItem';
import { Product } from '../types/Product';
import { useLocalStorage } from '../hooks/useLocalStorage';

type CartContextValue = {
  cartItems: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  changeQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

type Props = {
  children: ReactNode;
};

export const CartProvider = ({ children }: Props) => {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);

  const value = useMemo(() => {
    const addToCart = (product: Product) => {
      setCartItems(items =>
        items.some(item => item.id === product.itemId)
          ? items
          : [...items, { id: product.itemId, quantity: 1, product }],
      );
    };

    const removeFromCart = (id: string) => {
      setCartItems(items => items.filter(item => item.id !== id));
    };

    const changeQuantity = (id: string, delta: number) => {
      setCartItems(items =>
        items.map(item =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item,
        ),
      );
    };

    const clearCart = () => {
      setCartItems([]);
    };

    const isInCart = (id: string) => cartItems.some(item => item.id === id);

    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    return {
      cartItems,
      totalQuantity,
      totalPrice,
      addToCart,
      removeFromCart,
      changeQuantity,
      clearCart,
      isInCart,
    };
  }, [cartItems, setCartItems]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};
