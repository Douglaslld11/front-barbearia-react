import { Platform } from 'react-native';

export const COLORS = {
  background: '#0F0F13',
  surface: '#1C1C22',
  surfaceLight: '#282830',
  primary: '#EAB308', // Premium Gold
  secondary: '#888899', 
  text: '#FAFAFA',
  textMuted: '#9CA3AF',
  error: '#EF4444',
  success: '#22C55E',
  accent: '#FACC15',
  divider: 'rgba(255, 255, 255, 0.08)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 30,
  full: 999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h3: { fontSize: 22, fontWeight: '600' as const, letterSpacing: -0.3 },
  h4: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  bodyLarge: { fontSize: 18, fontWeight: '400' as const },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  button: { fontSize: 16, fontWeight: '700' as const, letterSpacing: 0.3 },
};

export const SHADOWS = {
  small: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
    android: { elevation: 3 },
    web: { boxShadow: '0 2px 4px rgba(0,0,0,0.15)' },
  }),
  medium: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10 },
    android: { elevation: 8 },
    web: { boxShadow: '0 6px 12px rgba(0,0,0,0.25)' },
  }),
  large: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.35, shadowRadius: 16 },
    android: { elevation: 12 },
    web: { boxShadow: '0 12px 24px rgba(0,0,0,0.35)' },
  }),
  glow: (color: string) => Platform.select({
    ios: { shadowColor: color, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 12 },
    android: { elevation: 8 },
    web: { boxShadow: `0 0 16px ${color}66` },
  }),
};

