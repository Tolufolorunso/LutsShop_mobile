# LUTShop Mobile - Project Overview

<!-- blueprint:source-hash 2f9e1bc13c3a77f3f73f7b74a620429588d94cac98d35a68f06def6b6a06d9db -->

> Cinema-grade React Native companion app for iOS and Android that gives videographers on-the-go access to the LUTShop LUT catalog, interactive before/after split grading previews, cross-platform Google auth, real-time bi-directional cart sync, mobile checkout, and a digital purchase library.

---

## Problem

Videographers and content creators browse and buy camera LUTs on desktop but have no native mobile option. The LUTShop web platform is desktop-only. Mobile users need a touch-optimized shopping experience with 60fps split-grading previews, a unified Google identity that shares cart and purchase history with the web, and instant bi-directional cart sync so items added on either platform appear on the other immediately.

---

## Users

- **Videographers / cinematographers** — browse and buy LUT packs on-the-go (on set, in transit); need touch-optimized catalog, split slider, and unified account
- **Bootcamp evaluators** — verify cross-platform cart sync and Google identity; have access to one-tap Demo Mode (Alex Turner / `demo-filmmaker-001`)

---

## Features

Build-plan order. ★ = headline feature.

| # | Feature | Delivers |
|---|---|---|
| 1 | **Expo Scaffold & Theme Tokens** | Expo Router entry, `CinemaTheme` design token object, Inter font, navigation deps |
| 2 | **Core UI Components** | `CinemaHeader`, `AppButton`, `AppText`, `BadgePill`, `CinemaCard` |
| 3 | **Bottom Tab Navigation Shell** | 4-tab layout: Shop, Cart, Library, Account — dark glassmorphic tab bar |
| 4 | **API Client & Product State** | `src/config/api.ts` with env URL, product fetch hooks, search + filter |
| 5 | **Catalog Screen** | `ShopScreen`: search bar, camera filter pills, FlatList of `ProductCard` |
| 6 ★ | **Split Comparison Slider** | `SplitComparisonView`: PanResponder-based before/after divider at 60fps |
| 7 | **Product Details Screen** | Full-width split slider, tech specs, sticky Add-to-Cart bar |
| 8 | **Google OAuth & AuthContext** | `expo-auth-session`, extract Google `sub`, loading state |
| 9 | **Backend Profile Sync** | `POST /api/auth/google` → Supabase `profiles` upsert, AsyncStorage persist |
| 10 | **Demo Mode Fallback** | One-tap Alex Turner (`demo-filmmaker-001`) sign-in |
| 11 | **Profile & Account Screen** | Avatar, name, email, Pro badge, sign-in/out, connectivity status |
| 12 | **Cart Context & Local Cache** | `CartContext`: items, badge count, totals, AsyncStorage |
| 13 | **Backend Cart Sync** | `GET/POST/DELETE /api/cart` wired to CartContext |
| 14 | **Focus & Realtime Sync Engine** | `useFocusEffect` refresh + optional Supabase Realtime WebSocket |
| 15 | **Cart Screen** | Item list, thumbnails, delete, subtotal, "Proceed to Checkout" CTA |
| 16 | **Checkout Screen** | Email pre-fill, payment method select, `POST /api/orders` |
| 17 | **Order Success & Cart Clearance** | Confirmation, clear local + remote cart, link to Library |
| 18 | **My Library Screen** | `GET /api/orders` — purchased packs, license status, download buttons |
| 19 | **Physical Device Run** | `EXPO_PUBLIC_API_BASE_URL` config, Expo Go on-device test |
| 20 | **Cross-Platform Verification** | Screen recording: web + mobile side-by-side, bi-directional sync demo |

---

## Data Model

### Local — AsyncStorage

**`@lutshop_mobile_user`** (persisted JSON)
- `id` (string) — Google `sub` or `"demo-filmmaker-001"`; primary key shared with Supabase `profiles.id`
- `email` (string)
- `fullName` (string)
- `avatarUrl` (string | undefined)
- `isDemo` (boolean)
- `isPro` (boolean)

**CartContext state** (in-memory, hydrated from backend on login / screen focus)
- `items` — array of cart item objects from `/api/cart`
- `badgeCount` (number) — derived from items length

---

### Remote — Supabase PostgreSQL (shared with web, read/written via Next.js API)

