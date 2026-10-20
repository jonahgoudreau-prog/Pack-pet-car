import { Alert, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { T } from '@/components/T';
import { Card, PillButton, Screen, Tag } from '@/components/ui';
import { longDate, weekEndingOn } from '@/lib/dates';
import { useTheme } from '@/theme/ThemeProvider';
import { TAP } from '@/theme/typography';

/**
 * Phase 0: Home laid out from the Main design with sample numbers, so fonts,
 * colors and spacing can be checked on a real iPhone. Real data arrives in Phase 1.
 */
export default function HomeScreen() {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const today = new Date();
  const week = weekEndingOn(today);
  const circle = Math.min(Math.round(width * 0.6), 260);
  // Sample only: pretend the day two days ago had a problem.
  const problemDay = week[4].key;

  const comingSoon = () =>
    Alert.alert('Coming in Phase 1', 'Logging meals arrives once sign-in and households are built.');

  return (
    <Screen>
      <View style={styles.header}>
        <View style={{ gap: 2, flex: 1 }}>
          <T size={14} color={theme.muted}>
            {longDate(today)}
          </T>
          <T size={26} weight={800} style={{ letterSpacing: -0.5 }}>
            Milo
          </T>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Switch pet"
          style={[styles.round, { backgroundColor: theme.card, borderColor: theme.line }]}>
          <Icon name="chevron-down" size={18} strokeWidth={2.4} color={theme.ink} />
        </Pressable>
      </View>

      <Tag label="Preview · sample data" />

      <View style={styles.week} accessibilityLabel="This week">
        {week.map((d) => {
          const problem = d.key === problemDay;
          return (
            <View key={d.key} style={styles.weekDay}>
              <T size={12} weight={d.isToday ? 800 : 700} color={d.isToday ? theme.ink : theme.muted}>
                {d.isToday ? 'Today' : d.letter}
              </T>
              <View
                style={[
                  styles.dayDot,
                  d.isToday && { backgroundColor: theme.hero },
                  problem && { borderBottomWidth: 3, borderColor: theme.alertLine, borderRadius: 0 },
                ]}>
                <T size={15} weight={800} num color={d.isToday ? theme.onHero : theme.ink} style={{ letterSpacing: 0 }}>
                  {d.day}
                </T>
              </View>
            </View>
          );
        })}
      </View>

      <View
        style={[
          styles.hero,
          { width: circle, height: circle, backgroundColor: theme.hero },
        ]}>
        <T size={14} weight={700} color={theme.mutedOnHero}>
          Dinner
        </T>
        <T size={Math.round(circle * 0.22)} weight={800} num color={theme.onHero} style={{ lineHeight: Math.round(circle * 0.25) }}>
          45 min
        </T>
        <T size={15} weight={700} color={theme.alert}>
          overdue
        </T>
        <View style={{ marginTop: 10 }}>
          <PillButton label="Feed dinner" variant="onHero" height={44} onPress={comingSoon} />
        </View>
      </View>

      <View style={styles.cards}>
        <Card style={styles.card}>
          <T size={14} weight={700} color={theme.muted}>
            Walks
          </T>
          <T size={30} weight={800} num>
            38
            <T size={15} weight={700} color={theme.muted}>
              {' '}
              / 60 min
            </T>
          </T>
        </Card>
        <Card style={styles.card}>
          <T size={14} weight={700} color={theme.muted}>
            Meds
          </T>
          <T size={30} weight={800} num>
            8 PM
            <T size={15} weight={700} color={theme.muted}>
              {' '}
              next
            </T>
          </T>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  round: {
    width: TAP,
    height: TAP,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  week: {
    flexDirection: 'row',
  },
  weekDay: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  dayDot: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignSelf: 'center',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  cards: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 'auto',
  },
  card: {
    flex: 1,
    gap: 4,
  },
});
