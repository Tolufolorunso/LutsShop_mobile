# Feature: My Library Screen

**From build-plan:** feature 18
**Build attempt:** 1
**Branch:** feature/my-library-screen
**Status:** verified

## Goal

Replace the Library tab placeholder with the real purchase library: pull the signed-in user's order history from `GET /api/orders`, render each order's purchased packs with license status and download buttons, and refresh on tab focus. This completes Milestone 5 and closes the evaluation loop from the project plan ("complete checkout on mobile → verify order appears in My Library").

## In scope

- `PurchaseOrder` / `PurchaseOrderItem` types in `src/types/order.ts` and a tolerant `fetchOrderHistory(userId)` fetcher in `src/config/api.ts` (GET `/api/orders?userId=`): accepts a bare array or an envelope (`orders` / `items` wrapper), tolerates snake_case and camelCase fields (`created_at`/`createdAt`, `payment_method`/`paymentMethod`, `download_url`/`downloadUrl`), skips items without a title with a `console.warn` — the pragmatic resolution of the feature-16 items-shape parity question
- Library screen rebuild in `src/app/(tabs)/library.tsx`:
  - **Signed out:** the existing "No Purchased LUTs Yet" block with the SIGN IN WITH GOOGLE CTA (routed to Account) — unchanged behavior
  - **Loading:** spinner state matching the Shop screen's "Synchronizing..." pattern
  - **Error:** inline banner (icon + message) with a RETRY button when the fetch fails
  - **Empty (signed in, no orders):** the existing empty block minus the sign-in CTA, plus the preserved "Commercial License Access" info card
  - **Orders:** one `CinemaCard` per order — `ORDER #<id>` caption, formatted purchase date, payment-method badge, then one row per item: thumbnail, title, category + LUT-count caption, price, a gold `LIFETIME` license `BadgePill`, and a download icon button
- Download buttons: on press, open the item's download URL via `Linking.openURL` when the backend provides one; otherwise show an `Alert.alert` notice that downloads are served by the production backend (simulated payment demo) — React Native stdlib, no new dependency
- Refresh on tab focus via `useFocusEffect` (feature-14 pattern), signed in only; date rendering uses the locale default with graceful fallback when the timestamp is missing or unparseable

## Out of scope

- Real file hosting / download delivery — the backend owns provisioning; mobile renders the button and opens the URL when present
- License keys, PDF invoices, per-order receipt screens
- Order cancellation, refunds, re-purchase flows
- Filtering or search within the library
- Web platform library changes

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: Order-history types and tolerant fetcher**
  Add `PurchaseOrder` and `PurchaseOrderItem` to `src/types/order.ts`; add `fetchOrderHistory(userId)` to `src/config/api.ts` with the established timeout/`ApiError` behavior and tolerant normalization (throw on transport failure; the screen owns state).
  **Done when:** TypeScript compiles (`npx tsc --noEmit`); `fetchOrderHistory` is exported and typed.

- [x] **Step 2: Library screen rebuild**
  Rebuild `src/app/(tabs)/library.tsx` with the four states (signed out, loading, error, empty) and the orders list per the contract above. Keep the `CinemaHeader`, the placeholder's empty-state content (adjusted per scope), and the license info card.
  **Done when:** TypeScript compiles and lint passes. Runtime (verified at `/check`): after placing an order on mobile or web, focusing the Library tab lists that order's packs with license badges; download taps open the URL or show the notice; signed out shows the sign-in CTA; offline shows the retry banner.

## Files / areas

| File | Action |
|------|--------|
| `src/types/order.ts` | Edit — `PurchaseOrder`, `PurchaseOrderItem` |
| `src/config/api.ts` | Edit — `fetchOrderHistory` tolerant fetcher |
| `src/app/(tabs)/library.tsx` | Edit — rebuild with real data states and order cards |

## Data / contracts

**`GET /api/orders?userId=<id>`** — response shape unconfirmed; normalized tolerantly to `PurchaseOrder[]`:

```typescript
interface PurchaseOrder {
  id: string;
  createdAt: string | null;      // ISO or null when missing/unparseable
  paymentMethod: string | null;
  items: PurchaseOrderItem[];
}
interface PurchaseOrderItem {
  id: string;
  title: string;
  price: number;
  thumbnailUrl: string | null;
  category: string | null;
  lutCount: number | null;
  downloadUrl: string | null;    // opened via Linking when present
}
```

**Identity:** `userId` = `AuthUser.id` (Google `sub` / `demo-filmmaker-001`) — the same lock-pin as cart and checkout.

**License contract:** ownership of an order implies a lifetime commercial license per included pack — displayed as the existing `LIFETIME` gold badge; no separate license entity exists in the plans.

**Failure model:** transport errors set the error state with retry; malformed orders/items are skipped with warnings rather than blocking the screen.

## Testing

No test runner is configured. Verify manually with the backend running:

1. Place an order on mobile → focus the Library tab → the order card appears with the pack(s), LIFETIME badges, price, date, and payment method
2. Place an order on the **web** store → focus the Library tab on mobile → the web order appears (cross-platform contract)
3. Tap a download button → opens the URL when the backend provides one; otherwise the "served by production backend" notice appears
4. Sign out → the signed-out empty state with the Google sign-in CTA returns
5. Kill the backend → error banner with RETRY; restart → retry loads orders
6. No orders (fresh demo user state) → the empty block with the license info card

## Notes for the AI

- Normalize inside `fetchOrderHistory` (established pattern — see `extractCartProductIds`); the screen receives clean `PurchaseOrder[]` and never parses raw shapes.
- Skip, don't fail: an order with zero renderable items is omitted with a warning; a missing field renders a fallback (`—` for date, no badge for payment method).
- Reuse `CinemaCard`, `AppText`, `BadgePill`, `AppButton`, `expo-image`, and the existing icon-button pattern — no new primitives or dependencies.
- `Linking` and `Alert` come from `react-native` (stdlib) — nothing to install.
- Keep the placeholder's license-info card; it is real product copy from the plans (lifetime commercial usage rights).


<!-- blueprint:completion {"schemaVersion":1,"specBytes":6521,"specSha256":"c592e57f0dbe08db1f301f2f1c3c37d29b0c2f5bd484f8bca9cd92087a731384","branch":"refs/heads/feature/my-library-screen","head":"bc2532858b5716bd8d96b954ed230c4de14f7746","baseRef":"refs/heads/main","baseCommit":"bc2532858b5716bd8d96b954ed230c4de14f7746","sourceTree":"c87ae012bca80c6fe72696e75ba07dc607b5866f","absentOptional":[]} -->
