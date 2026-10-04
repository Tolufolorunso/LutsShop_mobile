# Feature: Touch-Enabled Before/After Split Comparison Slider

**From build-plan:** feature 6
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/touch-enabled-before-after-split-slider`

## Goal

Build the headline interactive feature of Milestone 2: a high-performance touch-enabled `SplitComparisonView` component powered by `PanResponder` and `expo-image`, enabling filmmakers to drag a neon cyan divider handle across raw camera Log footage versus graded cinema footage in real time with smooth 60fps response.

## Design reference

Matches the split slider blueprint in `mobile-blueprint/design-system-tokens.md`:
- Black canvas container with rounded borders (`radius.lg: 16`) and overflow clipping
- Background layer: graded cinema image (`afterUrl`)
- Clipped foreground layer: flat Log image (`beforeUrl`) constrained by dynamic width
- 2px neon cyan divider bar (`CinemaTheme.colors.primary: #00E5FF`)
- Circular handle: 32x32px circular knob in neon cyan with directional chevron arrows and shadow glow
- Floating "RAW LOG" and "GRADED" indicators

## In scope

- Create `src/components/slider/SplitComparisonView.tsx`:
  - `PanResponder` implementation with horizontal intent threshold to prevent gesture conflicts with vertical parent scrolling
  - Dynamic container width measurement via `onLayout`
  - Position clamping (`0.02` to `0.98`) to keep divider knob on screen
  - Tap-to-jump gesture support to move divider on direct press
  - Floating badges for "RAW LOG" (left) and "GRADED" (right)
  - Customizable height and border styling
- Create barrel export in `src/components/slider/index.ts` and update `src/components/index.ts`
- Integrate into `ShopScreen`:
  - Featured Split Hero banner at top of catalog displaying live interactive slider for the featured LUT pack
  - Interactive "SPLIT VIEW" modal sheet accessible from any product card
- Verify with `npx tsc --noEmit` and `npm run lint`

## Out of scope

- Full Product Details Screen route - deferred to Feature 7
- Multi-item persistent cart context - deferred to Milestone 4

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Build SplitComparisonView Component** - Create `src/components/slider/SplitComparisonView.tsx` with `PanResponder`, clipped image layout, neon cyan divider line, circular handle knob, and before/after text badges. Export via `src/components/slider/index.ts`. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 2 - Integrate Split Hero in Shop Screen** - Add interactive Featured Split Hero banner at top of `ShopScreen` above the catalog list, rendering the featured pack's before/after comparison. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 3 - Add Fullscreen Split Modal & Gesture Tuning** - Add interactive "SPLIT VIEW" modal viewer accessible on card press, and tune gesture responder to cleanly separate horizontal dragging from vertical scrolling. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0, and dragging divider does not interrupt scroll.

## Files / areas

- `src/components/slider/SplitComparisonView.tsx` - split comparison slider component
- `src/components/slider/index.ts` - slider components export
- `src/components/index.ts` - top-level components export
- `src/app/(tabs)/index.tsx` - shop screen with featured split slider & modal

## Data / contracts

```ts
export interface SplitComparisonViewProps {
  beforeUrl: string;
  afterUrl: string;
  height?: number;
  initialPosition?: number;
  beforeLabel?: string;
  afterLabel?: string;
  showLabels?: boolean;
}
```

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Interaction verification:
  - Dragging the handle moves the divider left and right smoothly
  - Log image on left reveals more/less as handle moves
  - Vertical list scrolling is not blocked by slider gestures
  - Tapping "SPLIT VIEW" opens modal viewer with full comparison

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Use `StyleSheet.create()` for all static styles.
- Ensure horizontal touch gestures claim responder only when `Math.abs(dx) > Math.abs(dy)`.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":4462,"specSha256":"1268d240d8e9abd06d14113a90a6bd9100e46c754c04e4a0e2db600b326a1340","branch":"refs/heads/feature/touch-enabled-before-after-split-slider","head":"0332bdac3b31b9c1329af9daa67721127fe2ec49","baseRef":"refs/heads/master","baseCommit":"0332bdac3b31b9c1329af9daa67721127fe2ec49","sourceTree":"70c581aeaf53d349d8cf94254f9bf344c32f222a","absentOptional":[]} -->
