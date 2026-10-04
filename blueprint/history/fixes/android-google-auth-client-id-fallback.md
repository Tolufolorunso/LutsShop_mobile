# Fix: Android Google Auth Client ID Fallback

**Type:** Fix
**Status:** verified
**Branch:** fix/android-google-auth-client-id-fallback

## The problem

When running on Android devices or emulators, `expo-auth-session/providers/google` invokes an invariant assertion checking that `androidClientId` (or `clientId`) is defined. If environment variables `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_CLIENT_ID` are not configured in `.env`, the hook throws an unhandled synchronous exception during `AuthProvider` rendering:
`[Error: Client Id property androidClientId must be defined to use Google auth on this platform.]`
This completely crashes the application on Android at startup, preventing evaluators from testing the app or using Demo Mode.

## The fix

1. In `src/context/AuthContext.tsx`:
   - Provide safe fallback client ID strings to `Google.useAuthRequest` so `invariantClientId` never throws at render time on Android, iOS, or Web.
   - Detect whether genuine Google credentials are configured via `isGoogleConfigured`.
   - In `signInWithGoogle`, guard against unconfigured credentials by displaying a friendly in-app notification directing the creator to use Demo Mode or configure their `.env` file, avoiding any app crash.
2. Create `.env.example` in the project root documenting all optional Google OAuth keys (`EXPO_PUBLIC_GOOGLE_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`) and backend URL.

## Build steps

- [x] 1. **Add resilient client ID fallbacks and configuration guard in AuthContext**
  - Update `src/context/AuthContext.tsx` with fallback client IDs for Android, iOS, and Web.
  - Guard `signInWithGoogle` to show a user-friendly error message when Google keys are missing.
  - *Done when:* `src/context/AuthContext.tsx` boots safely on Android without throwing an unhandled exception, verified with `npx tsc --noEmit` and `npm run lint`.

- [x] 2. **Create .env.example with beginner setup instructions**
  - Add `.env.example` detailing `EXPO_PUBLIC_API_BASE_URL` and all Google OAuth Client ID environment variables.
  - *Done when:* `.env.example` exists and documents configuration keys.

## Verify

1. Run `npm run lint` and `npx tsc --noEmit`.
2. Observe app startup on Android: no RedBox crash on launch.
3. Tap "SIGN IN AS DEMO (ALEX TURNER)": instant authentication without needing Google Cloud credentials.
4. Tap "SIGN IN WITH GOOGLE" without credentials configured: displays friendly message in error banner rather than crashing the app.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":2543,"specSha256":"09ea45bfb683427cd3cd68279ed96897bdec64e34f305187f3c1083a65d66b51","branch":"refs/heads/fix/android-google-auth-client-id-fallback","head":"b11c70533ba9d72ba9c7a65d02bf76306e9d5cfa","baseRef":"refs/heads/master","baseCommit":"b11c70533ba9d72ba9c7a65d02bf76306e9d5cfa","sourceTree":"b8a6e86e1baee5936d134db26deb003f2b2970d0","absentOptional":[]} -->
