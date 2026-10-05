import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CartItem,
  CartContextType,
  CartSyncStatus,
  productToCartItem,
} from '@/types/cart';
import { Product } from '@/types/product';
import { useAuth } from '@/context/AuthContext';
import {
  addRemoteCartItem,
  clearRemoteCart,
  fetchCartProductIds,
  fetchProducts,
  removeRemoteCartItem,
} from '@/config/api';

const STORAGE_KEY = '@lutshop_mobile_cart';
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const userId = user?.id;

  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<CartSyncStatus>('idle');
  const isSyncingRef = useRef(false);
  const itemsRef = useRef<CartItem[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Restore cached cart from AsyncStorage on startup
  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((cached) => {
        if (!isMounted || !cached) return;
        try {
          const parsed: CartItem[] = JSON.parse(cached);
          if (!Array.isArray(parsed)) return;
          // Union with any items added before hydration finished
          setItems((prev) => {
            const byId = new Map(prev.map((item) => [item.id, item]));
            for (const item of parsed) {
              if (!byId.has(item.id)) byId.set(item.id, item);
            }
            return Array.from(byId.values());
          });
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

  // Write-through persistence: mirror every committed cart state. Signed out
  // with an empty cart the storage key is removed so no stale cache survives
  // an account switch; signed in, "[]" keeps the cache consistent with remote.
  useEffect(() => {
    if (isLoading) return;

    if (items.length > 0 || userId) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items)).catch((err) => {
        console.warn('Error saving cart to storage:', err);
      });
    } else {
      AsyncStorage.removeItem(STORAGE_KEY).catch((err) => {
        console.warn('Error clearing cart storage:', err);
      });
    }
  }, [items, isLoading, userId]);

  // Pull-merge-push sync engine: shared by sign-in and focus refresh
  const syncCart = useCallback(() => {
    if (!userId) return;
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;

    (async () => {
      setSyncStatus('syncing');
      try {
        const [remoteIds, catalog] = await Promise.all([
          fetchCartProductIds(userId),
          fetchProducts(),
        ]);
        const remoteIdSet = new Set(remoteIds);
        const catalogById = new Map(catalog.map((product) => [product.id, product]));

        // Push items added while offline so the backend catches up
        for (const item of itemsRef.current) {
          if (remoteIdSet.has(item.id)) continue;
          try {
            await addRemoteCartItem(userId, item.id);
          } catch (err) {
            console.warn(`Cart sync: failed to push offline item ${item.id}:`, err);
          }
        }

        // Remote items get fresh catalog snapshots; unresolvable ids are skipped
        const remoteItems: CartItem[] = [];
        for (const id of remoteIds) {
          const product = catalogById.get(id);
          if (product) {
            remoteItems.push(productToCartItem(product));
          } else {
            console.warn(`Cart sync: remote item ${id} not found in catalog; skipping`);
          }
        }

        setItems((current) => {
          const byId = new Map(remoteItems.map((item) => [item.id, item]));
          for (const item of current) {
            if (!byId.has(item.id)) byId.set(item.id, item);
          }
          return Array.from(byId.values());
        });

        setSyncStatus('synced');
      } catch (err) {
        console.warn('Cart sync failed (keeping local cart):', err);
        setSyncStatus('offline');
      } finally {
        isSyncingRef.current = false;
      }
    })();
  }, [userId]);

  // Sync on sign-in (Google, demo, or restored session); drop the local cache
  // on sign-out. The remote cart itself is never deleted here.
  useEffect(() => {
    if (isAuthLoading) return;

    if (!userId) {
      // Defer the reset out of the effect body (AuthContext pattern)
      void Promise.resolve().then(() => {
        setItems([]);
        setSyncStatus('idle');
      });
      return;
    }

    syncCart();
  }, [userId, isAuthLoading, syncCart]);

  const addItem = useCallback(
    (product: Product) => {
      setItems((prev) => {
        // Duplicate guard: each LUT pack is a one-time purchase, quantity is always 1
        if (prev.some((item) => item.id === product.id)) {
          return prev;
        }
        return [...prev, productToCartItem(product)];
      });
      // Fire-and-forget backend write; optimistic local state is not rolled back
      if (userId) {
        addRemoteCartItem(userId, product.id).catch((err) => {
          console.warn('Cart sync: failed to add item on backend:', err);
        });
      }
    },
    [userId]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((item) => item.id !== productId));
      if (userId) {
        removeRemoteCartItem(userId, productId).catch((err) => {
          console.warn('Cart sync: failed to remove item on backend:', err);
        });
      }
    },
    [userId]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    if (userId) {
      clearRemoteCart(userId).catch((err) => {
        console.warn('Cart sync: failed to clear backend cart:', err);
      });
    }
  }, [userId]);

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
        syncStatus,
        addItem,
        removeItem,
        clearCart,
        isInCart,
        refresh: syncCart,
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
