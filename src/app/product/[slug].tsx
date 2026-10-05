import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  AppButton,
  AppText,
  BadgePill,
  CinemaCard,
} from '@/components/ui';
import { SplitComparisonView } from '@/components/slider';
import { useProduct } from '@/hooks';
import { useCart } from '@/context';
import { CinemaTheme } from '@/theme';

export default function ProductDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { product, loading, error } = useProduct(slug);

  const { addItem, isInCart } = useCart();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={CinemaTheme.colors.primary} />
        <AppText
          variant="body"
          color={CinemaTheme.colors.textSecondary}
          style={styles.loadingText}
        >
          Loading cinema profile data...
        </AppText>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.errorContainer, { paddingTop: insets.top }]}>
        <Ionicons
          name="alert-circle-outline"
          size={48}
          color={CinemaTheme.colors.error}
        />
        <AppText variant="h2" style={styles.errorTitle}>
          LUT Pack Not Found
        </AppText>
        <AppText
          variant="body"
          color={CinemaTheme.colors.textSecondary}
          style={styles.errorText}
        >
          The requested color transformation profile could not be located in the catalog.
        </AppText>
        <AppButton
          title="BACK TO CATALOG"
          variant="primary"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const badgeVariant =
    product.badge === 'BEST SELLER' || product.badge === 'PRO PACK'
      ? 'gold'
      : 'primary';

  return (
    <View style={styles.container}>
      {/* Top Custom Header */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={CinemaTheme.colors.textPrimary}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
            {product.category.toUpperCase()} MASTER SUITE
          </AppText>
          <AppText variant="bodyBold" numberOfLines={1}>
            {product.title}
          </AppText>
        </View>

        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/(tabs)/cart')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="cart-outline"
            size={22}
            color={CinemaTheme.colors.textPrimary}
          />
          {isInCart(product.id) && <View style={styles.cartBadgeDot} />}
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 90 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-Width Split Comparison Slider */}
        <View style={styles.sliderContainer}>
          <SplitComparisonView
            beforeUrl={product.beforeImageUrl}
            afterUrl={product.afterImageUrl}
            height={280}
            beforeLabel="RAW LOG"
            afterLabel={product.category.toUpperCase()}
          />
          <AppText
            variant="caption"
            color={CinemaTheme.colors.textTertiary}
            style={styles.sliderHint}
          >
            DRAG CYAN DIVIDER TO COMPARE RAW LOG VS. GRADED CINEMA PRINT
          </AppText>
        </View>

        {/* Product Title & Badges Section */}
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            {product.supportedCameras[0] && (
              <BadgePill
                label={product.supportedCameras[0].toUpperCase()}
                variant="camera"
              />
            )}
            {product.badge && (
              <BadgePill label={product.badge} variant={badgeVariant} />
            )}
            <BadgePill
              label={`${product.lutCount} LUTS`}
              variant="camera"
            />
          </View>

          <AppText variant="h1" style={styles.title}>
            {product.title}
          </AppText>

          <AppText
            variant="body"
            color={CinemaTheme.colors.textSecondary}
            style={styles.tagline}
          >
            {product.tagline}
          </AppText>

          {/* Rating Summary Row */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={15} color={CinemaTheme.colors.accentGold} />
            <AppText variant="bodyBold" style={styles.ratingScore}>
              {product.rating.toFixed(1)}
            </AppText>
            <AppText
              variant="caption"
              color={CinemaTheme.colors.textTertiary}
            >
              ({product.reviewsCount} verified filmmaker reviews)
            </AppText>
          </View>
        </View>

        {/* Narrative Description Card */}
        <CinemaCard elevated style={styles.cardSection}>
          <AppText variant="caption" color={CinemaTheme.colors.primary}>
            ARTISTIC INSPIRATION & USE CASES
          </AppText>
          <AppText variant="h3" style={styles.sectionHeading}>
            Cinematic Color Science
          </AppText>
          <AppText
            variant="body"
            color={CinemaTheme.colors.textSecondary}
            style={styles.descriptionText}
          >
            {product.description}
          </AppText>
        </CinemaCard>

        {/* Technical Specifications Card */}
        <CinemaCard style={styles.cardSection}>
          <AppText variant="caption" color={CinemaTheme.colors.primary}>
            TECHNICAL SPECIFICATIONS
          </AppText>
          <AppText variant="h3" style={styles.sectionHeading}>
            Engineered Camera Compatibility
          </AppText>

          <View style={styles.specList}>
            <View style={styles.specRow}>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                TARGET COLOR SPACE
              </AppText>
              <AppText variant="bodyBold">
                {product.techSpecs.colorSpace || 'Rec.709 Cinema Standard'}
              </AppText>
            </View>

            <View style={styles.specRow}>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                LUT TRANSFORMATION FORMATS
              </AppText>
              <AppText variant="bodyBold">
                {product.techSpecs.fileFormats?.join(' • ') || '.CUBE (33x33x33 & 65x65x65)'}
              </AppText>
            </View>

            <View style={styles.specRow}>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                CALIBRATED SENSORS / CURVES
              </AppText>
              <AppText variant="bodyBold">
                {product.techSpecs.cameraCurves?.join(', ') || product.supportedCameras.join(', ')}
              </AppText>
            </View>

            <View style={styles.specRow}>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                PACKAGE DOWNLOAD SIZE
              </AppText>
              <AppText variant="bodyBold">
                {product.techSpecs.packageSize || '145 MB'}
              </AppText>
            </View>
          </View>
        </CinemaCard>
      </ScrollView>

      {/* Sticky Bottom Purchase Bar */}
      <View
        style={[
          styles.stickyBottomBar,
          { paddingBottom: Math.max(insets.bottom, CinemaTheme.spacing.md) },
        ]}
      >
        <View style={styles.priceContainer}>
          <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
            LIFETIME LICENSE
          </AppText>
          <View style={styles.priceRow}>
            <AppText variant="h1" color={CinemaTheme.colors.textPrimary}>
              ${product.price}
            </AppText>
            {product.originalPrice && (
              <AppText
                variant="body"
                color={CinemaTheme.colors.textTertiary}
                style={styles.originalPrice}
              >
                ${product.originalPrice}
              </AppText>
            )}
          </View>
        </View>

        <AppButton
          title={isInCart(product.id) ? 'ADDED TO CART ✓' : '+ ADD TO CART'}
          variant={isInCart(product.id) ? 'secondary' : 'primary'}
          size="md"
          onPress={() => addItem(product)}
          style={styles.buyBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: CinemaTheme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CinemaTheme.spacing.xl,
    gap: CinemaTheme.spacing.md,
  },
  errorTitle: {
    marginTop: CinemaTheme.spacing.sm,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: CinemaTheme.spacing.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.sm,
    backgroundColor: CinemaTheme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CinemaTheme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: CinemaTheme.spacing.sm,
  },
  cartBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CinemaTheme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    position: 'relative',
  },
  cartBadgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CinemaTheme.colors.primary,
  },
  scrollContent: {
    padding: CinemaTheme.spacing.md,
  },
  sliderContainer: {
    marginBottom: CinemaTheme.spacing.md,
  },
  sliderHint: {
    textAlign: 'center',
    marginTop: CinemaTheme.spacing.xs,
    letterSpacing: 0.5,
  },
  titleSection: {
    marginBottom: CinemaTheme.spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CinemaTheme.spacing.xs,
    marginBottom: CinemaTheme.spacing.sm,
  },
  title: {
    marginBottom: CinemaTheme.spacing.xs,
  },
  tagline: {
    marginBottom: CinemaTheme.spacing.sm,
    lineHeight: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingScore: {
    color: CinemaTheme.colors.textPrimary,
  },
  cardSection: {
    marginBottom: CinemaTheme.spacing.md,
    gap: CinemaTheme.spacing.xs,
  },
  sectionHeading: {
    marginBottom: CinemaTheme.spacing.xs,
  },
  descriptionText: {
    lineHeight: 20,
  },
  specList: {
    gap: CinemaTheme.spacing.sm,
    marginTop: CinemaTheme.spacing.xs,
  },
  specRow: {
    paddingVertical: CinemaTheme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
  },
  stickyBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingTop: CinemaTheme.spacing.md,
  },
  priceContainer: {
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
  },
  buyBtn: {
    minWidth: 160,
  },
});
