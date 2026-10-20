import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { T } from '@/components/T';
import { Card, Screen } from '@/components/ui';
import { buildInfo } from '@/lib/buildInfo';
import { tap } from '@/lib/haptics';
import type { AppearanceMode } from '@/theme/appearance';
import {
  DARK_THEME_IDS,
  LIGHT_THEME_IDS,
  palettes,
  type Palette,
} from '@/theme/palettes';
import { useAppearance, useTheme } from '@/theme/ThemeProvider';
import { radius, TAP } from '@/theme/typography';

const MODES: { id: AppearanceMode; label: string }[] = [
  { id: 'auto', label: 'Automatic' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

export default function SettingsScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useAppearance();

  return (
    <Screen>
      <T size={30} weight={800} style={{ letterSpacing: -0.6 }} accessibilityRole="header">
        Settings
      </T>

      <Card style={styles.list}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            tap();
            router.push('/household');
          }}
          style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
          <Icon name="household" color={theme.ink} />
          <T size={17} weight={700} style={{ flex: 1 }}>
            Household
          </T>
          <Icon name="chevron-right" size={18} color={theme.muted} />
        </Pressable>
      </Card>

      <Section title="Appearance">
        <View
          accessibilityRole="radiogroup"
          style={[styles.segment, { backgroundColor: theme.card, borderColor: theme.line }]}>
          {MODES.map((m) => {
            const selected = preference.mode === m.id;
            return (
              <Pressable
                key={m.id}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  tap();
                  setPreference({ mode: m.id });
                }}
                style={[styles.segmentItem, selected && { backgroundColor: theme.hero }]}>
                <T size={15} weight={800} color={selected ? theme.onHero : theme.ink}>
                  {m.label}
                </T>
              </Pressable>
            );
          })}
        </View>
        <T size={14} weight={500} color={theme.muted} style={{ lineHeight: 20 }}>
          {preference.mode === 'auto'
            ? `Follows your iPhone: ${palettes[preference.light].name} by day, ${palettes[preference.dark].name} at night.`
            : 'Only changes Pack on this phone.'}
        </T>
      </Section>

      <Section title="Light color">
        <Card style={styles.list}>
          {LIGHT_THEME_IDS.map((id, i) => (
            <ThemeRow
              key={id}
              palette={palettes[id]}
              selected={preference.light === id}
              last={i === LIGHT_THEME_IDS.length - 1}
              onPress={() => setPreference({ light: id })}
            />
          ))}
        </Card>
      </Section>

      <Section title="Dark style">
        <Card style={styles.list}>
          {DARK_THEME_IDS.map((id, i) => (
            <ThemeRow
              key={id}
              palette={palettes[id]}
              selected={preference.dark === id}
              last={i === DARK_THEME_IDS.length - 1}
              onPress={() => setPreference({ dark: id })}
            />
          ))}
        </Card>
      </Section>

      <Section title="About">
        <Card style={{ gap: 4 }}>
          <T size={16} weight={700}>
            Pack · Phase 0
          </T>
          <T size={14} weight={500} color={theme.muted}>
            Version {buildInfo.commit}
            {buildInfo.publishedAt ? ` · published ${buildInfo.publishedAt}` : ''}
          </T>
        </Card>
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 10 }}>
      <T size={14} weight={700} color={theme.muted} accessibilityRole="header">
        {title}
      </T>
      {children}
    </View>
  );
}

function ThemeRow({
  palette,
  selected,
  last,
  onPress,
}: {
  palette: Palette;
  selected: boolean;
  last: boolean;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={palette.name}
      onPress={() => {
        tap();
        onPress();
      }}
      style={({ pressed }) => [
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth * 2, borderColor: theme.line },
        pressed && { opacity: 0.7 },
      ]}>
      <View style={styles.swatches}>
        {[palette.bg, palette.hero, palette.alert].map((c, i) => (
          <View
            key={i}
            style={[
              styles.swatch,
              { backgroundColor: c, borderColor: theme.card, marginLeft: i === 0 ? 0 : -10 },
            ]}
          />
        ))}
      </View>
      <T size={17} weight={700} style={{ flex: 1 }}>
        {palette.name}
      </T>
      {selected && (
        <View style={[styles.check, { backgroundColor: theme.hero }]}>
          <Icon name="check" size={14} strokeWidth={3} color={theme.onHero} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  segment: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth * 2,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    minHeight: TAP,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 0,
    borderRadius: radius.row,
  },
  row: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
  },
  swatches: {
    flexDirection: 'row',
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 2,
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
