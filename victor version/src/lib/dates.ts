export type WeekDay = {
  /** YYYY-MM-DD */
  key: string;
  /** Day of month, e.g. 20 */
  day: number;
  /** One-letter weekday, e.g. "T" */
  letter: string;
  isToday: boolean;
};

const LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** The 7 days ending today, oldest first, like the week strip on Home. */
export function weekEndingOn(today: Date): WeekDay[] {
  const days: WeekDay[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
    days.push({
      key: dateKey(d),
      day: d.getDate(),
      letter: LETTERS[d.getDay()],
      isToday: offset === 0,
    });
  }
  return days;
}

/** "Tuesday, Oct 20" */
export function longDate(d: Date): string {
  const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  return `${weekday}, ${month} ${d.getDate()}`;
}
