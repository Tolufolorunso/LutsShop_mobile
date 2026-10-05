import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { AppButton, AppText, BadgePill, CinemaCard } from '@/components/ui';
import { useAuth, useCart } from '@/context';
import { placeOrder, ApiError } from '@/config/api';
import { CinemaTheme } from '@/theme';

// The planning docs name exactly one method ("simulated card"); extend this
// array when the web checkout's full method list is confirmed.
const PAYMENT_METHODS: { id: string; label: string }[] = [
  { id: 'card', label: 'CREDIT / DEBIT CARD' },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CheckoutScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { items, itemCount, subtotal } = useCart();

  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [paymentMethod, setPaymentMethod] = useState<string>(PAYMENT_METHODS[0].id);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const isEmailValid = EMAIL_PATTERN.test(email.trim());
  const canSubmit = Boolean(user) && isEmailValid && !isSubmitting;

  if (!user) {
    return (
      <View style={[styles.container, styles.noticeContainer, { paddingTop: insets.top }]}>
        <Ionicons
          name="lock-closed-outline"
          size={44}
          color={CinemaTheme.colors.textTertiary}
        />
        <AppText variant="h2" style={styles.noticeTitle}>
          Sign In Required
        </AppText>
        <AppText
          variant="body"
          color={CinemaTheme.colors.textSecondary}
          style={styles.noticeText}
        >
          Checkout uses your LUTShop account so your order appears in My Library on every device.
        </AppText>
        <AppButton
          title="BACK"
          variant="outline"
          onPress={() => router.back()}
        />
      </View>
    );
  }

  const handlePlaceOrder = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await placeOrder({
        userId: user.id,
        customerEmail: email.trim(),
        items,
        paymentMethod,
      });

      // Parse the order id tolerantly — the backend response shape is unconfirmed
      const orderId =
        typeof response.orderId === 'string'
          ? response.orderId
          : response.order && typeof response.order.id === 'string'
            ? response.order.id
            : undefined;

      router.replace({
        pathname: '/order-success',
        params: {
          total: String(subtotal),
          itemCount: String(itemCount),
          ...(orderId ? { orderId } : {}),
        },
      });
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Order submission failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Custom Header */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={CinemaTheme.colors.textPrimary}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
            SECURE SIMULATED CHECKOUT
          </AppText>
          <AppText variant="bodyBold">Checkout</AppText>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Receipt Email */}
        <CinemaCard style={styles.sectionCard}>
          <AppText variant="caption" color={CinemaTheme.colors.primary}>
            RECEIPT EMAIL
          </AppText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@studio.com"
            placeholderTextColor={CinemaTheme.colors.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.emailInput}
          />
          {!isEmailValid && email.trim().length > 0 && (
            <AppText variant="caption" color={CinemaTheme.colors.error}>
              Enter a valid email address.
            </AppText>
          )}
        </CinemaCard>

        {/* Payment Method */}
        <CinemaCard style={styles.sectionCard}>
          <AppText variant="caption" color={CinemaTheme.colors.primary}>
            PAYMENT METHOD
          </AppText>
          {PAYMENT_METHODS.map((method) => {
            const isSelected = paymentMethod === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={styles.paymentRow}
                onPress={() => setPaymentMethod(method.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={
                    isSelected
                      ? CinemaTheme.colors.primary
                      : CinemaTheme.colors.textTertiary
                  }
                />
                <AppText variant="bodyBold">{method.label}</AppText>
                <BadgePill label="SIMULATED" variant="gold" size="sm" />
              </TouchableOpacity>
            );
          })}
        </CinemaCard>

        {/* Order Summary */}
        <CinemaCard elevated style={styles.sectionCard}>
          <AppText variant="caption" color={CinemaTheme.colors.primary}>
            ORDER SUMMARY
          </AppText>

          {items.map((item) => (
            <View key={item.id} style={styles.orderItemRow}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={styles.orderItemThumb}
                contentFit="cover"
                transition={150}
              />
              <View style={styles.orderItemMeta}>
                <AppText variant="bodyBold" numberOfLines={1}>
                  {item.title}
                </AppText>
                <AppText
                  variant="caption"
                  color={CinemaTheme.colors.textTertiary}
                >
                  {item.category.toUpperCase()} • {item.lutCount} LUTS
                </AppText>
              </View>
              <AppText variant="bodyBold" color={CinemaTheme.colors.primary}>
                ${item.price}.00
              </AppText>
            </View>
          ))}

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
              ${subtotal}.00
            </AppText>
          </View>
        </CinemaCard>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons
              name="alert-circle"
              size={18}
              color={CinemaTheme.colors.error}
            />
            <AppText variant="caption" color={CinemaTheme.colors.error}>
              {error}
            </AppText>
          </View>
        )}

        <AppButton
          title={`PLACE ORDER — $${subtotal}.00`}
          variant="primary"
          size="lg"
          loading={isSubmitting}
          disabled={!canSubmit}
          onPress={handlePlaceOrder}
          style={styles.submitBtn}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
  },
  noticeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: CinemaTheme.spacing.xl,
    gap: CinemaTheme.spacing.md,
  },
  noticeTitle: {
    marginTop: CinemaTheme.spacing.sm,
  },
  noticeText: {
    textAlign: 'center',
    marginBottom: CinemaTheme.spacing.md,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.sm,
    backgroundColor: CinemaTheme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CinemaTheme.colors.cardElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: CinemaTheme.spacing.sm,
  },
  scrollContent: {
    padding: CinemaTheme.spacing.md,
    gap: CinemaTheme.spacing.md,
  },
  sectionCard: {
    gap: CinemaTheme.spacing.sm,
  },
  emailInput: {
    color: CinemaTheme.colors.textPrimary,
    fontSize: 14,
    padding: 0,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.sm,
    paddingVertical: CinemaTheme.spacing.xs,
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.sm,
    paddingVertical: CinemaTheme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: CinemaTheme.colors.divider,
  },
  orderItemThumb: {
    width: 40,
    height: 40,
    borderRadius: CinemaTheme.radius.sm,
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
  orderItemMeta: {
    flex: 1,
    gap: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: CinemaTheme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.sm,
    padding: CinemaTheme.spacing.sm,
    borderRadius: CinemaTheme.radius.md,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.error,
    backgroundColor: CinemaTheme.colors.card,
  },
  submitBtn: {
    minWidth: 220,
    alignSelf: 'center',
  },
});
