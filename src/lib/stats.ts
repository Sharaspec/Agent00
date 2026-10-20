import type { Activity, Meal, Task } from '../data/types';
import { addDays, buckets, startOfWeek, todayISO, type Period } from './dates';

const inRange = (date: string, from: string, to: string) => date >= from && date <= to;

export function sumBy<T>(rows: T[], pick: (r: T) => number) {
  return rows.reduce((s, r) => s + (pick(r) || 0), 0);
}

export function series<T extends { date: string }>(rows: T[], period: Period, anchor: string, pick: (rows: T[]) => number) {
  return buckets(period, anchor).map((b) => ({ label: b.label, value: pick(rows.filter((r) => inRange(r.date, b.from, b.to))) }));
}

export function activitySummary(acts: Activity[]) {
  const byType = new Map<string, { count: number; minutes: number }>();
  for (const a of acts) {
    const t = byType.get(a.type) ?? { count: 0, minutes: 0 };
    t.count += 1;
    t.minutes += a.duration_min;
    byType.set(a.type, t);
  }
  return {
    sessions: acts.length,
    minutes: sumBy(acts, (a) => a.duration_min),
    distance: sumBy(acts, (a) => a.distance_km ?? 0),
    calories: sumBy(acts, (a) => a.calories),
    byType: [...byType.entries()].sort((a, b) => b[1].minutes - a[1].minutes),
  };
}

export function mealSummary(meals: Meal[]) {
  const days = new Set(meals.map((m) => m.date)).size || 1;
  const calories = sumBy(meals, (m) => m.calories);
  return {
    days: new Set(meals.map((m) => m.date)).size,
    calories,
    avgCalories: Math.round(calories / days),
    protein: sumBy(meals, (m) => m.protein),
    carbs: sumBy(meals, (m) => m.carbs),
    fat: sumBy(meals, (m) => m.fat),
    avgProtein: Math.round(sumBy(meals, (m) => m.protein) / days),
  };
}

export function taskSummary(tasks: Task[]) {
  const done = tasks.filter((t) => t.done).length;
  return { total: tasks.length, done, rate: tasks.length ? Math.round((done / tasks.length) * 100) : 0 };
}

/**
 * Weekly streak, Strava-style: a week counts if it has at least one activity.
 * The current week doesn't break the streak until it's over.
 */
export function weeklyStreak(acts: Activity[]): number {
  const weeks = new Set(acts.map((a) => startOfWeek(a.date)));
  let week = startOfWeek(todayISO());
  if (!weeks.has(week)) week = addDays(week, -7);
  let n = 0;
  while (weeks.has(week)) {
    n += 1;
    week = addDays(week, -7);
  }
  return n;
}

export const fmt = (n: number, digits = 0) => n.toLocaleString(undefined, { maximumFractionDigits: digits });
