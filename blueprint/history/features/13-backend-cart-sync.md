# Feature: Backend Cart Sync

**From build-plan:** feature 13
**Build attempt:** 1
**Branch:** feature/backend-cart-sync
**Status:** verified

## Goal

Wire the existing backend cart endpoints (`GET/POST/DELETE /api/cart`) into `CartContext` so the cart synchronizes with the shared Supabase `cart_items` table through the LUTShop Next.js server: pull on sign-in, push on add/remove/clear. This gives bi-directional sync with the desktop web app for the same Google account (or the shared demo user), while keeping the feature-12 AsyncStorage cache as the offline layer.

## In scope

- Typed backend cart fetchers in `src/config/api.ts` following the existing `fetchProducts`/`fetchProductBySlug` pattern (timeout-guarded, `ApiError`-throwing)
- Tolerant normalization of the `GET /api/cart` response into product ids (accepts `string[]`, row objects with `product_id`/`productId`, an `{ items }` / `{ cart_items }` wrapper, or enriched product objects with `id`)
- CartItem snapshot hydration for remote-only ids via the existing `fetchProducts()` catalog fetch (which already falls back to `MOCK_PRODUCTS` offline); remote rows with no matching catalog product are skipped with a `console.warn`
- Sign-in sync: when `useAuth().user` becomes non-null (Google sign-in, demo sign-in, or session restore), GET the remote cart, union-merge with local items deduped by product id, push local-only items to the backend with `POST /api/cart`, and persist the merged cart locally
- Catalog refresh for merged items: snapshots for items that exist remotely are taken from the fresh catalog response, replacing stale local snapshot fields (id, slug, title, price, thumbnailUrl, category, lutCount)
- Write-through on `addItem`: optimistic local update, then fire-and-forget `POST /api/cart` with `{ userId, productId }`; failure logs a `console.warn` and keeps local state (reconciled on next sync)
- Write-through on `removeItem`: optimistic local update, then fire-and-forget `DELETE /api/cart?userId=&productId=`; same failure handling
- Write-through on `clearCart`: optimistic local clear, then fire-and-forget `DELETE /api/cart?userId=&clearAll=true`; same failure handling
- Signed-out behavior: when `user` is null, all network calls are skipped and the cart behaves exactly as feature 12 (local-only)
- Sign-out behavior: when `user` becomes null, clear in-memory items and remove the `@lutshop_mobile_cart` storage key (prevents cross-account mixing on a shared device; the remote cart is untouched)
- `syncStatus: AuthSyncStatus` on `CartContextType` (`'idle' | 'syncing' | 'synced' | 'offline'`), mirroring the `AuthContext` pattern; reuses the existing `AuthSyncStatus` type
- Overlap guard so a second sync cannot start while one is in flight; items added during an in-flight sync survive the merge

## Out of scope

- `useFocusEffect` re-fetch on screen focus — feature 14
- Supabase Realtime WebSocket subscription — feature 14
- Batch merge via `mergeProductIds` — present in an early planning doc but not in the overview's contract table; individual `POST`s are used instead
- Cart screen item list, delete UI, subtotal, checkout CTA — feature 15
- Order-time cart clearance flow — feature 17 (it will call `clearCart`, which already syncs remote)
- Any backend/server code changes — the Next.js API already exists
- Quantity handling — one row per product per user; quantity is always 1

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: Backend cart fetchers and sync types**
  In `src/types/cart.ts`, re-export `AuthSyncStatus` as the cart sync status type and add any response-shape helper types. In `src/config/api.ts`, add `fetchCartProductIds(userId)` (GET `/api/cart?userId=`, tolerant normalization to `string[]`, 5s timeout), `addRemoteCartItem(userId, productId)` (POST body `{ userId, productId }`), `removeRemoteCartItem(userId, productId)` (DELETE `?userId=&productId=`), and `clearRemoteCart(userId)` (DELETE `?userId=&clearAll=true`). All throw on failure like the existing fetchers.
  **Done when:** TypeScript compiles without errors (`npx tsc --noEmit`). The four functions are exported from `src/config/api.ts` and typed.

- [x] **Step 2: Sign-in pull-merge-push sync in CartProvider**
  Call `useAuth()` inside `CartProvider` (it is already nested inside `AuthProvider`). Add a `syncStatus` state and an effect keyed on `user?.id`: null → clear items and storage; non-null → set `syncing`, GET remote ids, hydrate snapshots via `fetchProducts()`, union-merge with current local items (dedupe by id, remote-catalog snapshots win), `setItems` + persist, then POST each local-only item, then `synced`. On any failure: `console.warn`, set `offline`, keep local items. Guard against overlapping syncs with a ref; merge must preserve items added mid-sync.
  **Done when:** TypeScript compiles. With the backend running, signing in as the demo user pulls items added on the web into the cart badge/count; with the backend unreachable, sign-in still succeeds locally with `syncStatus: 'offline'`.

