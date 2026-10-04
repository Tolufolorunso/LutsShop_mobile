# Cross-Platform Google Authentication Integration Guide

This guide details how to integrate Google Authentication in the **LUTShop Mobile App** so that users log in with the exact same identity, share the same Supabase database record, and experience 100% unified cart and purchase synchronization across both the web and mobile apps.

---

## 1. Why Unified Google Identity Matters

In the LUTShop web application, authentication is performed via Google Identity Services (`@react-oauth/google`). When a user signs in:
1. Google returns a unique user identifier known as the **`sub`** (e.g. `10849204817294829104`).
2. The web app stores this `sub` as the user's primary key (`id`) in the Supabase PostgreSQL **`profiles`** table.
3. Every cart item saved to the cloud is written to the **`cart_items`** table with `user_id = profiles.id` (the Google `sub`).
4. Every order in the **`orders`** table is also saved with `user_id = profiles.id`.

**Therefore, to achieve instant cart and order synchronization on mobile, the mobile app must obtain that same Google `sub` and authenticate against the backend using it.**

---

## 2. Google Cloud Console Setup

To allow both the Web and Mobile apps to access the same user pool:

1. Go to the [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials).
2. Select your existing LUTShop Google Cloud project.
3. Under **OAuth 2.0 Client IDs**, verify you have:
   * **Web Application Client ID** (used by Next.js web app: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`).
   * **Android Client ID** (for Android builds: package name e.g. `com.lutshop.mobile`, SHA-1 fingerprint).
   * **iOS Client ID** (for iOS builds: bundle identifier e.g. `com.lutshop.mobile`).
4. When using **Expo Go** for quick development, you can use the **Web Client ID** directly with Expo's `AuthSession` or `Google.useAuthRequest`.

---

## 3. Recommended Mobile Implementation (Expo AuthSession)

### Step 1: Install Dependencies
In your mobile project:
```bash
npx expo install expo-auth-session expo-crypto expo-web-browser
```

### Step 2: Implement AuthContext in Mobile App

Create `src/context/AuthContext.tsx` in your mobile project:

```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

WebBrowser.maybeCompleteAuthSession();

export interface AuthUser {
  id: string; // Google 'sub' or demo ID
  email: string;
  fullName: string;
  avatarUrl?: string;
  isDemo?: boolean;
  isPro?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signInAsDemo: () => void;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = '@lutshop_mobile_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo User matching web Alex Turner demo user
export const DEMO_USER: AuthUser = {
  id: 'demo-filmmaker-001',
  email: 'alex.turner@cinema.raw',
  fullName: 'Alex Turner',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
  isPro: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Configure Google Request with your Web Client ID from the web project
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  // Load stored session on startup
  useEffect(() => {
    async function loadSavedUser() {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error('Failed to load user from storage', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSavedUser();
  }, []);

  // Handle Google OAuth Response
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        fetchGoogleProfile(authentication.accessToken);
      }
    }
  }, [response]);

  // Fetch Google User Profile using accessToken and sync to Backend
  async function fetchGoogleProfile(accessToken: string) {
    try {
      setIsLoading(true);
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const googleData = await res.json();

      // googleData.sub is the unique Google user ID matching web
      const authPayload: AuthUser = {
        id: googleData.sub,
        email: googleData.email,
        fullName: googleData.name || 'Filmmaker',
        avatarUrl: googleData.picture,
        isDemo: false,
        isPro: false,
      };

      // Sync with the LUTShop Next.js backend
      await syncUserWithBackend(authPayload);

      // Save locally
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(authPayload));
      setUser(authPayload);
    } catch (err) {
      console.error('Error fetching Google profile:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Sync profile with Backend API endpoint
  async function syncUserWithBackend(userData: AuthUser) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const result = await res.json();
      if (result?.profile) {
        userData.isPro = Boolean(result.profile.is_pro);
      }
    } catch (err) {
      console.warn('Backend sync warning (offline or local network):', err);
    }
  }

  // 1-Tap Demo Mode for instant bootcamp evaluation
  const signInAsDemo = async () => {
    setUser(DEMO_USER);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));
    await syncUserWithBackend(DEMO_USER);
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signInWithGoogle: () => promptAsync(),
        signInAsDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
```

---

## 4. How This Synchronizes With the Web Database

When `POST /api/auth/google` receives the payload:
```json
{
  "id": "10849204817294829104",
  "email": "videographer@gmail.com",
  "fullName": "Sarah Jenkins",
  "avatarUrl": "https://lh3.googleusercontent.com/..."
}
```

The Next.js backend executes:
```sql
INSERT INTO profiles (id, email, full_name, avatar_url)
VALUES ('10849204817294829104', 'videographer@gmail.com', 'Sarah Jenkins', 'https://...')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url;
```

Because `profiles.id` is identically `'10849204817294829104'` on both platforms:
* Calling `GET /api/cart?userId=10849204817294829104` returns the exact items added from the desktop browser.
* Calling `POST /api/cart` from mobile adds items that will immediately appear when refreshing or viewing the web browser cart!

---

## 5. Testing & Evaluation Workflow

1. **With Google Account:**
   * Log into `http://localhost:3000` (or production site) on your laptop with your Google account.
   * Open the mobile app on your phone, tap **Sign in with Google**, and select the exact same Google account.
   * Both devices will display the same user avatar and name.
2. **With Demo Mode (Alex Turner):**
   * On desktop, click **Alex Turner (Demo)**.
   * On mobile, tap **Sign in as Demo User (Alex Turner)**.
   * Both devices now share `userId = 'demo-filmmaker-001'` with full cart and order synchronization!
