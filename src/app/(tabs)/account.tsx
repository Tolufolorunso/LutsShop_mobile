import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  AppButton,
  AppText,
  BadgePill,
  CinemaCard,
  CinemaHeader,
} from '@/components/ui';
import { CinemaTheme } from '@/theme';

export default function AccountScreen() {
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
        <CinemaCard elevated style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons
                name="person"
                size={32}
                color={CinemaTheme.colors.primary}
              />
            </View>

            <View style={styles.profileInfo}>
              <AppText variant="h3">Guest Creator</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.textSecondary}>
                guest@lutshop.cinema
              </AppText>
              <BadgePill label="GUEST TIER" variant="camera" size="sm" style={styles.tierBadge} />
            </View>
          </View>
        </CinemaCard>

        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            CROSS-PLATFORM AUTHENTICATION
          </AppText>

          <CinemaCard style={styles.authCard}>
            <AppText variant="bodyBold">Sign in to sync your cart</AppText>
            <AppText variant="body" color={CinemaTheme.colors.textSecondary} style={styles.authText}>
              Logging in with Google links your mobile device to your desktop web account using your shared Google ID.
            </AppText>

            <AppButton
              title="SIGN IN WITH GOOGLE"
              variant="primary"
              onPress={() => {}}
              icon={<Ionicons name="logo-google" size={16} color="#000000" />}
              style={styles.authBtn}
            />

            <AppButton
              title="SIGN IN AS DEMO (ALEX TURNER)"
              variant="outline"
              onPress={() => {}}
              icon={<Ionicons name="videocam" size={16} color={CinemaTheme.colors.primary} />}
            />
          </CinemaCard>
        </View>

        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            SYSTEM DIAGNOSTICS
          </AppText>

          <CinemaCard style={styles.diagCard}>
            <View style={styles.diagRow}>
              <AppText variant="body">Backend URL</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.primary}>
                LOCAL / CONFIGURED
              </AppText>
            </View>

            <View style={styles.diagRow}>
              <AppText variant="body">Identity Service</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.accentGold}>
                GOOGLE OAUTH (EXPO)
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
