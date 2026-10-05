import { Product } from './product';

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
