export const COLORS = {
  background: '#121212',
  surface: '#1E1E1E',
  surfaceLight: '#2A2A2A',
  primary: '#D4AF37', // Gold
  secondary: '#A0A0A0', // Muted Gray
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  error: '#FF5252',
  success: '#4CAF50',
  accent: '#D4AF37',
  divider: '#333333',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '600' as const },
};
