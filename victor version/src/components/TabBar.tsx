import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tap } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

import { Icon, type IconName } from './Icon';
import { TAB_BAR_HEIGHT } from './ui';

const TABS: Record<string, { icon: IconName; label: string }> = {
  index: { icon: 'home', label: 'Today' },
  health: { icon: 'heart', label: 'Health' },
  history: { icon: 'history', label: 'History' },
  settings: { icon: 'settings', label: 'Settings' },
};

/** Floating Green pill with a big Butter "+" in the middle, as in the Main design. */
export function TabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const items = state.routes.map((route, index) => {
    const tab = TABS[route.name];
    if (!tab) return null;
    const focused = state.index === index;
    return (
      <Pressable
        key={route.key}
        accessibilityRole="tab"
        accessibilityLabel={tab.label}
        accessibilityState={{ selected: focused }}
        hitSlop={4}
        onPress={() => {
          tap();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        }}
        style={styles.tab}>
        <Icon name={tab.icon} color={focused ? theme.onHero : theme.mutedOnHero} />
      </Pressable>
    );
  });

  // Put the "+" between the second and third tab.
  items.splice(
    2,
    0,
    <Pressable
      key="log"
      accessibilityRole="button"
      accessibilityLabel="Log something"
      onPress={() => {
        tap();
        router.push('/log');
      }}
      style={({ pressed }) => [
        styles.plus,
        {
          backgroundColor: theme.onHero,
          borderColor: theme.bg,
          transform: [{ scale: pressed ? 0.94 : 1 }],
        },
      ]}>
      <Icon name="plus" size={26} strokeWidth={2.8} color={theme.hero} />
    </Pressable>
  );

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrap, { bottom: Math.max(insets.bottom - 8, 16) }]}>
      <View style={[styles.bar, { backgroundColor: theme.hero }]}>{items}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 24,
    right: 24,
  },
  bar: {
    height: TAB_BAR_HEIGHT,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  tab: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plus: {
    width: 64,
    height: 64,
    marginTop: -26,
    borderRadius: 999,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
