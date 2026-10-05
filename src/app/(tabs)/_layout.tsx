import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CinemaTheme } from '@/theme';
import { useCart } from '@/context';

export default function TabLayout() {
  const { itemCount } = useCart();
  const insets = useSafeAreaInsets();

  // Dynamic bottom inset handling for Android system navigation (3-button or gesture bar) and iOS home indicator
  const bottomInset = insets.bottom;
  const paddingBottom = bottomInset > 0 ? bottomInset : (Platform.OS === 'ios' ? 24 : 8);
  const tabBarHeight = 56 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: CinemaTheme.colors.primary,
        tabBarInactiveTintColor: CinemaTheme.colors.textTertiary,
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabBarHeight,
            paddingBottom,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Shop',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'bag-handle' : 'bag-handle-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: itemCount,
          tabBarBadgeStyle: {
            backgroundColor: CinemaTheme.colors.primary,
            color: CinemaTheme.colors.background,
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'cart' : 'cart-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'film' : 'film-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderTopColor: CinemaTheme.colors.divider,
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
