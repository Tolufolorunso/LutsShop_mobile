# Feature: Profile & Account Screen

**From build-plan:** feature 11
**Build attempt:** 1
**Status:** verified
**Branch:** feature/profile-account-screen

## Goal

Deliver a comprehensive, cinema-grade Profile & Account screen displaying creator identity (avatar, name, email), subscription status (Pro Creator vs Standard Creator vs Demo Evaluator), cross-platform Google authentication controls, live backend connectivity diagnostics with ping latency measurement, and filmmaker creative preferences.

## Design reference

Matches `mobile-blueprint/build-plan.md` (item 11) and `blueprint/context/project-overview.md`:
- CinemaTheme dark aesthetics (`#0a0b0e` background, `#00E5FF` primary cyan, `#FFB800` accent gold)
- Pro Creator Pass card with tiered privilege indicators
- Interactive backend connectivity diagnostic tool with live ping latency testing
- Seamless Google OAuth and one-tap Demo Mode (Alex Turner) controls
- Filmmaker creative profile preferences (default camera profile, preview engine)

## In scope

- Create `src/hooks/useBackendDiagnostics.ts`:
  - Ping backend API endpoint to measure round-trip latency in milliseconds
  - Track connectivity status ('checking', 'connected', 'degraded', 'offline')
  - Record last ping timestamp
- Update `src/context/AuthContext.tsx`:
  - Add `toggleProTier: () => Promise<void>` to allow evaluators and creators to simulate switching between Free and Pro subscription tiers
- Update `src/app/(tabs)/account.tsx`:
  - Refined Creator Profile Card with avatar, full name, email, and subscription badge
  - Subscription Pass Card displaying current tier benefits (Pro Suite vs Free Filmmaker vs Demo Pass)
  - Interactive "PING SERVER" action in System Diagnostics showing round-trip latency
  - Filmmaker Preferences section (default camera profile selection, split preview engine info, app version)
  - Full Google sign-in, Demo sign-in, and sign-out controls

## Out of scope

- Bi-directional cart synchronization (Milestone 4, Feature 12)
- Order checkout and simulated payment processing (Milestone 5, Feature 16)
- Digital license download management (Milestone 5, Feature 18)
- External image picker or camera upload for avatar (uses Google profile image or demo avatar)

## Build loop

- Standard Blueprint workflow: `workflow.stepReview: "feature"` and `workflow.checkpointCommits: "disabled"`.
- Continuous type checking and lint validation throughout implementation.
- Single review packet presented after all implementation steps complete.
- `/complete` archives the spec, updates plans, and creates the squashed feature commit on master.

## Build steps

- [x] 1. **Implement useBackendDiagnostics hook for live connectivity testing**
  - Create `src/hooks/useBackendDiagnostics.ts` measuring ping latency to `API_BASE_URL/api/products` using `apiClient`.
  - Expose `latencyMs`, `status`, `lastChecked`, and `checkConnection()` callback.
  - *Done when:* `src/hooks/useBackendDiagnostics.ts` exports `useBackendDiagnostics` and passes `npx tsc --noEmit`.

- [x] 2. **Add toggleProTier to AuthContext for evaluator tier testing**
  - In `src/types/auth.ts`, add `toggleProTier: () => Promise<void>` to `AuthContextType`.
  - In `src/context/AuthContext.tsx`, implement `toggleProTier` which toggles `user.isPro`, persists the updated user to `AsyncStorage`, and updates state.
  - *Done when:* `AuthContext` provides `toggleProTier` and passes `npx tsc --noEmit`.

- [x] 3. **Assemble enhanced Profile & Account Screen**
  - In `src/app/(tabs)/account.tsx`, integrate `useBackendDiagnostics` with live "TEST PING" action and latency readout.
  - Build Subscription Tier Card showing Pro vs Standard benefits and "TOGGLE PRO TIER" evaluator tool.
  - Add Filmmaker Creative Preferences card with default camera profile and preview engine info.
  - Polish layout, typography, and badges according to CinemaTheme tokens.
  - *Done when:* `AccountScreen` renders the complete profile, subscription tier, live diagnostics ping, and preferences, passing `npm run lint` and `npx tsc --noEmit`.

## Files / areas

- `src/hooks/useBackendDiagnostics.ts`: live backend ping hook
- `src/types/auth.ts`: add `toggleProTier` to `AuthContextType`
- `src/context/AuthContext.tsx`: implement `toggleProTier`
- `src/app/(tabs)/account.tsx`: enhanced profile, subscription pass, diagnostics, and preferences

## Data / contracts

- `BackendDiagnostics`:
  ```typescript
  export interface BackendDiagnostics {
    latencyMs: number | null;
    status: 'checking' | 'connected' | 'degraded' | 'offline';
    lastChecked: string | null;
    checkConnection: () => Promise<void>;
  }
  ```
- Local storage key: `@lutshop_mobile_user`
- Storage update on Pro toggle: `{ ...user, isPro: !user.isPro }`

## Testing

- Type verification: `npx tsc --noEmit`
- Linter verification: `npm run lint` (`expo lint`)
- Manual verification:
  1. Open Account tab, tap "TEST PING" in System Diagnostics, confirm latency response.
  2. In Demo mode or signed-in state, tap "TOGGLE PRO PASS" and verify tier badge changes between `PRO SUITE` and standard tier.
  3. Verify sign-in, demo sign-in, and sign-out function smoothly with correct UI updates.

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Maintain strict typing with no `any` types.
- Ensure state updates in effects or callbacks do not trigger React linting warnings.
- Keep the design clean, premium, and filmic with high-contrast cinema theme styling.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":5499,"specSha256":"5def97ee9f52bc2553a845608231cff15e62b0ec072c683ca51bdcf8412b4ed4","branch":"refs/heads/feature/profile-account-screen","head":"ef572dd7324e6eba91d49c06a27af159d59b6a91","baseRef":"refs/heads/master","baseCommit":"ef572dd7324e6eba91d49c06a27af159d59b6a91","sourceTree":"91577996f4f633aa94e66851052c3bff8492e096","absentOptional":[]} -->
