import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Platform, TurboModuleRegistry, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '@/config/api';
import {
  AuthUser,
  AuthContextType,
  AuthSyncStatus,
  BackendProfileResponse,
  DEMO_USER,
} from '@/types/auth';

const STORAGE_KEY = '@lutshop_mobile_user';
const SECURE_TOKEN_KEY = 'lutshop_auth_session_token';

// Safely detect if the native RNGoogleSignin binary module is registered in the running client
const checkNativeGoogleSigninAvailable = (): boolean => {
  if (Platform.OS === 'web') return false;
  try {
    return Boolean(
      TurboModuleRegistry.get('RNGoogleSignin') || NativeModules?.RNGoogleSignin
    );
  } catch {
    return false;
  }
};

const isNativeAvailable = checkNativeGoogleSigninAvailable();

// Dynamically load @react-native-google-signin/google-signin only if the native binary is present
// This prevents Expo Go from crashing on launch with "TurboModuleRegistry.getEnforcing(...): 'RNGoogleSignin' could not be found"
let GoogleSigninModule: typeof import('@react-native-google-signin/google-signin') | null = null;
if (isNativeAvailable) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    GoogleSigninModule = require('@react-native-google-signin/google-signin');
  } catch (err) {
    console.warn('Native Google Sign-In could not be loaded into this binary:', err);
  }
}

// Safe secure storage helper with web/Expo Go fallback
const saveSecureToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(SECURE_TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(SECURE_TOKEN_KEY, token);
    }
  } catch (err) {
    console.warn('SecureStore save warning:', err);
  }
};

const removeSecureToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(SECURE_TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    }
  } catch (err) {
    console.warn('SecureStore remove warning:', err);
  }
};

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const isGoogleAuthConfigured = Boolean(googleWebClientId);

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<AuthSyncStatus>('idle');

  // Configure GoogleSignin module on initialization if native module is present
  useEffect(() => {
    if (GoogleSigninModule && googleWebClientId) {
      try {
        GoogleSigninModule.GoogleSignin.configure({
          webClientId: googleWebClientId,
          iosClientId: googleIosClientId,
          scopes: ['profile', 'email'],
          offlineAccess: true,
        });
      } catch (err) {
        console.warn('Failed to initialize GoogleSignin configuration:', err);
      }
    }
  }, []);

  // Sync profile & idToken with Next.js backend API (POST /api/auth/google)
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
            idToken: userData.idToken,
          },
          { timeoutMs: 8000 }
        );

        let resolvedUser = { ...userData };
        const returnedProfile = result?.profile;
        const returnedUser = result?.user;

        if (returnedProfile || returnedUser) {
          resolvedUser = {
            ...resolvedUser,
            isPro: Boolean(returnedProfile?.is_pro ?? returnedUser?.isPro ?? userData.isPro),
            fullName: returnedProfile?.full_name ?? returnedUser?.fullName ?? resolvedUser.fullName,
            avatarUrl: (returnedProfile?.avatar_url ?? returnedUser?.avatarUrl) || resolvedUser.avatarUrl,
          };
        }

        // Store session token in secure storage if returned or save the verified Google idToken
        if (result?.token) {
          await saveSecureToken(result.token);
        } else if (userData.idToken) {
          await saveSecureToken(userData.idToken);
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
            // Verify and refresh backend synchronization in background
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

  // Native Google Sign-In implementation
  const signInWithGoogle = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    if (Platform.OS === 'web') {
      setIsLoading(false);
      setError('Native Google Sign-In requires an Android or iOS device build. Please use Demo Mode on web.');
      return;
    }

    if (!isNativeAvailable || !GoogleSigninModule) {
      setIsLoading(false);
      setError(
        'Native Google Sign-In requires a development build (npx expo run:android). Standard Expo Go does not contain custom native modules. Please launch the development build or use Demo Mode.'
      );
      return;
    }

    if (!isGoogleAuthConfigured || !googleWebClientId) {
      setIsLoading(false);
      setError(
        'Google Sign-In requires EXPO_PUBLIC_GOOGLE_CLIENT_ID (Web Client ID) in .env. Configure this in your environment or use Demo Mode.'
      );
      return;
    }

    const {
      GoogleSignin,
      statusCodes,
      isErrorWithCode,
      isSuccessResponse,
      isCancelledResponse,
    } = GoogleSigninModule;

    try {
      // Ensure GoogleSignin has the latest webClientId
      GoogleSignin.configure({
        webClientId: googleWebClientId,
        iosClientId: googleIosClientId,
        scopes: ['profile', 'email'],
        offlineAccess: true,
      });

      // Verify Google Play Services availability on Android
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const response = await GoogleSignin.signIn();

      if (isCancelledResponse(response)) {
        // User voluntarily dismissed or cancelled the dialog
        setIsLoading(false);
        return;
      }

      if (isSuccessResponse(response)) {
        const { idToken, user: googleUser } = response.data;

        if (!idToken) {
          console.warn('Google Sign-In returned without idToken. Ensure Web Client ID is configured in Google Cloud Console.');
        }

        const baseAuthUser: AuthUser = {
          id: googleUser.id,
          email: googleUser.email,
          fullName: googleUser.name || 'Filmmaker',
          avatarUrl: googleUser.photo || undefined,
          isDemo: false,
          isPro: false,
          idToken: idToken || undefined,
        };

        // Sync with backend API (POST /api/auth/google) and persist tokens
        const syncedUser = await syncUserProfileWithBackend(baseAuthUser);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncedUser));
        setUser(syncedUser);
      } else {
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setIsLoading(false);

      if (isErrorWithCode(err)) {
        switch (err.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // Handled cleanly without an alarm banner
            break;
          case statusCodes.IN_PROGRESS:
            setError('Google sign-in is already in progress.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            setError('Google Play Services is unavailable or out-of-date on this device.');
            break;
          default: {
            const rawCode = String(err.code);
            const rawMsg = err.message || '';
            if (rawCode === '10' || rawMsg.includes('10') || rawMsg.includes('DEVELOPER_ERROR')) {
              setError(
                'Developer Error (Code 10): SHA-1 fingerprint mismatch or package name mismatch (com.lutshop.mobile) in Google Cloud Console.'
              );
            } else if (rawCode === '12500' || rawMsg.includes('12500')) {
              setError(
                'Google Sign-In Error (12500): Check OAuth consent screen branding and user support email in Google Cloud Console.'
              );
            } else if (rawCode === '12501' || rawMsg.includes('12501')) {
              // User cancelled on older Play Services
              break;
            } else {
              setError(`Google Sign-In failed (${rawCode}): ${rawMsg}`);
            }
            break;
          }
        }
      } else if (err instanceof Error) {
        setError(err.message || 'Google sign-in failed. Please try again or use Demo Mode.');
      } else {
        setError('An unexpected error occurred during Google sign-in.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [syncUserProfileWithBackend]);

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

    if (GoogleSigninModule) {
      try {
        await GoogleSigninModule.GoogleSignin.signOut();
      } catch (err) {
        console.warn('GoogleSignin.signOut warning:', err);
      }
    }

    try {
      await removeSecureToken();
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
