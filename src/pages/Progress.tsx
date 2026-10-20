import { useState } from 'react';
import { BarChart, PeriodPicker, Stat } from '../components/ui';
import { activityType } from '../data/activityTypes';
import type { Activity, DayNote, Meal, Task } from '../data/types';
import { useAuth } from '../lib/auth';
import { periodRange, todayISO, type Period } from '../lib/dates';
import { useRows } from '../lib/hooks';
import { activitySummary, fmt, mealSummary, series, sumBy, taskSummary, weeklyStreak } from '../lib/stats';

type Metric = 'minutes' | 'distance' | 'calories';

export default function Progress() {
  const { me: profile } = useAuth();
  const [period, setPeriod] = useState<Period>('week');
  const [anchor, setAnchor] = useState(todayISO());
  const [metric, setMetric] = useState<Metric>('minutes');
  const range = periodRange(period, anchor);

  const acts = useRows<Activity>('activities', range);
  const meals = useRows<Meal>('meals', range);
  const tasks = useRows<Task>('tasks', range);
  const notes = useRows<DayNote>('day_notes', range);
  const allActs = useRows<Activity>('activities');

  const a = activitySummary(acts.rows);
  const m = mealSummary(meals.rows);
  const t = taskSummary(tasks.rows);
  const water = sumBy(notes.rows, (n) => n.water);
  const pick: Record<Metric, (rows: Activity[]) => number> = {
    minutes: (r) => sumBy(r, (x) => x.duration_min),
    distance: (r) => sumBy(r, (x) => x.distance_km ?? 0),
    calories: (r) => sumBy(r, (x) => x.calories),
  };
  const unit: Record<Metric, string> = { minutes: ' min', distance: ' km', calories: ' kcal' };
  // A year chart buckets by month, so food is shown as a daily average per month.
  const foodSeries = series(meals.rows, period, anchor, (r) => {
    const days = new Set(r.map((x) => x.date)).size;
    return days ? sumBy(r, (x) => x.calories) / (period === 'year' ? days : 1) : 0;
  });
  const taskSeries = series(tasks.rows, period, anchor, (r) => r.filter((x) => x.done).length);

  return (
    <div className="page stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>Look how far you've come</h1>
        </div>
      </header>

      <PeriodPicker period={period} anchor={anchor} onChange={(p, an) => { setPeriod(p); setAnchor(an); }} />

      <section className="card grid-4" aria-label="Summary">
        <Stat value={fmt(a.minutes)} label="active minutes" />
        <Stat value={fmt(a.distance, 1)} label="km moved" />
        <Stat value={m.days ? fmt(m.avgCalories) : '—'} label="avg kcal / logged day" />
        <Stat value={`${t.rate}%`} label={`plan done (${t.done}/${t.total})`} />
        <Stat value={a.sessions} label="workouts" />
        <Stat value={fmt(a.calories)} label="kcal burned (est.)" />
        <Stat value={m.days ? `${fmt(m.avgProtein)} g` : '—'} label="avg protein / day" />
        <Stat value={weeklyStreak(allActs.rows)} label="week streak" />
      </section>

      <div className="grid-2">
        <section className="card stack accent-workout" aria-labelledby="move-chart">
          <div className="row-between">
            <h2 id="move-chart" className="card-title" style={{ margin: 0 }}>Movement</h2>
            <div className="tabs" role="tablist" aria-label="Metric">
              {(['minutes', 'distance', 'calories'] as Metric[]).map((k) => (
                <button key={k} role="tab" aria-selected={metric === k} className={`tab${metric === k ? ' active' : ''}`} onClick={() => setMetric(k)}>
                  {k[0].toUpperCase() + k.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <BarChart data={series(acts.rows, period, anchor, pick[metric])} color="var(--c-workout)" unit={unit[metric]} />
          {period === 'week' && profile && (
            <p className="small muted">Weekly goal: {fmt(a.minutes)} of {profile.goal_active_minutes} active minutes.</p>
          )}
        </section>

        <section className="card stack accent-food" aria-labelledby="food-chart">
          <h2 id="food-chart" className="card-title">Calories eaten{period === 'year' ? ' (daily average)' : ''}</h2>
          <BarChart data={foodSeries} color="var(--c-food)" unit=" kcal" />
          <p className="small muted">
            Macros this {period}: P {fmt(m.protein)} g · C {fmt(m.carbs)} g · F {fmt(m.fat)} g
          </p>
        </section>

        <section className="card stack accent-planner" aria-labelledby="plan-chart">
          <h2 id="plan-chart" className="card-title">Tasks completed</h2>
          <BarChart data={taskSeries} color="var(--c-planner)" />
          <p className="small muted">Water logged: {fmt(water)} glasses</p>
        </section>

        <section className="card stack" aria-labelledby="mix-title">
          <h2 id="mix-title" className="card-title">Activity mix</h2>
          {a.byType.length === 0 ? (
            <p className="muted">No workouts in this {period} yet.</p>
          ) : (
            <ul className="list">
              {a.byType.map(([type, v]) => (
                <li key={type} className="list-item stack" style={{ gap: 4, alignItems: 'stretch' }}>
                  <div className="row-between small">
                    <span>{activityType(type).label} · {v.count}×</span>
                    <span className="muted nums">{fmt(v.minutes)} min</span>
                  </div>
                  <div className="progress sm progress-workout">
                    <div className="progress-bar" style={{ width: `${(v.minutes / Math.max(a.minutes, 1)) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
