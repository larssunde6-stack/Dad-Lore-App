import { Platform } from 'react-native';

// A touch slower than RN's default ('normal': iOS 0.998, Android 0.985) so
// flings settle sooner instead of gliding — reads as heavier, less floaty.
export const scrollPhysics = {
  decelerationRate: Platform.OS === 'ios' ? 0.994 : 0.97,
};

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

  riskGreen: '#2D9B2B',
  riskYellow: '#F2C94C',
  riskRed: '#D40000',
  riskGreenBg: 'rgba(45, 155, 43, 0.06)',
  riskYellowBg: 'rgba(242, 201, 76, 0.06)',
  riskRedBg: 'rgba(212, 0, 0, 0.06)',
};

export const gradients = {
  icon: ['rgba(255, 138, 61, 0.32)', 'rgba(255, 106, 31, 0.08)'] as const,
  fab: ['#FF8A3D', '#D8500F'] as const,
};

// Subtle diagonal wash for anything showing a risk/difficulty color as a
// fill — a badge, a card background, a hero card — instead of a flat tint.
export const riskGradients = {
  green: ['rgba(45, 155, 43, 0.16)', 'rgba(45, 155, 43, 0.03)'] as const,
  yellow: ['rgba(242, 201, 76, 0.18)', 'rgba(242, 201, 76, 0.03)'] as const,
  red: ['rgba(212, 0, 0, 0.16)', 'rgba(212, 0, 0, 0.03)'] as const,
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

// Custom fonts don't reliably synthetic-bold from a single file, so each
// weight points at its own EB Garamond cut rather than relying on
// fontWeight alone. Loaded via useFonts() in App.tsx.
export const fonts = {
  display: {
    fontFamily: 'EBGaramond_800ExtraBold',
    fontWeight: '800' as const,
    letterSpacing: 0.2,
  },
  heading: {
    fontFamily: 'EBGaramond_700Bold',
    fontWeight: '700' as const,
  },
  body: {
    fontFamily: 'EBGaramond_400Regular',
    fontWeight: '400' as const,
  },
  label: {
    fontFamily: 'EBGaramond_600SemiBold',
    fontWeight: '600' as const,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
};
