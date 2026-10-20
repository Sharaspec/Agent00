import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Empty, Modal, Stat, Toast } from '../components/ui';
import { ACTIVITY_TYPES, activityType, estimateCalories } from '../data/activityTypes';
import type { Activity, CustomWorkout, Exercise, Level, WorkoutKind, WorkoutTemplate } from '../data/types';
import { WORKOUT_TEMPLATES } from '../data/workouts';
import { useAuth } from '../lib/auth';
import { data } from '../lib/data';
import { addDays, friendlyDate, periodRange, todayISO } from '../lib/dates';
import { useRows, useToast } from '../lib/hooks';
import { activitySummary, fmt } from '../lib/stats';

const KIND_TO_TYPE: Record<WorkoutKind, string> = { strength: 'strength', cardio: 'custom', hiit: 'hiit', mobility: 'stretch', run: 'run', walk: 'walk' };
const KINDS: WorkoutKind[] = ['strength', 'hiit', 'cardio', 'run', 'walk', 'mobility'];

interface Draft {
  type: string;
  name: string;
  date: string;
  duration: string;
  distance: string;
  calories: string;
  notes: string;
  shared: boolean;
  exercises: Exercise[];
}

const blankDraft = (type = 'walk'): Draft => ({
  type,
  name: activityType(type).label,
  date: todayISO(),
  duration: '30',
  distance: '',
  calories: '',
  notes: '',
  shared: true,
  exercises: [],
});

function exerciseLine(e: Exercise) {
  const parts = [e.sets && e.reps ? `${e.sets} × ${e.reps}` : e.reps, e.durationSec ? `${e.durationSec}s` : null].filter(Boolean);
  return `${e.name}${parts.length ? ` — ${parts.join(', ')}` : ''}`;
}

