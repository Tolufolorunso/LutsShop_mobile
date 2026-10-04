import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { useBackendDiagnostics } from '@/hooks';
import { API_BASE_URL } from '@/config/api';
import { CinemaTheme } from '@/theme';

const CAMERA_PROFILES = ['Sony S-Log3', 'ARRI LogC', 'BMD Film', 'RED IPP2'];

export default function AccountScreen() {
  const {
    user,
    isLoading,
    error,
    syncStatus,
    signInWithGoogle,
    signInAsDemo,
    toggleProTier,
    signOut,
  } = useAuth();

  const {
    latencyMs,
    status: diagStatus,
    lastChecked,
    checkConnection,
  } = useBackendDiagnostics();

  const [selectedCamera, setSelectedCamera] = useState<string>('Sony S-Log3');

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

  const getLatencyColor = () => {
    if (diagStatus === 'offline' || latencyMs === null) return CinemaTheme.colors.error;
    if (latencyMs < 400) return CinemaTheme.colors.success;
    if (latencyMs < 900) return CinemaTheme.colors.accentGold;
    return CinemaTheme.colors.error;
  };

  const getTierLabel = () => {
    if (!user) return 'GUEST TIER';
    if (user.isDemo) return user.isPro ? 'DEMO EVALUATOR (PRO)' : 'DEMO EVALUATOR';
    if (user.isPro) return 'PRO CREATOR';
    return 'STANDARD CREATOR';
  };

  const getTierVariant = (): 'gold' | 'camera' => {
    if (user?.isPro || user?.isDemo) return 'gold';
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
              <View style={styles.badgeRow}>
                <BadgePill
                  label={getTierLabel()}
                  variant={getTierVariant()}
                  size="sm"
                />
                {user && (
                  <BadgePill
                    label={syncStatus === 'synced' ? 'CLOUD LINKED' : 'LOCAL CACHE'}
                    variant={syncStatus === 'synced' ? 'primary' : 'camera'}
                    size="sm"
                  />
                )}
              </View>
            </View>
          </View>
        </CinemaCard>

        {/* Subscription Tier Pass Card */}
        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            CREATOR SUBSCRIPTION STATUS
          </AppText>

          <CinemaCard style={styles.subscriptionCard}>
            <View style={styles.tierHeader}>
              <Ionicons
                name={user?.isPro ? 'sparkles' : 'videocam'}
                size={22}
                color={user?.isPro ? CinemaTheme.colors.accentGold : CinemaTheme.colors.primary}
              />
              <AppText
                variant="bodyBold"
                color={user?.isPro ? CinemaTheme.colors.accentGold : CinemaTheme.colors.textPrimary}
              >
                {user?.isPro
                  ? 'PRO CREATOR PASS (ACTIVE)'
                  : user?.isDemo
                    ? 'EVALUATOR DEMO PASS'
                    : user
                      ? 'STANDARD CREATOR TIER'
                      : 'GUEST EXPLORER TIER'}
              </AppText>
            </View>

            <AppText variant="caption" color={CinemaTheme.colors.textSecondary} style={styles.tierDesc}>
              {user?.isPro
                ? 'Full professional production access unlocked. Enjoy unrestricted 3D LUT downloads, camera log matrices, and priority cloud synchronization.'
                : 'Browse cinema LUTs, test touch split-screen comparisons, and explore log profiles. Upgrade to Pro for unlimited pack downloads.'}
            </AppText>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={CinemaTheme.colors.success}
                />
                <AppText variant="caption" color={CinemaTheme.colors.textSecondary}>
                  Interactive 60fps Split Comparison Engine
                </AppText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={CinemaTheme.colors.success}
                />
                <AppText variant="caption" color={CinemaTheme.colors.textSecondary}>
                  Cross-Platform Unified Cart Sync
                </AppText>
              </View>
              <View style={styles.featureItem}>
                <Ionicons
                  name={user?.isPro ? 'checkmark-circle' : 'lock-closed'}
                  size={16}
                  color={user?.isPro ? CinemaTheme.colors.accentGold : CinemaTheme.colors.textTertiary}
                />
                <AppText
                  variant="caption"
                  color={user?.isPro ? CinemaTheme.colors.textPrimary : CinemaTheme.colors.textTertiary}
                >
                  Commercial Production & Broadcast License
                </AppText>
              </View>
            </View>

            {user && (
              <AppButton
                title={user.isPro ? 'SWITCH TO STANDARD TIER (TEST)' : 'UPGRADE TO PRO CREATOR PASS (TEST)'}
                variant="outline"
                onPress={toggleProTier}
                icon={<Ionicons name="swap-horizontal" size={16} color={CinemaTheme.colors.primary} />}
                style={styles.tierToggleBtn}
              />
            )}
          </CinemaCard>
        </View>

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

        {/* System Diagnostics & Connectivity Testing */}
        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            SYSTEM DIAGNOSTICS & CONNECTIVITY
          </AppText>

          <CinemaCard style={styles.diagCard}>
            <View style={styles.diagRow}>
              <AppText variant="body">Backend URL</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.primary} numberOfLines={1}>
                {API_BASE_URL}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Identity Service</AppText>
              <AppText
                variant="caption"
                color={user?.isDemo ? CinemaTheme.colors.primary : CinemaTheme.colors.accentGold}
              >
                {user?.isDemo ? 'DEMO MODE (EVALUATOR)' : 'GOOGLE OAUTH 2.0'}
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
              <AppText variant="body">Cloud Profile Sync</AppText>
              <AppText variant="caption" color={getSyncStatusColor()}>
                {getSyncStatusText()}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Ping Latency</AppText>
              <AppText variant="caption" color={getLatencyColor()}>
                {diagStatus === 'checking'
                  ? 'MEASURING...'
                  : latencyMs !== null
                    ? `${latencyMs}ms (${diagStatus.toUpperCase()})`
                    : 'OFFLINE / UNREACHABLE'}
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Last Health Check</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.textSecondary}>
                {lastChecked || 'Pending check'}
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

            <AppButton
              title={diagStatus === 'checking' ? 'MEASURING LATENCY...' : 'TEST PING / REFRESH STATUS'}
              variant="outline"
              size="sm"
              onPress={checkConnection}
              icon={<Ionicons name="refresh" size={14} color={CinemaTheme.colors.primary} />}
              style={styles.pingBtn}
            />
          </CinemaCard>
        </View>

        {/* Filmmaker Creative Preferences */}
        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            FILMMAKER PREFERENCES
          </AppText>

          <CinemaCard style={styles.preferencesCard}>
            <AppText variant="bodyBold">Default Camera Color Profile</AppText>
            <AppText variant="caption" color={CinemaTheme.colors.textSecondary} style={styles.prefSubtitle}>
              Sets the primary color transform profile for before/after comparison previews.
            </AppText>

            <View style={styles.cameraPillsRow}>
              {CAMERA_PROFILES.map((cam) => {
                const isSelected = selectedCamera === cam;
                return (
                  <TouchableOpacity
                    key={cam}
                    onPress={() => setSelectedCamera(cam)}
                    style={[
                      styles.cameraPill,
                      isSelected && styles.cameraPillSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <AppText
                      variant="caption"
                      color={isSelected ? CinemaTheme.colors.background : CinemaTheme.colors.textSecondary}
                    >
                      {cam}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.prefDivider} />

            <View style={styles.diagRow}>
              <AppText variant="body">Comparison Engine</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.primary}>
                PANRESPONDER 60FPS
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">App Version</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                v1.0.0 (Cinema SDK 57)
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CinemaTheme.colors.card,
    borderWidth: 1.5,
    borderColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.xs,
    marginTop: 4,
  },
  section: {
    marginBottom: CinemaTheme.spacing.lg,
  },
  sectionLabel: {
    marginBottom: CinemaTheme.spacing.xs,
    marginLeft: 2,
  },
  subscriptionCard: {
    gap: CinemaTheme.spacing.sm,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.xs,
  },
  tierDesc: {
    lineHeight: 18,
  },
  featuresList: {
    gap: 6,
    marginVertical: 4,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.xs,
  },
  tierToggleBtn: {
    marginTop: CinemaTheme.spacing.xs,
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
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
  },
  pingBtn: {
    marginTop: CinemaTheme.spacing.xs,
  },
  preferencesCard: {
    gap: CinemaTheme.spacing.sm,
  },
  prefSubtitle: {
    lineHeight: 18,
  },
  cameraPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CinemaTheme.spacing.xs,
    marginVertical: 4,
  },
  cameraPill: {
    paddingHorizontal: CinemaTheme.spacing.sm,
    paddingVertical: 6,
    borderRadius: CinemaTheme.radius.sm,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
  cameraPillSelected: {
    backgroundColor: CinemaTheme.colors.primary,
    borderColor: CinemaTheme.colors.primary,
  },
  prefDivider: {
    height: 1,
    backgroundColor: CinemaTheme.colors.divider,
    marginVertical: 4,
  },
});
