import { createContext, useState, useContext, ReactNode } from 'react';
import type { Product, ProductVariant } from '../types/product.ts';

export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

interface CartContextType {
  isCartOpen: boolean;
  toggleCart: () => void;
  cartItems: CartItem[];
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  // We'll add removeFromCart, updateQuantity etc. later
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.variant.id === variant.id
      );

      if (existingItemIndex > -1) {
        // Variant already in cart, update quantity
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        // Add new variant to cart
        return [...prevItems, { product, variant, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const value = {
    isCartOpen,
    toggleCart,
    cartItems,
    addToCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};