# Feature: Bottom Tab Navigation Shell

**From build-plan:** feature 3
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/bottom-tab-navigation-shell`

## Goal

Implement the primary navigation architecture of the application: a 4-tab bottom tab bar (Shop, Cart, Library, Account) styled with the cinema dark palette, glassmorphism surface, and neon cyan active accents, establishing the screen hierarchy defined in the architecture plan.

## In scope

- Create `src/app/(tabs)/_layout.tsx` using Expo Router's `Tabs` navigator
- Style bottom tab bar with cinema dark background (`#0a0b0e` / `#121318`), thin top border (`rgba(255, 255, 255, 0.08)`), active neon cyan highlights (`#00E5FF`), and inactive slate gray (`#64748B`)
- Define 4 tab screens with matching Ionicons:
  - Tab 1: **Shop** (`src/app/(tabs)/index.tsx`) with `CinemaHeader`
  - Tab 2: **Cart** (`src/app/(tabs)/cart.tsx`) with `CinemaHeader` and cart badge indicator
  - Tab 3: **Library** (`src/app/(tabs)/library.tsx`) with `CinemaHeader`
  - Tab 4: **Account** (`src/app/(tabs)/account.tsx`) with `CinemaHeader`
- Update root `src/app/_layout.tsx` to mount the `(tabs)` group with transparent transition
- Verify typecheck (`npx tsc --noEmit`) and lint (`npm run lint`) pass with 0 errors

## Out of scope

- Product catalog REST API data fetching - deferred to Milestone 2 (Features 4 and 5)
- Touch-enabled Before/After split comparison slider - deferred to Feature 6
- Google OAuth and Supabase auth flow - deferred to Milestone 3
- Bi-directional cart syncing logic and context - deferred to Milestone 4
- Checkout modal and payment processing - deferred to Milestone 5

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Create Bottom Tabs Layout** - Create `src/app/(tabs)/_layout.tsx` defining the 4 tabs (Shop, Cart, Library, Account) with custom icons, active/inactive color states, and dark cinema styling. *Done when:* layout file compiles cleanly with `npx tsc --noEmit`.
- [x] **Step 2 - Build Tab Screen Shells** - Create `src/app/(tabs)/index.tsx` (Shop), `src/app/(tabs)/cart.tsx` (Cart), `src/app/(tabs)/library.tsx` (Library), and `src/app/(tabs)/account.tsx` (Account) using `CinemaHeader`, `AppText`, `BadgePill`, and `AppButton`. *Done when:* all 4 screens are created and compile with `npx tsc --noEmit`.
- [x] **Step 3 - Mount Tabs in Root Layout & Clean up Entry** - Update `src/app/_layout.tsx` to register `(tabs)` and remove standalone `src/app/index.tsx` so `(tabs)/index.tsx` acts as the primary app entry. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0.

## Files / areas

- `src/app/(tabs)/_layout.tsx` - tab navigation layout
- `src/app/(tabs)/index.tsx` - shop tab screen
- `src/app/(tabs)/cart.tsx` - cart tab screen
- `src/app/(tabs)/library.tsx` - library tab screen
- `src/app/(tabs)/account.tsx` - account tab screen
- `src/app/_layout.tsx` - root stack layout update
- `src/app/index.tsx` - removed/replaced by `(tabs)/index.tsx`

## Data / contracts

Tab Routes:
- `/(tabs)` or `/(tabs)/` -> Shop Tab
- `/(tabs)/cart` -> Cart Tab
- `/(tabs)/library` -> Library Tab
- `/(tabs)/account` -> Account Tab

Tab Bar Visual Contract:
- `tabBarStyle`: `backgroundColor: CinemaTheme.colors.cardElevated`, `borderTopColor: CinemaTheme.colors.divider`, `borderTopWidth: 1`, `height: 60` (adjusted for insets)
- `tabBarActiveTintColor`: `CinemaTheme.colors.primary` (`#00E5FF`)
- `tabBarInactiveTintColor`: `CinemaTheme.colors.textTertiary` (`#64748B`)
- Tab Bar Icons: `bag-handle` / `bag-handle-outline`, `cart` / `cart-outline`, `film` / `film-outline`, `person` / `person-outline`

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Visual verification: App launches into Shop tab with bottom navigation bar displaying all 4 tabs; tapping each tab switches screens smoothly

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for static styles per coding standards.
- Follow TypeScript strict typing rules.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":4305,"specSha256":"67cb78ce0cf0ccd3dd0c95336698453e01f66c427c61e80569a6749eaf9ed006","branch":"refs/heads/feature/bottom-tab-navigation-shell","head":"db179896727ae15e555fa8b4b6ef00682fc5d789","baseRef":"refs/heads/master","baseCommit":"db179896727ae15e555fa8b4b6ef00682fc5d789","sourceTree":"aa328c2dda6ce65a5a6e0f742197791d3afbdfc4","absentOptional":[]} -->
