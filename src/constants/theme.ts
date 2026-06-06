export const Colors = {
  background: '#0D0D0D', // Very dark, almost black
  surface: '#1A1A1A', // Slightly lighter for cards
  surfaceLight: '#2A2A2A',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  primary: '#64FFDA', // Neon Cyan
  secondary: '#B388FF', // Neon Lavender
  accent: '#FF4081', // Neon Pink (for highlights/errors)
  success: '#00E676', // Neon Green
  error: '#FF5252', // Neon Red
  border: '#333333',
  occupancy: {
    empty: '#64FFDA',    // Cyan (Vazio 0-15%)
    quiet: '#00E676',    // Green (Tranquilo 16-35%)
    moderate: '#FFC107', // Amber (Moderado 36-60%)
    busy: '#FF9800',     // Orange (Cheio 61-85%)
    full: '#FF4081',     // Pink (Lotado 86-100%)
  },
};

export const Gradients = {
  primary: ['#64FFDA', '#B388FF'] as const,
  card: ['rgba(26,26,26,0.8)', 'rgba(42,42,42,0.8)'] as const,
};

export const Typography = {
  fonts: {
    regular: 'Outfit_400Regular',
    medium: 'Outfit_500Medium',
    bold: 'Outfit_700Bold',
    black: 'Outfit_900Black',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 48,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 9999,
};

export const Theme = {
  colors: Colors,
  gradients: Gradients,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
};
