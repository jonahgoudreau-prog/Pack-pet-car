/**
 * Color themes. Every screen reads colors from these tokens, never from hex
 * values directly, so adding a theme is just adding an entry here.
 *
 * Butter, Sky, Lavender and Blush come from the design files. White, Charcoal,
 * Dark and Night were added on the design canvas.
 */
export type Palette = {
  id: ThemeId;
  name: string;
  isDark: boolean;
  /** App background. */
  bg: string;
  /** Cards and list rows. */
  card: string;
  /** Hairline border on cards. */
  line: string;
  /** Main text on bg and card. */
  ink: string;
  /** Secondary text on bg and card. */
  muted: string;
  /** Hero circle, tab bar, primary buttons. */
  hero: string;
  /** Text and buttons on hero. */
  onHero: string;
  /** Secondary text on hero. */
  mutedOnHero: string;
  /** Alerts only: overdue, live dot, weakest score. */
  alert: string;
  /** Text on alert. */
  onAlert: string;
  /** Alert-colored text on bg/card (darker so it stays readable). */
  alertInk: string;
  /** Underline for problem days in the week strip. */
  alertLine: string;
  /** Past days in charts, empty bar tracks. */
  past: string;
  /** Faint fill on hero (secondary buttons on hero). */
  ghost: string;
};

export const LIGHT_THEME_IDS = ['butter', 'white', 'sky', 'lavender', 'blush', 'charcoal'] as const;
export const DARK_THEME_IDS = ['dark', 'night'] as const;

export type LightThemeId = (typeof LIGHT_THEME_IDS)[number];
export type DarkThemeId = (typeof DARK_THEME_IDS)[number];
export type ThemeId = LightThemeId | DarkThemeId;

export const palettes: Record<ThemeId, Palette> = {
  butter: {
    id: 'butter',
    name: 'Butter',
    isDark: false,
    bg: '#FFEFB3',
    card: '#FFF8DE',
    line: 'rgba(1,62,55,0.08)',
    ink: '#013E37',
    muted: '#4A6B65',
    hero: '#013E37',
    onHero: '#FFEFB3',
    mutedOnHero: '#B3BA8E',
    alert: '#FF9F5A',
    onAlert: '#013E37',
    alertInk: '#9A4A12',
    alertLine: '#FF9F5A',
    past: '#C9CBA6',
    ghost: 'rgba(255,239,179,0.14)',
  },
  white: {
    id: 'white',
    name: 'White',
    isDark: false,
    bg: '#FFFFFF',
    card: '#F5F5F3',
    line: 'rgba(17,17,17,0.08)',
    ink: '#111111',
    muted: '#5E5E5A',
    hero: '#111111',
    onHero: '#FFFFFF',
    mutedOnHero: '#A3A3A3',
    alert: '#FF9F5A',
    onAlert: '#111111',
    alertInk: '#9A4A12',
    alertLine: '#FF9F5A',
    past: '#D9D9D6',
    ghost: 'rgba(255,255,255,0.14)',
  },
  sky: {
    id: 'sky',
    name: 'Sky',
    isDark: false,
    bg: '#DDEEFB',
    card: '#F1F8FE',
    line: 'rgba(11,46,79,0.08)',
    ink: '#0B2E4F',
    muted: '#4A647C',
    hero: '#0B2E4F',
    onHero: '#DDEEFB',
    mutedOnHero: '#9EBBD6',
    alert: '#FFB547',
    onAlert: '#0B2E4F',
    alertInk: '#8A5300',
    alertLine: '#FFB547',
    past: '#B8CCE0',
    ghost: 'rgba(221,238,251,0.14)',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender',
    isDark: false,
    bg: '#EDE7FB',
    card: '#F7F4FE',
    line: 'rgba(46,26,92,0.08)',
    ink: '#2E1A5C',
    muted: '#5E5480',
    hero: '#2E1A5C',
    onHero: '#EDE7FB',
    mutedOnHero: '#B9AEDB',
    alert: '#FF7A8A',
    onAlert: '#2E1A5C',
    alertInk: '#A3253A',
    alertLine: '#FF7A8A',
    past: '#CFC6EA',
    ghost: 'rgba(237,231,251,0.14)',
  },
  blush: {
    id: 'blush',
    name: 'Blush',
    isDark: false,
    bg: '#FBE3E6',
    card: '#FEF2F3',
    line: 'rgba(90,23,48,0.08)',
    ink: '#5A1730',
    muted: '#7D4D5B',
    hero: '#5A1730',
    onHero: '#FBE3E6',
    mutedOnHero: '#E3A9B8',
    alert: '#FFA066',
    onAlert: '#5A1730',
    alertInk: '#9A3F0C',
    alertLine: '#E8742C',
    past: '#EBC6CC',
    ghost: 'rgba(251,227,230,0.14)',
  },
  charcoal: {
    id: 'charcoal',
    name: 'Charcoal',
    isDark: false,
    bg: '#F2F2EE',
    card: '#FFFFFF',
    line: 'rgba(30,30,30,0.08)',
    ink: '#1E1E1E',
    muted: '#5E5E5A',
    hero: '#1E1E1E',
    onHero: '#FFEFB3',
    mutedOnHero: '#A8A8A0',
    alert: '#FF9F5A',
    onAlert: '#1E1E1E',
    alertInk: '#9A4A12',
    alertLine: '#FF9F5A',
    past: '#D3D3CC',
    ghost: 'rgba(255,239,179,0.14)',
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    isDark: true,
    bg: '#000000',
    card: '#1C1C1E',
    line: 'rgba(255,255,255,0.08)',
    ink: '#FFFFFF',
    muted: '#A1A1A6',
    hero: '#2C2C2E',
    onHero: '#FFFFFF',
    mutedOnHero: '#A1A1A6',
    alert: '#FF9F5A',
    onAlert: '#000000',
    alertInk: '#FFB37A',
    alertLine: '#FF9F5A',
    past: '#3A3A3C',
    ghost: 'rgba(255,255,255,0.14)',
  },
  night: {
    id: 'night',
    name: 'Night',
    isDark: true,
    bg: '#0C1614',
    card: '#15231F',
    line: 'rgba(255,239,179,0.08)',
    ink: '#FFEFB3',
    muted: '#9DB3A8',
    hero: '#1D4A42',
    onHero: '#FFEFB3',
    mutedOnHero: '#B3BA8E',
    alert: '#FF9F5A',
    onAlert: '#0C1614',
    alertInk: '#FFB37A',
    alertLine: '#FF9F5A',
    past: '#34504A',
    ghost: 'rgba(255,239,179,0.14)',
  },
};
