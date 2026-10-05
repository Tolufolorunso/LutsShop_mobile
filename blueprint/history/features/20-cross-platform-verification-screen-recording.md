# Feature: Cross-Platform Verification & Screen Recording

**From build-plan:** feature 20
**Build attempt:** 1
**Branch:** feature/cross-platform-verification-screen-recording
**Status:** verified (recording session deferred by user — all automatable verification passed)

## Goal

Produce the capstone evaluator deliverable: a live screen recording of the LUTShop experience running side-by-side — desktop web store and mobile app in Expo Go — under the same account, showing the bi-directional cart sync, a mobile checkout with order confirmation, and the purchase appearing in My Library on both platforms. This is the final build-plan item, and it doubles as the deferred on-device verification from feature 19 (checklist items 1–6).

## Prerequisite inherited from feature 19

**F-19-1 — root cause CORRECTED during Step 1.** The 401s probed in feature 19 were never the LUTShop backend: port 3000 was (and is) occupied by an unrelated dev server (`Desktop\dzuels\DZF-ILLS`, another Next.js app with auth-protected APIs — identified via `netstat`/process command line). The real LUTShop backend at `..\lutshop` is **fully contract-compliant**: public CORS-enabled routes, the unauthenticated userId contract, and even the batch-merge cart parameter. Resolution is operational, not a code change: run the LUTShop dev server (it will take port 3001 while DZF-ILLS holds 3000), point `.env` at it, and fix the one genuine mobile defect this audit surfaced — `placeOrder` now maps the cart snapshot to the backend's `[{ productId, price }]` wire format (applied this step; tsc + lint pass). Feature 19's backend-auth deferral is therefore moot: there is no backend change to make.

## In scope

- **Backend contract restoration (Step 1):** the documented endpoints answer as the plans specify — `GET /api/products` returns the catalog JSON, `POST /api/auth/google` upserts the demo profile, `GET /api/cart?userId=` / `POST` / `DELETE ?userId=&clearAll=true` and `GET /api/orders?userId=` work with `demo-filmmaker-001`. Proof: probe outputs recorded in this spec. Either the user applies the backend change, or the agent does it given the backend repo path (the LUTShop Next.js repo is not in this workspace)
- **Demo script (Step 2):** a fixed recording run-sheet, written into this spec, covering: side-by-side layout, demo sign-in on both platforms, add-on-web → focus mobile Cart → item appears, add-on-mobile → appears in web cart, remove cross-platform, mobile checkout → confirmation → cart cleared on both, Library listing the order on mobile and web, split-slider gesture close-up, kill-and-relaunch cart persistence
- **Recording session (Step 2, user-performed):** the user records the run-sheet on device + screen capture; the video stays local (never committed to Git)
- **Results recording (Step 3):** the run-sheet's observed results and the local path to the recording are written into this spec; any failed step becomes a recorded finding with a repair plan before `/complete`
- `.env` adjustments needed for the demo session (LAN URL already set from feature 19; production/tunnel URL only if the session uses one)

## Out of scope

- Committing video files or screenshots to Git — recordings stay local by design
- EAS builds, app-store packaging, production deployment (explicitly deferred by the plans)
- New product code in this repo — if the demo exposes a mobile defect, it is fixed under this feature's steps with its own focused check or via `/fix`, never silently
- Backend changes beyond restoring the documented contract (no new endpoints, no schema changes)

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit. Steps 1–2 require user participation: the backend change (or repo path) and the physical recording.

## Build steps

- [x] **Step 1: Restore the backend contract (resolves F-19-1)**
  ✅ Root cause corrected: the port was occupied by DZF-ILLS, not LUTShop; the lutshop repo is contract-compliant; `placeOrder` wire-format defect fixed (tsc + lint pass). **Remaining:** the user starts the LUTShop dev server (`cd ../lutshop && npm run dev` — expect port 3001 while DZF-ILLS holds 3000); the agent re-points `.env`, records the probe proofs below, and updates this step.
  **Done when:** `curl` proofs recorded in this spec show 200/success for `GET /api/products`, `POST /api/auth/google`, `GET/POST/DELETE /api/cart`, and `GET /api/orders?userId=demo-filmmaker-001`. ✅ done (2026-10-05, server `http://192.168.1.240:3001`, Supabase `isCloudConfigured: true`): products 200 with catalog; auth/google `{"success":true,...}` upserting Alex Turner; cart POST `{"success":true}` inserting prod-02, cart GET returning `product_id` rows, cart DELETE `{"success":true,"deletedProductId":"prod-02"}` then GET confirming `[]`; orders GET returning the `orders` envelope with camelCase `mapOrder` shape (a pre-existing Oct 2 order has `items: []` and is skipped by the mobile normalizer by design). Mobile `.env` re-pointed to `:3001`.

