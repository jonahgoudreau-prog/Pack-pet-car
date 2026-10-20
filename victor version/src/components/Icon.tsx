import Svg, { Circle, Path } from 'react-native-svg';

export type IconName =
  | 'home'
  | 'history'
  | 'plus'
  | 'household'
  | 'settings'
  | 'chevron-down'
  | 'chevron-left'
  | 'check'
  | 'bowl'
  | 'walk'
  | 'pill'
  | 'heart'
  | 'chevron-right';

type Props = { name: IconName; size?: number; color: string; strokeWidth?: number };

/** Stroke icons drawn to match the design files. Always decorative: label the button, not the icon. */
export function Icon({ name, size = 24, color, strokeWidth = 2.2 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      {name === 'home' && <Path {...common} d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />}
      {name === 'history' && (
        <>
          <Circle {...common} cx="12" cy="12" r="9" />
          <Path {...common} d="M12 7v5l3 2" />
        </>
      )}
      {name === 'plus' && <Path {...common} d="M12 5v14M5 12h14" />}
      {name === 'household' && (
        <>
          <Circle {...common} cx="9" cy="8" r="3.5" />
          <Path {...common} d="M2.5 20c.8-3.6 3.4-5.5 6.5-5.5s5.7 1.9 6.5 5.5" />
          <Path {...common} d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .6 3.2 2.3 3.5 5.2" />
        </>
      )}
      {name === 'settings' && (
        <>
          <Circle {...common} cx="12" cy="12" r="3" />
          <Path
            {...common}
            d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"
          />
        </>
      )}
      {name === 'chevron-down' && <Path {...common} d="M6 9l6 6 6-6" />}
      {name === 'chevron-left' && <Path {...common} d="M15 5l-7 7 7 7" />}
      {name === 'chevron-right' && <Path {...common} d="M9 5l7 7-7 7" />}
      {name === 'heart' && (
        <Path
          {...common}
          d="M12 20s-7.5-4.6-9-9.3C1.9 7.2 4.1 4.5 7.2 4.5c2 0 3.5 1.1 4.8 2.8 1.3-1.7 2.8-2.8 4.8-2.8 3.1 0 5.3 2.7 4.2 6.2C19.5 15.4 12 20 12 20z"
        />
      )}
      {name === 'check' && <Path {...common} d="M5 12l5 5 9-10" />}
      {name === 'bowl' && (
        <>
          <Path {...common} d="M3 11h18a9 9 0 0 1-18 0z" />
          <Path {...common} d="M8 7c0-1.5 1-2 1-3.5M12 7c0-1.5 1-2 1-3.5M16 7c0-1.5 1-2 1-3.5" />
        </>
      )}
      {name === 'walk' && (
        <>
          <Circle {...common} cx="13" cy="4.5" r="1.8" />
          <Path {...common} d="M9 21l2.5-6 2.5 2v4M8 12l2-4h4l2 3 2 1M11.5 15l1-7" />
        </>
      )}
      {name === 'pill' && (
        <>
          <Path {...common} d="M10.5 20.5a5 5 0 0 1-7-7l7-7a5 5 0 0 1 7 7z" />
          <Path {...common} d="M7 10l7 7" />
        </>
      )}
    </Svg>
  );
}
