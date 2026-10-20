import { DEFAULT_APPEARANCE, parseAppearance, resolvePalette } from '../appearance';

describe('resolvePalette', () => {
  it('defaults to Automatic: Butter in light mode, Dark in dark mode', () => {
    expect(DEFAULT_APPEARANCE.mode).toBe('auto');
    expect(resolvePalette(DEFAULT_APPEARANCE, 'light').id).toBe('butter');
    expect(resolvePalette(DEFAULT_APPEARANCE, 'dark').id).toBe('dark');
  });

  it('treats an unknown iPhone setting as light', () => {
    expect(resolvePalette(DEFAULT_APPEARANCE, null).id).toBe('butter');
    expect(resolvePalette(DEFAULT_APPEARANCE, 'unspecified').id).toBe('butter');
  });

  it('uses the chosen colors in Automatic mode', () => {
    const pref = { mode: 'auto' as const, light: 'sky' as const, dark: 'night' as const };
    expect(resolvePalette(pref, 'light').id).toBe('sky');
    expect(resolvePalette(pref, 'dark').id).toBe('night');
  });

  it('ignores the iPhone setting when forced to Light or Dark', () => {
    const light = { ...DEFAULT_APPEARANCE, mode: 'light' as const, light: 'white' as const };
    const dark = { ...DEFAULT_APPEARANCE, mode: 'dark' as const };
    expect(resolvePalette(light, 'dark').id).toBe('white');
    expect(resolvePalette(dark, 'light').id).toBe('dark');
  });
});

describe('parseAppearance', () => {
  it('returns defaults for empty or broken storage', () => {
    expect(parseAppearance(null)).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance('not json')).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance('42')).toEqual(DEFAULT_APPEARANCE);
  });

  it('keeps valid values and replaces unknown ones', () => {
    expect(parseAppearance(JSON.stringify({ mode: 'dark', light: 'blush', dark: 'night' }))).toEqual({
      mode: 'dark',
      light: 'blush',
      dark: 'night',
    });
    expect(parseAppearance(JSON.stringify({ mode: 'sepia', light: 'dark', dark: 'butter' }))).toEqual(
      DEFAULT_APPEARANCE
    );
  });
});
