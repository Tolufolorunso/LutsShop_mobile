# Feature: Focus & Real-Time Sync Engine

**From build-plan:** feature 14
**Build attempt:** 1
**Branch:** feature/focus-real-time-sync-engine
**Status:** verified

## Goal

Make the feature-13 sync engine re-triggerable: a `refresh()` on `CartContext` that re-runs the pull-merge-push sync against `GET /api/cart`, wired to `useFocusEffect` on the Shop and Cart tabs so items added on the desktop web app appear on mobile (and disappear when removed) the moment the user switches to those tabs — no re-sign-in needed. This is the "quick background sync on screen focus" from the project plan; Supabase Realtime is optional and deferred (see Open questions).

## In scope

- Extract the sign-in sync body in `CartProvider` into a stable `syncCart` callback (the existing pull-merge-push engine: GET remote ids + catalog, push offline-added items, union-merge with fresh catalog snapshots, `syncing` → `synced`/`offline` status, overlap guard)
- Expose `refresh: () => void` on `CartContextType`; signed out it is a no-op; signed in it runs `syncCart`
- The sign-in effect reuses `syncCart` — behavior unchanged from feature 13
- `useFocusEffect` (from `expo-router`) on `src/app/(tabs)/cart.tsx` calling `refresh()` on focus
- `useFocusEffect` on `src/app/(tabs)/index.tsx` (Shop) calling `refresh()` on focus
- The existing overlap guard dedupes the initial-mount focus against the sign-in sync, so no double fetch on cold start

## Out of scope

- Supabase Realtime WebSocket subscription on `cart_items` — optional per the build plan; `@supabase/supabase-js` is not installed and no `EXPO_PUBLIC_SUPABASE_*` env config exists (see Open questions)
- Polling or interval-based refresh — focus-driven only
- Any cart screen UI, delete controls, subtotal — feature 15
- Backend changes
- Realtime-style push from mobile to web on focus — web syncs itself; mobile only reconciles on focus

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit.

## Build steps

- [x] **Step 1: Extract the sync engine and expose `refresh()`**
  In `src/context/CartContext.tsx`, move the sync effect body into a `syncCart` `useCallback` keyed on `userId` (keeping the `isSyncingRef` guard, status transitions, offline push, and union merge exactly as they are). The sign-in effect calls `syncCart()`; the signed-out branch (deferred cache reset) stays in the effect. Add `refresh: () => void` to `CartContextType` in `src/types/cart.ts` and expose `refresh = syncCart` from the provider value.
  **Done when:** TypeScript compiles (`npx tsc --noEmit`). Feature-13 behavior is unchanged: sign-in still pulls/pushes, sign-out still clears the local cache, and the overlap guard still prevents concurrent syncs.

- [x] **Step 2: Wire focus refresh into Shop and Cart tabs**
  In `src/app/(tabs)/cart.tsx` and `src/app/(tabs)/index.tsx`, import `useFocusEffect` from `expo-router` plus `useCart().refresh`, and call `useFocusEffect(useCallback(() => { refresh(); }, [refresh]))`. No other UI changes.
  **Done when:** TypeScript compiles and lint passes. Runtime (verified at `/check`): add an item on the web cart, switch to the mobile Cart tab, and the item appears in the badge/count within a beat without signing in again; removing it on web and re-focusing removes it locally.

## Files / areas

| File | Action |
|------|--------|
| `src/context/CartContext.tsx` | Edit — extract `syncCart`, expose `refresh` |
| `src/types/cart.ts` | Edit — add `refresh` to `CartContextType` |
| `src/app/(tabs)/cart.tsx` | Edit — `useFocusEffect` refresh on focus |
| `src/app/(tabs)/index.tsx` | Edit — `useFocusEffect` refresh on focus |

## Data / contracts

**New context member:** `refresh: () => void` — re-runs the feature-13 pull-merge-push engine against `GET /api/cart` when signed in; no-op signed out. All feature-13 contracts (endpoints, merge rule, failure model, storage key, duplicate guard) are unchanged and preserved.

**Focus contract:** every focus of the Shop or Cart tab triggers at most one `refresh()`; the overlap guard collapses concurrent triggers (cold start fires sign-in sync and initial-tab focus together — exactly one sync runs).

**syncStatus:** reflects the focused refresh the same as sign-in sync (`syncing` → `synced`/`offline`).

## Testing

No test runner is configured. Verify manually with the backend running:

1. Sign in on mobile → add a product on the web app → switch to the mobile Cart tab → the item appears in the badge/header count without re-signing in
2. Remove the product on web → re-focus the Cart tab → it disappears locally
3. Add on mobile → focus Shop → state consistent; web cart reflects the add (write-through from feature 13)
4. Kill the backend → tab switches still work, local cart persists, `syncStatus` returns to `offline`; restart backend → next focus re-syncs
5. Feature-13 regression: sign-in pull/push, sign-out cache clear, restart persistence

## Notes for the AI

- `useFocusEffect` is re-exported by `expo-router` (`import { useFocusEffect } from 'expo-router'`) — no new dependency. Wrap the callback in `useCallback` as its docs require.
- `syncCart` must be a stable `useCallback` so the focus callbacks don't re-register every render.
- Do not add `@supabase/supabase-js`, env vars, polling intervals, or any push channel — see Open questions.
- Keep every feature-13 contract and behavior byte-for-byte where possible; this feature only makes the engine re-triggerable and focus-wired.

## Open questions

- **Supabase Realtime (deferred, recommended):** the build plan marks the WebSocket subscription "optional", the dependency is not installed, and no Supabase URL/anon-key env surface exists — adding it now would mean a new dependency plus new config for a capability the focus refresh already covers at tab granularity. Recommend deferring until evaluators report tab-level latency is insufficient; at that point it is its own small feature (dependency + env + subscription in `CartProvider`).


<!-- blueprint:completion {"schemaVersion":1,"specBytes":6052,"specSha256":"5634e5ecae04c52167f330212c610e297c549f2c615389b5f582fb410a1f1e4e","branch":"refs/heads/feature/focus-real-time-sync-engine","head":"41243f7f1b4afed87b5d54096050c4becfecbad7","baseRef":"refs/heads/main","baseCommit":"41243f7f1b4afed87b5d54096050c4becfecbad7","sourceTree":"e4930c85881e2aecbb33c9d5eefd88fd8f6c00e0","absentOptional":[]} -->
