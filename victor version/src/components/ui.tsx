import { Pressable, ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tap } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, TAP } from '@/theme/typography';

import { T } from './T';

/** Space the floating tab bar takes at the bottom, so content can scroll clear of it. */
export const TAB_BAR_HEIGHT = 64;
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, 16) + 24;
}

/** Full-screen scrolling page with the theme background and safe areas. */
export function Screen({
  children,
  withTabBar = true,
  scroll = true,
}: {
  children: React.ReactNode;
  withTabBar?: boolean;
  scroll?: boolean;
}) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const tabSpace = useTabBarSpace();
  const padding = {
    paddingTop: insets.top + 12,
    paddingBottom: withTabBar ? tabSpace : insets.bottom + 24,
    paddingHorizontal: 24,
    gap: 20,
  };
  if (!scroll) {
    return <View style={[{ flex: 1, backgroundColor: theme.bg }, padding]}>{children}</View>;
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.bg }}
      contentContainerStyle={[padding, { flexGrow: 1 }]}
      contentInsetAdjustmentBehavior="never">
      {children}
    </ScrollView>
  );
}

export function Card({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: theme.card,
          borderColor: theme.line,
          borderWidth: StyleSheet.hairlineWidth * 2,
          borderRadius: radius.card,
          padding: 16,
        },
        style,
      ]}
    />
  );
}

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'onHero' | 'ghost' | 'plain';
  height?: number;
  disabled?: boolean;
  accessibilityHint?: string;
};

/** Pill button. Every press gives a light haptic tap. */
export function PillButton({
  label,
  onPress,
  variant = 'primary',
  height = 56,
  disabled,
  accessibilityHint,
}: ButtonProps) {
  const theme = useTheme();
  const colors = {
    primary: { bg: theme.hero, fg: theme.onHero },
    onHero: { bg: theme.onHero, fg: theme.hero },
    ghost: { bg: theme.ghost, fg: theme.onHero },
    plain: { bg: 'transparent', fg: theme.muted },
  }[variant];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      disabled={disabled}
      onPress={() => {
        tap();
        onPress?.();
      }}
      style={({ pressed }) => ({
        height: Math.max(height, TAP),
        borderRadius: radius.pill,
        backgroundColor: colors.bg,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}>
      <T size={17} weight={800} color={colors.fg}>
        {label}
      </T>
    </Pressable>
  );
}

/** Small rounded label, e.g. "Preview" or "3 meals". */
export function Tag({ label, tone = 'card' }: { label: string; tone?: 'card' | 'alert' }) {
  const theme = useTheme();
  const alert = tone === 'alert';
  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: alert ? theme.alert : theme.card,
        borderColor: theme.line,
        borderWidth: alert ? 0 : StyleSheet.hairlineWidth * 2,
        borderRadius: radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 4,
      }}>
      <T size={13} weight={700} color={alert ? theme.onAlert : theme.muted}>
        {label}
      </T>
    </View>
  );
}
