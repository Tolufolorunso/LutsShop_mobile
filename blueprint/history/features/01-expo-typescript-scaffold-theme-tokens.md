# Feature: Expo TypeScript Scaffold & Theme Tokens

**From build-plan:** feature 1
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/expo-typescript-scaffold-theme-tokens`

## Goal

Establish the core runtime foundations and styling system for the LUTShop mobile app by installing required navigation and storage dependencies, implementing the complete Cinema Theme tokens in `src/theme/index.ts`, and configuring the root layout with the cinema dark background and light status bar.

## In scope

- Install essential mobile dependencies: `@react-native-async-storage/async-storage` and `@expo/vector-icons`
- Implement complete `CinemaTheme` tokens in `src/theme/index.ts` (colors, radius, spacing, typography) matching `mobile-blueprint/design-system-tokens.md`
- Configure root stack layout in `src/app/_layout.tsx` with cinema dark background (`#0a0b0e`), `StatusBar` set to light content, and `SafeAreaProvider`
- Update `src/app/index.tsx` to render a themed placeholder screen verifying theme tokens
- Verify project passes typecheck (`npx tsc --noEmit`) and lint (`npm run lint`)

## Out of scope

- Reusable UI components (`CinemaHeader`, `AppButton`, `BadgePill`, `CinemaCard`) - deferred to Feature 2
- Bottom Tab navigation shell - deferred to Feature 3
- Product catalog, API integration, auth, cart, or checkout - deferred to Milestones 2-5

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Install foundational dependencies** - Install `@react-native-async-storage/async-storage` and `@expo/vector-icons` via Expo CLI/npm. *Done when:* packages are listed in `package.json` dependencies and `npx tsc --noEmit` runs without missing package errors.
- [x] **Step 2 - Define CinemaTheme tokens** - Create `src/theme/index.ts` exporting `CinemaTheme` with colors (deep cinema blacks, neon cyan, electric cobalt, gold, text hierarchy), radius, spacing, and typography scales. *Done when:* `src/theme/index.ts` is created, typed, exported, and compiles cleanly with `npx tsc --noEmit`.
- [x] **Step 3 - Configure Root Layout & Screen** - Update `src/app/_layout.tsx` to wrap the app with `SafeAreaProvider`, render `StatusBar` with `style="light"`, set Stack screen background to `CinemaTheme.colors.background`, and update `src/app/index.tsx` to display a branded cinema dark preview screen. *Done when:* both files use `CinemaTheme`, typecheck cleanly, and `npm run lint` passes with 0 errors.

## Files / areas

- `package.json` - dependencies update
- `src/theme/index.ts` - new theme tokens file
- `src/app/_layout.tsx` - root layout configuration
- `src/app/index.tsx` - initial entry screen preview

## Data / contracts

`CinemaTheme` object in `src/theme/index.ts`:
- `colors`: `background` (`#0a0b0e`), `card` (`#121318`), `cardElevated` (`#181920`), `cardHover` (`#1f2029`), `primary` (`#00E5FF`), `primaryGlow` (`rgba(0, 229, 255, 0.15)`), `secondary` (`#2979FF`), `accentGold` (`#FFD700`), `textPrimary` (`#F0F4F8`), `textSecondary` (`#94A3B8`), `textTertiary` (`#64748B`), `success` (`#00E676`), `warning` (`#FFB300`), `error` (`#FF1744`), `divider` (`rgba(255, 255, 255, 0.08)`), `glassmorphism` (`rgba(10, 11, 14, 0.85)`), `modalOverlay` (`rgba(0, 0, 0, 0.75)`)
- `radius`: `xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (24), `pill` (9999)
- `spacing`: `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32)
- `typography`: `h1`, `h2`, `h3`, `body`, `bodyBold`, `caption`, `badge`

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Visual verification: preview screen in `src/app/index.tsx` renders with cinema dark background and neon cyan accents

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for static styles per coding standards.
- Follow TypeScript strict typing rules.

<!-- blueprint:completion {"schemaVersion":1,"specBytes":4075,"specSha256":"2628027135f1ba58d04683b6d4cdfe519fc4da0d60c3df795ba841a95ec6f416","branch":"refs/heads/feature/expo-typescript-scaffold-theme-tokens","head":"39384f4f1f9cc7663b6d4ffbef86b8d66ef07738","baseRef":"refs/heads/master","baseCommit":"39384f4f1f9cc7663b6d4ffbef86b8d66ef07738","sourceTree":"1845811530a74b6c9f58d25457e17b1939ad0c49","absentOptional":[]} -->
