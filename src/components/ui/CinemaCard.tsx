import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { CinemaTheme } from '@/theme';

export interface CinemaCardProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
  onPress?: () => void;
  activeOpacity?: number;
}

export const CinemaCard: React.FC<CinemaCardProps> = ({
  children,
  style,
  elevated = false,
  onPress,
  activeOpacity = 0.85,
}) => {
  const cardStyle = [
    styles.card,
    elevated ? styles.elevated : styles.standard,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        style={cardStyle}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: CinemaTheme.radius.lg,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    padding: CinemaTheme.spacing.md,
  },
  standard: {
    backgroundColor: CinemaTheme.colors.card,
  },
  elevated: {
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
});
