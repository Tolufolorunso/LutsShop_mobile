# Feature: Cart Screen & Item Management

**From build-plan:** feature 15
**Build attempt:** 1
**Branch:** feature/cart-screen-item-management
**Status:** verified

## Goal

Replace the placeholder Cart tab with the real item-management screen the build plan promises: a list of `CartItem` rows (thumbnail, title, category, LUT count, price) with per-item delete, an order-summary card with the subtotal, and the "PROCEED TO CHECKOUT" CTA. All data and mutations come from the existing `useCart()` context — this feature is pure UI over the feature-12/13/14 plumbing and completes Milestone 4.

## In scope

- New `CartItemCard` component in `src/components/cart/` (new domain folder mirroring `components/product/`), exported through a barrel and re-exported from `src/components/index.ts`
- Item row: `expo-image` thumbnail (`CartItem.thumbnailUrl`, `contentFit="cover"` with transition, per the `ProductCard` pattern), title (`bodyBold`, single line), category + `N LUTS` caption row, price on the right, and a trash-icon delete button calling `removeItem(item.id)`
- Cart screen items mode: when `itemCount > 0`, render the list of rows (ScrollView, mapped) plus an order-summary card ("SUBTOTAL" caption + formatted subtotal, item count line) and the "PROCEED TO CHECKOUT" primary CTA
- CTA is rendered with AppButton `disabled` — checkout navigation and the checkout screen itself are feature 16; the disabled state is honest UI, not a dead tap target
- Delete flows through the context (optimistic local removal + fire-and-forget backend `DELETE` + badge/header updates), already built — no new API code
- Empty mode: the existing "Your Cart is Empty" block with `BROWSE CINEMA SHOP` and the Bi-Directional Cloud Sync info card is preserved verbatim when `itemCount === 0`
- Header subtitle and tab badge keep reading live counts from context (feature 12 wiring, untouched)
- `useFocusEffect` re-sync on focus stays (feature 14, untouched)

## Out of scope

- Checkout screen, navigation on CTA press, email pre-fill, payment selection — feature 16
- Order success and cart clearance flow — feature 17
- Quantity controls / per-item quantity display — each LUT pack is a one-time purchase, quantity is always 1
- Item editing, save-for-later, promo codes
- Any backend or context-layer changes
- The web platform's cart UI

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: CartItemCard component**
  Create `src/components/cart/CartItemCard.tsx` with `CartItemCardProps { item: CartItem; onRemove: (productId: string) => void; style? }`: left thumbnail image, middle title + category caption + LUT-count caption, right-aligned price, trash `TouchableOpacity` bound to `onRemove(item.id)`. Style with `CinemaTheme` tokens matching the existing card language (card surface, divider hairlines, caption colors). Create `src/components/cart/index.ts` re-exporting it and add the re-export to `src/components/index.ts`.
  **Done when:** TypeScript compiles (`npx tsc --noEmit`); the component is importable as `import { CartItemCard } from '@/components/cart'`.

- [x] **Step 2: Cart screen items mode with summary and CTA**
  In `src/app/(tabs)/cart.tsx`: when `items.length > 0`, render a ScrollView of `CartItemCard` rows (deleting via `removeItem`), then a summary `CinemaCard` with the `N ITEM(S)` line, the `SUBTOTAL` row showing `$<subtotal>.00` (matching the existing shop price formatting), and the disabled `PROCEED TO CHECKOUT` AppButton. When `items.length === 0`, render the existing empty block unchanged. Keep the `CinemaHeader`, focus refresh, and styles consistent with the screen's current structure.
  **Done when:** TypeScript compiles and lint passes. Runtime (verified at `/check`): adding products on Shop lists them here with thumbnails; delete removes the row, decrements the badge, and syncs the removal to the web cart; subtotal equals the sum of row prices; deleting everything restores the empty state.

## Files / areas

| File | Action |
|------|--------|
| `src/components/cart/CartItemCard.tsx` | Create — item row (thumbnail, meta, price, delete) |
| `src/components/cart/index.ts` | Create — barrel re-export |
| `src/components/index.ts` | Edit — re-export cart components |
| `src/app/(tabs)/cart.tsx` | Edit — items mode, summary card, disabled CTA, empty-mode conditional |

## Data / contracts

**Consumed context members (no changes to `CartContextType`):** `items: CartItem[]`, `itemCount`, `subtotal`, `removeItem(productId)`.

**`CartItem` fields rendered:** `id`, `title`, `price`, `thumbnailUrl`, `category`, `lutCount` (snapshot per feature-12 contract).

**Formatting:** prices render as whole dollars matching the existing shop pattern (`$<n>.00`); item count line follows the `1 ITEM` / `N ITEMS` convention already used in the header subtitle.

**Deletion contract:** `removeItem` is context-owned (optimistic local update, fire-and-forget backend `DELETE /api/cart?userId=&productId=`, warn on failure) — the UI only calls it; no rollback or confirmation dialog is specified.

## Testing

No test runner is configured. Verify manually with the backend running:

1. Add two products on Shop → Cart tab lists both rows with thumbnails, correct prices, category captions, and LUT counts; badge and header subtitle show `2 ITEMS`
2. Subtotal equals the sum of both prices
3. Delete one row → it disappears, badge/subtitle drop to `1 ITEM`, and the product reappears as addable on the Shop tab; the web cart no longer has it
4. Delete the second row → empty state ("Your Cart is Empty" + browse CTA + sync info card) returns; subtotal block is gone
5. Kill and relaunch the app while signed in → a non-empty cart rehydrates and lists correctly (feature-12/13 regression)
6. CTA renders disabled with no navigation

## Notes for the AI

- Use `expo-image`'s `Image` (`contentFit="cover"`, `transition`) exactly like `ProductCard` — not React Native's `Image`.
- Mirror the `components/product` folder structure: component file + `index.ts` barrel, then re-export from `src/components/index.ts`.
- The delete button needs a comfortable touch target (≥36px hit area) even though the icon is small; no accessibility text exists in the current component set, so follow the repo's existing icon-button pattern (`TouchableOpacity` + `Ionicons`).
- Keep all styling on `CinemaTheme` tokens — no hard-coded colors outside the existing conventions (white text on cyan uses `#000000`, per `AppButton`).
- Do not add swipe-to-delete, quantity steppers, or navigation — the CTA stays disabled for feature 16.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":6668,"specSha256":"8ab1a5723d760dec3af44298dfaca20f530ccacaea2fecec249f642600855880","branch":"refs/heads/feature/cart-screen-item-management","head":"4c417a28b0f5446385ff451c269d311c01f8dd49","baseRef":"refs/heads/main","baseCommit":"4c417a28b0f5446385ff451c269d311c01f8dd49","sourceTree":"fcd5de9123c0a2cfcc9a46a082de25e165889dc5","absentOptional":[]} -->
