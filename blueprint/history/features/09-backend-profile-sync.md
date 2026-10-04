# Feature: Backend Profile Sync

**From build-plan:** feature 9
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/backend-profile-sync`

## Goal

Synchronize authenticated mobile creator profiles with the LUTShop backend via `POST /api/auth/google` to upsert profiles into Supabase and establish cross-platform user identity, with persistent local session caching using AsyncStorage (`@lutshop_mobile_user`) and resilient offline fallback.

## Design reference

Matches the authentication integration architecture in `mobile-blueprint/google-auth-integration.md` and `blueprint/context/project-overview.md`:
- Shared database identity: Google `sub` is persisted to `profiles.id` in Supabase
- Persistent local session storage under `@lutshop_mobile_user`
- Transparent offline resilience: local state is preserved if the backend is unreachable or local development server is disconnected
- Diagnostic visibility: Account screen reflects backend synchronization state

## In scope

- Update `src/context/AuthContext.tsx`:
  - Add session hydration on startup from AsyncStorage (`@lutshop_mobile_user`)
  - Add persistent session storage on sign-in and session clearance on sign-out
  - Implement `syncUserProfileWithBackend` calling `POST /api/auth/google` with payload (`id`, `email`, `fullName`, `avatarUrl`)
  - Handle backend profile response to update user attributes (such as `isPro`)
  - Track `syncStatus` (`'idle' | 'syncing' | 'synced' | 'offline'`) in context
- Update `src/types/auth.ts`:
  - Add `syncStatus` to `AuthContextType`
  - Define `BackendProfileResponse` interface
- Update `src/app/(tabs)/account.tsx`:
  - Display live Backend Sync Status (`SYNCED TO BACKEND`, `OFFLINE (CACHED)`, or `IDLE`) in System Diagnostics
  - Display active `API_BASE_URL` target
- Verification with `npx tsc --noEmit` and `npm run lint`

## Out of scope

- One-tap Alex Turner demo account login fallback - deferred to Feature 10
- Detailed account screen UI polish, creator tier cards, and order counts - deferred to Feature 11
- Multi-item cart synchronization with user ID - deferred to Milestone 4

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - AsyncStorage Session Persistence** - In `src/context/AuthContext.tsx`, load cached user from `@lutshop_mobile_user` on component mount, persist user on login, and remove item on sign-out. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 2 - Backend Sync Client & Profile Upsert** - Implement `syncUserProfileWithBackend` calling `POST /api/auth/google` via `apiClient.post`, update `user.isPro` if returned by backend, and catch network failures gracefully without blocking local authentication. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 3 - Sync Status Diagnostics & Verification** - Expose `syncStatus` in `AuthContextType` and render live synchronization state in `AccountScreen` System Diagnostics card. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0.

## Files / areas

- `src/types/auth.ts` - add `syncStatus` and backend profile response types
- `src/context/AuthContext.tsx` - session hydration, AsyncStorage caching, backend sync
- `src/app/(tabs)/account.tsx` - sync state diagnostics display

## Data / contracts

Storage Key:
`@lutshop_mobile_user`

Backend Profile Payload:
```typescript
interface ProfileSyncPayload {
  id: string;        // Google sub identifier
  email: string;
  fullName: string;
  avatarUrl?: string;
}
```

Backend Profile Response:
```typescript
interface BackendProfileResponse {
  profile?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    is_pro?: boolean;
    created_at?: string;
    updated_at?: string;
  };
}
```

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Session and sync verification:
  - Stored user session reloads automatically on startup
  - Sign-in triggers background sync to `POST /api/auth/google`
  - If backend is offline, local user remains authenticated with `syncStatus: 'offline'`
  - Sign-out removes `@lutshop_mobile_user` from AsyncStorage

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for all static styles.
- Always use `try / catch` around AsyncStorage and network operations to prevent crashes.
- Import `apiClient` or `API_BASE_URL` from `@/config/api`.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":4707,"specSha256":"87f68925fb6e3118adaf21578e5501ddf3829ed962cd2d74837426f8854ecdd0","branch":"refs/heads/feature/backend-profile-sync","head":"f09a4fea44650914924f7c8b041f289aedb21483","baseRef":"refs/heads/master","baseCommit":"f09a4fea44650914924f7c8b041f289aedb21483","sourceTree":"b3b218df87e7beb37732d9bcfd57b07913c9c884","absentOptional":[]} -->
