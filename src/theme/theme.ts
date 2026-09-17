export const colors = {
  background: '#0C0B0D',
  backgroundAlt: '#141316',
  surface: '#1C1A1E',
  surfaceRaised: '#242226',
  border: '#2E2B30',
  borderSubtle: '#221F23',

  orange: '#FF6A1F',
  orangeBright: '#FF8A3D',
  orangeDeep: '#D8500F',
  orangeMuted: 'rgba(255, 106, 31, 0.16)',

  textPrimary: '#F6F3EF',
  textSecondary: '#ADA8A5',
  textMuted: '#726D6B',
  textOnOrange: '#191012',

  success: '#7CB88F',
  overlay: 'rgba(0, 0, 0, 0.55)',
};

export const shadow = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  glow: {
    shadowColor: '#FF6A1F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const fonts = {
  display: {
    fontWeight: '800' as const,
    letterSpacing: 0.2,
  },
  heading: {
    fontWeight: '700' as const,
  },
  body: {
    fontWeight: '400' as const,
  },
  label: {
    fontWeight: '600' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
};
