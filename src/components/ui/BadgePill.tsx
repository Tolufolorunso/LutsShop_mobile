import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CinemaTheme } from '@/theme';

export type BadgeVariant = 'primary' | 'gold' | 'camera' | 'success' | 'error';
export type BadgeSize = 'sm' | 'md';

export interface BadgePillProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: StyleProp<ViewStyle>;
}

export const BadgePill: React.FC<BadgePillProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  return (
    <View style={[styles.base, styles[variant], styles[size], style]}>
      <Text style={[styles.text, textStyles[variant], textStyles[size]]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: CinemaTheme.radius.xs,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  md: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  primary: {
    backgroundColor: CinemaTheme.colors.primaryGlow,
    borderColor: CinemaTheme.colors.primary,
  },
  gold: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: CinemaTheme.colors.accentGold,
  },
  camera: {
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderColor: CinemaTheme.colors.divider,
  },
  success: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    borderColor: CinemaTheme.colors.success,
  },
  error: {
    backgroundColor: 'rgba(255, 23, 68, 0.15)',
    borderColor: CinemaTheme.colors.error,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

const textStyles = StyleSheet.create({
  sm: {
    fontSize: 9,
  },
  md: {
    fontSize: 11,
  },
  primary: {
    color: CinemaTheme.colors.primary,
  },
  gold: {
    color: CinemaTheme.colors.accentGold,
  },
  camera: {
    color: CinemaTheme.colors.primary,
  },
  success: {
    color: CinemaTheme.colors.success,
  },
  error: {
    color: CinemaTheme.colors.error,
  },
});
