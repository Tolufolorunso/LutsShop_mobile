import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import {
  AppButton,
  AppText,
  BadgePill,
  CinemaCard,
  CinemaHeader,
} from '@/components/ui';
import { useAuth } from '@/context';
import { API_BASE_URL } from '@/config/api';
import { CinemaTheme } from '@/theme';

export default function AccountScreen() {
  const {
    user,
    isLoading,
    error,
    syncStatus,
    signInWithGoogle,
    signInAsDemo,
    signOut,
  } = useAuth();

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'synced':
        return 'SYNCED TO CLOUD';
      case 'syncing':
        return 'SYNCHRONIZING...';
      case 'offline':
        return 'OFFLINE (CACHED)';
      default:
        return user ? 'LOCAL SESSION' : 'IDLE';
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'synced':
        return CinemaTheme.colors.success;
      case 'syncing':
        return CinemaTheme.colors.primary;
      case 'offline':
        return CinemaTheme.colors.accentGold;
      default:
        return CinemaTheme.colors.textTertiary;
    }
  };

  const getTierLabel = () => {
    if (!user) return 'GUEST TIER';
    if (user.isDemo) return 'DEMO EVALUATOR';
    if (user.isPro) return 'PRO SUITE';
    return 'GOOGLE VERIFIED';
  };

  const getTierVariant = (): 'gold' | 'camera' => {
    if (user?.isDemo || user?.isPro) return 'gold';
    return 'camera';
  };

  return (
    <View style={styles.container}>
      <CinemaHeader
        title="ACCOUNT"
        subtitle="CREATOR PROFILE"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Creator Profile Card */}
        <CinemaCard elevated style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              {user?.avatarUrl ? (
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                  contentFit="cover"
                />
              ) : (
                <Ionicons
                  name="person"
                  size={32}
                  color={CinemaTheme.colors.primary}
                />
              )}
            </View>

            <View style={styles.profileInfo}>
              <AppText variant="h3">
                {user ? user.fullName : 'Guest Creator'}
              </AppText>
              <AppText variant="caption" color={CinemaTheme.colors.textSecondary}>
                {user ? user.email : 'guest@lutshop.cinema'}
              </AppText>
              <BadgePill
                label={getTierLabel()}
                variant={getTierVariant()}
                size="sm"
                style={styles.tierBadge}
              />
            </View>
          </View>
        </CinemaCard>

        {/* Authentication Card */}
        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            CROSS-PLATFORM AUTHENTICATION
          </AppText>

          <CinemaCard style={styles.authCard}>
            {user ? (
              <>
                <View style={styles.authSuccessHeader}>
                  <Ionicons
                    name={user.isDemo ? 'videocam' : 'checkmark-circle'}
                    size={20}
                    color={user.isDemo ? CinemaTheme.colors.accentGold : CinemaTheme.colors.success}
                  />
                  <AppText
                    variant="bodyBold"
                    color={user.isDemo ? CinemaTheme.colors.accentGold : CinemaTheme.colors.success}
                  >
                    {user.isDemo
                      ? 'Authenticated via Demo Account (Alex Turner)'
                      : 'Authenticated via Google Identity'}
                  </AppText>
                </View>

                <AppText
                  variant="body"
                  color={CinemaTheme.colors.textSecondary}
                  style={styles.authText}
                >
                  {user.isDemo
                    ? 'Demo mode active for evaluator testing. This profile shares demo-filmmaker-001 with the desktop web demo user for live cross-platform evaluation.'
                    : 'Your Google identity is active. Orders and cloud cart synchronization are tied to this profile.'}
                </AppText>

                <View style={styles.subInfoBox}>
                  <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                    {user.isDemo ? 'DEMO EVALUATOR IDENTIFIER' : 'GOOGLE SUB IDENTIFIER'}
                  </AppText>
                  <AppText variant="bodyBold" color={CinemaTheme.colors.primary} numberOfLines={1}>
                    {user.id}
                  </AppText>
                </View>

                <AppButton
                  title="SIGN OUT"
                  variant="outline"
                  onPress={signOut}
                  icon={<Ionicons name="log-out-outline" size={16} color={CinemaTheme.colors.primary} />}
                  style={styles.authBtn}
                />
              </>
            ) : (
              <>
                <AppText variant="bodyBold">Sign in to sync your cart</AppText>
                <AppText variant="body" color={CinemaTheme.colors.textSecondary} style={styles.authText}>
                  Logging in with Google links your mobile device to your desktop web account using your shared Google ID.
                </AppText>

                {error && (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle" size={16} color={CinemaTheme.colors.error} />
                    <AppText variant="caption" color={CinemaTheme.colors.error} style={styles.errorText}>
                      {error}
                    </AppText>
                  </View>
                )}

                {isLoading ? (
                  <View style={styles.loadingBox}>
                    <ActivityIndicator size="small" color={CinemaTheme.colors.primary} />
                    <AppText variant="caption" color={CinemaTheme.colors.primary}>
                      Connecting to Identity Services...
                    </AppText>
                  </View>
                ) : (
                  <>
                    <AppButton
                      title="SIGN IN WITH GOOGLE"
                      variant="primary"
                      onPress={signInWithGoogle}
                      icon={<Ionicons name="logo-google" size={16} color="#000000" />}
                      style={styles.authBtn}
                    />

                    <AppButton
                      title="SIGN IN AS DEMO (ALEX TURNER)"
                      variant="outline"
                      onPress={signInAsDemo}
                      icon={<Ionicons name="videocam" size={16} color={CinemaTheme.colors.primary} />}
                    />
                  </>
                )}
              </>
            )}
          </CinemaCard>
        </View>

        {/* System Diagnostics */}
        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            SYSTEM DIAGNOSTICS
          </AppText>

          <CinemaCard style={styles.diagCard}>
            <View style={styles.diagRow}>
              <AppText variant="body">Backend URL</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.primary}>
                {API_BASE_URL}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Identity Service</AppText>
              <AppText
                variant="caption"
                color={user?.isDemo ? CinemaTheme.colors.primary : CinemaTheme.colors.accentGold}
              >
                {user?.isDemo ? 'DEMO MODE (EVALUATOR)' : 'GOOGLE OAUTH (EXPO)'}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Identity State</AppText>
              <AppText
                variant="caption"
                color={user ? CinemaTheme.colors.success : CinemaTheme.colors.textTertiary}
              >
                {user ? (user.isDemo ? 'DEMO ACTIVE' : 'AUTHENTICATED') : 'GUEST'}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Backend Profile Sync</AppText>
              <AppText variant="caption" color={getSyncStatusColor()}>
                {getSyncStatusText()}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Session Storage</AppText>
              <AppText
                variant="caption"
                color={user ? CinemaTheme.colors.primary : CinemaTheme.colors.textTertiary}
              >
                {user ? '@lutshop_mobile_user' : 'NONE'}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Cart Engine</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.success}>
                POSTGRES + REALTIME
              </AppText>
            </View>
          </CinemaCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
  },
  scrollContent: {
    padding: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.xl + 20,
  },
  profileCard: {
    borderColor: CinemaTheme.colors.primaryGlow,
    marginBottom: CinemaTheme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: CinemaTheme.colors.card,
    borderWidth: 1.5,
    borderColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  tierBadge: {
    marginTop: 4,
  },
  section: {
    marginBottom: CinemaTheme.spacing.lg,
  },
  sectionLabel: {
    marginBottom: CinemaTheme.spacing.xs,
    marginLeft: 2,
  },
  authCard: {
    gap: CinemaTheme.spacing.xs,
  },
  authSuccessHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.xs,
    marginBottom: CinemaTheme.spacing.xs,
  },
  subInfoBox: {
    backgroundColor: CinemaTheme.colors.cardElevated,
    padding: CinemaTheme.spacing.sm,
    borderRadius: CinemaTheme.radius.sm,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    marginBottom: CinemaTheme.spacing.md,
    gap: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.xs,
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
    padding: CinemaTheme.spacing.sm,
    borderRadius: CinemaTheme.radius.sm,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.error,
    marginBottom: CinemaTheme.spacing.sm,
  },
  errorText: {
    flex: 1,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CinemaTheme.spacing.sm,
    paddingVertical: CinemaTheme.spacing.md,
  },
  authText: {
    marginTop: 2,
    marginBottom: CinemaTheme.spacing.md,
    lineHeight: 20,
  },
  authBtn: {
    marginBottom: CinemaTheme.spacing.sm,
  },
  diagCard: {
    gap: CinemaTheme.spacing.sm,
  },
  diagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
  },
});
