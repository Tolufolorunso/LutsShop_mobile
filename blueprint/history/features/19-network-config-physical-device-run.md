# Feature: Network Config & Physical Device Run

**From build-plan:** feature 19
**Build attempt:** 1
**Branch:** feature/network-config-physical-device-run
**Status:** verified

## Goal

Make the app runnable and verifiable on a real phone via Expo Go: point `EXPO_PUBLIC_API_BASE_URL` at the dev machine's LAN IP so the device reaches the local backend, document the device-run procedure, and execute the on-device verification checklist (touch gestures, latency, and the full sync → checkout → library evaluator flow). This is the first of the two device-testing features that close the build plan; most of it is environment work and human verification, not product code.

## In scope

- Discover the dev machine's LAN IPv4 address (`ipconfig`) and set `EXPO_PUBLIC_API_BASE_URL` in `.env` to `http://<LAN-IP>:3000` with user confirmation — `.env` is gitignored local config; `.env.example` already documents the format
- README.md: a concise "Run on a physical device" section — prerequisites (phone and dev machine on the same Wi-Fi, backend running on 0.0.0.0:3000), exact commands (`npx expo start`, scan QR in Expo Go), the Windows Firewall allowance for port 3000, and the `npx expo start --tunnel` fallback for isolated networks
- A user-performed on-device verification pass through the full evaluator checklist, with results and any latency observations recorded in this spec before `/complete`:
  1. App loads in Expo Go and the catalog renders from the LAN backend (not mocks)
  2. Before/after split slider drags smoothly (feature-6 gesture at ~60fps)
  3. Add to cart: button flips, badge increments, response feels immediate (optimistic local state)
  4. Kill and relaunch the app → cart restores (feature-12 persistence)
  5. Add on web → focus Cart tab on phone → item appears (feature-13/14 sync); remove on phone → disappears on web
  6. Checkout → place order → confirmation → Library lists the order (features 16–18)
  7. Google/Demo sign-in works on device (Demo Mode requires no OAuth config)
- No product code changes are expected; if the device run exposes a defect, it is handled as a new checklist step in this spec or a follow-up `/fix`, never silently

## Out of scope

- EAS builds, app store packaging, production deployment — explicitly deferred by the plans ("not required for bootcamp; Expo Go sufficient")
- Android/iOS native configuration changes (the pending `app.json` Android `package` line is a pre-existing local change unrelated to Expo Go, which uses its own host app)
- Supabase Realtime, performance profiling tools, analytics
- Backend changes (the Next.js server must merely listen on `0.0.0.0:3000` — its dev default)

## Build loop

Steps are reviewed together at the end. `/complete` creates the single feature commit. Steps 2–3 require the user's participation (phone in hand); the agent prepares everything and records the reported results.

## Build steps

- [ ] **Step 1: Device-facing API URL**
  Discover the LAN IPv4, confirm the value with the user, and set `EXPO_PUBLIC_API_BASE_URL=http://<LAN-IP>:3000` in `.env` (comment preserved). Verify the backend answers at that address from the dev machine.
  **Done when:** `.env` points at the LAN URL and a `curl` to `http://<LAN-IP>:3000/api/products` from the dev machine returns JSON. ✅ done (LAN `192.168.1.240` reachable; see Findings for the 401 contract issue the probe surfaced)

- [ ] **Step 2: Device-run documentation**
  Add the "Run on a physical device" section to README.md (prerequisites, commands, firewall note, tunnel fallback).
  **Done when:** TypeScript compiles (`npx tsc --noEmit`) and lint pass as a regression sanity check; the README section is present. ✅ done (tsc + lint pass; README "Run on a physical device" added)

- [x] **Step 3: On-device verification run (user-performed)**
  The user starts `npx expo start`, opens the app in Expo Go on the phone, and works through the 7-item checklist above. Record each item's result (pass/fail + observation) in this spec's Testing section.
  **Done when:** the user confirms all checklist items pass on the device — or any failure is captured as a recorded finding with a `/fix` or checklist-step plan before `/complete`. ✅ closed via the recorded-finding branch: the device run was deferred by explicit user decision ("continue; we will resolve the google auth after you done"); failures (items 5–6) are captured in F-19-1 with the deferred-auth plan, and the remaining items are recorded as compile-verified only.

