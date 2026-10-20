import { Alert, View } from 'react-native';

import { T } from '@/components/T';
import { Card, PillButton, Screen, Tag } from '@/components/ui';
import { useTheme } from '@/theme/ThemeProvider';
import { radius } from '@/theme/typography';

type Appetite = 'all' | 'some' | 'none';

// Sample only, matching the Health design. Real trends arrive in Phase 4.
const SAMPLE: Appetite[] = ['all', 'all', 'all', 'all', 'all', 'all', 'all', 'all', 'all', 'some', 'all', 'some', 'none', 'all'];
const BAR_HEIGHT: Record<Appetite, `${number}%`> = { all: '100%', some: '55%', none: '18%' };

export default function HealthScreen() {
  const theme = useTheme();
  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <View style={{ gap: 2 }}>
          <T size={14} color={theme.muted}>
            Last 14 days
          </T>
          <T size={26} weight={800} style={{ letterSpacing: -0.5 }} accessibilityRole="header">
            {"Milo's health"}
          </T>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <T size={30} weight={800} num>
            86
            <T size={14} weight={700} color={theme.muted}>
              {' '}
              /100
            </T>
          </T>
          <T size={12} weight={700} color={theme.muted}>
            care score
          </T>
        </View>
      </View>

      <Tag label="Preview · sample data" />

      <View style={{ backgroundColor: theme.alert, borderRadius: radius.row, padding: 16, gap: 4 }}>
        <T size={16} weight={800} color={theme.onAlert}>
          {"Milo's eating less than usual"}
        </T>
        <T size={14} weight={600} color={theme.onAlert} style={{ lineHeight: 19 }}>
          He left food 3 times this week, up from 0 last week. Worth mentioning to your vet if it keeps up.
        </T>
      </View>

      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <T size={15} weight={800}>
            Appetite
          </T>
          <T size={13} color={theme.muted}>
            per day
          </T>
        </View>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel="Appetite over 14 days: ate everything most days, left some food on 2 recent days and barely ate once"
          style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 64 }}>
          {SAMPLE.map((a, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                height: BAR_HEIGHT[a],
                borderRadius: 4,
                backgroundColor: a === 'all' ? theme.ink : theme.alert,
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap' }}>
          <Legend color={theme.ink} h={10} label="Ate all" />
          <Legend color={theme.alert} h={6} label="Left some" />
          <Legend color={theme.alert} h={3} label="Barely ate" />
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Card style={{ flex: 1, gap: 2, borderRadius: radius.row, padding: 14 }}>
          <T size={13} weight={700} color={theme.muted}>
            Walks / day
          </T>
          <T size={26} weight={800} num>
            48
            <T size={13} weight={700} color={theme.muted}>
              {' '}
              min
            </T>
          </T>
          <T size={13} weight={700} color={theme.muted}>
            Down 9 min from last week
          </T>
        </Card>
        <Card style={{ flex: 1, gap: 2, borderRadius: radius.row, padding: 14 }}>
          <T size={13} weight={700} color={theme.muted}>
            Meds given
          </T>
          <T size={26} weight={800} num>
            14
            <T size={13} weight={700} color={theme.muted}>
              {' '}
              / 14
            </T>
          </T>
          <T size={13} weight={700} color={theme.muted}>
            No missed doses
          </T>
        </Card>
      </View>

      <View style={{ marginTop: 'auto', gap: 8 }}>
        <PillButton
          label="Create vet report"
          onPress={() => Alert.alert('Coming in Phase 4', 'The vet report PDF is built with the Health features.')}
        />
        <T size={12} color={theme.muted} align="center">
          {"Based on what's been logged. Not medical advice."}
        </T>
      </View>
    </Screen>
  );
}

function Legend({ color, h, label }: { color: string; h: number; label: string }) {
  const theme = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={{ width: 10, height: h, borderRadius: 2, backgroundColor: color }} />
      <T size={12} weight={700} color={theme.muted}>
        {label}
      </T>
    </View>
  );
}
