# Feature: Cinema Product Card & Catalog Screen

**From build-plan:** feature 5
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/cinema-product-card-catalog-screen`

## Goal

Build the dedicated cinema-grade `ProductCard` component with before/after frame inspection toggles and one-tap cart action, and upgrade `ShopScreen` to a high-performance `FlatList` with pull-to-refresh, camera profile filters, and interactive feedback.

## Design reference

Matches the mobile component blueprint in `mobile-blueprint/design-system-tokens.md`:
- Cinema dark card background (`#121318`) with 1px border (`rgba(255, 255, 255, 0.08)`) and rounded corners (`radius.lg: 16`)
- Top media banner (`height: 180`) using `expo-image` with interactive before/after toggle
- Camera specifications row with neon cyan camera curve label and tertiary LUT count
- High-contrast title (`h3`), secondary tagline, rating stars, price display, and neon cyan "+ ADD" CTA button

## In scope

- Create `src/components/product/ProductCard.tsx`:
  - `expo-image` image banner rendering `afterImageUrl` with fallback to `thumbnailUrl`
  - Interactive "LOG / GRADED" preview toggle button allowing users to switch between flat Log footage and graded cinema frames directly on the card
  - Badges via `BadgePill` for custom badges (e.g. "BEST SELLER", "NEW", "PRO PACK") and camera curves
  - Camera specs row (`supportedCameras` summary and `lutCount` count)
  - Product title, tagline, rating display with star icon and review count
  - Price row with current price and optional strikethrough original price
  - "+ ADD" / "ADDED" button with visual feedback on tap
  - Card press callback
- Create barrel export in `src/components/product/index.ts` and update `src/components/index.ts`
- Upgrade `src/app/(tabs)/index.tsx` (Shop screen):
  - Replace vertical `ScrollView` with performant `FlatList`
  - `ListHeaderComponent` with search input, camera filter pills, and active filter counter
  - Pull-to-refresh integration linked to `refresh()` from `useProducts()`
  - Empty state with reset filters action
- Verify with `npx tsc --noEmit` and `npm run lint`

## Out of scope

- Touch-enabled 60fps pan slider divider (`SplitComparisonView`) - deferred to Feature 6
- Full Product Details Screen route - deferred to Feature 7
- Multi-item persistent cart context - deferred to Milestone 4

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Build Cinema Product Card Component** - Create `src/components/product/ProductCard.tsx` with `expo-image` banner, before/after toggle, badge support, camera specs, rating stars, and "+ ADD" button. Export via `src/components/product/index.ts`. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 2 - Upgrade Shop Screen to FlatList with Pull-to-Refresh** - Refactor `src/app/(tabs)/index.tsx` to use `FlatList` rendering `ProductCard` items, with `ListHeaderComponent` (search, camera pills, results counter), pull-to-refresh, and empty state. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 3 - Add Interactive Add-to-Cart Feedback & Card Polish** - Implement temporary "+ ADDED" button feedback state on item selection and add card tap feedback. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0, and cards render fluidly.

## Files / areas

- `src/components/product/ProductCard.tsx` - cinema product card component
- `src/components/product/index.ts` - product components export
- `src/components/index.ts` - top-level components barrel export
- `src/app/(tabs)/index.tsx` - catalog FlatList screen

## Data / contracts

```ts
export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isAdded?: boolean;
}
```

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Visual & interaction verification:
  - Catalog renders all products via `FlatList`
  - Tapping "LOG / GRADED" toggle switches between flat Log and graded images
  - Search and camera pills filter the FlatList instantly
  - Pull-to-refresh triggers catalog re-fetch with spinner
  - Tapping "+ ADD" transitions button to "+ ADDED" feedback

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for all static styles.
- Use `expo-image` for high-performance image caching and transition animations.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":4717,"specSha256":"2c53b27dc4872ed57473604ea16647f7d346c91bbb79f4063c920bc65f10fc89","branch":"refs/heads/feature/cinema-product-card-catalog-screen","head":"4a126aed52d8359a575f5697880676c600785b99","baseRef":"refs/heads/master","baseCommit":"4a126aed52d8359a575f5697880676c600785b99","sourceTree":"0e7a2ccd1cd4798840bbd861b4b164b5d7196d14","absentOptional":[]} -->
