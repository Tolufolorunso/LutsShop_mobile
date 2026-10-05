export type AuthSyncStatus = 'idle' | 'syncing' | 'synced' | 'offline';

export interface AuthUser {
  id: string; // Google 'sub' or demo ID
  email: string;
  fullName: string;
  avatarUrl?: string;
  isDemo?: boolean;
  isPro?: boolean;
  idToken?: string;
}

export interface BackendProfileResponse {
  success?: boolean;
  user?: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string | null;
    isPro?: boolean;
    subscriptionStatus?: string;
  };
  profile?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string | null;
    is_pro?: boolean;
    created_at?: string;
    updated_at?: string;
  };
  token?: string;
  error?: string;
}

// Standard evaluator demo user matching web desktop demo account
export const DEMO_USER: AuthUser = {
  id: 'demo-filmmaker-001',
  email: 'alex.turner@cinema.raw',
  fullName: 'Alex Turner',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  isDemo: true,
  isPro: false,
};

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  syncStatus: AuthSyncStatus;
  signInWithGoogle: () => Promise<void>;
  signInAsDemo: () => Promise<void>;
  toggleProTier: () => Promise<void>;
  signOut: () => Promise<void>;
}
