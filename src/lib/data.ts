// Personal records (tasks, workouts, meals, notes) go through here.
// Signed in: the real backend. Signed out: a guest store in this browser's
// localStorage, so anyone can use the planner, workouts and food log without
// an account. Creating an account moves guest data into it.
import type { Profile } from '../data/types';
import { backend, type DateRange, type Table } from './backend';

const KEY = 'daybloom-guest-v1';
export const GUEST_ID = 'guest';

type Rows = Record<Table, Record<string, unknown>[]>;
const emptyRows = (): Rows => ({ tasks: [], activities: [], meals: [], custom_workouts: [], day_notes: [] });

let memory: Rows | null = null;

function load(): Rows {
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(KEY);
    memory = raw ? { ...emptyRows(), ...(JSON.parse(raw) as Partial<Rows>) } : emptyRows();
  } catch {
    memory = emptyRows();
  }
  return memory;
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(load()));
  } catch {
    /* storage blocked or full: keep working in memory */
  }
}

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const guest = {
  async list<T>(table: Table, range?: DateRange) {
    return load()
      [table].filter((r) => !range || ((r.date as string) >= range.from && (r.date as string) <= range.to))
      .sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) || String(a.created_at).localeCompare(String(b.created_at))) as T[];
  },
  async insert<T>(table: Table, row: object) {
    const full = { id: uuid(), ...row, user_id: GUEST_ID, created_at: new Date().toISOString() };
    load()[table].push(full);
    save();
    return full as T;
  },
  async upsert<T>(table: Table, row: { id: string }) {
    const rows = load()[table];
    const i = rows.findIndex((r) => r.id === row.id);
    const full = { created_at: new Date().toISOString(), ...(i >= 0 ? rows[i] : {}), ...row, user_id: GUEST_ID };
    if (i >= 0) rows[i] = full;
    else rows.push(full);
    save();
    return full as T;
  },
  async update<T>(table: Table, id: string, patch: Partial<T>) {
    const rows = load()[table];
    const i = rows.findIndex((r) => r.id === id);
    if (i >= 0) rows[i] = { ...rows[i], ...(patch as object) };
    save();
  },
  async remove(table: Table, id: string) {
    const db = load();
    db[table] = db[table].filter((r) => r.id !== id);
    save();
  },
};

let signedIn = false;
export const setSignedIn = (v: boolean) => {
  signedIn = v;
};

export const data = {
  list: <T>(table: Table, range?: DateRange) => (signedIn ? backend.list<T>(table, range) : guest.list<T>(table, range)),
  insert: <T>(table: Table, row: object) => (signedIn ? backend.insert<T>(table, row as never) : guest.insert<T>(table, row)),
  upsert: <T>(table: Table, row: { id: string } & object) => (signedIn ? backend.upsert<T>(table, row as never) : guest.upsert<T>(table, row)),
  update: <T>(table: Table, id: string, patch: Partial<T>) => (signedIn ? backend.update<T>(table, id, patch) : guest.update<T>(table, id, patch)),
  remove: (table: Table, id: string) => (signedIn ? backend.remove(table, id) : guest.remove(table, id)),
};

export function guestRowCount(): number {
  const db = load();
  return Object.values(db).reduce((n, rows) => n + rows.length, 0);
}

let migrating: Promise<number> | null = null;

/** Copies everything logged as a guest into the signed-in account, then clears the guest store. */
export function migrateGuestData(profile: Profile): Promise<number> {
  if (migrating) return migrating;
  migrating = (async () => {
    const db = load();
    const total = guestRowCount();
    if (!total) return 0;
    const strip = (r: Record<string, unknown>) => {
      const { id: _id, user_id: _u, created_at: _c, ...rest } = r;
      return rest;
    };
    for (const table of ['tasks', 'activities', 'meals', 'custom_workouts'] as Table[]) {
      for (const r of db[table]) await backend.insert(table, strip(r) as never);
    }
    for (const r of db.day_notes) await backend.upsert('day_notes', { ...strip(r), id: `${profile.id}_${r.date}` } as never);
    memory = emptyRows();
    save();
    return total;
  })().finally(() => {
    migrating = null;
  });
  return migrating;
}

/** Defaults used for goals while browsing as a guest. */
export const GUEST_PROFILE: Profile = {
  id: GUEST_ID,
  username: 'guest',
  display_name: 'there',
  bio: '',
  avatar_color: '#2e5aa7',
  is_public: false,
  weight_kg: null,
  goal_calories: 2000,
  goal_protein: 100,
  goal_active_minutes: 150,
  goal_water: 8,
  created_at: '',
};
