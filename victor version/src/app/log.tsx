import { router } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { T } from '@/components/T';
import { Card, PillButton } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';

const ACTIONS: { icon: IconName; label: string; phase: string }[] = [
  { icon: 'bowl', label: 'Feed', phase: 'Phase 1' },
  { icon: 'walk', label: 'Start walk', phase: 'Phase 2' },
  { icon: 'pill', label: 'Give meds', phase: 'Phase 5' },
];

/** The sheet behind the "+" button. Placeholder until logging exists. */
export default function LogSheet() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.bg,
        padding: 24,
        paddingBottom: insets.bottom + 16,
        gap: 14,
      }}>
      <T size={24} weight={800} accessibilityRole="header">
        Log for Milo
      </T>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {ACTIONS.map((a) => (
          <Card key={a.label} style={{ flex: 1, alignItems: 'center', gap: 8, paddingVertical: 18 }}>
            <Icon name={a.icon} size={28} color={theme.ink} />
            <T size={15} weight={800} align="center">
              {a.label}
            </T>
            <T size={12} weight={600} color={theme.muted} align="center">
              {a.phase}
            </T>
          </Card>
        ))}
      </View>
      <View style={{ marginTop: 'auto' }}>
        <PillButton label="Close" onPress={() => router.back()} />
      </View>
    </View>
  );
}
