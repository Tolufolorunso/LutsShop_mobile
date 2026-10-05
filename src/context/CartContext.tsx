import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, CartContextType, productToCartItem } from '@/types/cart';
import { Product } from '@/types/product';

const STORAGE_KEY = '@lutshop_mobile_cart';
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore cached cart from AsyncStorage on startup
  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((cached) => {
        if (!isMounted || !cached) return;
        try {
          const parsed: CartItem[] = JSON.parse(cached);
          if (!Array.isArray(parsed)) return;
          // Keep items added before hydration finished instead of clobbering them
          setItems((prev) => (prev.length > 0 ? prev : parsed));
        } catch {
          // Ignore corrupted cached JSON
        }
      })
      .catch((err) => {
        console.warn('Failed to load cart from storage', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Write-through persistence: mirror every committed cart state to AsyncStorage
  useEffect(() => {
    if (isLoading) return;

    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch((err) => {
      console.warn('Error saving cart to storage:', err);
    });
  }, [items, isLoading]);

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      // Duplicate guard: each LUT pack is a one-time purchase, quantity is always 1
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, productToCartItem(product)];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (productId: string) => items.some((item) => item.id === productId),
    [items]
  );

  const itemCount = items.length;
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        removeItem,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