- [x] **Step 3: Write-through add / remove / clear**
  Extend `addItem`, `removeItem`, and `clearCart` in `CartProvider`: after the optimistic local update, fire-and-forget the matching backend call when `user` is non-null, catching and warning on failure without touching local state. Existing duplicate guard and `productToCartItem` snapshot logic stay unchanged.
  **Done when:** TypeScript compiles. Adding a product on mobile (backend running) makes it appear in the web cart; removing on mobile removes it from the web cart; all existing feature-12 behaviors (badge, ADDED ✓ states, restart persistence) still hold.

## Files / areas

| File | Action |
|------|--------|
| `src/types/cart.ts` | Edit — sync status type, response-shape helper types |
| `src/config/api.ts` | Edit — four backend cart functions |
| `src/context/CartContext.tsx` | Edit — `useAuth` coupling, sign-in sync effect, write-through actions, `syncStatus` |

## Data / contracts

**Backend endpoints** (on `EXPO_PUBLIC_API_BASE_URL`, per `blueprint/context/project-overview.md`):

| Call | Shape |
|------|-------|
| `GET /api/cart?userId=<id>` | Response shape **not documented** — normalize tolerantly to product id `string[]` (see Open questions) |
| `POST /api/cart` | body `{ userId, productId }` |
| `DELETE /api/cart` | `?userId=<id>&productId=<id>` or `?userId=<id>&clearAll=true` |

**Identity:** `userId` is `AuthUser.id` — Google `sub` or `demo-filmmaker-001`; equals `profiles.id` / `cart_items.user_id` shared with the web app.

**Merge rule (sign-in):** `merged = local ∪ remote` deduped by product id; for ids present in the fresh catalog, snapshot fields come from the catalog response; remote ids with no catalog match are dropped with a warning; local-only ids are pushed up with individual POSTs.

**Failure model:** backend is treated as eventually reachable. Local state is always updated first and persisted; network failures warn and set `syncStatus: 'offline'` without rollback. The next successful sign-in sync reconciles.

**Storage:** `@lutshop_mobile_cart` unchanged; cleared on sign-out.

**`CartContextType` additions:** `syncStatus: AuthSyncStatus`.

## Testing

No test runner is configured. Verify manually with the backend running (`EXPO_PUBLIC_API_BASE_URL` set):

1. Add a product on the web app → sign in on mobile (demo or Google) → the item appears in the mobile cart badge without any local add
2. Add a product on mobile → it appears in the web cart
3. Remove on mobile → it disappears on the web cart
4. Sign out → local cart cache is cleared; sign back in → remote cart rehydrates
5. Kill the backend, sign in and add an item → local cart still works, `syncStatus` is `offline`; restart the backend and re-sync → the offline-added item is pushed and appears on web
6. Feature-12 regression: badge increments, ADDED ✓ states, cart survives app restart while signed in

## Notes for the AI

- `CartProvider` already sits inside `AuthProvider` in `src/app/_layout.tsx` (feature 12) — `useAuth()` is callable there.
- Follow `AuthContext`'s `syncStatus` pattern; reuse `AuthSyncStatus` from `@/types/auth`, do not define a duplicate union.
- Reuse `apiClient.get/post/delete` and `fetchProducts()` — no new HTTP machinery, no new dependencies.
- Do not add `useFocusEffect`, Supabase Realtime, or any cart UI — features 14/15 own those.
- Fire-and-forget means: do not `await` the backend call in the UI action path; catch and warn. Never roll back the optimistic local update.
- Keep the feature-12 contracts intact: `@lutshop_mobile_cart` key, duplicate-add guard, `productToCartItem` snapshots, and all existing `CartContextType` members.

## Open questions

- **GET `/api/cart` response shape is unconfirmed** — no planning doc records the JSON the Next.js server returns, and the backend repo is not in this workspace. The spec handles the plausible shapes (`string[]`, `{ product_id }`/`{ productId }` rows, `{ items }`/`{ cart_items }` wrappers, enriched product objects). Confirm the real shape against the backend before `/check`; if it differs from all of these, extend the normalizer.
- **Sign-out clears the local cart cache** (recommended default, recorded above as a contract). The alternative — retaining the local cart across accounts — risks mixing two users' items on a shared device. Confirm at spec review; flipping it later is a one-line change in the sign-out effect.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9576,"specSha256":"570191f28bb87b9b62cbe8b35c6355387917d83b5cfde50f92d6769f1079fcfe","branch":"refs/heads/feature/backend-cart-sync","head":"9e90b3efd9ac34872a64a3bcbfb0529add2e557f","baseRef":"refs/heads/main","baseCommit":"9e90b3efd9ac34872a64a3bcbfb0529add2e557f","sourceTree":"9d08e943d919df16acf493766e99a39ebc6ddcdc","absentOptional":[]} -->
