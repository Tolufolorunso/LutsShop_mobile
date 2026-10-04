import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { CinemaTheme } from '@/theme';

export type ButtonVariant = 'primary' | 'outline' | 'secondary';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface AppButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const isInteractive = !disabled && !loading;

  const spinnerColor =
    variant === 'primary' ? '#000000' : CinemaTheme.colors.primary;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!isInteractive}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={spinnerColor} />
      ) : (
        <View style={styles.contentRow}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
          <Text style={[styles.text, textStyles[variant], textStyles[size], textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: CinemaTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: CinemaTheme.spacing.xs,
  },
  primary: {
    backgroundColor: CinemaTheme.colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: CinemaTheme.colors.primary,
  },
  secondary: {
    backgroundColor: CinemaTheme.colors.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  sm: {
    paddingVertical: CinemaTheme.spacing.xs,
    paddingHorizontal: CinemaTheme.spacing.md,
  },
  md: {
    paddingVertical: CinemaTheme.spacing.sm + 2,
    paddingHorizontal: CinemaTheme.spacing.lg,
  },
  lg: {
    paddingVertical: CinemaTheme.spacing.md,
    paddingHorizontal: CinemaTheme.spacing.xl,
  },
  text: {
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

const textStyles = StyleSheet.create({
  primary: {
    color: '#000000',
  },
  outline: {
    color: CinemaTheme.colors.primary,
  },
  secondary: {
    color: CinemaTheme.colors.textPrimary,
  },
  sm: {
    fontSize: 12,
  },
  md: {
    fontSize: 13,
  },
  lg: {
    fontSize: 15,
  },
});
