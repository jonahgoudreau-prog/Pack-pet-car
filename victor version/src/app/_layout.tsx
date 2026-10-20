import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider as NavigationThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { fontFiles } from '@/theme/typography';

export default function RootLayout() {
  const [loaded, error] = useFonts(fontFiles);
  if (!loaded && !error) return null;

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedNavigation() {
  const theme = useTheme();
  const navTheme = useMemo(
    () => ({
      ...DefaultTheme,
      dark: theme.isDark,
      colors: {
        ...DefaultTheme.colors,
        background: theme.bg,
        card: theme.bg,
        text: theme.ink,
        border: theme.line,
        primary: theme.hero,
      },
    }),
    [theme]
  );

  return (
    <NavigationThemeProvider value={navTheme}>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.bg } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="log" options={{ presentation: 'formSheet', sheetAllowedDetents: [0.5] }} />
      </Stack>
    </NavigationThemeProvider>
  );
}
