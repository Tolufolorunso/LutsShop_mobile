# Feature: Order Success Screen & Cart Clearance

**From build-plan:** feature 17
**Build attempt:** 1
**Branch:** feature/order-success-cart-clearance
**Status:** verified

## Goal

Complete the checkout arc: after `POST /api/orders` succeeds, land on a dedicated confirmation screen instead of the interim return-to-cart, clear the cart (local state + AsyncStorage + remote via the existing `clearCart` write-through), and offer the link to My Library. This closes the loop the build plan describes and hands a clean cart to the next session.

## In scope

- New stack route `src/app/order-success.tsx`, registered in the root `_layout.tsx` with `slide_from_right` (consistent with checkout and product detail)
- Confirmation UI: success check icon, "ORDER CONFIRMED" title, order-number caption when the backend returned one (tolerant — the response shape is unconfirmed, so the id is optional), and a summary card showing ITEM COUNT and SUBTOTAL carried via route params
- Cart clearance: the success screen calls `clearCart()` exactly once on mount (ref-guarded against re-runs) — this reuses the feature-13 write-through, clearing local state, the `@lutshop_mobile_cart` storage key, and the remote cart via `DELETE /api/cart?userId=&clearAll=true`
- Display data independence: total, item count, and order id travel as route params from checkout, so the confirmation renders correctly even after the cart context is cleared
- Primary CTA "GO TO MY LIBRARY" → `router.replace('/(tabs)/library')` (the Library tab placeholder exists; feature 18 builds the real screen)
- Secondary CTA "BACK TO SHOP" → `router.replace('/(tabs)')`
- Checkout rewiring: replace the interim `router.replace('/(tabs)/cart')` with navigation to `/order-success`, passing `total`, `itemCount`, and the parsed order id (when present) as params
- Graceful deep-link: missing params render with zero-value defaults instead of crashing

## Out of scope

- The real My Library screen (purchased packs, license status, downloads) — feature 18
- Order history fetching, receipt emails, invoice/PDF generation
- Order cancellation or edits
- Any backend changes
- Animations beyond the standard route transition; confetti or custom lottie (not in the repo's vocabulary)

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: Order success route with one-time clearance**
  Create `src/app/order-success.tsx` (confirmation UI from params, tolerant order id, summary card, both CTAs) and register it in `src/app/_layout.tsx`. Clear the cart once on mount with a ref guard using `useCart().clearCart`.
  **Done when:** TypeScript compiles (`npx tsc --noEmit`); the route renders without crash for present, partial, and missing params.

- [x] **Step 2: Rewire checkout success navigation**
  In `src/app/checkout.tsx`, replace the interim Cart-tab transition with `router.replace` to `/order-success`, passing `total` (`String(subtotal)`), `itemCount` (`String(itemCount)`), and `orderId` when `placeOrder`'s tolerant response exposes one.
  **Done when:** TypeScript compiles and lint passes. Runtime (verified at `/check`): placing an order lands on the confirmation with correct totals, the cart badge resets to 0 with the empty state restored on the Cart tab, and the web cart is emptied by the `clearAll` call.

## Files / areas

| File | Action |
|------|--------|
| `src/app/order-success.tsx` | Create — confirmation screen with clearance and CTAs |
| `src/app/_layout.tsx` | Edit — register the route |
| `src/app/checkout.tsx` | Edit — success navigation with params |

## Data / contracts

**Route params** (`/order-success`): `total: string` (dollars), `itemCount: string`, `orderId: string` (optional — parsed tolerantly from the `POST /api/orders` response, which may expose `orderId`, `order.id`, or neither).

**Clearance contract:** `clearCart()` is context-owned (optimistic empty state, storage removal signed-in semantics, fire-and-forget `DELETE ?userId=&clearAll=true`, warn on failure). The success screen invokes it exactly once; no rollback if the network call fails — the local cart is already cleared and the next sync reconciles.

**Cart state after success:** empty — badge 0, Cart tab shows the preserved empty state, and a subsequent Shop-tab add starts a fresh cart synced to the backend.

**Checkout changes only:** the submit flow, payload, and error path from feature 16 are otherwise untouched.

## Testing

No test runner is configured. Verify manually with the backend running:

1. Place an order from checkout → confirmation screen shows "ORDER CONFIRMED", the order id when the backend returns one, and the correct ITEM COUNT / SUBTOTAL from the order
2. Cart tab afterwards: badge 0, "Your Cart is Empty" state, web cart emptied (check the desktop browser)
3. "GO TO MY LIBRARY" navigates to the Library tab (placeholder); "BACK TO SHOP" lands on the Shop tab
4. Add a new product after the order → fresh cart works, badge increments, backend cart syncs
5. Kill the backend before placing the order → feature-16 error banner still governs; no navigation, no clearance
6. Regression: cart sync (13), focus re-sync (14), cart management (15), checkout validation (16)

## Notes for the AI

- The clearance must run exactly once: guard with a `useRef<boolean>` flipped inside the mount effect, since React 19 strict-mode-style double effects and refocus must not double-fire the `clearAll` request.
- Parse the order id tolerantly: `response.orderId ?? response.order?.id ?? undefined` — never assume a field exists.
- Reuse `CinemaCard`, `AppText`, `AppButton`, and `Ionicons` (`checkmark-circle` / similar) — no new UI primitives, no lottie, no haptics.
- Params arrive as strings via `useLocalSearchParams` — parse `Number()` where arithmetic or display formatting is needed; the screen formats dollars as `$<n>.00` per the repo convention.
- Do not call `clearCart` from checkout — clearance belongs to the success screen where the order is confirmed.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":6081,"specSha256":"3b0205960d617d1a80eb4865b3c87c29947df38bd8f964c2cc98d74f6e0d77c7","branch":"refs/heads/feature/order-success-cart-clearance","head":"4c41e1014276bb7192ea44ce59ef417df2e52c21","baseRef":"refs/heads/main","baseCommit":"4c41e1014276bb7192ea44ce59ef417df2e52c21","sourceTree":"66cc3f1e1111e02cfb769fa566adb436aeddac80","absentOptional":[]} -->
