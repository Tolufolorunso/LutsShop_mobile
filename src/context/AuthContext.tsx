import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@/config/api';
import {
  AuthUser,
  AuthContextType,
  AuthSyncStatus,
  BackendProfileResponse,
  DEMO_USER,
} from '@/types/auth';

// Complete any pending auth sessions on web or deep linking redirects
WebBrowser.maybeCompleteAuthSession();

const STORAGE_KEY = '@lutshop_mobile_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<AuthSyncStatus>('idle');

  // Configure Google OAuth request with env-provided client IDs
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  // Sync profile with backend API (POST /api/auth/google) to upsert in Supabase
  const syncUserProfileWithBackend = useCallback(
    async (userData: AuthUser): Promise<AuthUser> => {
      setSyncStatus('syncing');
      try {
        const result = await apiClient.post<BackendProfileResponse>(
          '/api/auth/google',
          {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            avatarUrl: userData.avatarUrl,
          },
          { timeoutMs: 5000 }
        );

        let resolvedUser = { ...userData };
        if (result?.profile) {
          resolvedUser = {
            ...resolvedUser,
            isPro: Boolean(result.profile.is_pro),
            fullName: result.profile.full_name || resolvedUser.fullName,
            avatarUrl: result.profile.avatar_url || resolvedUser.avatarUrl,
          };
        }

        setSyncStatus('synced');
        return resolvedUser;
      } catch (err) {
        console.warn('Backend sync warning (offline or local server disconnected):', err);
        setSyncStatus('offline');
        return userData;
      }
    },
    []
  );

  // Restore cached user session from AsyncStorage on startup
  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((cached) => {
        if (!isMounted) return;
        if (cached) {
          try {
            const parsed: AuthUser = JSON.parse(cached);
            setUser(parsed);
            // Verify backend synchronization in background
            syncUserProfileWithBackend(parsed)
              .then((synced) => {
                if (!isMounted) return;
                setUser(synced);
              })
              .catch(() => {});
          } catch {
            // Ignore corrupted cached JSON
          }
        }
      })
      .catch((err) => {
        console.warn('Failed to load user session from storage', err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [syncUserProfileWithBackend]);

  const fetchGoogleProfile = useCallback(
    async (accessToken: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Google profile fetch failed with status ${res.status}`);
        }

        const googleData = await res.json();

        const baseAuthUser: AuthUser = {
          id: googleData.sub,
          email: googleData.email,
          fullName: googleData.name || 'Filmmaker',
          avatarUrl: googleData.picture,
          isDemo: false,
          isPro: false,
        };

        // Sync with backend database
        const syncedUser = await syncUserProfileWithBackend(baseAuthUser);

        // Persist session to AsyncStorage
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser));
        setUser(syncedUser);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to retrieve Google profile';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [syncUserProfileWithBackend]
  );

  // Handle Google OAuth redirect response via async microtask
  useEffect(() => {
    if (!response) return;

    if (response.type === 'success') {
      const token = response.authentication?.accessToken;
      if (token) {
        void Promise.resolve().then(() => fetchGoogleProfile(token));
      }
    } else if (response.type === 'error') {
      const message = response.error?.message || 'Authentication failed';
      void Promise.resolve().then(() => {
        setError(message);
        setIsLoading(false);
      });
    }
  }, [response, fetchGoogleProfile]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (!request) {
        setError('Google authentication is not ready or Client ID is unconfigured');
        setIsLoading(false);
        return;
      }
      const result = await promptAsync();
      if (result.type === 'success' && result.authentication?.accessToken) {
        await fetchGoogleProfile(result.authentication.accessToken);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
    }
  }, [promptAsync, request, fetchGoogleProfile]);

  // One-tap Demo Mode for evaluator testing matching desktop web demo account
  const signInAsDemo = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      // 1. Immediately activate demo user locally
      setUser(DEMO_USER);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_USER));

      // 2. Synchronize demo profile with backend (POST /api/auth/google)
      const syncedUser = await syncUserProfileWithBackend(DEMO_USER);

      // 3. Update local storage with any enriched profile details from backend
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser));
      setUser(syncedUser);
    } catch (err) {
      console.warn('Demo sign-in sync warning (using cached demo profile):', err);
      // Ensure DEMO_USER remains active locally even if offline
      setUser(DEMO_USER);
    } finally {
      setIsLoading(false);
    }
  }, [syncUserProfileWithBackend]);

  // Toggle Pro status for evaluation and testing
  const toggleProTier = useCallback(async () => {
    if (!user) return;
    const updatedUser: AuthUser = {
      ...user,
      isPro: !user.isPro,
    };
    setUser(updatedUser);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    } catch (err) {
      console.warn('Error saving updated pro tier to storage:', err);
    }
  }, [user]);

  const signOut = useCallback(async () => {
    setUser(null);
    setError(null);
    setSyncStatus('idle');
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Error clearing stored session:', err);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        syncStatus,
        signInWithGoogle,
        signInAsDemo,
        toggleProTier,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