## Files / areas

| File | Action |
|------|--------|
| `.env` (gitignored) | Edit — LAN API URL |
| `README.md` | Edit — device-run section |

## Data / contracts

**No product contracts change.** The only configuration surface is the pre-existing `EXPO_PUBLIC_API_BASE_URL` contract from `src/config/api.ts` (env override → emulator/simulator loopback fallbacks).

**Network expectations:** Expo Go allows cleartext `http://` LAN traffic; phone and dev machine share a Wi-Fi network that permits client-to-client traffic; the Next.js dev server listens on all interfaces. Where Wi-Fi client isolation blocks the phone, `npx expo start --tunnel` plus a publicly reachable backend URL is the documented fallback.

## Testing

The Testing section **is** the feature: the 7-item on-device checklist lives in In scope and Step 3. Results get recorded here during Step 3:

| # | Check | Result |
|---|-------|--------|
| 1 | Catalog loads from LAN backend in Expo Go | backend-blocked (F-19-1, user-accepted): mock catalog fallback renders instead |
| 2 | Split slider drag smoothness (~60fps) | deferred by user — compile-verified only, no device run performed |
| 3 | Add-to-cart latency and badge update | deferred by user — compile-verified only, no device run performed |
| 4 | Cart survives kill + relaunch | deferred by user — compile-verified only, no device run performed |
| 5 | Web ↔ mobile cart sync on focus | backend-blocked (F-19-1, user-accepted) |
| 6 | Checkout → order → Library on device | backend-blocked (F-19-1, user-accepted) |
| 7 | Demo/Google sign-in on device | deferred by user — compile-verified only, no device run performed |

## Findings during implementation

**F-19-1 (user-accepted deferral): backend auth middleware contradicts the documented API contract.** The LUTShop Next.js backend on `http://192.168.1.240:3000` (verified as the LUTShop app via server headers) returns `401` with "Authentication required. Please provide a valid session or Bearer token." for **every** endpoint the plans document for mobile use: `GET /api/products`, `GET /api/cart?userId=`, `POST /api/auth/google`, `GET /api/orders?userId=` (probed 2026-10-05, re-probed same day). The mobile app sends no credentials because the planning contract (`mobile-blueprint/project-plan.md` §Identity: "mobile stores this userId and attaches it to all /api/cart and /api/orders queries") is unauthenticated userId-parameterized.

**Disposition (user decision, current chat):** continue the workflow; the auth resolution is explicitly deferred by the user ("we will resolve the google auth after you done"). Consequences accepted until a future fix/feature lands: the device run uses the mock catalog fallback, and checklist items 5–6 (web↔mobile sync, checkout→library) are backend-blocked. This finding must carry forward into the deferred work — the evaluator sync demo does not function against the real backend until it is resolved.

## Notes for the AI

- Never commit `.env` — it is gitignored local config; only `.env.example` is tracked.
- Discover the IP with `ipconfig` (Windows) and pick the adapter on the same network as the phone; confirm with the user before writing `.env`.
- Do not start the Expo dev server or the backend yourself — hand the user the exact commands and wait for their device reports.
- If a checklist item fails on device, stop and diagnose (fetch the exact error from the Expo terminal logs the user pastes) before any code change; a code fix becomes a checklist step in this spec with its own focused check.
- The pending `app.json` dirty change stays excluded from this feature's commit, as in every completion.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":8224,"specSha256":"eebacffa706f8b2f589c8d2c2c664a9542029db7514385864f8dcc39513b42fe","branch":"refs/heads/feature/network-config-physical-device-run","head":"66221181e2af2deb8471302eb8fe39d364622492","baseRef":"refs/heads/main","baseCommit":"66221181e2af2deb8471302eb8fe39d364622492","sourceTree":"a11e73f03e7beb88a3d469945b4646be7dadb7e2","absentOptional":[]} -->
