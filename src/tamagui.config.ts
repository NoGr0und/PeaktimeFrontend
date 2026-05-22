import { createTamagui, createTokens } from 'tamagui';
import { config as configBase } from '@tamagui/config/v3';
import { Colors, Spacing } from './constants/theme';

const space = {
  half: Spacing.half,
  one: Spacing.one,
  two: Spacing.two,
  three: Spacing.three,
  four: Spacing.four,
  five: Spacing.five,
  six: Spacing.six,
  true: Spacing.three,
};

const size = {
  ...space,
  ...configBase.tokens.size,
};

const radius = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 24,
  true: 8,
};

const tokens = createTokens({
  ...configBase.tokens,
  space,
  size,
  radius,
});

const config = createTamagui({
  ...configBase,
  tokens,
  themes: {
    light: {
      background: Colors.light.background,
      color: Colors.light.text,
      backgroundElement: Colors.light.backgroundElement,
      backgroundSelected: Colors.light.backgroundSelected,
      textSecondary: Colors.light.textSecondary,
      primary: Colors.light.primary,
      primaryLight: Colors.light.primaryLight,
      accent: Colors.light.accent,
      tint: Colors.light.tint,
    },
    dark: {
      background: Colors.dark.background,
      color: Colors.dark.text,
      backgroundElement: Colors.dark.backgroundElement,
      backgroundSelected: Colors.dark.backgroundSelected,
      textSecondary: Colors.dark.textSecondary,
      primary: Colors.dark.primary,
      primaryLight: Colors.dark.primaryLight,
      accent: Colors.dark.accent,
      tint: Colors.dark.tint,
    }
  }
});

export type Conf = typeof config;
declare module 'tamagui' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends Conf {}
}

export default config;
