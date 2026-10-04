import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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

const CAMERA_FILTERS = [
  'ALL',
  'SONY S-LOG3',
  'APPLE LOG',
  'CANON C-LOG',
  'WEDDINGS',
  'COMMERCIAL',
];

export default function ShopScreen() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <CinemaHeader
        title="LUTSHOP"
        subtitle="CINEMA CATALOG"
        cartCount={0}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={CinemaTheme.colors.textTertiary}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search camera, tone, or style..."
            placeholderTextColor={CinemaTheme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={18}
                color={CinemaTheme.colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {CAMERA_FILTERS.map((filter) => {
            const isSelected = selectedFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedFilter(filter)}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillSelected,
                ]}
                activeOpacity={0.8}
              >
                <AppText
                  variant="caption"
                  color={
                    isSelected
                      ? '#000000'
                      : CinemaTheme.colors.textSecondary
                  }
                  style={styles.filterPillText}
                >
                  {filter}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <CinemaCard elevated style={styles.featuredCard}>
          <View style={styles.badgeRow}>
            <BadgePill label="SONY S-LOG3" variant="camera" />
            <BadgePill label="BEST SELLER" variant="gold" />
          </View>

          <AppText variant="h2" style={styles.productTitle}>
            Venice Master Cinema Suite
          </AppText>

          <AppText variant="body" color={CinemaTheme.colors.textSecondary} style={styles.productTagline}>
            14 precision color transformation LUTs engineered for Sony Venice, FX6, FX3, and A7S III.
          </AppText>

          <View style={styles.priceRow}>
            <View>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                FORMAT .CUBE (REC.709)
              </AppText>
              <AppText variant="h2" color={CinemaTheme.colors.primary}>
                $49.00
              </AppText>
            </View>

            <AppButton
              title="+ ADD TO CART"
              variant="primary"
              size="sm"
              onPress={() => router.push('/(tabs)/cart')}
            />
          </View>
        </CinemaCard>

        <CinemaCard style={styles.catalogInfoCard}>
          <AppText variant="h3">Full Catalog Launching in Milestone 2</AppText>
          <AppText variant="body" color={CinemaTheme.colors.textSecondary} style={styles.infoText}>
            Upcoming features include live REST API catalog synchronization, search filtering, and interactive 60fps before/after split grading sliders.
          </AppText>
          <BadgePill label="MILESTONE 2 READY" variant="primary" />
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
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderRadius: CinemaTheme.radius.md,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingVertical: CinemaTheme.spacing.sm,
    marginBottom: CinemaTheme.spacing.md,
  },
  searchIcon: {
    marginRight: CinemaTheme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: CinemaTheme.colors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
  filterScroll: {
    paddingBottom: CinemaTheme.spacing.md,
    gap: CinemaTheme.spacing.xs,
  },
  filterPill: {
    backgroundColor: CinemaTheme.colors.card,
    borderRadius: CinemaTheme.radius.pill,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingVertical: CinemaTheme.spacing.xs + 2,
    marginRight: CinemaTheme.spacing.xs,
  },
  filterPillSelected: {
    backgroundColor: CinemaTheme.colors.primary,
    borderColor: CinemaTheme.colors.primary,
  },
  filterPillText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  featuredCard: {
    borderColor: CinemaTheme.colors.primaryGlow,
    marginBottom: CinemaTheme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: CinemaTheme.spacing.xs,
    marginBottom: CinemaTheme.spacing.sm,
  },
  productTitle: {
    marginBottom: CinemaTheme.spacing.xs,
  },
  productTagline: {
    marginBottom: CinemaTheme.spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CinemaTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  catalogInfoCard: {
    gap: CinemaTheme.spacing.xs,
  },
  infoText: {
    marginTop: CinemaTheme.spacing.xs,
    marginBottom: CinemaTheme.spacing.sm,
  },
});
