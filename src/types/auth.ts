export type AuthSyncStatus = 'idle' | 'syncing' | 'synced' | 'offline';

export interface AuthUser {
  id: string; // Google 'sub' or demo ID
  email: string;
  fullName: string;
  avatarUrl?: string;
  isDemo?: boolean;
  isPro?: boolean;
}

export interface BackendProfileResponse {
  profile?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    is_pro?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  error?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  syncStatus: AuthSyncStatus;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
