# Mobile App Build Plan: LUTShop Mobile

Sequential development roadmap and build plan for the LUTShop Mobile App. Each milestone and feature delivers a complete, reviewable slice of functionality.

---

## Milestone 1: Environment Setup & Cinema Theme Foundation

- [ ] 1. **Expo TypeScript Scaffold & Theme Tokens** - Initialize a clean Expo TypeScript app (`npx create-expo-app@latest lutshop-mobile --template blank-typescript`), configure fonts (Inter/System), install navigation dependencies (`@react-navigation/native`, `@react-navigation/bottom-tabs`, `@react-navigation/native-stack`, `react-native-safe-area-context`, `react-native-screens`), and define central theme tokens (`#0a0b0e`, `#121318`, `#181920`, `#00E5FF`, `#2979FF`, `#F0F4F8`).
- [ ] 2. **Core Reusable UI Components** - Build foundational components: `CinemaHeader` with logo and cart badge, `AppButton` (solid neon cyan and outlined variants), `AppText`, `BadgePill` (camera and best seller tags), and `CinemaCard` with dark surface styling.
- [ ] 3. **Bottom Tab Navigation Shell** - Set up bottom tab navigator with 4 tabs: **Shop** (`ShoppingBagIcon`), **Cart** (`CartIcon` with dynamic badge), **Library** (`FilmIcon`), and **Account** (`PersonIcon`), styled with glassmorphism dark blur and active cyan highlights.

---

## Milestone 2: Shop Catalog & Interactive Split Slider

- [ ] 4. **API Client & Product Catalog State** - Create `src/api/client.ts` with base URL configuration pointing to the LUTShop backend (`/api/products`), handle offline fallbacks, and implement search and category filtering hooks.
- [ ] 5. **Cinema Product Card & Catalog Screen** - Build `ShopScreen` featuring an interactive search bar, horizontal camera profile filter pills (Sony S-Log3, Canon C-Log, Apple Log, All), and a fluid FlatList of product cards with before/after thumbnail previews, rating stars, and one-tap "Add to Cart".
- [ ] 6. **Touch-Enabled Before/After Split Comparison Slider** - Build `SplitComparisonView` using touch pan gestures or slider controls. Users drag a vertical divider line across raw camera Log footage vs. graded cinema footage in real time with smooth 60fps response.
- [ ] 7. **Product Details Screen** - Create `ProductDetailScreen` featuring the full-screen touch split slider, technical specs (camera curves, color space, LUT count), creative description, and fixed bottom purchase bar with Price and "Add to Cart" button.

---

## Milestone 3: Google Authentication & Cross-Platform Identity

- [ ] 8. **Google OAuth & Supabase Auth Bridge** - Integrate Google Sign-In (via `expo-auth-session` or `@react-native-google-signin/google-signin`), configure Google Web Client ID matching the web app, and extract the Google user ID (`sub`).
- [ ] 9. **Backend Profile Synchronization (`/api/auth/google`)** - Wire Google sign-in to the backend endpoint `POST /api/auth/google`, upserting the user profile in Supabase PostgreSQL and storing the user profile and session token securely in AsyncStorage / SecureStore.
- [ ] 10. **Demo Mode (Alex Turner) Fallback** - Implement one-tap "Sign In as Demo (Alex Turner)" button matching web `demo-filmmaker-001` ID, allowing instant testing and evaluation without Google Cloud setup.
- [ ] 11. **Profile & Account Screen** - Build `ProfileScreen` showing user avatar, name, email, subscription status (Pro Creator / Free), Google Sign-In/Out controls, and backend connectivity diagnostics.

---

## Milestone 4: Bi-Directional Cart & Real-Time Synchronization

- [ ] 12. **Mobile Cart Context & Local Persistence** - Implement `CartContext` to manage local cart items, total calculation, item removal, and badge count.
- [ ] 13. **Backend Cart Synchronization (`/api/cart`)** - Wire `CartContext` to call `GET /api/cart?userId=...` on login, `POST /api/cart` on adding an item, and `DELETE /api/cart` on removing an item, synchronizing seamlessly with the web database.
- [ ] 14. **Focus & Real-Time Sync Engine** - Implement automatic cart re-fetching on screen focus (`useFocusEffect`), plus optional Supabase Realtime WebSocket subscription on `cart_items` for 0-second instant synchronization between phone and desktop browser.
- [ ] 15. **Cart Screen & Item Management** - Build `CartScreen` with item list, thumbnail preview, price, quantity controls, delete action, order summary breakdown, and "Proceed to Checkout" button.

---

## Milestone 5: Mobile Checkout, Order Fulfillment & Library

- [ ] 16. **Checkout Screen & Simulated Payment Flow** - Build `CheckoutScreen` or modal sheet allowing payment method selection (Simulated Card / Mobile Pay), collecting customer email, and submitting the order to `POST /api/orders`.
- [ ] 17. **Order Success Screen & Cart Clearance** - On successful checkout, clear the cart locally and in the database, display order confirmation with order ID, and provide a direct link to "View in My Library".
- [ ] 18. **Customer Library Screen ("My Purchases")** - Build `LibraryScreen` calling `GET /api/orders?userId=...`, displaying all purchased LUT packs, license status, order date, and download buttons.

---

## Milestone 6: Physical Phone Testing & Video Submission

- [ ] 19. **Network Configuration & Physical Device Run** - Configure backend IP address for physical phone connectivity over local Wi-Fi, run the app in **Expo Go**, and test touch gestures and network latency.
- [ ] 20. **Cross-Platform Verification & Screen Recording** - Position phone alongside desktop monitor, demonstrate live Google login on both, add items on desktop to see instant update on phone, add items on phone to see instant update on desktop, complete checkout, and record the final submission video.
