import React, { useState } from 'react';
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

export default function Index() {
  const [cartCount, setCartCount] = useState(2);
  const [btnLoading, setBtnLoading] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const handleTestCart = () => {
    setCartCount((prev) => (prev >= 5 ? 0 : prev + 1));
  };

  const handleTestLoading = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setBtnLoading(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <CinemaHeader
        title="LUTSHOP"
        subtitle="CINEMA DESIGN SYSTEM"
        cartCount={cartCount}
        onCartPress={handleTestCart}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CinemaCard elevated style={styles.heroCard}>
          <AppText variant="h2" color={CinemaTheme.colors.primary}>
            UI System Showcase
          </AppText>
          <AppText variant="body" color={CinemaTheme.colors.textSecondary} style={styles.heroText}>
            Core reusable components matching the cinema dark palette and typography rules.
          </AppText>
          <View style={styles.badgeRow}>
            <BadgePill label="SONY S-LOG3" variant="camera" />
            <BadgePill label="BEST SELLER" variant="gold" />
            <BadgePill label="VERIFIED" variant="success" />
          </View>
        </CinemaCard>

        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            TYPOGRAPHY SCALE
          </AppText>
          <CinemaCard style={styles.cardSpacing}>
            <AppText variant="h1">Heading 1 (28px)</AppText>
            <AppText variant="h2">Heading 2 (22px)</AppText>
            <AppText variant="h3">Heading 3 (18px)</AppText>
            <AppText variant="bodyBold">Body Bold (14px)</AppText>
            <AppText variant="body">Body regular text with muted secondary color.</AppText>
            <AppText variant="caption">Caption text (12px) for specs and metadata</AppText>
            <AppText variant="badge">BADGE TEXT (11px TRACKED)</AppText>
          </CinemaCard>
        </View>

        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            BADGES & PILLS
          </AppText>
          <CinemaCard style={styles.cardSpacing}>
            <View style={styles.wrapRow}>
              <BadgePill label="APPLE LOG" variant="camera" />
              <BadgePill label="CANON C-LOG" variant="camera" />
              <BadgePill label="BEST SELLER" variant="gold" />
              <BadgePill label="PRO CREATOR" variant="primary" />
              <BadgePill label="ORDER CONFIRMED" variant="success" />
              <BadgePill label="FAILED" variant="error" />
            </View>
          </CinemaCard>
        </View>

        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            BUTTON VARIANTS
          </AppText>
          <CinemaCard style={styles.cardSpacing}>
            <AppButton
              title="PRIMARY CYAN CTA"
              variant="primary"
              onPress={handleTestCart}
              style={styles.btnSpacing}
              icon={<Ionicons name="cart" size={16} color="#000000" />}
            />
            <AppButton
              title="OUTLINE BUTTON"
              variant="outline"
              onPress={handleTestLoading}
              loading={btnLoading}
              style={styles.btnSpacing}
            />
            <AppButton
              title="SECONDARY ACTION"
              variant="secondary"
              onPress={() => {}}
              style={styles.btnSpacing}
            />
            <AppButton
              title="DISABLED BUTTON"
              variant="primary"
              disabled
              onPress={() => {}}
            />
          </CinemaCard>
        </View>

        <View style={styles.section}>
          <AppText variant="badge" color={CinemaTheme.colors.primary} style={styles.sectionLabel}>
            INTERACTIVE CARDS
          </AppText>
          <CinemaCard
            elevated
            onPress={() => setClickCount((prev) => prev + 1)}
            style={styles.cardSpacing}
          >
            <AppText variant="h3">Tap this card to test touch feedback</AppText>
            <AppText variant="body" color={CinemaTheme.colors.textSecondary}>
              Click counter: {clickCount} taps
            </AppText>
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
  heroCard: {
    marginBottom: CinemaTheme.spacing.lg,
    borderColor: CinemaTheme.colors.primaryGlow,
  },
  heroText: {
    marginTop: CinemaTheme.spacing.xs,
    marginBottom: CinemaTheme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CinemaTheme.spacing.xs,
  },
  section: {
    marginBottom: CinemaTheme.spacing.lg,
  },
  sectionLabel: {
    marginBottom: CinemaTheme.spacing.xs,
    marginLeft: 2,
  },
  cardSpacing: {
    gap: CinemaTheme.spacing.sm,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CinemaTheme.spacing.xs,
  },
  btnSpacing: {
    marginBottom: CinemaTheme.spacing.sm,
  },
});
