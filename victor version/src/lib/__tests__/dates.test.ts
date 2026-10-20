import { dateKey, longDate, weekEndingOn } from '../dates';

describe('weekEndingOn', () => {
  it('returns the 7 days ending today, oldest first', () => {
    const week = weekEndingOn(new Date(2026, 9, 20)); // Tue Oct 20, 2026
    expect(week.map((d) => d.day)).toEqual([14, 15, 16, 17, 18, 19, 20]);
    expect(week.map((d) => d.letter).join('')).toBe('WTFSSMT');
    expect(week.filter((d) => d.isToday)).toHaveLength(1);
    expect(week[6].isToday).toBe(true);
  });

  it('crosses month boundaries', () => {
    const week = weekEndingOn(new Date(2026, 10, 3)); // Nov 3
    expect(week[0].key).toBe('2026-10-28');
    expect(week[6].key).toBe('2026-11-03');
  });
});

describe('formatting', () => {
  it('formats keys and long dates', () => {
    const d = new Date(2026, 9, 20);
    expect(dateKey(d)).toBe('2026-10-20');
    expect(longDate(d)).toBe('Tuesday, Oct 20');
  });
});
