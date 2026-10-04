import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';
import { CinemaTheme } from '@/theme';

export type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'bodyBold' | 'caption' | 'badge';

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: string;
  children?: React.ReactNode;
}

export const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...rest
}) => {
  return (
    <Text
      style={[
        styles.base,
        styles[variant],
        color ? { color } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  base: {
    color: CinemaTheme.colors.textPrimary,
  },
  h1: CinemaTheme.typography.h1,
  h2: CinemaTheme.typography.h2,
  h3: CinemaTheme.typography.h3,
  body: CinemaTheme.typography.body,
  bodyBold: CinemaTheme.typography.bodyBold,
  caption: CinemaTheme.typography.caption,
  badge: {
    ...CinemaTheme.typography.badge,
    color: CinemaTheme.colors.primary,
  },
});
