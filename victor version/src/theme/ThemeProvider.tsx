import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SystemUI from 'expo-system-ui';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import {
  DEFAULT_APPEARANCE,
  parseAppearance,
  resolvePalette,
  type AppearancePreference,
} from './appearance';
import type { Palette } from './palettes';

const STORAGE_KEY = 'pack.appearance.v1';

type ThemeContextValue = {
  palette: Palette;
  preference: AppearancePreference;
  setPreference: (next: Partial<AppearancePreference>) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [preference, setPreferenceState] = useState<AppearancePreference>(DEFAULT_APPEARANCE);

  // The appearance choice is a per-phone setting, so it lives on the device.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => setPreferenceState(parseAppearance(raw)))
      .catch(() => {});
  }, []);

  const setPreference = useCallback((next: Partial<AppearancePreference>) => {
    setPreferenceState((current) => {
      const merged = { ...current, ...next };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged)).catch(() => {});
      return merged;
    });
  }, []);

  const palette = resolvePalette(preference, system);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(palette.bg).catch(() => {});
  }, [palette.bg]);

  const value = useMemo(
    () => ({ palette, preference, setPreference }),
    [palette, preference, setPreference]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Palette {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx.palette;
}

export function useAppearance() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppearance must be used inside ThemeProvider');
  return ctx;
}
