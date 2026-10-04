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

export default function LibraryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <CinemaHeader
        title="MY LIBRARY"
        subtitle="PURCHASED PACKS"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="film-outline"
              size={40}
              color={CinemaTheme.colors.primary}
            />
          </View>

          <AppText variant="h2" style={styles.emptyTitle}>
            No Purchased LUTs Yet
          </AppText>

          <AppText
            variant="body"
            color={CinemaTheme.colors.textSecondary}
            style={styles.emptySubtitle}
          >
            Packs you purchase on the desktop web store or mobile app appear here instantly with direct download links and license keys.
          </AppText>

          <View style={styles.actionRow}>
            <AppButton
              title="SIGN IN WITH GOOGLE"
              variant="primary"
              size="md"
              onPress={() => router.push('/(tabs)/account')}
              icon={<Ionicons name="logo-google" size={16} color="#000000" />}
            />
          </View>
        </View>

        <CinemaCard elevated style={styles.licenseCard}>
          <View style={styles.cardHeader}>
            <AppText variant="h3">Commercial License Access</AppText>
            <BadgePill label="LIFETIME" variant="gold" size="sm" />
          </View>
          <AppText variant="body" color={CinemaTheme.colors.textSecondary} style={styles.licenseText}>
            All purchases include lifetime commercial usage rights for YouTube, broadcast, commercial films, and streaming projects.
          </AppText>
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
  actionRow: {
    width: '100%',
    alignItems: 'center',
  },
  licenseCard: {
    marginTop: CinemaTheme.spacing.lg,
    borderColor: CinemaTheme.colors.divider,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CinemaTheme.spacing.xs,
  },
  licenseText: {
    marginTop: CinemaTheme.spacing.xs,
    lineHeight: 20,
  },
});
