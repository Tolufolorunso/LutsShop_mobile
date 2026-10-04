import React, { useState } from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types/product';
import { CinemaTheme } from '@/theme';
import { BadgePill } from '../ui/BadgePill';

export interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
  isAdded?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  onAddToCart,
  isAdded = false,
  style,
}) => {
  const [showBefore, setShowBefore] = useState<boolean>(false);

  const displayImage = showBefore
    ? product.beforeImageUrl
    : product.afterImageUrl || product.thumbnailUrl;

  const camerasText =
    product.supportedCameras && product.supportedCameras.length > 0
      ? product.supportedCameras.slice(0, 2).join(' • ').toUpperCase()
      : 'ALL CAMERAS';

  const badgeVariant =
    product.badge === 'BEST SELLER' || product.badge === 'PRO PACK'
      ? 'gold'
      : 'primary';

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={0.9}
      onPress={() => onPress?.(product)}
    >
      {/* Media Banner */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: displayImage }}
          style={styles.image}
          contentFit="cover"
          transition={250}
        />

        {/* Top Badges */}
        <View style={styles.badgesRow}>
          {product.badge ? (
            <BadgePill label={product.badge} variant={badgeVariant} size="sm" />
          ) : (
            <BadgePill
              label={product.category.toUpperCase()}
              variant="camera"
              size="sm"
            />
          )}

          {/* Interactive Before/After Toggle */}
          <TouchableOpacity
            style={[
              styles.toggleBtn,
              showBefore && styles.toggleBtnActive,
            ]}
            activeOpacity={0.8}
            onPress={() => setShowBefore((prev) => !prev)}
          >
            <Ionicons
              name={showBefore ? 'contrast' : 'contrast-outline'}
              size={12}
              color={showBefore ? '#000000' : CinemaTheme.colors.primary}
              style={styles.toggleIcon}
            />
            <Text
              style={[
                styles.toggleText,
                showBefore && styles.toggleTextActive,
              ]}
            >
              {showBefore ? 'LOG' : 'GRADED'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom image overlay with mode label */}
        <View style={styles.imageOverlayLabel}>
          <Text style={styles.modeLabel}>
            {showBefore ? 'RAW LOG FOOTAGE' : 'GRADED CINEMA FRAME'}
          </Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.content}>
        {/* Camera specs row */}
        <View style={styles.cameraRow}>
          <Text style={styles.cameraText} numberOfLines={1}>
            {camerasText}
          </Text>
          <Text style={styles.formatText}>{product.lutCount} LUTS</Text>
        </View>

        {/* Title & Tagline */}
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <Text style={styles.tagline} numberOfLines={2}>
          {product.tagline}
        </Text>

        {/* Rating row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={CinemaTheme.colors.accentGold} />
          <Text style={styles.ratingScore}>{product.rating.toFixed(1)}</Text>
          <Text style={styles.reviewsCount}>({product.reviewsCount} reviews)</Text>
          <Text style={styles.categoryBadge}>{product.category}</Text>
        </View>

        {/* Footer with Price and Add to Cart */}
        <View style={styles.footerRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice}</Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.addBtn, isAdded && styles.addBtnSuccess]}
            activeOpacity={0.8}
            onPress={() => onAddToCart?.(product)}
          >
            {isAdded ? (
              <>
                <Ionicons
                  name="checkmark"
                  size={14}
                  color="#000000"
                  style={styles.addBtnIcon}
                />
                <Text style={styles.addBtnText}>ADDED</Text>
              </>
            ) : (
              <Text style={styles.addBtnText}>+ ADD</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: CinemaTheme.colors.card,
    borderRadius: CinemaTheme.radius.lg,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    marginBottom: CinemaTheme.spacing.md,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#000000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesRow: {
    position: 'absolute',
    top: CinemaTheme.spacing.sm,
    left: CinemaTheme.spacing.sm,
    right: CinemaTheme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 11, 14, 0.85)',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primary,
    borderRadius: CinemaTheme.radius.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  toggleBtnActive: {
    backgroundColor: CinemaTheme.colors.primary,
  },
  toggleIcon: {
    marginRight: 4,
  },
  toggleText: {
    color: CinemaTheme.colors.primary,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  toggleTextActive: {
    color: '#000000',
  },
  imageOverlayLabel: {
    position: 'absolute',
    bottom: CinemaTheme.spacing.xs,
    left: CinemaTheme.spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: CinemaTheme.radius.xs,
  },
  modeLabel: {
    color: CinemaTheme.colors.textSecondary,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  content: {
    padding: CinemaTheme.spacing.md,
  },
  cameraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cameraText: {
    color: CinemaTheme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    flex: 1,
  },
  formatText: {
    color: CinemaTheme.colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
    marginLeft: CinemaTheme.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: CinemaTheme.colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  tagline: {
    fontSize: 13,
    fontWeight: '400',
    color: CinemaTheme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: CinemaTheme.spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CinemaTheme.spacing.md,
    gap: 4,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: CinemaTheme.colors.textPrimary,
    marginLeft: 2,
  },
  reviewsCount: {
    fontSize: 11,
    color: CinemaTheme.colors.textTertiary,
    marginRight: 6,
  },
  categoryBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: CinemaTheme.colors.textSecondary,
    backgroundColor: CinemaTheme.colors.cardElevated,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: CinemaTheme.radius.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CinemaTheme.spacing.sm + 2,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: CinemaTheme.colors.textPrimary,
  },
  originalPrice: {
    fontSize: 13,
    color: CinemaTheme.colors.textTertiary,
    textDecorationLine: 'line-through',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CinemaTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: CinemaTheme.radius.md,
  },
  addBtnSuccess: {
    backgroundColor: CinemaTheme.colors.success,
  },
  addBtnIcon: {
    marginRight: 4,
  },
  addBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
