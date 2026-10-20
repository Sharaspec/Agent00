// Date helpers that work on local-time YYYY-MM-DD strings.

export type Period = 'day' | 'week' | 'month' | 'year';

const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function fromISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const todayISO = () => toISO(new Date());

export function addDays(iso: string, n: number): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

/** Monday-start week. */
export function startOfWeek(iso: string): string {
  const d = fromISO(iso);
  const offset = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - offset);
  return toISO(d);
}

export function periodRange(period: Period, anchor: string): { from: string; to: string } {
  const d = fromISO(anchor);
  switch (period) {
    case 'day':
      return { from: anchor, to: anchor };
    case 'week': {
      const from = startOfWeek(anchor);
      return { from, to: addDays(from, 6) };
    }
    case 'month':
      return { from: toISO(new Date(d.getFullYear(), d.getMonth(), 1)), to: toISO(new Date(d.getFullYear(), d.getMonth() + 1, 0)) };
    case 'year':
      return { from: `${d.getFullYear()}-01-01`, to: `${d.getFullYear()}-12-31` };
  }
}

export function shiftPeriod(period: Period, anchor: string, dir: 1 | -1): string {
  const d = fromISO(anchor);
  if (period === 'day') d.setDate(d.getDate() + dir);
  if (period === 'week') d.setDate(d.getDate() + 7 * dir);
  if (period === 'month') d.setMonth(d.getMonth() + dir, 1);
  if (period === 'year') d.setFullYear(d.getFullYear() + dir, 0, 1);
  return toISO(d);
}

/** Chart buckets for a period: hours aren't tracked, so a day shows one bucket. */
export function buckets(period: Period, anchor: string): { key: string; label: string; from: string; to: string }[] {
  const { from, to } = periodRange(period, anchor);
  if (period === 'year') {
    const y = fromISO(anchor).getFullYear();
    return Array.from({ length: 12 }, (_, m) => ({
      key: `${y}-${pad(m + 1)}`,
      label: new Date(y, m, 1).toLocaleDateString(undefined, { month: 'narrow' }),
      from: toISO(new Date(y, m, 1)),
      to: toISO(new Date(y, m + 1, 0)),
    }));
  }
  const out = [];
  for (let day = from; day <= to; day = addDays(day, 1)) {
    const dt = fromISO(day);
    out.push({
      key: day,
      label: period === 'week' ? dt.toLocaleDateString(undefined, { weekday: 'narrow' }) : String(dt.getDate()),
      from: day,
      to: day,
    });
  }
  return out;
}

export function periodLabel(period: Period, anchor: string): string {
  const d = fromISO(anchor);
  if (period === 'day') return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  if (period === 'week') {
    const { from, to } = periodRange('week', anchor);
    const f = fromISO(from).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const t = fromISO(to).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return `${f} – ${t}`;
  }
  if (period === 'month') return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  return String(d.getFullYear());
}

export function friendlyDate(iso: string): string {
  const t = todayISO();
  if (iso === t) return 'Today';
  if (iso === addDays(t, -1)) return 'Yesterday';
  if (iso === addDays(t, 1)) return 'Tomorrow';
  return fromISO(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}
