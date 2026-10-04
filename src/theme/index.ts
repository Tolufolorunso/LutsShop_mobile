export const CinemaTheme = {
  colors: {
    background: '#0a0b0e',
    card: '#121318',
    cardElevated: '#181920',
    cardHover: '#1f2029',

    primary: '#00E5FF',
    primaryGlow: 'rgba(0, 229, 255, 0.15)',
    secondary: '#2979FF',
    accentGold: '#FFD700',

    textPrimary: '#F0F4F8',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',

    success: '#00E676',
    warning: '#FFB300',
    error: '#FF1744',
    divider: 'rgba(255, 255, 255, 0.08)',

    glassmorphism: 'rgba(10, 11, 14, 0.85)',
    modalOverlay: 'rgba(0, 0, 0, 0.75)',
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  typography: {
    h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5, color: '#F0F4F8' },
    h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3, color: '#F0F4F8' },
    h3: { fontSize: 18, fontWeight: '600' as const, color: '#F0F4F8' },
    body: { fontSize: 14, fontWeight: '400' as const, color: '#94A3B8', lineHeight: 20 },
    bodyBold: { fontSize: 14, fontWeight: '600' as const, color: '#F0F4F8' },
    caption: { fontSize: 12, fontWeight: '500' as const, color: '#64748B' },
    badge: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 1.2, textTransform: 'uppercase' as const },
  },
} as const;

export type Theme = typeof CinemaTheme;
export type ThemeColors = typeof CinemaTheme.colors;
export type ThemeSpacing = typeof CinemaTheme.spacing;
export type ThemeRadius = typeof CinemaTheme.radius;
