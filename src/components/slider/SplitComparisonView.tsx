import React, { useState, useMemo } from 'react';
import {
  PanResponder,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { CinemaTheme } from '@/theme';

export interface SplitComparisonViewProps {
  beforeUrl: string;
  afterUrl: string;
  height?: number;
  initialPosition?: number;
  beforeLabel?: string;
  afterLabel?: string;
  showLabels?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SplitComparisonView: React.FC<SplitComparisonViewProps> = ({
  beforeUrl,
  afterUrl,
  height = 240,
  initialPosition = 0.5,
  beforeLabel = 'RAW LOG',
  afterLabel = 'GRADED',
  showLabels = true,
  style,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(initialPosition);
  const [width, setWidth] = useState<number>(320);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.dx) > 4
          );
        },
        onMoveShouldSetPanResponderCapture: (_, gestureState) => {
          return (
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
            Math.abs(gestureState.dx) > 4
          );
        },
        onPanResponderGrant: (evt) => {
          if (width > 0) {
            const touchX = evt.nativeEvent.locationX;
            const newPos = Math.max(0.02, Math.min(0.98, touchX / width));
            setSliderPos(newPos);
          }
        },
        onPanResponderMove: (evt) => {
          if (width > 0) {
            const touchX = evt.nativeEvent.locationX;
            const newPos = Math.max(0.02, Math.min(0.98, touchX / width));
            setSliderPos(newPos);
          }
        },
      }),
    [width]
  );

  return (
    <View
      style={[styles.container, { height }, style]}
      onLayout={(e) => {
        const layoutWidth = e.nativeEvent.layout.width;
        if (layoutWidth > 0 && layoutWidth !== width) {
          setWidth(layoutWidth);
        }
      }}
      {...panResponder.panHandlers}
    >
      {/* Background Layer: After (Graded Cinema Frame) */}
      <Image
        source={{ uri: afterUrl }}
        style={styles.image}
        contentFit="cover"
        transition={150}
      />

      {/* Clipped Foreground Layer: Before (Raw Log Footage) */}
      <View style={[styles.clippedContainer, { width: width * sliderPos }]}>
        <Image
          source={{ uri: beforeUrl }}
          style={[styles.image, { width }]}
          contentFit="cover"
          transition={150}
        />
      </View>

      {/* Floating Badges */}
      {showLabels && (
        <>
          <View style={styles.leftLabel}>
            <Text style={styles.labelText}>{beforeLabel}</Text>
          </View>
          <View style={styles.rightLabel}>
            <Text style={styles.labelText}>{afterLabel}</Text>
          </View>
        </>
      )}

      {/* Divider Bar */}
      <View
        style={[styles.divider, { left: width * sliderPos - 1 }]}
        pointerEvents="none"
      >
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
    backgroundColor: '#000000',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
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
  leftLabel: {
    position: 'absolute',
    top: CinemaTheme.spacing.sm,
    left: CinemaTheme.spacing.sm,
    backgroundColor: 'rgba(10, 11, 14, 0.85)',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: CinemaTheme.radius.xs,
    zIndex: 1,
  },
  rightLabel: {
    position: 'absolute',
    top: CinemaTheme.spacing.sm,
    right: CinemaTheme.spacing.sm,
    backgroundColor: 'rgba(10, 11, 14, 0.85)',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: CinemaTheme.radius.xs,
    zIndex: 1,
  },
  labelText: {
    color: CinemaTheme.colors.textPrimary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  divider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  handle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    elevation: 6,
    shadowColor: CinemaTheme.colors.primary,
    shadowOpacity: 0.7,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  handleArrowLeft: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    borderRightWidth: 5,
    borderRightColor: '#000000',
    marginRight: 2,
  },
  handleArrowRight: {
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
    borderLeftWidth: 5,
    borderLeftColor: '#000000',
    marginLeft: 2,
  },
});
