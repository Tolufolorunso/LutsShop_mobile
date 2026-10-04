# Build Plan: LUTShop Mobile

Sequential development roadmap. Each item is a reviewable slice of functionality. Details come in `/feature` specs.

## Milestone 1: Environment Setup & Cinema Theme Foundation

- [x] 1. **Expo TypeScript Scaffold & Theme Tokens** — Configure Expo Router entry, install navigation/storage dependencies, define `CinemaTheme` tokens (`#0a0b0e`, `#00E5FF`, etc.) in `src/theme/index.ts`
- [ ] 2. **Core Reusable UI Components** — Build `CinemaHeader`, `AppButton` (solid + outlined), `AppText`, `BadgePill`, `CinemaCard` with cinema dark styling
- [ ] 3. **Bottom Tab Navigation Shell** — 4-tab layout (Shop, Cart, Library, Account) with dark glassmorphic tab bar and active cyan highlights

## Milestone 2: Shop Catalog & Interactive Split Slider

- [ ] 4. **API Client & Product Catalog State** — `src/config/api.ts` with env-configurable base URL, product fetch hooks with search and category filtering
- [ ] 5. **Cinema Product Card & Catalog Screen** — `ShopScreen` with search bar, camera filter pills, FlatList of `ProductCard` components with before/after thumbnails
- [ ] 6. **Touch-Enabled Before/After Split Comparison Slider** — `SplitComparisonView` using `PanResponder` with neon cyan divider handle at smooth 60fps
- [ ] 7. **Product Details Screen** — `ProductDetailScreen` with full-width split slider, technical specs, and sticky Add-to-Cart bottom bar

## Milestone 3: Google Authentication & Cross-Platform Identity

- [ ] 8. **Google OAuth & AuthContext** — `expo-auth-session` Google provider, extract `sub` via Google userinfo endpoint, `AuthContext` with loading state
- [ ] 9. **Backend Profile Sync** — Wire sign-in to `POST /api/auth/google`, upsert `profiles`, persist user in AsyncStorage
- [ ] 10. **Demo Mode (Alex Turner) Fallback** — One-tap `demo-filmmaker-001` sign-in matching web demo user for evaluator access
- [ ] 11. **Profile & Account Screen** — `ProfileScreen` with avatar, name, email, Pro badge, Google sign-in/out, and backend connectivity status

## Milestone 4: Bi-Directional Cart & Real-Time Sync

- [ ] 12. **Cart Context & Local Persistence** — `CartContext` managing items, badge count, totals, and AsyncStorage caching
- [ ] 13. **Backend Cart Sync** — Wire `GET/POST/DELETE /api/cart` to `CartContext`; sync on login and add/remove actions
- [ ] 14. **Focus & Real-Time Sync Engine** — `useFocusEffect` cart refresh + optional Supabase Realtime WebSocket on `cart_items`
- [ ] 15. **Cart Screen & Item Management** — `CartScreen` with item list, thumbnails, delete, subtotal, and "Proceed to Checkout" CTA

## Milestone 5: Mobile Checkout, Orders & Library

- [ ] 16. **Checkout Screen & Simulated Payment** — `CheckoutScreen` / bottom sheet with email pre-fill, payment method selection, submit to `POST /api/orders`
- [ ] 17. **Order Success Screen & Cart Clearance** — Confirmation screen, clear local + remote cart, link to My Library
- [ ] 18. **My Library Screen** — `LibraryScreen` with `GET /api/orders` pulling purchased packs, license status, and download buttons

## Milestone 6: Physical Device Testing & Submission

- [ ] 19. **Network Config & Physical Device Run** — Configure `EXPO_PUBLIC_API_BASE_URL` for LAN/production, run on Expo Go, verify touch gestures and latency
- [ ] 20. **Cross-Platform Verification & Screen Recording** — Live demo: web + mobile side-by-side, same Google account, bi-directional cart update, checkout, library verification
