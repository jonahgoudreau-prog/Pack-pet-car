/**
 * Urbanist, loaded from the font files in assets/fonts (SIL Open Font License).
 * React Native needs one family name per weight for custom fonts.
 */
export const fontFiles = {
  Urbanist_400Regular: require('../../assets/fonts/Urbanist_400Regular.ttf'),
  Urbanist_500Medium: require('../../assets/fonts/Urbanist_500Medium.ttf'),
  Urbanist_600SemiBold: require('../../assets/fonts/Urbanist_600SemiBold.ttf'),
  Urbanist_700Bold: require('../../assets/fonts/Urbanist_700Bold.ttf'),
  Urbanist_800ExtraBold: require('../../assets/fonts/Urbanist_800ExtraBold.ttf'),
};

export type Weight = 400 | 500 | 600 | 700 | 800;

export const fontFamily: Record<Weight, keyof typeof fontFiles> = {
  400: 'Urbanist_400Regular',
  500: 'Urbanist_500Medium',
  600: 'Urbanist_600SemiBold',
  700: 'Urbanist_700Bold',
  800: 'Urbanist_800ExtraBold',
};

/** Corner radii from the design. */
export const radius = {
  card: 24,
  row: 22,
  hero: 28,
  pill: 999,
} as const;

/** Minimum tap target (Apple's guideline). */
export const TAP = 44;
