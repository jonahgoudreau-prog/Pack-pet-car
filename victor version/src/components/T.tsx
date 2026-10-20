import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { fontFamily, type Weight } from '@/theme/typography';

type Props = TextProps & {
  size?: number;
  weight?: Weight;
  color?: string;
  /** Big-number style: tabular figures and tight letter spacing. */
  num?: boolean;
  align?: TextStyle['textAlign'];
};

/** All text in the app goes through this, so Urbanist and theme colors are always applied. */
export function T({ size = 16, weight = 600, color, num, align, style, ...rest }: Props) {
  const theme = useTheme();
  return (
    <Text
      // Dynamic Type: let text grow, but not so much that big numbers break the layout.
      maxFontSizeMultiplier={num || size >= 26 ? 1.25 : 1.6}
      {...rest}
      style={[
        {
          fontFamily: fontFamily[weight],
          fontSize: size,
          color: color ?? theme.ink,
          textAlign: align,
        },
        num && styles.num,
        num && { letterSpacing: -0.04 * size },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  num: {
    fontVariant: ['tabular-nums'],
  },
});
