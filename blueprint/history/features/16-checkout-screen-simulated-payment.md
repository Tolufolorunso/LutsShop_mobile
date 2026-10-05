# Feature: Checkout Screen & Simulated Payment

**From build-plan:** feature 16
**Build attempt:** 1
**Branch:** feature/checkout-screen-simulated-payment
**Status:** verified

## Goal

Add a `CheckoutScreen` stack route that turns the cart into an order: receipt email pre-filled from the signed-in Google profile, payment-method selection (the documented simulated card), an order summary, and submission to `POST /api/orders` — enabling the cart's "PROCEED TO CHECKOUT" CTA. Simulated payment only; no real payment SDK, matching the monetization contract ("simulated card / Stripe handled server-side, no in-app purchase API").

## In scope

- New `src/types/order.ts`: `CreateOrderPayload { userId, customerEmail, items: CartItem[], paymentMethod: string }` and `OrderSubmissionResponse` (tolerant: `{ orderId? }`, `{ order? }`, or bare object — backend response shape unconfirmed), re-exported from the types barrel
- `placeOrder(payload)` fetcher in `src/config/api.ts` following the established pattern (POST `/api/orders`, 8s default timeout, `ApiError` on failure)
- New stack route `src/app/checkout.tsx`, registered in the root `_layout.tsx` Stack with the same `slide_from_right` presentation as product detail
- Reachability: the Cart tab's "PROCEED TO CHECKOUT" button becomes enabled when `itemCount > 0` **and** the user is signed in, navigating to `/checkout`; signed out or empty cart keeps it disabled
- Checkout header bar with back button (same custom-header pattern as product detail: chevron, title, safe-area padding)
- Receipt email field: `TextInput` pre-filled from `useAuth().user.email`, editable, caption label; submit disabled while the value is empty or fails a basic `name@domain.tld` check, with inline error text under the field
- Payment method selection: radio-style selectable rows from a structured list — currently exactly one entry, "CREDIT / DEBIT CARD" (id `card`, the only method the planning docs name), default selected; the list is a plain array so future methods are one-line additions
- Order summary card: item count line (`1 ITEM` / `N ITEMS`) and `SUBTOTAL` row from `useCart().subtotal`, plus a compact item list (thumbnail, title, price per row — read-only)
- Submit button: `PLACE ORDER — $<subtotal>.00` using AppButton `loading` while the request is in flight; on success navigate back to the Cart tab (`router.replace('/(tabs)/cart')`) — the dedicated success screen and cart clearance are feature 17, so this transition is explicitly interim
- Error path: failed submission (network error, timeout, non-2xx `ApiError`) shows an inline error banner above the submit button and keeps the screen usable for retry; local state is unchanged on failure

## Out of scope

- Order success screen and cart clearance — feature 17 (until then the cart keeps its items after a successful order)
- My Library / order history rendering — feature 18
- Real payment processing, Stripe SDK, Apple/Google in-app purchase — excluded by the monetization contract
- Web platform checkout changes
- Additional payment methods beyond the documented simulated card
- Order edits, promo codes, tax/shipping lines — digital goods, single subtotal

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: Order types and placeOrder fetcher**
  Create `src/types/order.ts` with `CreateOrderPayload` and `OrderSubmissionResponse`; re-export from `src/types/index.ts`. Add `placeOrder(payload: CreateOrderPayload)` to `src/config/api.ts` posting to `/api/orders`.
  **Done when:** TypeScript compiles (`npx tsc --noEmit`); `placeOrder` is exported and typed.

- [x] **Step 2: Checkout screen route**
  Create `src/app/checkout.tsx` (email pre-fill + validation, payment selection, summary with compact item list, submit with loading/error states, success → Cart tab) and register it in `src/app/_layout.tsx` with `slide_from_right`.
  **Done when:** TypeScript compiles; the route renders without crash and is protected when signed out (message + back instead of the form).

