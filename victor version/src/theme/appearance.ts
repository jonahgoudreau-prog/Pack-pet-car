import {
  DARK_THEME_IDS,
  LIGHT_THEME_IDS,
  palettes,
  type DarkThemeId,
  type LightThemeId,
  type Palette,
} from './palettes';

/**
 * What the person picked in Settings > Appearance.
 * - mode "auto" follows the iPhone's light/dark setting.
 * - light is the color used in light mode, dark is the style used in dark mode.
 */
export type AppearanceMode = 'auto' | 'light' | 'dark';

export type AppearancePreference = {
  mode: AppearanceMode;
  light: LightThemeId;
  dark: DarkThemeId;
};

export const DEFAULT_APPEARANCE: AppearancePreference = {
  mode: 'auto',
  light: 'butter',
  dark: 'dark',
};

/** The iPhone's current setting, as React Native reports it. */
export type SystemScheme = 'light' | 'dark' | null | undefined | 'unspecified';

export function resolvePalette(pref: AppearancePreference, system: SystemScheme): Palette {
  const wantsDark = pref.mode === 'dark' || (pref.mode === 'auto' && system === 'dark');
  return wantsDark ? palettes[pref.dark] : palettes[pref.light];
}

/** Reads a saved preference, falling back to defaults for anything missing or unknown. */
export function parseAppearance(raw: string | null | undefined): AppearancePreference {
  if (!raw) return DEFAULT_APPEARANCE;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return DEFAULT_APPEARANCE;
  }
  if (typeof data !== 'object' || data === null) return DEFAULT_APPEARANCE;
  const value = data as Record<string, unknown>;
  const modes: readonly string[] = ['auto', 'light', 'dark'];
  return {
    mode: modes.includes(value.mode as string)
      ? (value.mode as AppearanceMode)
      : DEFAULT_APPEARANCE.mode,
    light: (LIGHT_THEME_IDS as readonly string[]).includes(value.light as string)
      ? (value.light as LightThemeId)
      : DEFAULT_APPEARANCE.light,
    dark: (DARK_THEME_IDS as readonly string[]).includes(value.dark as string)
      ? (value.dark as DarkThemeId)
      : DEFAULT_APPEARANCE.dark,
  };
}
