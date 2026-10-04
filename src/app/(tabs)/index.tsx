import React from 'react';
import {
  ActivityIndicator,
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
import { useProducts } from '@/hooks';
import { CinemaTheme } from '@/theme';

const CAMERA_FILTERS: { label: string; value: string }[] = [
  { label: 'ALL', value: 'All' },
  { label: 'SONY S-LOG3', value: 'Sony' },
  { label: 'ARRI LOGC', value: 'ARRI' },
  { label: 'APPLE LOG', value: 'Apple' },
  { label: 'RED IPP2', value: 'RED' },
  { label: 'BMPCC GEN 5', value: 'BMPCC' },
];

export default function ShopScreen() {
  const router = useRouter();
  const {
    products,
    loading,
    searchQuery,
    selectedCamera,
    totalCount,
    featuredProduct,
    setSearchQuery,
    setSelectedCamera,
    clearFilters,
  } = useProducts();

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
            const isSelected = selectedCamera === filter.value;
            return (
              <TouchableOpacity
                key={filter.value}
                onPress={() => setSelectedCamera(filter.value)}
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
                  {filter.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.resultsHeaderRow}>
          <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
            {loading
              ? 'SYNCHRONIZING CATALOG...'
              : `${totalCount} CINEMA LUT PACK${totalCount === 1 ? '' : 'S'} AVAILABLE`}
          </AppText>

          {(searchQuery !== '' || selectedCamera !== 'All') && (
            <TouchableOpacity onPress={clearFilters}>
              <AppText variant="caption" color={CinemaTheme.colors.primary}>
                RESET FILTERS
              </AppText>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={CinemaTheme.colors.primary} />
            <AppText
              variant="body"
              color={CinemaTheme.colors.textSecondary}
              style={styles.loadingText}
            >
              Loading color transformation profiles...
            </AppText>
          </View>
        ) : totalCount === 0 ? (
          <CinemaCard style={styles.emptyCard}>
            <Ionicons
              name="search-outline"
              size={36}
              color={CinemaTheme.colors.textTertiary}
            />
            <AppText variant="h3">No Matching LUTs Found</AppText>
            <AppText
              variant="body"
              color={CinemaTheme.colors.textSecondary}
              style={styles.emptyText}
            >
              Try clearing your search query or switching to another camera profile filter.
            </AppText>
            <AppButton
              title="CLEAR ALL FILTERS"
              variant="outline"
              size="sm"
              onPress={clearFilters}
            />
          </CinemaCard>
        ) : (
          <>
            {featuredProduct && (
              <CinemaCard elevated style={styles.featuredCard}>
                <View style={styles.badgeRow}>
                  {featuredProduct.supportedCameras[0] && (
                    <BadgePill
                      label={featuredProduct.supportedCameras[0].toUpperCase()}
                      variant="camera"
                    />
                  )}
                  {featuredProduct.badge && (
                    <BadgePill
                      label={featuredProduct.badge}
                      variant="gold"
                    />
                  )}
                  <BadgePill
                    label={`${featuredProduct.lutCount} LUTS`}
                    variant="camera"
                  />
                </View>

                <AppText variant="h2" style={styles.productTitle}>
                  {featuredProduct.title}
                </AppText>

                <AppText
                  variant="body"
                  color={CinemaTheme.colors.textSecondary}
                  style={styles.productTagline}
                >
                  {featuredProduct.tagline}
                </AppText>

                <View style={styles.priceRow}>
                  <View>
                    <AppText
                      variant="caption"
                      color={CinemaTheme.colors.textTertiary}
                    >
                      CATEGORY: {featuredProduct.category.toUpperCase()}
                    </AppText>
                    <AppText variant="h2" color={CinemaTheme.colors.primary}>
                      ${featuredProduct.price}.00
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
            )}

            <View style={styles.catalogList}>
              {products
                .filter((p) => p.id !== featuredProduct?.id)
                .slice(0, 4)
                .map((product) => (
                  <CinemaCard key={product.id} style={styles.productMiniCard}>
                    <View style={styles.badgeRow}>
                      <BadgePill
                        label={product.category.toUpperCase()}
                        variant="camera"
                      />
                      <BadgePill
                        label={`${product.lutCount} LUTS`}
                        variant="camera"
                      />
                    </View>

                    <AppText variant="bodyBold" style={styles.miniTitle}>
                      {product.title}
                    </AppText>

                    <AppText
                      variant="caption"
                      color={CinemaTheme.colors.textSecondary}
                      numberOfLines={2}
                      style={styles.miniTagline}
                    >
                      {product.tagline}
                    </AppText>

                    <View style={styles.miniFooter}>
                      <AppText variant="bodyBold" color={CinemaTheme.colors.primary}>
                        ${product.price}
                      </AppText>
                      <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                        ★ {product.rating} ({product.reviewsCount})
                      </AppText>
                    </View>
                  </CinemaCard>
                ))}
            </View>

            <CinemaCard style={styles.catalogInfoCard}>
              <AppText variant="h3">Feature 5 Preview: Visual Product Cards</AppText>
              <AppText
                variant="body"
                color={CinemaTheme.colors.textSecondary}
                style={styles.infoText}
              >
                API client and reactive catalog filtering state are active. Feature 5 will add high-resolution split image cards and full FlatList rendering.
              </AppText>
              <BadgePill label="STATE HOOKS CONNECTED" variant="primary" />
            </CinemaCard>
          </>
        )}
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
    paddingBottom: CinemaTheme.spacing.sm,
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
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: CinemaTheme.spacing.sm,
    paddingHorizontal: CinemaTheme.spacing.xs,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: CinemaTheme.spacing.xl * 2,
  },
  loadingText: {
    marginTop: CinemaTheme.spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: CinemaTheme.spacing.xl,
    gap: CinemaTheme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: CinemaTheme.spacing.sm,
  },
  featuredCard: {
    borderColor: CinemaTheme.colors.primaryGlow,
    marginBottom: CinemaTheme.spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  catalogList: {
    gap: CinemaTheme.spacing.sm,
    marginBottom: CinemaTheme.spacing.md,
  },
  productMiniCard: {
    gap: CinemaTheme.spacing.xs,
  },
  miniTitle: {
    fontSize: 16,
  },
  miniTagline: {
    lineHeight: 16,
  },
  miniFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: CinemaTheme.spacing.xs,
    paddingTop: CinemaTheme.spacing.xs,
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