- [x] **Step 3: Enable the cart CTA**
  In `src/app/(tabs)/cart.tsx`, source `useAuth().user` and enable "PROCEED TO CHECKOUT" only when the cart is non-empty and the user is signed in, with `onPress` pushing `/checkout`. Remove the hard-coded `disabled`.
  **Done when:** TypeScript compiles and lint passes. Runtime (verified at `/check`): signed in with items, the CTA navigates to checkout; submitting an order sends `{ userId, customerEmail, items, paymentMethod }` to `POST /api/orders` and returns to the Cart tab; empty cart or signed-out keeps the CTA disabled.

## Files / areas

| File | Action |
|------|--------|
| `src/types/order.ts` | Create — order payload/response types |
| `src/types/index.ts` | Edit — re-export order types |
| `src/config/api.ts` | Edit — `placeOrder` fetcher |
| `src/app/checkout.tsx` | Create — checkout screen |
| `src/app/_layout.tsx` | Edit — register the checkout route |
| `src/app/(tabs)/cart.tsx` | Edit — conditional CTA enabling + navigation |

## Data / contracts

**`POST /api/orders`** (per `blueprint/context/project-overview.md`): body `{ userId, customerEmail, items, paymentMethod }`.

- `userId` = `AuthUser.id` (Google `sub` or `demo-filmmaker-001`) — same identity lock-pin as cart
- `customerEmail` = editable, validated receipt email (pre-filled from the profile)
- `items` = the current `CartItem[]` snapshot (`id, slug, title, price, thumbnailUrl, category, lutCount`) — stored as JSONB per the `orders` table
- `paymentMethod` = the selected method id; current list: `'card'` (simulated)

**Response shape:** unconfirmed — parsed tolerantly; only success/failure gates the flow.

**Guard:** checkout is a signed-in surface; signed-out renders an inline notice with a back button instead of the form, and the CTA stays disabled.

**Failure model:** submission failures surface inline (banner + retry); the cart and form state are never mutated on failure. Cart clearance happens in feature 17, not on submit.

## Testing

No test runner is configured. Verify manually with the backend running:

1. Signed in with two cart items → CTA is enabled → navigates to Checkout showing pre-filled email, selected Card method, both items, correct subtotal
2. Edit the email to an invalid string → submit disables and an inline error appears; restore a valid email → enabled again
3. Place the order → button shows loading, request hits `POST /api/orders` with the documented payload, then the app returns to the Cart tab (cart still populated until feature 17)
4. Kill the backend → submit shows the inline error banner, the form stays usable, retry works after the backend returns
5. Signed out (empty cart too) → CTA remains disabled; navigating to `/checkout` directly shows the sign-in notice
6. Regression: cart badge, header counts, focus re-sync, and web-cart sync all still work

## Notes for the AI

- Reuse `AppButton` (`loading`, `disabled`), `CinemaCard`, `AppText`, `BadgePill`, and the product-detail custom header pattern — no new UI primitives.
- The payment list must be a data array (`{ id, label }[]`) rendered as selectable rows — not hard-coded JSX — so adding methods later is data, not surgery.
- Email validation is intentionally basic (non-empty + `name@domain.tld` regex) — no error-message copy beyond one inline line.
- Do not call `clearCart` on submit — cart clearance belongs to feature 17's success flow.
- Do not add a confirmation dialog, haptics, or analytics — keep to the repo's current interaction vocabulary.

## Open questions

- **Payment-method list is under-documented:** the plans only name "simulated card / Stripe on the web side," so the spec ships exactly one selectable method (`card`). If the web checkout offers more (e.g., PayPal), extend the array after confirming the web UI — no structural change needed.
- **`items` JSONB shape parity:** mobile sends `CartItem[]` snapshots. The web writes its own snapshot shape into the same column; feature 18 (My Library) reads `GET /api/orders` — confirm the web items shape before 18 so both platforms' orders render from the same field names.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":8247,"specSha256":"e2cccf24c0fd1d24bc99a9d9e48c36707888e86fd09329140ed0913e850fba3a","branch":"refs/heads/feature/checkout-screen-simulated-payment","head":"aa9d77e521bf3a2456496328fd87a480a24ba038","baseRef":"refs/heads/main","baseCommit":"aa9d77e521bf3a2456496328fd87a480a24ba038","sourceTree":"38209f8a02e8149bca376d2648b56723f84137a6","absentOptional":[]} -->