export default function Workouts() {
  const { me: profile, isGuest } = useAuth();
  const recentRange = { from: addDays(todayISO(), -30), to: addDays(todayISO(), 1) };
  const recent = useRows<Activity>('activities', recentRange);
  const custom = useRows<CustomWorkout>('custom_workouts');
  const toast = useToast();
  const [draft, setDraft] = useState<Draft>(blankDraft());
  const [level, setLevel] = useState<Level | 'all'>('all');
  const [viewing, setViewing] = useState<WorkoutTemplate | CustomWorkout | null>(null);
  const [building, setBuilding] = useState<{ name: string; kind: WorkoutKind; exercises: Exercise[] } | null>(null);

  const week = periodRange('week', todayISO());
  const weekSummary = activitySummary(recent.rows.filter((a) => a.date >= week.from && a.date <= week.to));
  const type = activityType(draft.type);
  const autoCalories = estimateCalories(draft.type, Number(draft.duration) || 0, profile?.weight_kg ?? null);

  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  function startFrom(w: WorkoutTemplate | CustomWorkout) {
    const t = KIND_TO_TYPE[w.kind];
    setDraft({ ...blankDraft(t), name: w.name, duration: String('minutes' in w ? w.minutes : 45), exercises: w.exercises });
    setViewing(null);
    document.getElementById('log-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function log(e: FormEvent) {
    e.preventDefault();
    const minutes = Number(draft.duration);
    if (!minutes || minutes <= 0) return toast.show('Add how many minutes you worked out.');
    const row = await data.insert<Activity>('activities', {
      date: draft.date,
      type: draft.type,
      name: draft.name.trim() || type.label,
      duration_min: minutes,
      distance_km: type.hasDistance && draft.distance ? Number(draft.distance) : null,
      calories: draft.calories ? Number(draft.calories) : autoCalories,
      notes: draft.notes,
      exercises: draft.exercises,
      shared: draft.shared && !isGuest,
    });
    recent.setRows((r) => [...r, row]);
    setDraft(blankDraft(draft.type));
    toast.show(`Logged ${row.name}. Nice work!`);
  }

  async function remove(a: Activity) {
    recent.setRows((r) => r.filter((x) => x.id !== a.id));
    await data.remove('activities', a.id);
  }

  async function saveCustom(e: FormEvent) {
    e.preventDefault();
    if (!building) return;
    const exercises = building.exercises.filter((x) => x.name.trim());
    if (!building.name.trim() || !exercises.length) return toast.show('Give it a name and at least one exercise.');
    const row = await data.insert<CustomWorkout>('custom_workouts', { name: building.name.trim(), kind: building.kind, exercises });
    custom.setRows((r) => [...r, row]);
    setBuilding(null);
    toast.show('Workout saved');
  }

  const templates = WORKOUT_TEMPLATES.filter((t) => level === 'all' || t.level === level);
  const history = [...recent.rows].sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at));

  return (
    <div className="page stack accent-workout">
      <header className="page-header">
        <div>
          <p className="muted small"><span className="pill-workout">Workouts</span></p>
          <h1>Move your way</h1>
        </div>
      </header>

      <section className="card row stats-row" aria-label="This week">
        <Stat value={weekSummary.sessions} label="sessions this week" />
        <Stat value={fmt(weekSummary.minutes)} label={`of ${profile?.goal_active_minutes ?? 150} active min`} />
        <Stat value={fmt(weekSummary.distance, 1)} label="km covered" />
        <Stat value={fmt(weekSummary.calories)} label="kcal burned (est.)" />
      </section>

      <div className="grid-2">
        <form id="log-form" className="card stack" onSubmit={log} aria-labelledby="log-title">
          <h2 id="log-title" className="card-title">Log an activity</h2>
          <div className="row" style={{ gap: 6 }} role="group" aria-label="Activity type">
            {ACTIVITY_TYPES.map((t) => (
              <button type="button" key={t.id} className={`chip${draft.type === t.id ? ' active' : ''}`} aria-pressed={draft.type === t.id} onClick={() => set({ type: t.id, name: draft.exercises.length ? draft.name : t.label })}>
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid-2 tight">
            <div className="field">
              <label className="label" htmlFor="w-name">Name</label>
              <input id="w-name" className="input" value={draft.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="w-date">Date</label>
              <input id="w-date" className="input" type="date" value={draft.date} onChange={(e) => set({ date: e.target.value })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="w-dur">Minutes</label>
              <input id="w-dur" className="input" type="number" min="1" inputMode="numeric" value={draft.duration} onChange={(e) => set({ duration: e.target.value })} />
            </div>
            {type.hasDistance && (
              <div className="field">
                <label className="label" htmlFor="w-dist">Distance (km)</label>
                <input id="w-dist" className="input" type="number" min="0" step="0.01" inputMode="decimal" value={draft.distance} onChange={(e) => set({ distance: e.target.value })} />
              </div>
            )}
            <div className="field">
              <label className="label" htmlFor="w-cal">Calories</label>
              <input id="w-cal" className="input" type="number" min="0" inputMode="numeric" placeholder={`${autoCalories} (estimated)`} value={draft.calories} onChange={(e) => set({ calories: e.target.value })} />
            </div>
          </div>
          {draft.exercises.length > 0 && (
            <div className="stack" style={{ gap: 4 }}>
              <span className="label">Exercises</span>
              <ul className="list small">
                {draft.exercises.map((x, i) => <li key={i} className="list-item">{exerciseLine(x)}</li>)}
              </ul>
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="w-notes">Notes</label>
            <textarea id="w-notes" className="textarea" rows={2} placeholder="How did it feel?" value={draft.notes} onChange={(e) => set({ notes: e.target.value })} />
          </div>
          {isGuest ? (
            <p className="small muted">
              <Link to="/signup">Create an account</Link> to share workouts with friends and keep your history on every device.
            </p>
          ) : (
            <label className="row small" style={{ alignItems: 'center' }}>
              <input type="checkbox" className="checkbox" checked={draft.shared} onChange={(e) => set({ shared: e.target.checked })} />
              Share with my followers
            </label>
          )}
          <p className="small muted">Calories are estimated from activity type, time and your weight{profile?.weight_kg ? '' : ' (add it in Profile for better estimates)'}.</p>
          <button className="btn btn-primary">Log activity</button>
        </form>

        <section className="card stack" aria-labelledby="mine-title">
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="mine-title" className="card-title" style={{ margin: 0 }}>My workouts</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setBuilding({ name: '', kind: 'strength', exercises: [{ name: '', sets: 3, reps: '10' }] })}>
              + Build a workout
            </button>
          </div>
          {custom.rows.length === 0 ? (
            <Empty title="Make it yours">Build a routine once, then log it in one tap.</Empty>
          ) : (
            <ul className="list">
              {custom.rows.map((w) => (
                <li key={w.id} className="list-item">
                  <button className="link-btn" onClick={() => setViewing(w)}>{w.name}</button>
                  <span className="small muted">{w.exercises.length} exercises</span>
                  <button className="btn btn-sm btn-primary" onClick={() => startFrom(w)}>Log</button>
                </li>
              ))}
            </ul>
          )}

          <h2 className="card-title">Recent activity</h2>
          {history.length === 0 ? (
            <Empty title="Your first workout is waiting">Log one on the left, even a short walk.</Empty>
          ) : (
            <ul className="list">
              {history.slice(0, 12).map((a) => (
                <li key={a.id} className="list-item">
                  <div className="stack" style={{ gap: 0 }}>
                    <strong>{a.name}</strong>
                    <span className="small muted">
                      {friendlyDate(a.date)} · {a.duration_min} min{a.distance_km ? ` · ${fmt(a.distance_km, 1)} km` : ''} · {fmt(a.calories)} kcal{a.shared || isGuest ? '' : ' · private'}
                    </span>
                  </div>
                  <button className="icon-btn" aria-label={`Delete ${a.name}`} onClick={() => remove(a)}>×</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="stack" aria-labelledby="lib-title">
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="lib-title" className="card-title" style={{ margin: 0 }}>Workout library</h2>
          <div className="tabs" role="tablist" aria-label="Level">
            {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((l) => (
              <button key={l} role="tab" aria-selected={level === l} className={`tab${level === l ? ' active' : ''}`} onClick={() => setLevel(l)}>
                {l === 'all' ? 'All' : l[0].toUpperCase() + l.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="grid-3">
          {templates.map((t) => (
            <article key={t.id} className="card stack template-card">
              <div className="row" style={{ gap: 6 }}>
                <span className="badge">{t.level}</span>
                <span className="badge">{t.kind}</span>
                <span className="badge">{t.minutes} min</span>
              </div>
              <h3 className="card-title" style={{ margin: 0 }}>{t.name}</h3>
              <p className="small muted">{t.description}</p>
              <div className="row">
                <button className="btn btn-ghost btn-sm" onClick={() => setViewing(t)}>View</button>
                <button className="btn btn-primary btn-sm" onClick={() => startFrom(t)}>Do this workout</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {viewing && (
        <Modal title={viewing.name} onClose={() => setViewing(null)}>
          {'description' in viewing && <p className="muted">{viewing.description}</p>}
          <ol className="list">
            {viewing.exercises.map((x, i) => (
              <li key={i} className="list-item stack" style={{ gap: 0, alignItems: 'flex-start' }}>
                <span>{exerciseLine(x)}</span>
                {x.notes && <span className="small muted">{x.notes}</span>}
              </li>
            ))}
          </ol>
          <div className="row">
            <button className="btn btn-primary" onClick={() => startFrom(viewing)}>Log this workout</button>
            {'user_id' in viewing ? (
              <button
                className="btn btn-danger"
                onClick={async () => {
                  await data.remove('custom_workouts', viewing.id);
                  custom.setRows((r) => r.filter((x) => x.id !== viewing.id));
                  setViewing(null);
                }}
              >
                Delete
              </button>
            ) : (
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setBuilding({ name: `${viewing.name} (mine)`, kind: viewing.kind, exercises: viewing.exercises.map((x) => ({ ...x })) });
                  setViewing(null);
                }}
              >
                Customize
              </button>
            )}
          </div>
        </Modal>
      )}

      {building && (
        <Modal title="Build a workout" onClose={() => setBuilding(null)}>
          <form className="stack" onSubmit={saveCustom}>
            <div className="grid-2 tight">
              <div className="field">
                <label className="label" htmlFor="b-name">Name</label>
                <input id="b-name" className="input" required value={building.name} onChange={(e) => setBuilding({ ...building, name: e.target.value })} placeholder="Tuesday upper body" />
              </div>
              <div className="field">
                <label className="label" htmlFor="b-kind">Type</label>
                <select id="b-kind" className="select" value={building.kind} onChange={(e) => setBuilding({ ...building, kind: e.target.value as WorkoutKind })}>
                  {KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>
            {building.exercises.map((x, i) => {
              const upd = (patch: Partial<Exercise>) =>
                setBuilding({ ...building, exercises: building.exercises.map((y, j) => (j === i ? { ...y, ...patch } : y)) });
              return (
                <div key={i} className="row exercise-row">
                  <input id={`b-ex-${i}`} className="input" aria-label="Exercise" placeholder="Exercise" value={x.name} onChange={(e) => upd({ name: e.target.value })} />
                  <input id={`b-sets-${i}`} className="input" aria-label="Sets" type="number" min="0" placeholder="Sets" value={x.sets ?? ''} onChange={(e) => upd({ sets: e.target.value ? Number(e.target.value) : undefined })} />
                  <input id={`b-reps-${i}`} className="input" aria-label="Reps or time" placeholder="Reps / time" value={x.reps ?? ''} onChange={(e) => upd({ reps: e.target.value })} />
                  <button type="button" className="icon-btn" aria-label="Remove exercise" onClick={() => setBuilding({ ...building, exercises: building.exercises.filter((_, j) => j !== i) })}>×</button>
                </div>
              );
            })}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setBuilding({ ...building, exercises: [...building.exercises, { name: '', sets: 3, reps: '10' }] })}>
              + Add exercise
            </button>
            <button className="btn btn-primary">Save workout</button>
          </form>
        </Modal>
      )}
      <Toast message={toast.message} />
    </div>
  );
}
