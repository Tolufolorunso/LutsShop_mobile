import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  AppButton,
  AppText,
  BadgePill,
  CinemaCard,
  CinemaHeader,
} from '@/components/ui';
import { CinemaTheme } from '@/theme';

export default function CartScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CinemaHeader
        title="YOUR CART"
        subtitle="0 ITEMS"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="bag-outline"
              size={40}
              color={CinemaTheme.colors.primary}
            />
          </View>

          <AppText variant="h2" style={styles.emptyTitle}>
            Your Cart is Empty
          </AppText>

          <AppText
            variant="body"
            color={CinemaTheme.colors.textSecondary}
            style={styles.emptySubtitle}
          >
            Explore our cinema color grading catalog and add LUT packs to your cart. Items will automatically sync with your desktop workstation.
          </AppText>

          <AppButton
            title="BROWSE CINEMA SHOP"
            variant="primary"
            size="md"
            onPress={() => router.push('/(tabs)')}
            icon={<Ionicons name="sparkles" size={16} color="#000000" />}
            style={styles.exploreBtn}
          />
        </View>

        <CinemaCard elevated style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons
              name="sync-circle"
              size={22}
              color={CinemaTheme.colors.primary}
            />
            <View style={styles.infoContent}>
              <AppText variant="bodyBold">Bi-Directional Cloud Sync</AppText>
              <AppText variant="caption" color={CinemaTheme.colors.textSecondary}>
                Any item added here immediately syncs with your desktop browser when you sign in.
              </AppText>
            </View>
          </View>
          <BadgePill label="REAL-TIME SYNC READY" variant="primary" size="sm" style={styles.badge} />
        </CinemaCard>
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
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: CinemaTheme.spacing.xl,
    paddingHorizontal: CinemaTheme.spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CinemaTheme.spacing.md,
  },
  emptyTitle: {
    marginBottom: CinemaTheme.spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: CinemaTheme.spacing.xl,
    lineHeight: 22,
  },
  exploreBtn: {
    minWidth: 220,
  },
  infoCard: {
    marginTop: CinemaTheme.spacing.lg,
    borderColor: CinemaTheme.colors.divider,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  badge: {
    marginTop: CinemaTheme.spacing.sm,
    alignSelf: 'flex-start',
  },
});
