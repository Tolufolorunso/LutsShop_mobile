import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
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
  CinemaCard,
  CinemaHeader,
} from '@/components/ui';
import { ProductCard } from '@/components/product';
import { useProducts } from '@/hooks';
import { Product } from '@/types/product';
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
    setSearchQuery,
    setSelectedCamera,
    clearFilters,
    refresh,
  } = useProducts();

  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = useCallback((product: Product) => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  }, []);

  const handleProductPress = useCallback(
    (_product: Product) => {
      // Feature 7 will navigate to Product Details screen: router.push(`/product/${product.slug}`)
    },
    []
  );

  const renderProductItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard
        product={item}
        onAddToCart={handleAddToCart}
        onPress={handleProductPress}
        isAdded={addedIds.has(item.id)}
      />
    ),
    [handleAddToCart, handleProductPress, addedIds]
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Search Input Container */}
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
          autoCapitalize="none"
          autoCorrect={false}
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

      {/* Camera Profile Filter Pills */}
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

      {/* Catalog Results Header Row */}
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
    </View>
  );

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={CinemaTheme.colors.primary} />
          <AppText
            variant="body"
            color={CinemaTheme.colors.textSecondary}
            style={styles.loadingText}
          >
            Synchronizing cinema color profiles...
          </AppText>
        </View>
      );
    }

    return (
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
          No profiles matched your search or camera filter. Try adjusting your query or resetting filters.
        </AppText>
        <AppButton
          title="CLEAR ALL FILTERS"
          variant="outline"
          size="sm"
          onPress={clearFilters}
        />
      </CinemaCard>
    );
  };

  return (
    <View style={styles.container}>
      <CinemaHeader
        title="LUTSHOP"
        subtitle="CINEMA CATALOG"
        cartCount={addedIds.size}
        onCartPress={() => router.push('/(tabs)/cart')}
      />

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProductItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            tintColor={CinemaTheme.colors.primary}
            colors={[CinemaTheme.colors.primary]}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
  },
  listContent: {
    padding: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.xl + 24,
  },
  headerContainer: {
    marginBottom: CinemaTheme.spacing.xs,
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
  },
  emptyText: {
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: CinemaTheme.spacing.sm,
  },
});
