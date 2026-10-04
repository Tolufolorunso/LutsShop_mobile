import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
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
  BadgePill,
  CinemaCard,
  CinemaHeader,
} from '@/components/ui';
import { ProductCard } from '@/components/product';
import { SplitComparisonView } from '@/components/slider';
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
    featuredProduct,
    setSearchQuery,
    setSelectedCamera,
    clearFilters,
    refresh,
  } = useProducts();

  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

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

  const handleProductPress = useCallback((product: Product) => {
    setModalProduct(product);
  }, []);

  const closeModal = useCallback(() => {
    setModalProduct(null);
  }, []);

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

      {/* Featured Split Hero Slider (Feature 6 Showcase) */}
      {featuredProduct && searchQuery === '' && selectedCamera === 'All' && (
        <CinemaCard elevated style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.badgeRow}>
              <BadgePill label="60FPS SPLIT SLIDER" variant="primary" size="sm" />
              <BadgePill label="FEATURED PACK" variant="gold" size="sm" />
            </View>
            <AppText variant="caption" color={CinemaTheme.colors.primary}>
              DRAG CYAN HANDLE ◄ ►
            </AppText>
          </View>

          <AppText variant="h2" style={styles.heroTitle}>
            {featuredProduct.title}
          </AppText>

          <AppText
            variant="caption"
            color={CinemaTheme.colors.textSecondary}
            style={styles.heroSubtitle}
          >
            {featuredProduct.supportedCameras.slice(0, 3).join(' • ')}
          </AppText>

          {/* Interactive Split Comparison View */}
          <SplitComparisonView
            beforeUrl={featuredProduct.beforeImageUrl}
            afterUrl={featuredProduct.afterImageUrl}
            height={220}
            beforeLabel="RAW LOG"
            afterLabel="VENICE GOLD"
            style={styles.heroSlider}
          />

          <View style={styles.heroFooter}>
            <View>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                CINEMA MASTER PRINT
              </AppText>
              <AppText variant="h2" color={CinemaTheme.colors.primary}>
                ${featuredProduct.price}.00
              </AppText>
            </View>

            <View style={styles.heroBtnGroup}>
              <AppButton
                title="FULLSCREEN"
                variant="outline"
                size="sm"
                onPress={() => setModalProduct(featuredProduct)}
              />
              <AppButton
                title={addedIds.has(featuredProduct.id) ? 'ADDED ✓' : '+ ADD TO CART'}
                variant={addedIds.has(featuredProduct.id) ? 'secondary' : 'primary'}
                size="sm"
                onPress={() => handleAddToCart(featuredProduct)}
              />
            </View>
          </View>
        </CinemaCard>
      )}

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

      {/* Fullscreen Split Comparison Modal */}
      <Modal
        visible={modalProduct !== null}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <AppText variant="h2" numberOfLines={1}>
                  {modalProduct?.title}
                </AppText>
                <AppText
                  variant="caption"
                  color={CinemaTheme.colors.primary}
                  numberOfLines={1}
                >
                  {modalProduct?.supportedCameras.join(' • ')}
                </AppText>
              </View>

              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={closeModal}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="close"
                  size={20}
                  color={CinemaTheme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>

            {/* Split Comparison Slider in Modal */}
            {modalProduct && (
              <SplitComparisonView
                beforeUrl={modalProduct.beforeImageUrl}
                afterUrl={modalProduct.afterImageUrl}
                height={300}
                beforeLabel="RAW LOG"
                afterLabel={modalProduct.category.toUpperCase()}
                style={styles.modalSlider}
              />
            )}

            <AppText
              variant="caption"
              color={CinemaTheme.colors.textTertiary}
              style={styles.modalInstructions}
            >
              DRAG THE CYAN DIVIDER HANDLE TO COMPARE LOG FOOTAGE & CINEMA COLOR GRADE
            </AppText>

            {/* Modal Description */}
            <AppText
              variant="body"
              color={CinemaTheme.colors.textSecondary}
              style={styles.modalDescription}
            >
              {modalProduct?.description}
            </AppText>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <View>
                <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                  {modalProduct?.lutCount} LUTS INCLUDED
                </AppText>
                <AppText variant="h2" color={CinemaTheme.colors.primary}>
                  ${modalProduct?.price}.00
                </AppText>
              </View>

              <View style={styles.modalBtnRow}>
                <AppButton
                  title="CLOSE"
                  variant="outline"
                  size="sm"
                  onPress={closeModal}
                />
                {modalProduct && (
                  <AppButton
                    title={
                      addedIds.has(modalProduct.id)
                        ? 'ADDED ✓'
                        : '+ ADD TO CART'
                    }
                    variant={
                      addedIds.has(modalProduct.id)
                        ? 'secondary'
                        : 'primary'
                    }
                    size="sm"
                    onPress={() => handleAddToCart(modalProduct)}
                  />
                )}
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  heroCard: {
    borderColor: CinemaTheme.colors.primaryGlow,
    marginBottom: CinemaTheme.spacing.lg,
    padding: CinemaTheme.spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CinemaTheme.spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: CinemaTheme.spacing.xs,
  },
  heroTitle: {
    marginTop: CinemaTheme.spacing.xs,
    marginBottom: 2,
  },
  heroSubtitle: {
    marginBottom: CinemaTheme.spacing.md,
  },
  heroSlider: {
    marginBottom: CinemaTheme.spacing.md,
  },
  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CinemaTheme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  heroBtnGroup: {
    flexDirection: 'row',
    gap: CinemaTheme.spacing.xs,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: CinemaTheme.colors.card,
    borderTopLeftRadius: CinemaTheme.radius.xl,
    borderTopRightRadius: CinemaTheme.radius.xl,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    padding: CinemaTheme.spacing.lg,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CinemaTheme.spacing.md,
  },
  modalTitleContainer: {
    flex: 1,
    marginRight: CinemaTheme.spacing.md,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CinemaTheme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
  },
  modalSlider: {
    marginBottom: CinemaTheme.spacing.sm,
  },
  modalInstructions: {
    textAlign: 'center',
    marginBottom: CinemaTheme.spacing.md,
    letterSpacing: 0.5,
  },
  modalDescription: {
    lineHeight: 20,
    marginBottom: CinemaTheme.spacing.lg,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CinemaTheme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: CinemaTheme.spacing.sm,
  },
});
