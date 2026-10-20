import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { T } from '@/components/T';
import { Card, Screen, Tag } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP } from '@/theme/typography';

/** Reached from Settings. Members, invite code and shortcut code arrive in Phase 5. */
export default function HouseholdScreen() {
  const theme = useTheme();
  return (
    <Screen withTabBar={false}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          style={[styles.round, { backgroundColor: theme.card, borderColor: theme.line }]}>
          <Icon name="chevron-left" size={20} strokeWidth={2.4} color={theme.ink} />
        </Pressable>
        <T size={28} weight={800} accessibilityRole="header">
          Household
        </T>
      </View>
      <Card style={{ gap: 10, padding: 20 }}>
        <Tag label="Coming in Phase 5" />
        <T size={16} weight={500} color={theme.muted} style={{ lineHeight: 22 }}>
          Everyone who feeds or walks Milo, plus the invite code to bring more people in.
        </T>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  round: {
    width: TAP,
    height: TAP,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