**`profiles`**
- `id` (text, PK) — Google `sub`; identical on web and mobile
- `email` (text)
- `full_name` (text)
- `avatar_url` (text)
- `is_pro` (boolean)

**`cart_items`**
- `user_id` (text, FK → `profiles.id`) — Google `sub`
- `product_id` (text)
- one row per product per user; shared between web and mobile

**`orders`**
- `user_id` (text, FK → `profiles.id`)
- `customer_email` (text)
- `items` (JSONB) — snapshot of purchased products
- `payment_method` (text)
- `created_at` (timestamp)

> `profiles.id = Google sub` is the identity lock-pin across all tables. Every cart and order query uses this same value on both platforms.

---

## Tech Stack

- **React Native + Expo SDK 57** — managed workflow, iOS + Android
- **TypeScript 5** — language
- **Expo Router** — file-based navigation (already installed); bottom tab layout
- **React Context + Hooks** — `AuthContext`, `CartContext` with AsyncStorage persistence
- **`expo-auth-session` + `expo-web-browser`** — Google OAuth; extracts `sub` from Google userinfo endpoint
- **Fetch API / `src/config/api.ts`** — central HTTP client, env-configurable base URL
- **`@supabase/supabase-js`** — Realtime WebSocket subscription on `cart_items` (optional, feature 14)
- **`react-native-gesture-handler` + `react-native-reanimated`** — split slider pan gestures (already installed)
- **`expo-image`** — product thumbnails (already installed)
- **`@expo/vector-icons`** — MaterialCommunityIcons / Ionicons
- **`@react-native-async-storage/async-storage`** — local user and cart persistence

---

## Backend API Contract

All endpoints on `EXPO_PUBLIC_API_BASE_URL` (existing LUTShop Next.js server):

| Method | Endpoint | Purpose |
|:---|:---|:---|
| `GET` | `/api/products` | Catalog with `?category=&camera=&search=&featured=` |
| `GET` | `/api/products/[slug]` | Single product detail |
| `POST` | `/api/auth/google` | Upsert `profiles` — body: `{ id, email, fullName, avatarUrl }` |
| `GET` | `/api/auth/profile` | User profile + Pro status — `?userId=` |
| `GET` | `/api/cart` | Cart items — `?userId=` |
| `POST` | `/api/cart` | Add item — body: `{ userId, productId }` |
| `DELETE` | `/api/cart` | Remove — `?userId=&productId=` or `clearAll=true` |
| `GET` | `/api/orders` | Purchase history — `?userId=` |
| `POST` | `/api/orders` | Place order — body: `{ userId, customerEmail, items, paymentMethod }` |

---

## Monetization

One-time purchase of digital LUT packs via the existing web backend. No Apple/Google in-app purchase API. Simulated card / Stripe handled server-side.

---

## UI/UX

**Theme:** Cinema dark — `#0a0b0e` background, `#121318` cards, `#181920` elevated surfaces, `#00E5FF` neon cyan CTAs + active tab, `#2979FF` electric blue secondary, `#FFD700` gold badges.

**Typography:** Inter/System — h1 28/700, h2 22/700, h3 18/600, body 14/400, caption 12/500, badge 11/700 uppercase.

**Screens / Tabs:**
- **Shop** — search bar, camera filter pills, FlatList of `ProductCard`
- **Product Detail** — full-width `SplitComparisonView`, tech specs, sticky Add CTA
- **Cart** — item list, delete, subtotal, checkout CTA
- **Checkout** — email pre-fill, payment select, order submit; Order Success → Library link
- **Library** — purchased packs, license status, download buttons
- **Account** — avatar, name, email, Pro badge, Google sign-in/out, Demo Mode button

Full token definitions and component code: `mobile-blueprint/design-system-tokens.md`

---

## Deployment

- **Development:** Expo Go on physical device; `EXPO_PUBLIC_API_BASE_URL` = local Wi-Fi IP or production URL
- **Backend:** Existing LUTShop Next.js (Vercel or Render)
- **Production mobile:** EAS Build — not required for bootcamp; Expo Go sufficient
- **Env vars required:**
  - `EXPO_PUBLIC_API_BASE_URL`
  - `EXPO_PUBLIC_GOOGLE_CLIENT_ID`
  - `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
  - `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
