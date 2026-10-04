# Feature: Product Details Screen

**From build-plan:** feature 7
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/product-details-screen`

## Goal

Build the dedicated `ProductDetailScreen` route (`src/app/product/[slug].tsx`) featuring a full-width touch-enabled split slider comparison, comprehensive technical specifications (camera curves, color space, LUT count), creative description, and fixed sticky bottom purchase bar.

## Design reference

Matches the product details blueprint in `mobile-blueprint/design-system-tokens.md` and `mobile-blueprint/build-plan.md`:
- Cinema dark canvas background (`#0a0b0e`)
- Top custom header with back navigation button and cart badge
- High-resolution `SplitComparisonView` banner (height 280px) with interactive divider
- Metadata badges for category, camera profile, and promotion status
- Detailed technical specs card displaying camera curves, color space target, and package format
- Sticky elevated bottom bar with safe area insets, price display, and primary "+ ADD TO CART" CTA

## In scope

- Create `src/app/product/[slug].tsx`:
  - Parameterized route extracting `slug` via `useLocalSearchParams`
  - Data loading via `useProduct(slug)` with loading spinner and not-found states
  - Custom top header with back button (`chevron-back`), product title, and cart shortcut
  - Full-width `SplitComparisonView` with before/after labels
  - Badge row, title (`h1`), tagline, and star rating display
  - Creative description card explaining narrative tone and color calibration
  - Technical specifications card formatted with camera curves, color space, file format, and package size
  - Sticky bottom purchase bar with current price, original price strikethrough, and "+ ADD TO CART" button
- Update root `src/app/_layout.tsx` to configure `product/[slug]` stack screen with custom transition
- Wire card presses in `src/app/(tabs)/index.tsx` to `router.push(`/product/${product.slug}`)`
- Verify with `npx tsc --noEmit` and `npm run lint`

## Out of scope

- Google OAuth & Supabase authentication - deferred to Milestone 3 (Features 8-11)
- Persistent multi-item cart state across screens - deferred to Milestone 4 (Features 12-15)

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Create Product Details Route Shell & Header** - Create `src/app/product/[slug].tsx` with `useLocalSearchParams`, `useProduct`, top header with back button, and loading/error states. Register in `src/app/_layout.tsx`. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 2 - Render Split Slider & Content Cards** - Embed `SplitComparisonView`, title, badges, ratings, creative description card, and technical specifications grid. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 3 - Add Sticky Purchase Bar & Wire Navigation** - Add sticky bottom purchase bar with safe area insets and price display, and wire card presses in `src/app/(tabs)/index.tsx` to navigate to `/product/[slug]`. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0, and tapping a card navigates to its details screen.

## Files / areas

- `src/app/product/[slug].tsx` - product details screen route
- `src/app/_layout.tsx` - root stack layout registration
- `src/app/(tabs)/index.tsx` - shop screen navigation wiring

## Data / contracts

Route: `/product/[slug]` (e.g. `/product/venice-gold`, `/product/tokyo-neon`)

Sticky Purchase Bar Contract:
- `backgroundColor: CinemaTheme.colors.cardElevated`
- `borderTopWidth: 1`, `borderTopColor: CinemaTheme.colors.divider`
- `paddingHorizontal: CinemaTheme.spacing.md`
- Bottom safe area padding via `useSafeAreaInsets`

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Navigation verification:
  - Tapping a product card in Shop navigates to `/product/[slug]`
  - Back button returns smoothly to Shop
  - Full-width split slider in details screen responds to touch drag at 60fps
  - Technical specifications and narrative description display accurately

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for all static styles.
- Support safe area bottom insets for the sticky purchase bar.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":4509,"specSha256":"1c1b957257af475c76d1993381875f7fd5ab3623de953af119b02a913c43c12c","branch":"refs/heads/feature/product-details-screen","head":"f3ada1fd14f493403e7dfb9e4edd7b7dde775527","baseRef":"refs/heads/master","baseCommit":"f3ada1fd14f493403e7dfb9e4edd7b7dde775527","sourceTree":"a78bc89d4ac2d7ca8b24adee09094ae40329a816","absentOptional":[]} -->
