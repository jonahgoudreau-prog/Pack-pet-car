import { palettes } from '../palettes';

/** WCAG relative luminance of a #RRGGBB color. */
function luminance(hex: string): number {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// Every theme must keep text readable (WCAG AA, 4.5:1 for normal text).
describe.each(Object.values(palettes))('$name theme', (p) => {
  it.each([
    ['ink on bg', p.ink, p.bg],
    ['ink on card', p.ink, p.card],
    ['muted on bg', p.muted, p.bg],
    ['muted on card', p.muted, p.card],
    ['onHero on hero', p.onHero, p.hero],
    ['mutedOnHero on hero', p.mutedOnHero, p.hero],
    ['onAlert on alert', p.onAlert, p.alert],
    ['alertInk on card', p.alertInk, p.card],
  ])('%s is readable', (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });

  it('marks dark themes as dark', () => {
    expect(p.isDark).toBe(luminance(p.bg) < 0.2);
  });
});
