# Feature: Cart Context & Local Persistence

**From build-plan:** feature 12
**Build attempt:** 1
**Branch:** feature/cart-context-and-local-persistence
**Status:** verified

## Goal

Create a shared `CartContext` that manages cart items as centralized React state, replaces the local toggle stubs in `ShopScreen` and `ProductDetailScreen`, and persists the cart to AsyncStorage so it survives app restarts. This feature is local-only — backend sync is feature 13.

## In scope

- `CartItem` type definition with product snapshot fields needed for the cart UI (id, slug, title, price, thumbnailUrl, category, lutCount)
- `CartContextType` interface exposing items array, badge count, subtotal, loading state, and add/remove/clear/isInCart helpers
- `CartProvider` component using `useState` + `useEffect` for AsyncStorage hydration on mount
- AsyncStorage key `@lutshop_mobile_cart` storing `CartItem[]` as JSON
- Write-through persistence: every add/remove/clear updates AsyncStorage immediately
- `useCart()` hook with context guard (throw if used outside provider)
- Wire `CartProvider` into the app layout (wrap alongside existing `AuthProvider`)
- Replace `ShopScreen` local `addedIds` Set stub with `useCart().addItem` / `useCart().isInCart`
- Replace `ProductDetailScreen` local `isAdded` toggle stub with `useCart().addItem` / `useCart().isInCart`
- Cart tab badge count from `useCart().itemCount` in tab layout
- Cart tab header subtitle from context (`"N ITEMS"`)
- Duplicate guard: `addItem` is a no-op when the product is already in the cart

## Out of scope

- Backend API sync (`GET/POST/DELETE /api/cart`) — feature 13
- `useFocusEffect` refresh or Supabase Realtime — feature 14
- Cart screen item list, delete, subtotal UI — feature 15
- Checkout flow — features 16–17
- Quantity tracking (each LUT pack is a one-time digital purchase; quantity is always 1)

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: Cart types and CartContext provider**
  Create `src/types/cart.ts` with `CartItem` and `CartContextType` interfaces. Create `src/context/CartContext.tsx` with `CartProvider` (AsyncStorage hydration, add/remove/clear/isInCart logic, write-through persistence, subtotal and itemCount derivations). Export from `src/context/index.ts`. Add `@lutshop_mobile_cart` storage key.
  **Done when:** TypeScript compiles without errors. `CartProvider` exports are importable.

- [x] **Step 2: Wire CartProvider into app layout**
  Wrap `CartProvider` around the existing component tree in the root or tab layout (next to `AuthProvider`). Connect cart badge count to the Cart tab icon in `_layout.tsx`.
  **Done when:** App renders without crash. Cart tab badge shows `0` initially. `useCart()` is callable from any tab screen.

- [x] **Step 3: Replace ShopScreen cart stub with context**
  Remove the local `addedIds` / `setAddedIds` state from `src/app/(tabs)/index.tsx`. Import `useCart()` and use `addItem(product)` / `isInCart(productId)` for button state and the featured product hero CTA. Pass cart count from context to `CinemaHeader`.
  **Done when:** Tapping "Add to Cart" on any product card or the hero CTA changes the button to "ADDED ✓". The Cart tab badge increments. State persists when navigating between tabs.

- [x] **Step 4: Replace ProductDetailScreen cart stub with context**
  Remove the local `isAdded` / `setIsAdded` state from `src/app/product/[slug].tsx`. Import `useCart()` and use `addItem(product)` / `isInCart(product.id)` for the sticky bottom bar button state.
  **Done when:** Tapping "Add to Cart" on the product detail screen changes the button to "ADDED TO CART ✓". The change is reflected back on the Shop tab (same product shows "ADDED ✓"). Cart tab badge is correct.

- [x] **Step 5: Cart tab header reads from context**
  Update `src/app/(tabs)/cart.tsx` to import `useCart()` and display the live item count in the `CinemaHeader` subtitle (`"N ITEMS"` / `"0 ITEMS"`).
  **Done when:** Adding a product on the Shop tab and switching to the Cart tab shows the updated count in the header.

## Files / areas

| File | Action |
|------|--------|
| `src/types/cart.ts` | Create — `CartItem`, `CartContextType` |
| `src/types/index.ts` | Edit — re-export cart types |
| `src/context/CartContext.tsx` | Create — `CartProvider`, `useCart` |
| `src/context/index.ts` | Edit — re-export `CartContext` |
| `src/app/(tabs)/_layout.tsx` or `src/app/_layout.tsx` | Edit — wrap `CartProvider`, wire badge |
| `src/app/(tabs)/index.tsx` | Edit — replace local stub with `useCart()` |
| `src/app/product/[slug].tsx` | Edit — replace local stub with `useCart()` |
| `src/app/(tabs)/cart.tsx` | Edit — read `itemCount` from context for header |

## Data / contracts

**AsyncStorage key:** `@lutshop_mobile_cart`
**Stored shape:** `CartItem[]` as JSON string

```typescript
interface CartItem {
  id: string;        // product.id
  slug: string;
  title: string;
  price: number;
  thumbnailUrl: string;
  category: string;
  lutCount: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;      // items.length
  subtotal: number;       // sum of items[].price
  isLoading: boolean;     // true during AsyncStorage hydration
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}
```

`addItem` extracts the `CartItem` snapshot fields from the full `Product` object. Duplicate product IDs are silently ignored (no duplicate rows).

## Testing

No test runner is configured. Verify manually:
1. Add product on Shop → badge increments, button toggles to "ADDED ✓"
2. Navigate to Product Detail of same product → button already shows "ADDED TO CART ✓"
3. Navigate to Cart tab → header subtitle shows correct count
4. Kill and relaunch app → cart items persist (AsyncStorage)
5. Items added on Shop hero CTA also reflected in catalog card state

## Notes for the AI

- Follow the `AuthContext` pattern: `createContext<Type | undefined>`, provider component, `useCart()` hook with `throw` guard.
- `CartItem` is a snapshot — don't store the full `Product` to avoid stale data when product catalog changes. Keep only the fields needed for cart display and checkout.
- The existing `ProductCard` component receives `onAddToCart` and `isAdded` props — preserve these prop names but source the values from context instead of local state.
- The `CinemaHeader` in `ShopScreen` already accepts a `cartCount` prop at line 284 — wire this from `useCart().itemCount`.
- `addItem` takes a `Product` (not `CartItem`) and extracts the needed fields internally for caller convenience.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":6763,"specSha256":"ad7b0655e4b106eae78a5110c4bbfb06bd0496e155045ffd8b8a0f6f1175ef9f","branch":"refs/heads/feature/cart-context-and-local-persistence","head":"c75756085d9c3b2f7a80d9d29118a9de81758a7d","baseRef":"refs/heads/master","baseCommit":"c75756085d9c3b2f7a80d9d29118a9de81758a7d","sourceTree":"01dcc5e8edf27f5b6982ff39991d2995553f5478","absentOptional":[]} -->
