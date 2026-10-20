import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import IdeaGenerator, { CATEGORY_LABELS } from '../components/IdeaGenerator';
import { Empty, Ring, Toast } from '../components/ui';
import { TIPS } from '../data/tips';
import type { Activity, DayNote, IdeaCategory, Meal, Task } from '../data/types';
import { useAuth } from '../lib/auth';
import { data } from '../lib/data';
import { addDays, friendlyDate, fromISO, periodRange, todayISO } from '../lib/dates';
import { useRows, useToast } from '../lib/hooks';
import { fmt, sumBy, weeklyStreak } from '../lib/stats';
import Icon from '../components/Icon';

const MOODS = ['Rough', 'Meh', 'Okay', 'Good', 'Great'];

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export default function Today() {
  const { me: profile } = useAuth();
  const [date, setDate] = useState(todayISO());
  const day = { from: date, to: date };
  const week = periodRange('week', date);
  const tasks = useRows<Task>('tasks', day);
  const meals = useRows<Meal>('meals', day);
  const weekActs = useRows<Activity>('activities', week);
  const allActs = useRows<Activity>('activities');
  const notes = useRows<DayNote>('day_notes', day);
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [category, setCategory] = useState<IdeaCategory>('plan');

  const note = notes.rows[0];
  const dayActs = weekActs.rows.filter((a) => a.date === date);
  const sortedTasks = useMemo(
    () => [...tasks.rows].sort((a, b) => Number(a.done) - Number(b.done) || (a.time ?? '99').localeCompare(b.time ?? '99')),
    [tasks.rows],
  );
  const tip = TIPS[fromISO(date).getDate() % Math.max(TIPS.length, 1)];
  const streak = weeklyStreak(allActs.rows);
  const doneCount = tasks.rows.filter((t) => t.done).length;
  const calories = sumBy(meals.rows, (m) => m.calories);
  const weekMinutes = sumBy(weekActs.rows, (a) => a.duration_min);

  async function addTask(t: string, cat: IdeaCategory, tm: string | null) {
    const row = await data.insert<Task>('tasks', { date, title: t, time: tm, category: cat, done: false });
    tasks.setRows((r) => [...r, row]);
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await addTask(title.trim(), category, time || null);
    setTitle('');
    setTime('');
  }

  async function toggle(t: Task) {
    tasks.setRows((r) => r.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)));
    await data.update<Task>('tasks', t.id, { done: !t.done });
  }

  async function remove(t: Task) {
    tasks.setRows((r) => r.filter((x) => x.id !== t.id));
    await data.remove('tasks', t.id);
  }

  async function carryOver() {
    const prev = await data.list<Task>('tasks', { from: addDays(date, -1), to: addDays(date, -1) });
    const open = prev.filter((t) => !t.done);
    for (const t of open) await addTask(t.title, t.category, t.time);
    toast.show(open.length ? `Moved ${open.length} unfinished task${open.length > 1 ? 's' : ''} from yesterday` : 'Nothing left over from yesterday');
  }

  async function saveNote(patch: Partial<DayNote>) {
    if (!profile) return;
    const base = note ?? { water: 0, mood: null, note: '' };
    const row = await data.upsert<DayNote>('day_notes', {
      id: `${profile.id}_${date}`,
      date,
      water: base.water,
      mood: base.mood,
      note: base.note,
      ...patch,
    });
    notes.setRows([row]);
  }

  return (
    <div className="page stack accent-planner">
      <header className="page-header">
        <div>
          <p className="muted small">{greeting()}, {profile?.display_name.split(' ')[0]}</p>
          <h1>{friendlyDate(date)}</h1>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="icon-btn" aria-label="Previous day" onClick={() => setDate(addDays(date, -1))}><Icon name="chevron-left" /></button>
          <input className="input date-input" type="date" aria-label="Pick a date" value={date} onChange={(e) => e.target.value && setDate(e.target.value)} />
          <button className="icon-btn" aria-label="Next day" onClick={() => setDate(addDays(date, 1))}><Icon name="chevron-right" /></button>
        </div>
      </header>

      <section className="card rings-card" aria-label="Today at a glance">
        <Ring value={doneCount} max={tasks.rows.length || 1} label="Plan" sub={`${doneCount}/${tasks.rows.length} done`} color="var(--c-planner)" />
        <Ring value={weekMinutes} max={profile?.goal_active_minutes ?? 150} label="Move (week)" sub={`${weekMinutes}/${profile?.goal_active_minutes} min`} color="var(--c-workout)" />
        <Ring value={calories} max={profile?.goal_calories ?? 2000} label="Eat" sub={`${fmt(calories)}/${fmt(profile?.goal_calories ?? 2000)} kcal`} color="var(--c-food)" />
        <div className="stat streak-stat">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">week streak</div>
          <div className="small muted">1 workout a week keeps it going</div>
        </div>
      </section>

      <div className="grid-2">
        <section className="card stack" aria-labelledby="plan-title">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="plan-title" className="card-title" style={{ margin: 0 }}>
              <span className="pill-planner">Plan</span> Your day
            </h2>
            <button className="btn btn-ghost btn-sm" onClick={carryOver}>Bring over yesterday</button>
          </div>
          <form className="row task-form" onSubmit={submit}>
            <input id="task-title" className="input" placeholder="Add something to your day" aria-label="Task" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input id="task-time" className="input" type="time" aria-label="Time" value={time} onChange={(e) => setTime(e.target.value)} />
            <select id="task-cat" className="select" aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value as IdeaCategory)}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <button className="btn btn-primary">Add</button>
          </form>
          {sortedTasks.length === 0 ? (
            <Empty title="A blank page, full of options">Add a task above or grab one from the idea generator.</Empty>
          ) : (
            <ul className="list">
              {sortedTasks.map((t) => (
                <li key={t.id} className={`list-item${t.done ? ' done' : ''}`}>
                  <label className="row task-row">
                    <input type="checkbox" className="checkbox" checked={t.done} onChange={() => toggle(t)} />
                    <span className="task-time small muted">{t.time ?? '—'}</span>
                    <span className="task-title">{t.title}</span>
                  </label>
                  <span className="badge">{CATEGORY_LABELS[t.category]}</span>
                  <button className="icon-btn" aria-label={`Delete ${t.title}`} onClick={() => remove(t)}><Icon name="close" size={18} /></button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <IdeaGenerator
          onAdd={async (idea) => {
            await addTask(idea.text, idea.category, null);
            toast.show('Added to your day');
          }}
        />
      </div>

      <div className="grid-3">
        <section className="card stack">
          <h2 className="card-title"><span className="pill-workout">Move</span> Workouts</h2>
          {dayActs.length ? (
            <ul className="list">
              {dayActs.map((a) => (
                <li key={a.id} className="list-item">
                  <span>{a.name}</span>
                  <span className="small muted">{a.duration_min} min{a.distance_km ? ` · ${fmt(a.distance_km, 1)} km` : ''}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No workouts logged yet. A 10-minute walk counts.</p>
          )}
          <Link to="/app/workouts" className="btn btn-ghost btn-sm">Log a workout</Link>
        </section>

        <section className="card stack">
          <h2 className="card-title"><span className="pill-food">Eat</span> Food</h2>
          <div className="row" style={{ justifyContent: 'space-between' }}>
            <span>{fmt(calories)} kcal</span>
            <span className="small muted">{fmt(sumBy(meals.rows, (m) => m.protein))} g protein</span>
          </div>
          <div className="progress" aria-hidden="true">
            <div className="progress-bar" style={{ width: `${Math.min(100, (calories / (profile?.goal_calories || 2000)) * 100)}%`, background: 'var(--c-food)' }} />
          </div>
          <p className="small muted">{meals.rows.length} item{meals.rows.length === 1 ? '' : 's'} logged</p>
          <Link to="/app/food" className="btn btn-ghost btn-sm">Log food</Link>
        </section>

        <section className="card stack">
          <h2 className="card-title">Check-in</h2>
          <div className="field">
            <span className="label">Water</span>
            <div className="row" style={{ alignItems: 'center' }}>
              <button className="icon-btn" aria-label="One less glass" onClick={() => saveNote({ water: Math.max(0, (note?.water ?? 0) - 1) })}><Icon name="minus" /></button>
              <strong>{note?.water ?? 0} / {profile?.goal_water ?? 8} glasses</strong>
              <button className="icon-btn" aria-label="One more glass" onClick={() => saveNote({ water: (note?.water ?? 0) + 1 })}><Icon name="plus" /></button>
            </div>
          </div>
          <div className="field">
            <span className="label">Mood</span>
            <div className="row" style={{ gap: 6 }}>
              {MOODS.map((m, i) => (
                <button key={m} className={`chip${note?.mood === i + 1 ? ' active' : ''}`} aria-pressed={note?.mood === i + 1} onClick={() => saveNote({ mood: i + 1 })}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label className="label" htmlFor="day-note">Note to self</label>
            <textarea
              id="day-note"
              key={`${date}-${notes.loading ? "l" : note ? "n" : "e"}`}
              className="textarea"
              rows={2}
              defaultValue={note?.note ?? ''}
              placeholder="What went well today?"
              onBlur={(e) => e.target.value !== (note?.note ?? '') && saveNote({ note: e.target.value })}
            />
          </div>
        </section>
      </div>

      {tip && (
        <section className="card tip-card">
          <span className="badge">Tip of the day</span>
          <h2 className="card-title">{tip.title}</h2>
          <p>{tip.body}</p>
          {tip.source && <p className="small muted">Source: {tip.source}</p>}
        </section>
      )}
      <Toast message={toast.message} />
    </div>
  );
}
