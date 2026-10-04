# Feature: API Client & Product Catalog State

**From build-plan:** feature 4
**Build attempt:** 1
**Status:** verified
**Branch:** `feature/api-client-product-catalog-state`

## Goal

Build the central API communication layer (`src/config/api.ts`), product domain data models, and reactive state hooks (`useProducts`, `useProduct`) with client-side and remote search/category/camera filtering, seamless offline fallback, and integration into the Shop tab.

## In scope

- Define TypeScript domain contracts in `src/types/product.ts` (`Product`, `CameraProfile`, `ProductCategory`, `ProductFilterParams`, `ProductsResponse`, `TechSpecs`)
- Create curated cinema-grade catalog dataset in `src/data/mockProducts.ts` with authentic LUT metadata, supported cameras (Sony S-Log3, ARRI LogC, Apple Log, RED IPP2, BMPCC), before/after image URLs, pricing, and technical specs
- Implement `src/config/api.ts` providing:
  - Base URL configuration via `process.env.EXPO_PUBLIC_API_BASE_URL` with sensible platform fallbacks
  - Timeout-guarded `fetch` wrapper with standard error handling
  - Typed helper methods: `fetchProducts(params)` and `fetchProductBySlug(slug)`
  - Resilient offline fallback to curated catalog data if the backend server is unreachable or offline
- Implement state hooks in `src/hooks/`:
  - `useProducts.ts`: reactive product catalog with loading, error, search query, camera filter, and category filter state
  - `useProduct.ts`: reactive single product fetch by slug or ID with loading and error state
  - `index.ts`: unified hooks barrel export
- Connect `useProducts` into `src/app/(tabs)/index.tsx` (Shop tab) to drive live search text input, dynamic camera filter selection, loading indicator, and count feedback
- Verify with `npx tsc --noEmit` and `npm run lint`

## Out of scope

- `ProductCard` UI component with before/after thumbnail overlays and FlatList grid layout - deferred to Feature 5
- Touch-enabled Before/After split comparison slider - deferred to Feature 6
- Product Details Screen route - deferred to Feature 7
- Cart Context and add-to-cart persistence - deferred to Milestone 4

## Build loop

Build one small step at a time. Follow `workflow.stepReview: "feature"` in `blueprint/config.json`: produce one review packet after all steps are complete. Checkpoint commits are disabled. `/complete` creates the final feature commit.

## Build steps

- [x] **Step 1 - Product Data Contracts & Curated Dataset** - Create `src/types/product.ts` with comprehensive interfaces, and `src/data/mockProducts.ts` containing 8 diverse cinema LUT packs with full metadata (Venice Gold, Tokyo Neon, Nordic Mood, Desert Nomad, Matrix Monochrome, Pacific Teal, Havana Sunset, Cyberpunk 2088). *Done when:* `npx tsc --noEmit` compiles cleanly.
- [x] **Step 2 - Central API Client & Remote Fetchers** - Create `src/config/api.ts` with env URL configuration, timeout-guarded HTTP GET/POST methods, typed endpoints, and transparent offline fallback when remote API is unreachable. *Done when:* `npx tsc --noEmit` and `npm run lint` pass with 0 errors.
- [x] **Step 3 - Product Catalog State Hooks** - Implement `src/hooks/useProducts.ts` and `src/hooks/useProduct.ts` with reactive search, camera filter, category filter, refresh, and loading/error states. Export via `src/hooks/index.ts`. *Done when:* `npx tsc --noEmit` compiles cleanly.
- [x] **Step 4 - Connect Shop Screen to Reactive State** - Wire `useProducts` into `src/app/(tabs)/index.tsx`, connecting the search input, camera filter pills, and product count to active state. *Done when:* `npx tsc --noEmit` and `npm run lint` both exit with code 0, and search/camera filtering updates the rendered view reactively.

## Files / areas

- `src/types/product.ts` - product and filter types
- `src/data/mockProducts.ts` - offline curated catalog dataset
- `src/config/api.ts` - central API client configuration and network layer
- `src/hooks/useProducts.ts` - catalog fetch and filtering hook
- `src/hooks/useProduct.ts` - single product fetch hook
- `src/hooks/index.ts` - hooks barrel export
- `src/app/(tabs)/index.tsx` - shop tab reactive integration

## Data / contracts

```ts
export type CameraProfile = 'All' | 'Sony S-Log3' | 'ARRI LogC' | 'Apple Log' | 'RED IPP2' | 'BMPCC Gen 5';

export interface TechSpecs {
  cameraCurves?: string[];
  colorSpace?: string;
  fileFormats?: string[];
  packageSize?: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Cinema' | 'Vintage' | 'Commercial' | 'Horror' | 'Sci-Fi';
  supportedCameras: string[];
  lutCount: number;
  badge?: string;
  isFeatured?: boolean;
  rating: number;
  reviewsCount: number;
  beforeImageUrl: string;
  afterImageUrl: string;
  thumbnailUrl: string;
  techSpecs: TechSpecs;
}

export interface ProductFilterParams {
  search?: string;
  category?: string;
  camera?: string;
  featured?: boolean;
}
```

## Testing

- Typecheck: `npx tsc --noEmit` exits with code 0
- Linter: `npm run lint` exits with code 0
- Runtime verification:
  - App launches into Shop tab without errors
  - Search input filters the displayed catalog reactively
  - Tapping camera filter pills (e.g. Sony, ARRI, RED) updates active state and filters results
  - Loading and empty search states display correctly

## Notes for the AI

- Do not use em dashes (U+2014) in code, comments, or documentation.
- Maintain strict TypeScript type safety without using any `any` types.
- Ensure offline fallback allows development and testing without requiring a live remote backend server.


<!-- blueprint:completion {"schemaVersion":1,"specBytes":5647,"specSha256":"aafe67503b7045edaf631f7a67ae9766618063037134739e9f934f503e3d392c","branch":"refs/heads/feature/api-client-product-catalog-state","head":"413098f0c4738d5ac655090dc355d5190ceee9b5","baseRef":"refs/heads/master","baseCommit":"413098f0c4738d5ac655090dc355d5190ceee9b5","sourceTree":"ed58f3a0f0050a7b451bca6f5ec53625a79578d4","absentOptional":[]} -->
