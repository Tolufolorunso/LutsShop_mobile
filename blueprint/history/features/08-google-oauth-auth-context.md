# Feature: Google OAuth & AuthContext

**From build-plan:** feature 8
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/google-oauth-auth-context`

## Goal

Implement the core mobile authentication foundation using `expo-auth-session` with Google identity services, extracting the unique Google `sub` identifier and creator profile from the Google userinfo endpoint, and providing a clean, typed `AuthContext` across the application.

## Design reference

Matches the authentication integration architecture in `mobile-blueprint/google-auth-integration.md` and `blueprint/context/project-overview.md`:
- Cross-platform Google OAuth flow via `expo-auth-session/providers/google` and `expo-web-browser`
- Unified Google `sub` identity mapping for cross-platform account recognition
- Seamless creator state management with `user`, `isLoading`, `error`, `signInWithGoogle`, and `signOut`
- Root layout integration providing immediate authentication state to all routes

## In scope

- Install required OAuth dependencies:
  - `expo-auth-session`
  - `expo-crypto`
- Create `src/types/auth.ts`:
  - `AuthUser`: interface with `id` (Google `sub`), `email`, `fullName`, `avatarUrl`, `isDemo`, and `isPro`
  - `AuthContextType`: interface exposing `user`, `isLoading`, `error`, `signInWithGoogle`, and `signOut`
- Create `src/context/AuthContext.tsx` and `src/context/index.ts`:
  - Call `WebBrowser.maybeCompleteAuthSession()`
  - Configure `Google.useAuthRequest` with web, iOS, and Android client ID configuration from environment variables
  - Handle OAuth redirect responses and exchange `accessToken` at `https://www.googleapis.com/oauth2/v3/userinfo`
  - Map profile data (`sub` -> `id`, `email`, `name`, `picture`) into `AuthUser`
  - Handle cancellation, network failure, and loading transitions cleanly
  - Provide `useAuth()` custom hook with error boundary protection
- Update `src/app/_layout.tsx`:
  - Wrap top-level navigation stack inside `<AuthProvider>`
- Wire authentication triggers in `src/app/(tabs)/account.tsx`:
  - Connect `signInWithGoogle` to the "SIGN IN WITH GOOGLE" button
  - Connect `signOut` to an account sign-out action when logged in
  - Display authenticated creator details (name, email, avatar) when logged in, or guest creator card when logged out
  - Show loading indicator while authentication is in progress
- Verification with `npx tsc --noEmit` and `npm run lint`

## Out of scope

- Backend database profile upsert to `POST /api/auth/google` and persistent AsyncStorage session storage - deferred to Feature 9
- One-tap Alex Turner (`demo-filmmaker-001`) demo login fallback - deferred to Feature 10
- Backend connectivity diagnostics and detailed creator tier status - deferred to Feature 11
- Cloud cart synchronization with user ID - deferred to Milestone 4

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Install OAuth Dependencies & Define Auth Types** - Install `expo-auth-session` and `expo-crypto` via `npx expo install`. Define `AuthUser` and `AuthContextType` interfaces in `src/types/auth.ts` and export from `src/types/index.ts`. *Done when:* packages are listed in `package.json`, and `npx tsc --noEmit` passes with 0 errors.
- [x] **Step 2 - Build AuthContext & Google OAuth Provider** - Create `src/context/AuthContext.tsx` with `WebBrowser.maybeCompleteAuthSession()`, `Google.useAuthRequest`, token-to-userinfo profile resolution, loading and cancellation handling, and `useAuth` hook. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 3 - Wrap Root Layout & Wire Account Screen** - Integrate `<AuthProvider>` into `src/app/_layout.tsx`. Connect `signInWithGoogle` and `signOut` in `src/app/(tabs)/account.tsx` with dynamic signed-in/guest UI states and loading feedback. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0, and Account screen displays active auth status.

## Files / areas

- `package.json` - add `expo-auth-session` and `expo-crypto`
- `src/types/auth.ts` - authentication type definitions
- `src/types/index.ts` - types export barrel
- `src/context/AuthContext.tsx` - authentication context and Google OAuth provider
- `src/context/index.ts` - context barrel export
- `src/app/_layout.tsx` - root provider integration
- `src/app/(tabs)/account.tsx` - account screen auth wiring and state rendering

## Data / contracts

Google Userinfo Response Contract:
```typescript
interface GoogleUserInfo {
  sub: string;           // Unique immutable Google account ID
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}
```

AuthUser Contract:
```typescript
export interface AuthUser {
  id: string;            // Google 'sub' or demo ID
  email: string;
  fullName: string;
  avatarUrl?: string;
  isDemo?: boolean;
  isPro?: boolean;
}
```

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Authentication flow verification:
  - Account screen reflects guest state when not logged in
  - Tapping "SIGN IN WITH GOOGLE" triggers auth session prompt
  - Cancelling prompt returns to screen without errors and clears loading state
  - Sign out resets user state back to guest creator

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for all static styles.
- Call `WebBrowser.maybeCompleteAuthSession()` at top-level module scope in `AuthContext.tsx`.
- Support optional client IDs gracefully without crashing if environment variables are not configured in local development.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":5803,"specSha256":"bcef78aedaabfb1785a4654406e1f6c6f17e87531ef10101ccd8cc0049c8f0db","branch":"refs/heads/feature/google-oauth-auth-context","head":"ee8d543d0fec1c7ebf07b59330f13258943a269c","baseRef":"refs/heads/master","baseCommit":"ee8d543d0fec1c7ebf07b59330f13258943a269c","sourceTree":"47813b813267c714092fcaa54aa8914880154b11","absentOptional":[]} -->
