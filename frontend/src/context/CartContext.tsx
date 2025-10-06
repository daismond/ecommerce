import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import type { Cart } from '../types/cart';
import apiClient from '../services/api';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (variantId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getCartId = (): string | null => localStorage.getItem('cart_id');
  const setCartId = (id: string) => localStorage.setItem('cart_id', id);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartId = getCartId();
      const headers = cartId ? { 'X-Cart-ID': cartId } : {};
      const response = await apiClient.get<Cart>('/cart/', { headers });
      setCart(response.data);
      if (response.headers['x-cart-id']) {
        setCartId(response.headers['x-cart-id']);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (variantId: string, quantity: number) => {
    try {
      const cartId = getCartId();
      const headers = cartId ? { 'X-Cart-ID': cartId } : {};
      const response = await apiClient.post<Cart>(
        '/cart/items',
        { product_variant_id: variantId, quantity },
        { headers }
      );
      setCart(response.data);
      if (response.headers['x-cart-id']) {
        setCartId(response.headers['x-cart-id']);
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const cartId = getCartId();
      const headers = cartId ? { 'X-Cart-ID': cartId } : {};
      const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`, { headers });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, cartItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};