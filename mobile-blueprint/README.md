# LUTShop Mobile Blueprint

Welcome to the **LUTShop Mobile App Blueprint**. This folder contains the complete architecture, build plan, design tokens, and integration guides to build the companion mobile app for iOS and Android consuming the LUTShop backend APIs.

---

## 📁 What is in this Folder

1. **`project-plan.md`**: Master architecture doc covering problem definition, mobile tech stack (React Native + Expo), UI/UX continuity, screen breakdown, unified Google authentication, and physical device testing.
2. **`build-plan.md`**: Step-by-step sequential feature roadmap organized into 6 milestones from scaffold to screen recording.
3. **`google-auth-integration.md`**: Step-by-step code and setup guide explaining how Google OAuth integrates seamlessly between the web app and mobile app to share the exact same user identity and database records.
4. **`design-system-tokens.md`**: Exact hex codes, typography rules, and ready-to-use React Native component blueprints (`ProductCard`, `SplitSliderView`) matching the cinema dark theme.

---

## 🚀 Quick Start: Creating the Mobile Codebase

You can create your mobile application in a separate directory on your machine:

```bash
# 1. Create a new Expo TypeScript project
npx create-expo-app@latest lutshop-mobile --template blank-typescript

# 2. Enter directory
cd lutshop-mobile

# 3. Copy the blueprint files over to your new project
# (Copy project-plan.md and build-plan.md to blueprint/ or root of your new project)

# 4. Install essential mobile navigation and storage packages
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install react-native-screens react-native-safe-area-context
npm install @react-native-async-storage/async-storage
npx expo install expo-auth-session expo-crypto expo-web-browser

# 5. Start development server
npx expo start
```

---

## 📱 Testing on Your Physical Phone

1. Install **Expo Go** from the iOS App Store or Android Google Play Store.
2. In your mobile app's API config file (`src/config/api.ts`):
   * When testing locally, set your computer's local Wi-Fi IP address (e.g. `http://192.168.1.15:3000`).
   * When deployed, set your production URL (e.g. `https://lutshop.vercel.app`).
3. Scan the terminal QR code with your phone camera (iPhone) or the Expo Go app (Android).
4. Run the app on your physical phone!

---

## 🎥 Screen Recording Checklist for Bootcamp Submission

- [ ] Show web shop and mobile app side-by-side.
- [ ] Sign in with the same Google account (or Demo Mode) on both.
- [ ] Add an item on web -> show it appears in mobile cart.
- [ ] Add an item on mobile -> show it appears in web cart.
- [ ] Checkout on mobile -> show order in "My Library" on both platforms.
