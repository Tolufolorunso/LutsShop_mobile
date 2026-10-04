# Project Plan: LUTShop Mobile

> Source of truth and architectural blueprint for the **LUTShop Mobile App** — a cinema-grade companion application for iOS and Android consuming the existing LUTShop web backend. Built to give videographers and content creators on-the-go access to the LUT catalog, interactive before/after split grading previews, cross-platform Google authentication, real-time cart synchronization, mobile checkout, and an instant digital asset library.

---

## 1. Problem — What problem are we solving?

Videographers and content creators frequently browse presets, camera LUTs, and grading assets on mobile devices (on set, in transit, or scouting locations). The LUTShop web platform is a desktop workstation storefront only. Mobile creators need:

1. A native, touch-optimized shopping experience with fluid 60fps before/after split grading sliders.
2. A unified account identity: signing in with Google on mobile shares the exact same user profile, active cart, and purchase history as the web platform.
3. Instant bi-directional cart sync: items added on desktop appear immediately in the mobile cart, and vice-versa.
4. Seamless mobile checkout and instant access to purchased digital downloads on the phone.

---

## 2. Users — Who is this for?

**Primary:** Videographers, cinematographers, and content creators who use camera LUTs (Look-Up Tables) to grade footage in post-production. They browse and buy on desktop but want the same capability on their phone — especially while on set or in transit.

**Secondary:** Bootcamp evaluators reviewing the cross-platform identity and cart sync demonstration.

---

## 3. Features — What does the MVP need?

- Cinema dark-themed Expo app with bottom tab navigation (Shop, Cart, Library, Account)
- Product catalog screen with search, camera-profile filter chips, and `ProductCard` grid
- Product detail screen with touch-enabled before/after `SplitComparisonView` split slider
- Google Sign-In via `expo-auth-session`, sharing the same Google `sub` as the web app
- One-tap Demo Mode (Alex Turner / `demo-filmmaker-001`) for evaluator access
- Backend profile sync via `POST /api/auth/google` → Supabase `profiles` upsert
- Cart context with `GET/POST/DELETE /api/cart` backend sync
- Auto cart re-fetch on screen focus (`useFocusEffect`) + optional Supabase Realtime WebSocket
- Cart screen with item list, subtotal, and checkout CTA
- Mobile checkout (simulated payment) via `POST /api/orders`
- Order success screen clearing cart and linking to Library
- My Library screen showing purchased packs and download links (`GET /api/orders`)
- Account/Profile screen with avatar, name, email, Pro badge, and sign-out
- Physical device readiness via Expo Go

---

## 4. Data — What are we storing?

**Local (AsyncStorage):**
- `@lutshop_mobile_user` — authenticated user object (id, email, fullName, avatarUrl, isDemo, isPro)
- Cart items cached locally in `CartContext` state

**Remote (Supabase via Next.js API — shared with web):**
- `profiles` — user identity, keyed by Google `sub`
- `cart_items` — active cart rows, `user_id = profiles.id`
- `orders` — purchase history, `user_id = profiles.id`

---

## 5. Tech — What stack are we using?

- **Framework:** React Native + Expo SDK 57 (Managed Workflow), TypeScript 5
- **Navigation:** Expo Router (already installed) with bottom tab layout
- **State:** React Context + Hooks (`AuthContext`, `CartContext`) with AsyncStorage persistence
- **API Client:** Fetch / Axios with central `src/config/api.ts` (configurable local vs. production URL)
- **Auth:** `expo-auth-session` + `expo-web-browser` for Google OAuth; extracts Google `sub` via Google userinfo endpoint
- **Real-Time:** `@supabase/supabase-js` Realtime channel subscription on `cart_items` (optional enhancement)
- **Gestures:** `react-native-gesture-handler` + `react-native-reanimated` (already installed)
- **Icons:** `@expo/vector-icons` (MaterialCommunityIcons / Ionicons)
- **Images:** `expo-image` (already installed)
- **Design Tokens:** `CinemaTheme` object — see `mobile-blueprint/design-system-tokens.md`

---

## 6. Monetize — How will this make money?

