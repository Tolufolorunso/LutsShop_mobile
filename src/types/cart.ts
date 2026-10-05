import { Product } from './product';
import { AuthSyncStatus } from './auth';

export type CartSyncStatus = AuthSyncStatus;

/**
 * Tolerated row shapes from GET /api/cart — the product id may arrive under
 * any common key depending on how the backend joins cart_items to products.
 */
export interface RawCartRow {
  product_id?: string;
  productId?: string;
  id?: string;
  [key: string]: unknown;
}

/** Tolerated wrapper shapes from GET /api/cart around an id or row list. */
export interface RawCartEnvelope {
  items?: unknown;
  cart_items?: unknown;
  [key: string]: unknown;
}

/**
 * Snapshot of a product stored in the cart.
 * Keeps only the fields needed for cart display and checkout —
 * not the full Product to avoid stale catalog data.
 */
export interface CartItem {
  id: string;        // product.id
  slug: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  category: string;
  lutCount: number;
}

export interface CartContextType {
  items: CartItem[];
  itemCount: number;      // items.length
  subtotal: number;       // sum of items[].price
  isLoading: boolean;     // true during AsyncStorage hydration
  syncStatus: CartSyncStatus; // backend sync state, mirrors AuthSyncStatus
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

/**
 * Extract the cart-relevant snapshot fields from a full Product object.
 */
export const productToCartItem = (product: Product): CartItem => ({
  id: product.id,
  slug: product.slug,
  title: product.title,
  price: product.price,
  thumbnailUrl: product.thumbnailUrl,
  category: product.category,
  lutCount: product.lutCount,
});
