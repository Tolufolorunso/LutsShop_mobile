# Feature: Core Reusable UI Components

**From build-plan:** feature 2
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/core-reusable-ui-components`

## Goal

Build the foundational, reusable cinema-styled UI components that will power all screens in the application: `CinemaHeader`, `AppButton`, `AppText`, `BadgePill`, and `CinemaCard`, matching the design tokens established in Feature 1.

## In scope

- Create `AppText` component supporting typography variants (`h1`, `h2`, `h3`, `body`, `bodyBold`, `caption`, `badge`) and color overrides
- Create `AppButton` component supporting `primary` (solid neon cyan), `outline` (cyan border), and `secondary` variants, with `disabled` and `loading` states
- Create `BadgePill` component for camera profiles, "BEST SELLER" gold badges, and Pro status tags
- Create `CinemaCard` container component supporting elevated dark styling, custom padding, and optional press handling
- Create `CinemaHeader` component featuring brand logo/title, optional back button, and top-right cart button with dynamic count badge
- Export all components cleanly through `src/components/ui/index.ts`
- Update `src/app/index.tsx` to display a component showcase verifying visual fidelity and touch responsiveness
- Verify typecheck (`npx tsc --noEmit`) and lint (`npm run lint`) pass with 0 errors

## Out of scope

- Bottom Tab navigation shell - deferred to Feature 3
- Product catalog data fetching and `ProductCard` - deferred to Milestone 2
- Before/After split comparison slider - deferred to Feature 6
- Authentication and cart state integration - deferred to Milestones 3 and 4

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Build AppText and BadgePill components** - Create `src/components/ui/AppText.tsx` and `src/components/ui/BadgePill.tsx` with full TypeScript interfaces and theme token bindings. *Done when:* both components compile cleanly with `npx tsc --noEmit` and support all designated variants.
- [x] **Step 2 - Build AppButton and CinemaCard components** - Create `src/components/ui/AppButton.tsx` and `src/components/ui/CinemaCard.tsx` with active touch states, loading indicators, and dark surface styling. *Done when:* both components compile cleanly with `npx tsc --noEmit`.
- [x] **Step 3 - Build CinemaHeader and UI showcase** - Create `src/components/ui/CinemaHeader.tsx`, export all UI components from `src/components/ui/index.ts`, and update `src/app/index.tsx` with a live component showcase demonstrating each variant. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0.

## Files / areas

- `src/components/ui/AppText.tsx` - typography component
- `src/components/ui/BadgePill.tsx` - badge and camera pill component
- `src/components/ui/AppButton.tsx` - primary, outline, and secondary buttons
- `src/components/ui/CinemaCard.tsx` - dark surface container
- `src/components/ui/CinemaHeader.tsx` - branded header with cart badge
- `src/components/ui/index.ts` - barrel export
- `src/app/index.tsx` - showcase screen

## Data / contracts

Component props interfaces:
- `AppTextProps`: `variant` (`h1` | `h2` | `h3` | `body` | `bodyBold` | `caption` | `badge`), `color` (string), `numberOfLines` (number), `style` (StyleProp<TextStyle>), `children`
- `BadgePillProps`: `label` (string), `variant` (`primary` | `gold` | `camera` | `success` | `error`), `size` (`sm` | `md`)
- `AppButtonProps`: `title` (string), `onPress` (() => void), `variant` (`primary` | `outline` | `secondary`), `loading` (boolean), `disabled` (boolean), `icon` (ReactNode)
- `CinemaCardProps`: `children`, `style` (StyleProp<ViewStyle>), `elevated` (boolean), `onPress` (() => void)
- `CinemaHeaderProps`: `title` (string), `subtitle` (string), `showBack` (boolean), `onBack` (() => void), `cartCount` (number), `onCartPress` (() => void)

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Visual verification: showcase in `src/app/index.tsx` displays buttons, badges, typography, cards, and header on the cinema dark background

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for static styles per coding standards.
- Follow TypeScript strict typing rules.

<!-- blueprint:completion {"schemaVersion":1,"specBytes":4491,"specSha256":"f8eca579b288a1e1713478fc2592d7fbf948a871b25f80dd81cec457fb63f968","branch":"refs/heads/feature/core-reusable-ui-components","head":"60d95aec364af0a0382f46acfba059f6fe9b59a9","baseRef":"refs/heads/master","baseCommit":"60d95aec364af0a0382f46acfba059f6fe9b59a9","sourceTree":"f9c592f2c74a0ebe1de13392261f597f463daceb","absentOptional":[]} -->
