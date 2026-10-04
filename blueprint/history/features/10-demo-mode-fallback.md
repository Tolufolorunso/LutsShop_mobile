# Feature: Demo Mode Fallback

**From build-plan:** feature 10
**Build attempt:** 1
**Status:** verified
**Branch:** feature/demo-mode-fallback

## Goal

Provide a frictionless, one-tap demo authentication mechanism that signs in as Alex Turner (`demo-filmmaker-001`), matching the web demo account for evaluator testing, persisting the session in AsyncStorage, synchronizing with the backend, and displaying demo evaluator indicators.

## Design reference

Matches the architecture in `mobile-blueprint/google-auth-integration.md` and `blueprint/context/project-overview.md`:
- Fixed evaluator credentials: `demo-filmmaker-001`, `alex.turner@cinema.raw`, `Alex Turner`
- Shared cross-platform identity: matches the desktop web demo user so evaluators can inspect cross-platform synchronization
- One-tap sign-in button: "SIGN IN AS DEMO (ALEX TURNER)" on the Account tab
- Persistent local session storage: cached under `@lutshop_mobile_user`
- Resilient offline fallback: evaluator can sign in even if the backend server is unreachable

## In scope

- Update `src/types/auth.ts`:
  - Define and export `DEMO_USER` constant with fixed evaluator credentials
  - Add `signInAsDemo: () => Promise<void>` to `AuthContextType`
- Update `src/context/AuthContext.tsx`:
  - Implement `signInAsDemo` function:
    - Sets local `user` state to `DEMO_USER`
    - Caches session in `AsyncStorage` (`@lutshop_mobile_user`)
    - Initiates backend profile sync (`POST /api/auth/google`) to upsert demo profile in Supabase
    - Updates local user state if backend returns enriched attributes (such as `isPro`)
    - Handles offline/network errors without blocking the demo experience
  - Provide `signInAsDemo` through `AuthContext.Provider`
- Update `src/app/(tabs)/account.tsx`:
  - Wire `signInAsDemo` to the "SIGN IN AS DEMO (ALEX TURNER)" button
  - When signed in as demo user (`user?.isDemo`):
    - Show `DEMO EVALUATOR` badge in the profile header
    - Display demo authentication card status with explanation of cross-platform evaluator identity
    - Display `DEMO MODE (ALEX TURNER)` in System Diagnostics identity row
    - Allow complete sign out returning to guest state

## Out of scope

- Cart synchronization and badge management (Milestone 4, Features 12 to 15)
- User profile editing or photo upload (Feature 11)
- Mocking orders or library purchases (Milestone 5)
- Multiple custom demo accounts (only Alex Turner `demo-filmmaker-001` is required)

## Build loop

- Standard Blueprint workflow: `workflow.stepReview: "feature"` and `workflow.checkpointCommits: "disabled"`.
- All steps are implemented iteratively and verified with type checking and linting.
- Single review packet presented after all implementation steps complete.
- `/complete` runs final safety checks, archives the spec, updates plans, and creates the squashed feature commit.

## Build steps

- [x] 1. **Export DEMO_USER and update AuthContextType in auth types**
  - Define `DEMO_USER: AuthUser` in `src/types/auth.ts` with `id: 'demo-filmmaker-001'`, `email: 'alex.turner@cinema.raw'`, `fullName: 'Alex Turner'`, `avatarUrl`, `isDemo: true`, `isPro: false`.
  - Add `signInAsDemo: () => Promise<void>` to `AuthContextType`.
  - *Done when:* `src/types/auth.ts` exports `DEMO_USER` and `AuthContextType` contains `signInAsDemo`, verified with `npx tsc --noEmit`.

- [x] 2. **Implement signInAsDemo in AuthContext**
  - Implement `signInAsDemo` callback in `src/context/AuthContext.tsx`.
  - Save `DEMO_USER` to `AsyncStorage` under `@lutshop_mobile_user`.
  - Trigger `syncUserProfileWithBackend(DEMO_USER)`.
  - Handle offline/error conditions gracefully so demo access succeeds immediately even when disconnected.
  - Expose `signInAsDemo` in the context provider value.
  - *Done when:* `src/context/AuthContext.tsx` exports functional `signInAsDemo` adhering to `AuthContextType`, verified with `npx tsc --noEmit`.

- [x] 3. **Wire Demo Mode in Account screen and add evaluator UI indicators**
  - In `src/app/(tabs)/account.tsx`, connect `signInAsDemo` to the demo button's `onPress` prop.
  - Update profile badge to display `DEMO EVALUATOR` (variant 'gold') when `user?.isDemo` is true.
  - Update authentication status banner to clearly indicate active demo mode and shared `demo-filmmaker-001` evaluator ID.
  - Update diagnostics card to show `DEMO MODE (EVALUATOR)` under Identity Service.
  - Verify sign-out restores guest state cleanly.
  - *Done when:* `src/app/(tabs)/account.tsx` enables one-tap demo sign-in and shows demo status indicators, verified by passing `npm run lint` and `npx tsc --noEmit`.

## Files / areas

- `src/types/auth.ts`: define `DEMO_USER` constant and add `signInAsDemo` to `AuthContextType`
- `src/context/AuthContext.tsx`: implement `signInAsDemo` with persistence and backend sync
- `src/app/(tabs)/account.tsx`: connect demo sign-in handler, add demo evaluator badges and status messages

## Data / contracts

- `DEMO_USER`:
  ```typescript
  export const DEMO_USER: AuthUser = {
    id: 'demo-filmmaker-001',
    email: 'alex.turner@cinema.raw',
    fullName: 'Alex Turner',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isDemo: true,
    isPro: false,
  };
  ```
- Local storage key: `@lutshop_mobile_user`
- Remote sync endpoint: `POST /api/auth/google` with payload `{ id: 'demo-filmmaker-001', email: 'alex.turner@cinema.raw', fullName: 'Alex Turner', avatarUrl: string }`

## Testing

- Type verification: `npx tsc --noEmit`
- Linter verification: `npm run lint` (`expo lint`)
- Manual verification: tap "SIGN IN AS DEMO (ALEX TURNER)" on the Account tab, confirm instant switch to Alex Turner profile with `DEMO EVALUATOR` badge and `demo-filmmaker-001` ID, confirm backend sync status indicator, verify sign out returns to guest.

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Maintain strict typing with no `any` types.
- Ensure state updates in effects or callbacks do not trigger React linting warnings.
- Keep the demo sign-in resilient: if backend sync fails (offline mode), the demo user must still be active locally.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":6174,"specSha256":"5fdd5c393f27057e9f99f85408ed8f6e413217f746937a086f79ee280c97ef83","branch":"refs/heads/feature/demo-mode-fallback","head":"dc0e27e5182434f6c0a5b3dab3777a92d41dc85c","baseRef":"refs/heads/master","baseCommit":"dc0e27e5182434f6c0a5b3dab3777a92d41dc85c","sourceTree":"6805288e983a8799c1f560b4143137545006754a","absentOptional":[]} -->
