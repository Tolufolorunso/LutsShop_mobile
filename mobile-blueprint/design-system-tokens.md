# LUTShop Mobile Design System & UI Tokens

To ensure the mobile app interface is visually identical and in strict sync with the web version, use these exact design tokens, typography rules, and component styles in your React Native project.

---

## 1. Theme Color Palette

```ts
export const CinemaTheme = {
  colors: {
    // Backgrounds
    background: '#0a0b0e',        // Screen canvas background (deep cinema black)
    card: '#121318',              // Card background
    cardElevated: '#181920',      // Elevated cards, modal sheets, and inputs
    cardHover: '#1f2029',         // Pressed / active touch state
    
    // Accents & Brand
    primary: '#00E5FF',           // High-voltage neon cyan (primary brand CTA)
    primaryGlow: 'rgba(0, 229, 255, 0.15)', // Neon cyan glow for badges and active borders
    secondary: '#2979FF',         // Electric cobalt blue
    accentGold: '#FFD700',        // Gold for "Best Seller" and "Master Suite" tags
    
    // Text Hierarchy
    textPrimary: '#F0F4F8',       // High-contrast cinema white/light-gray
    textSecondary: '#94A3B8',     // Muted slate gray for descriptions and camera specs
    textTertiary: '#64748B',      // Dim helper text and placeholders
    
    // Status & Utility
    success: '#00E676',           // Vibrant green for verified orders, active licenses
    warning: '#FFB300',           // Amber warning
    error: '#FF1744',             // Red error
    divider: 'rgba(255, 255, 255, 0.08)', // Thin separators and card borders
    
    // Overlays
    glassmorphism: 'rgba(10, 11, 14, 0.85)',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },
  
  // Radius
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  
  // Typography
  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, color: '#F0F4F8' },
    h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, color: '#F0F4F8' },
    h3: { fontSize: 18, fontWeight: '600' as const, color: '#F0F4F8' },
    body: { fontSize: 14, fontWeight: '400' as const, color: '#94A3B8', lineHeight: 20 },
    bodyBold: { fontSize: 14, fontWeight: '600' as const, color: '#F0F4F8' },
    caption: { fontSize: 12, fontWeight: '500' as const, color: '#64748B' },
    badge: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  }
};
```

---

## 2. Core Mobile Component Blueprints

### A. Cinema Product Card Style (React Native StyleSheet)
```tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CinemaTheme } from './theme';

export const ProductCard = ({ product, onPress, onAddToCart }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.afterImageUrl || product.thumbnailUrl }} style={styles.image} />
        {product.badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{product.badge}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.cameraRow}>
          <Text style={styles.cameraText}>
            {product.supportedCameras?.slice(0, 2).join(' • ') || 'ALL CAMERAS'}
          </Text>
          <Text style={styles.formatText}>{product.lutCount} LUTS</Text>
        </View>

        <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
        <Text style={styles.tagline} numberOfLines={2}>{product.tagline}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity style={styles.addBtn} onPress={onAddToCart}>
            <Text style={styles.addBtnText}>+ ADD</Text>
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
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#000',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 229, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: CinemaTheme.radius.xs,
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  content: {
    padding: 16,
  },
  cameraRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cameraText: {
    color: CinemaTheme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  formatText: {
    color: CinemaTheme.colors.textTertiary,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    ...CinemaTheme.typography.h3,
    marginBottom: 4,
  },
  tagline: {
    ...CinemaTheme.typography.body,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: CinemaTheme.colors.textPrimary,
  },
  addBtn: {
    backgroundColor: CinemaTheme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: CinemaTheme.radius.md,
  },
  addBtnText: {
    color: '#000',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
```

---

## 3. Touch-Enabled Before / After Split Slider

```tsx
import React, { useState } from 'react';
import { View, Image, StyleSheet, PanResponder } from 'react-native';
import { CinemaTheme } from './theme';

interface SplitProps {
  beforeUrl: string; // Flat / Log footage
  afterUrl: string;  // Graded cinema footage
  height?: number;
}

export const SplitSliderView: React.FC<SplitProps> = ({ beforeUrl, afterUrl, height = 260 }) => {
  const [sliderPos, setSliderPos] = useState(0.5); // 0.0 to 1.0 (50% default)
  const [width, setWidth] = useState(300);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      if (width > 0) {
        const newPos = Math.max(0.05, Math.min(0.95, gestureState.moveX / width));
        setSliderPos(newPos);
      }
    },
  });

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      {...panResponder.panHandlers}
    >
      {/* Background (After / Graded) */}
      <Image source={{ uri: afterUrl }} style={styles.image} resizeMode="cover" />

      {/* Foreground clipped (Before / Log) */}
      <View style={[styles.clippedContainer, { width: width * sliderPos }]}>
        <Image source={{ uri: beforeUrl }} style={[styles.image, { width }]} resizeMode="cover" />
      </View>

      {/* Divider Bar */}
      <View style={[styles.divider, { left: width * sliderPos - 1 }]}>
        <View style={styles.handle}>
          <View style={styles.handleArrowLeft} />
          <View style={styles.handleArrowRight} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: CinemaTheme.radius.lg,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  clippedContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  handle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 4,
    shadowColor: CinemaTheme.colors.primary,
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  handleArrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: '#000',
    marginRight: 2,
  },
  handleArrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 5,
    borderTopColor: 'transparent',
    borderBottomWidth: 5,
    borderBottomColor: 'transparent',
    borderLeftWidth: 6,
    borderLeftColor: '#000',
    marginLeft: 2,
  },
});
```
