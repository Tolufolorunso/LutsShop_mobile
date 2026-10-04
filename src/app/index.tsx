import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { CinemaTheme } from '@/theme';

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Ionicons name="videocam" size={28} color={CinemaTheme.colors.primary} />
      </View>

      <Text style={styles.brandTitle}>LUTSHOP</Text>
      <Text style={styles.tagline}>CINEMA COLOR GRADING PRESETS</Text>

      <View style={styles.card}>
        <View style={styles.statusRow}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>FOUNDATION READY</Text>
        </View>

        <Text style={styles.cardTitle}>Cinema Theme Initialized</Text>
        <Text style={styles.cardBody}>
          Scaffold, design tokens, safe area layout, and icons loaded successfully.
        </Text>

        <View style={styles.tokenPill}>
          <Text style={styles.tokenText}>#0a0b0e - DEEP CINEMA BLACK</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CinemaTheme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: CinemaTheme.spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: CinemaTheme.radius.xl,
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: CinemaTheme.spacing.md,
  },
  brandTitle: {
    ...CinemaTheme.typography.h1,
    color: CinemaTheme.colors.textPrimary,
    letterSpacing: 2,
  },
  tagline: {
    ...CinemaTheme.typography.caption,
    color: CinemaTheme.colors.primary,
    letterSpacing: 1.5,
    marginTop: CinemaTheme.spacing.xs,
    marginBottom: CinemaTheme.spacing.xl,
  },
  card: {
    width: '100%',
    backgroundColor: CinemaTheme.colors.card,
    borderRadius: CinemaTheme.radius.lg,
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
    padding: CinemaTheme.spacing.lg,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: CinemaTheme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: CinemaTheme.colors.success,
    marginRight: CinemaTheme.spacing.xs,
  },
  statusText: {
    ...CinemaTheme.typography.badge,
    color: CinemaTheme.colors.success,
  },
  cardTitle: {
    ...CinemaTheme.typography.h3,
    color: CinemaTheme.colors.textPrimary,
    marginBottom: CinemaTheme.spacing.xs,
  },
  cardBody: {
    ...CinemaTheme.typography.body,
    color: CinemaTheme.colors.textSecondary,
    marginBottom: CinemaTheme.spacing.md,
  },
  tokenPill: {
    backgroundColor: CinemaTheme.colors.cardElevated,
    borderRadius: CinemaTheme.radius.sm,
    paddingHorizontal: CinemaTheme.spacing.md,
    paddingVertical: CinemaTheme.spacing.xs,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: CinemaTheme.colors.divider,
  },
  tokenText: {
    ...CinemaTheme.typography.caption,
    color: CinemaTheme.colors.textTertiary,
  },
});
