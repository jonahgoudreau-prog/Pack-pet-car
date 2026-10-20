import type { ConfigContext, ExpoConfig } from 'expo/config';

// These come from GitHub (repository variables) when CI publishes an update.
// Locally they can be left unset. None of them are secrets.
const projectId = process.env.EAS_PROJECT_ID || undefined;
const owner = process.env.EXPO_OWNER || undefined;

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Pack',
  slug: 'pack',
  owner,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  scheme: 'pack',
  // "automatic" lets the app follow the iPhone's light/dark setting.
  userInterfaceStyle: 'automatic',
  backgroundColor: '#FFEFB3',
  ios: {
    supportsTablet: false,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#FFEFB3',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
  },
  // Expo Go can load EAS updates that use the appVersion policy (SDK 49+).
  runtimeVersion: { policy: 'appVersion' },
  updates: projectId ? { url: `https://u.expo.dev/${projectId}` } : undefined,
  extra: {
    eas: { projectId },
  },
  plugins: ['expo-router', 'expo-font'],
  experiments: {
    typedRoutes: true,
  },
});
