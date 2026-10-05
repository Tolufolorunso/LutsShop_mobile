import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  AppButton,
  AppText,
  BadgePill,
  CinemaCard,
  CinemaHeader,
} from '@/components/ui';
import { useAuth } from '@/context';
import { fetchOrderHistory } from '@/config/api';
import { PurchaseOrder, PurchaseOrderItem } from '@/types/order';
import { CinemaTheme } from '@/theme';

type LoadState = 'idle' | 'loading' | 'error';

export default function LibraryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loadState, setLoadState] = useState<LoadState>('idle');

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoadState('loading');
    try {
      const history = await fetchOrderHistory(user.id);
      setOrders(history);
      setLoadState('idle');
    } catch (err) {
      console.warn('Failed to load order history:', err);
      setLoadState('error');
    }
  }, [user]);

  // Re-fetch the purchase history whenever the Library tab gains focus
  useFocusEffect(
    useCallback(() => {
      void loadOrders();
    }, [loadOrders])
  );

  const handleDownload = (item: PurchaseOrderItem) => {
    if (item.downloadUrl) {
      void Linking.openURL(item.downloadUrl).catch((err) =>
        console.warn('Failed to open download link:', err)
      );
      return;
    }
    Alert.alert(
      'Download Unavailable',
      `${item.title} downloads are served by the production backend. Your lifetime license is already active.`
    );
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    const parsed = new Date(iso);
    return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleDateString();
  };

  // Signed out: purchase history requires an account identity
  if (!user) {
    return (
      <View style={styles.container}>
        <CinemaHeader title="MY LIBRARY" subtitle="PURCHASED PACKS" />
        <ScrollView
          contentContainerStyle={styles.scrollContentCentered}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyContainer}>
            <View style={styles.iconCircle}>
              <Ionicons
                name="film-outline"
                size={40}
                color={CinemaTheme.colors.primary}
              />
            </View>

            <AppText variant="h2" style={styles.emptyTitle}>
              No Purchased LUTs Yet
            </AppText>

            <AppText
              variant="body"
              color={CinemaTheme.colors.textSecondary}
              style={styles.emptySubtitle}
            >
              Packs you purchase on the desktop web store or mobile app appear here instantly with direct download links and license keys.
            </AppText>

            <View style={styles.actionRow}>
              <AppButton
                title="SIGN IN WITH GOOGLE"
                variant="primary"
                size="md"
                onPress={() => router.push('/(tabs)/account')}
                icon={<Ionicons name="logo-google" size={16} color="#000000" />}
              />
            </View>
          </View>

          <LicenseInfoCard />
        </ScrollView>
      </View>
    );
  }

  const isEmpty = loadState === 'idle' && orders.length === 0;

  return (
    <View style={styles.container}>
      <CinemaHeader title="MY LIBRARY" subtitle="PURCHASED PACKS" />

      <ScrollView
        contentContainerStyle={
          isEmpty || loadState === 'error'
            ? styles.scrollContentCentered
            : styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
      >
        {loadState === 'loading' && orders.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={CinemaTheme.colors.primary} />
            <AppText
              variant="body"
              color={CinemaTheme.colors.textSecondary}
              style={styles.loadingText}
            >
              Synchronizing your purchase library...
            </AppText>
          </View>
        )}

        {loadState === 'error' && (
          <View style={styles.errorContainer}>
            <Ionicons
              name="cloud-offline-outline"
              size={36}
              color={CinemaTheme.colors.error}
            />
            <AppText variant="h3" style={styles.errorTitle}>
              Could Not Load Library
            </AppText>
            <AppText
              variant="body"
              color={CinemaTheme.colors.textSecondary}
              style={styles.emptySubtitle}
            >
              Your purchase history could not be reached. Check your connection and try again.
            </AppText>
            <AppButton
              title="RETRY"
              variant="primary"
              size="md"
              onPress={() => void loadOrders()}
            />
          </View>
        )}

        {isEmpty && (
          <>
            <View style={styles.emptyContainer}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="film-outline"
                  size={40}
                  color={CinemaTheme.colors.primary}
                />
              </View>

              <AppText variant="h2" style={styles.emptyTitle}>
                No Purchased LUTs Yet
              </AppText>

              <AppText
                variant="body"
                color={CinemaTheme.colors.textSecondary}
                style={styles.emptySubtitle}
              >
                Packs you purchase on the desktop web store or mobile app appear here instantly with direct download links and license keys.
              </AppText>
            </View>

            <LicenseInfoCard />
          </>
        )}

        {orders.map((order) => (
          <CinemaCard key={order.id} elevated style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
                ORDER #{order.id}
              </AppText>
              {order.paymentMethod && (
                <BadgePill
                  label={order.paymentMethod.toUpperCase()}
                  variant="primary"
                  size="sm"
                />
              )}
            </View>

            <AppText variant="caption" color={CinemaTheme.colors.textTertiary}>
              PURCHASED {formatDate(order.createdAt)}
            </AppText>

            {order.items.map((item) => (
              <View key={item.id} style={styles.orderItemRow}>
                <Image
                  source={{ uri: item.thumbnailUrl ?? undefined }}
                  style={styles.itemThumb}
                  contentFit="cover"
                  transition={150}
                />
                <View style={styles.itemMeta}>
                  <AppText variant="bodyBold" numberOfLines={1}>
                    {item.title}
                  </AppText>
                  <AppText
                    variant="caption"
                    color={CinemaTheme.colors.textTertiary}
                  >
                    {[
                      item.category?.toUpperCase(),
                      item.lutCount != null ? `${item.lutCount} LUTS` : null,
                    ]
                      .filter(Boolean)
                      .join(' • ') || 'CINEMA LUT PACK'}
                  </AppText>
                  <BadgePill
                    label="LIFETIME"
                    variant="gold"
                    size="sm"
                    style={styles.licenseBadge}
                  />
                </View>
                <View style={styles.itemRight}>
                  <AppText variant="bodyBold" color={CinemaTheme.colors.primary}>
                    ${item.price}.00
                  </AppText>
                  <TouchableOpacity
                    style={styles.downloadBtn}
                    onPress={() => handleDownload(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="download-outline"
                      size={18}
                      color={CinemaTheme.colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </CinemaCard>
        ))}

        {orders.length > 0 && <LicenseInfoCard />}
      </ScrollView>
    </View>
  );
}

const LicenseInfoCard: React.FC = () => (
  <CinemaCard elevated style={styles.licenseCard}>
    <View style={styles.cardHeader}>
      <AppText variant="h3">Commercial License Access</AppText>
      <BadgePill label="LIFETIME" variant="gold" size="sm" />
    </View>
    <AppText
      variant="body"
      color={CinemaTheme.colors.textSecondary}
      style={styles.licenseText}
    >
      All purchases include lifetime commercial usage rights for YouTube, broadcast, commercial films, and streaming projects.
    </AppText>
  </CinemaCard>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
  },
  scrollContent: {
    padding: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.xl + 20,
  },
  scrollContentCentered: {
    padding: CinemaTheme.spacing.md,
    paddingBottom: CinemaTheme.spacing.xl + 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: CinemaTheme.spacing.xl * 2,
  },
  loadingText: {
    marginTop: CinemaTheme.spacing.md,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: CinemaTheme.spacing.xl,
    paddingHorizontal: CinemaTheme.spacing.lg,
    gap: CinemaTheme.spacing.sm,
  },
  errorTitle: {
    marginTop: CinemaTheme.spacing.xs,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: CinemaTheme.spacing.xl,
    paddingHorizontal: CinemaTheme.spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primaryGlow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CinemaTheme.spacing.md,
  },
  emptyTitle: {
    marginBottom: CinemaTheme.spacing.xs,
    textAlign: 'center',
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: CinemaTheme.spacing.xl,
    lineHeight: 22,
  },
  actionRow: {
    width: '100%',
    alignItems: 'center',
  },
  orderCard: {
    marginBottom: CinemaTheme.spacing.md,
    gap: CinemaTheme.spacing.xs,
    borderColor: CinemaTheme.colors.divider,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CinemaTheme.spacing.sm,
    paddingVertical: CinemaTheme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: CinemaTheme.colors.divider,
  },
  itemThumb: {
    width: 48,
    height: 48,
    borderRadius: CinemaTheme.radius.sm,
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
  itemMeta: {
    flex: 1,
    gap: 2,
  },
  licenseBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: CinemaTheme.spacing.xs,
  },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primaryGlow,
    backgroundColor: CinemaTheme.colors.cardElevated,
  },
  licenseCard: {
    marginTop: CinemaTheme.spacing.lg,
    borderColor: CinemaTheme.colors.divider,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: CinemaTheme.spacing.xs,
  },
  licenseText: {
    marginTop: CinemaTheme.spacing.xs,
    lineHeight: 20,
  },
});
