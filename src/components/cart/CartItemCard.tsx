import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { AppText, CinemaCard } from '@/components/ui';
import { CartItem } from '@/types/cart';
import { CinemaTheme } from '@/theme';

export interface CartItemCardProps {
  item: CartItem;
  onRemove: (productId: string) => void;
  style?: StyleProp<ViewStyle>;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  item,
  onRemove,
  style,
}) => {
  return (
    <CinemaCard style={[styles.card, style]}>
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.thumbnail}
        contentFit="cover"
        transition={200}
      />

      <View style={styles.metaColumn}>
        <AppText variant="bodyBold" numberOfLines={1}>
          {item.title}
        </AppText>
        <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
          {item.category.toUpperCase()} • {item.lutCount} LUTS
        </AppText>
      </View>

      <View style={styles.rightColumn}>
        <AppText variant="bodyBold" color={CinemaTheme.colors.primary}>
          ${item.price}.00
        </AppText>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onRemove(item.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={CinemaTheme.colors.textTertiary}
          />
        </TouchableOpacity>
      </View>
    </CinemaCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.md,
    padding: CinemaTheme.spacing.sm,
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: CinemaTheme.radius.md,
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
  metaColumn: {
    flex: 1,
    gap: 2,
  },
  rightColumn: {
    alignItems: 'flex-end',
    gap: CinemaTheme.spacing.xs,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
});
