import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CinemaTheme } from '@/theme';

export interface CinemaHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  cartCount?: number;
  onCartPress?: () => void;
  rightAction?: React.ReactNode;
}

export const CinemaHeader: React.FC<CinemaHeaderProps> = ({
  title = 'LUTSHOP',
  subtitle,
  showBack = false,
  onBack,
  cartCount,
  onCartPress,
  rightAction,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 8 }]}>
      <View style={styles.contentRow}>
        <View style={styles.leftContainer}>
          {showBack ? (
            <TouchableOpacity
              onPress={onBack}
              style={styles.iconBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={CinemaTheme.colors.textPrimary}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.brandIconContainer}>
              <Ionicons
                name="videocam"
                size={20}
                color={CinemaTheme.colors.primary}
              />
            </View>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.titleText} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitleText} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightContainer}>
          {rightAction ? (
            rightAction
          ) : onCartPress ? (
            <TouchableOpacity
              onPress={onCartPress}
              style={styles.iconBtn}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="bag-outline"
                size={22}
                color={CinemaTheme.colors.textPrimary}
              />
              {cartCount !== undefined && cartCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholder} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: CinemaTheme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.sm + 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  brandIconContainer: {
    width: 34,
    height: 34,
    borderRadius: CinemaTheme.radius.sm,
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: CinemaTheme.spacing.xs,
  },
  titleText: {
    ...CinemaTheme.typography.h3,
    color: CinemaTheme.colors.textPrimary,
    letterSpacing: 1.5,
  },
  subtitleText: {
    ...CinemaTheme.typography.caption,
    color: CinemaTheme.colors.textSecondary,
    marginTop: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  iconBtn: {
    position: 'relative',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
  },
  placeholder: {
    width: 36,
    height: 36,
  },
});