- [x] **Step 2: Demo recording session**
  The user rehearses the run-sheet below and records the session. The agent updates the run-sheet results table as reports come in and troubleshoots any failure (logs pasted from the Expo terminal) before recording continues.
  **Done when:** the user reports the recording captured end-to-end, or a failed step is converted into a recorded finding with a repair plan. ✅ closed via deferral: the user invoked `/complete` without performing the session — the recording is deferred, the 9-step run-sheet is preserved above (and in the archive) for when the demo is recorded, and the backend session remains reproducible (LUTShop dev server on `:3001`, `demo-filmmaker-001`).

- [x] **Step 3: Results and closure**
  The final run-sheet table (with results and timing observations), the recording's local file path, and any residual risks are written into this spec's Testing section.
  **Done when:** the results table is complete and the recording path is recorded; the spec proceeds to `/complete`. ✅ closed via deferral: results table stands at "deferred — not performed"; recording path: none yet. All automatable verification (probe suite, compile, lint) is recorded above.

## Files / areas

| File | Action |
|------|--------|
| `blueprint/context/current-feature.md` | Edit — run-sheet, probe proofs, results |
| Backend repo (outside this workspace) | Edit by user or agent — auth middleware fix restoring the documented contract |
| Recording file | Local only — never committed |

## Data / contracts

**No product code changes in this repo.** The exercised contracts are the ones features 12–18 built against: the unauthenticated userId-parameterized cart/orders API, the demo identity (`demo-filmmaker-001` = `profiles.id`), and the optimistic-local + eventually-synced failure model. The recording is the contract's proof.

## Run-sheet (recording script)

1. Layout: desktop browser (web store, signed in as demo) left; phone in Expo Go right
2. Demo sign-in on mobile (one tap, Alex Turner) — profile + Pro badge visible
3. Browse catalog on mobile; drag the split slider (gesture close-up)
4. Add a pack on **web** → focus mobile **Cart** tab → item appears (badge + header count)
5. Add a different pack on **mobile** → refresh web cart → item appears
6. Remove the web-added pack on **mobile** → disappears on web
7. Mobile checkout: pre-filled email, Card (simulated), place order → confirmation screen
8. Cart cleared on both platforms; badge 0; web cart empty
9. Mobile **Library**: the order's packs with LIFETIME badges; web library shows the same order
10. Kill and relaunch the app → cart state and library still correct

## Testing

The run-sheet doubles as the test table. Results recorded during Steps 2–3:

| # | Demo step | Result |
|---|-----------|--------|
| 1 | Side-by-side layout + demo sign-in | pending |
| 2 | Catalog + split slider on device | pending |
| 3 | Web → mobile cart sync (add) | pending |
| 4 | Mobile → web cart sync (add) | pending |
| 5 | Mobile → web cart sync (remove) | pending |
| 6 | Mobile checkout → confirmation | pending |
| 7 | Cart cleared on both platforms | pending |
| 8 | Library shows the order (mobile + web) | pending |
| 9 | Kill/relaunch persistence | pending |

**Recording path:** recorded in Step 3 (local file, not committed).

## Notes for the AI

- Do not start the backend, Expo server, or recording — the user owns the session; the agent verifies probes, keeps the run-sheet, and troubleshoots from pasted logs.
- The backend fix must restore the documented contract only — no new endpoints, no schema changes, no credential plumbing; if the user instead chooses mobile-side Supabase auth, that is a plan revision, not an improvisation here.
- After Step 1's probes pass, update F-19-1's disposition in this spec (resolved-by, date) — feature 19's archive keeps its historical record.
- The demo identity is the shared `demo-filmmaker-001`; if the user prefers a real Google account for the recording, both platforms must sign in with that same account before step 4.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":9196,"specSha256":"b6c2d1f119fabef0084e7beb8cb5ca5f40a239fa8c6c613505503e6dba399a29","branch":"refs/heads/feature/cross-platform-verification-screen-recording","head":"b89703144b729aacc4c13512a47ddddd306d9d59","baseRef":"refs/heads/main","baseCommit":"b89703144b729aacc4c13512a47ddddd306d9d59","sourceTree":"ac038a3d4a2056649675fcbc8e3b745a34e72277","absentOptional":[]} -->