The mobile app is a companion to the web storefront. Revenue is generated the same way — one-time purchase of digital LUT packs. No in-app purchase API (Apple/Google) is used; payment is processed through the existing backend (`POST /api/orders`) with simulated card / Stripe on the web side.

---

## 7. UI/UX — How should this look and feel?

**Theme:** Cinema dark — deep blacks (`#0a0b0e` background, `#121318` cards), neon cyan accents (`#00E5FF`), electric blue secondary (`#2979FF`), glassmorphic surfaces.

**Typography:** System/Inter font — h1 (28/700), h2 (22/700), h3 (18/600), body (14/400), caption (12/500), badge (11/700 uppercase tracked).

**Key Components:**
- `CinemaHeader` — fixed dark header with brand logo, screen title, cart badge
- `ProductCard` — dark card with before/after thumbnail, camera badge, LUT count, price, Add CTA
- `SplitComparisonView` — PanResponder-based horizontal divider, raw Log vs. graded cinema footage at 60fps
- `CategoryFilterBar` — horizontal scrolling pill bar (All, Sony S-Log3, Canon C-Log, Apple Log, Weddings, Commercial, Documentary)
- `AppButton` — solid neon cyan and outlined variants
- `BadgePill` — camera tag, Best Seller (gold), Pro Creator

**Navigation:** Bottom Tab Navigator — 4 tabs with dark blur/glassmorphism tab bar, active tab in neon cyan.

**Reference:** Full component code and token definitions in `mobile-blueprint/design-system-tokens.md`.

---

## 8. Deployment — Where and how will this ship?

- **Development:** Expo Go on physical iOS/Android device via LAN (`http://<local-ip>:3000`) or production URL
- **Backend:** Existing LUTShop Next.js app (Vercel or Render); mobile points to `EXPO_PUBLIC_API_BASE_URL`
- **Production Build:** EAS Build (not required for bootcamp; Expo Go is sufficient)
- **Env Vars:** `EXPO_PUBLIC_GOOGLE_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`, `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, `EXPO_PUBLIC_API_BASE_URL`

---

## 9. Backend API Contract

| Method | Endpoint | Purpose |
|:---|:---|:---|
| `GET` | `/api/products` | Fetch catalog with `?category=&camera=&search=&featured=` |
| `GET` | `/api/products/[slug]` | Single product detail |
| `POST` | `/api/auth/google` | Authenticate / upsert Google profile in `profiles` table |
| `GET` | `/api/auth/profile` | Fetch user profile + Pro status |
| `GET` | `/api/cart` | Fetch user's cart items (`?userId=`) |
| `POST` | `/api/cart` | Add item or merge cart (`{ userId, productId }`) |
| `DELETE` | `/api/cart` | Remove item or clear cart |
| `GET` | `/api/orders` | Purchase history + download links |
| `POST` | `/api/orders` | Place order (`{ userId, customerEmail, items, paymentMethod }`) |

---

## 10. Google Auth & Identity Synchronization

The web app uses Google `sub` as `profiles.id` in Supabase. Mobile must extract and use that same `sub`:

1. User taps "Sign in with Google" → `expo-auth-session` launches OAuth flow
2. Exchange access token for Google userinfo (`https://www.googleapis.com/oauth2/v3/userinfo`)
3. Extract `sub`, post to `POST /api/auth/google` → backend upserts `profiles` row
4. Store user in AsyncStorage; use `id` (= `sub`) on all cart/order API calls
5. Cart sync: `GET /api/cart?userId=<sub>` returns items added from web instantly

**Demo Mode:** One-tap "Alex Turner" sets `userId = 'demo-filmmaker-001'` — same ID used by the web's demo button, enabling full cross-platform sync for evaluation.

---

## 11. Physical Testing & Submission Checklist

- [ ] Show web and mobile side-by-side
- [ ] Sign in with same Google account (or Demo) on both
- [ ] Add item on web → verify it appears instantly in mobile cart
- [ ] Add item on mobile → verify it appears instantly in web cart
- [ ] Complete checkout on mobile → verify order appears in "My Library" on both platforms
