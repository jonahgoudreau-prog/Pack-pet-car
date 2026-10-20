import { useTheme } from '@/theme/ThemeProvider';

import { T } from './T';
import { Card, Screen, Tag } from './ui';

export function ComingSoon({ title, phase, body }: { title: string; phase: string; body: string }) {
  const theme = useTheme();
  return (
    <Screen>
      <T size={30} weight={800} style={{ letterSpacing: -0.6 }} accessibilityRole="header">
        {title}
      </T>
      <Card style={{ gap: 10, padding: 20 }}>
        <Tag label={`Coming in ${phase}`} />
        <T size={16} weight={500} color={theme.muted} style={{ lineHeight: 22 }}>
          {body}
        </T>
      </Card>
    </Screen>
  );
}
