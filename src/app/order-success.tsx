import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppText, CinemaCard } from '@/components/ui';
import { useCart } from '@/context';
import { CinemaTheme } from '@/theme';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    total?: string;
    itemCount?: string;
    orderId?: string;
  }>();
  const { clearCart } = useCart();

  const hasClearedRef = useRef(false);

  // Clear local + remote cart exactly once, after the order is confirmed.
  // Deferred out of the effect body per the AuthContext pattern.
  useEffect(() => {
    if (hasClearedRef.current) return;
    hasClearedRef.current = true;
    void Promise.resolve().then(() => clearCart());
  }, [clearCart]);

  const total = Number(params.total ?? 0);
  const itemCount = Number(params.itemCount ?? 0);
  const orderId =
    typeof params.orderId === 'string' && params.orderId.length > 0
      ? params.orderId
      : undefined;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="checkmark"
            size={44}
            color={CinemaTheme.colors.primary}
          />
        </View>

        <AppText variant="h1">ORDER CONFIRMED</AppText>

        <AppText
          variant="body"
          color={CinemaTheme.colors.textSecondary}
          style={styles.subtitle}
        >
          Your LUT packs are now licensed to your account and synced across all your devices.
        </AppText>

        {orderId && (
          <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
            ORDER #{orderId}
          </AppText>
        )}

        <CinemaCard elevated style={styles.summaryCard}>
          <AppText variant="caption" color={CinemaTheme.colors.primary}>
            ORDER SUMMARY
          </AppText>

          <View style={styles.summaryRow}>
            <AppText variant="body" color={CinemaTheme.colors.textSecondary}>
              ITEM COUNT
            </AppText>
            <AppText variant="bodyBold">
              {itemCount === 1 ? '1 ITEM' : `${itemCount} ITEMS`}
            </AppText>
          </View>

          <View style={styles.summaryRow}>
            <AppText variant="body" color={CinemaTheme.colors.textSecondary}>
              SUBTOTAL
            </AppText>
            <AppText variant="h3" color={CinemaTheme.colors.primary}>
              ${total}.00
            </AppText>
          </View>
        </CinemaCard>

        <AppButton
          title="GO TO MY LIBRARY"
          variant="primary"
          size="lg"
          onPress={() => router.replace('/(tabs)/library')}
          icon={<Ionicons name="film" size={16} color="#000000" />}
          style={styles.cta}
        />

        <AppButton
          title="BACK TO SHOP"
          variant="outline"
          size="md"
          onPress={() => router.replace('/(tabs)')}
          style={styles.cta}
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CinemaTheme.spacing.xl,
    gap: CinemaTheme.spacing.sm,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CinemaTheme.spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: CinemaTheme.spacing.xs,
  },
  summaryCard: {
    alignSelf: 'stretch',
    marginTop: CinemaTheme.spacing.md,
    gap: CinemaTheme.spacing.sm,
    borderColor: CinemaTheme.colors.primaryGlow,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CinemaTheme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  cta: {
    alignSelf: 'stretch',
    marginTop: CinemaTheme.spacing.xs,
  },
});
