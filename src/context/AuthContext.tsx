import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AuthUser, AuthContextType } from '@/types/auth';

// Complete any pending auth sessions on web or deep linking redirects
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Configure Google OAuth request with env-provided client IDs
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
  });

  const fetchGoogleProfile = useCallback(async (accessToken: string) => {
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

      const authUser: AuthUser = {
        id: googleData.sub,
        email: googleData.email,
        fullName: googleData.name || 'Filmmaker',
        avatarUrl: googleData.picture,
        isDemo: false,
        isPro: false,
      };

      setUser(authUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to retrieve Google profile';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const signOut = useCallback(async () => {
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signInWithGoogle,
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
