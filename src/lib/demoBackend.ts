// Local demo backend: everything lives in this browser's localStorage, so the
// app works on Netlify before Supabase is set up. It seeds a few example
// community members so the Friends tab has something to show.
import type { Activity, Follow, Kudos, Profile } from '../data/types';
import type { Backend, FeedItem, Table } from './backend';
import { addDays, todayISO } from './dates';

const KEY = 'daybloom-demo-v1';

interface DemoDB {
  sessionUserId: string | null;
  accounts: { email: string; userId: string }[];
  profiles: Profile[];
  follows: Follow[];
  kudos: Kudos[];
  rows: Record<Table, Record<string, unknown>[]>;
}

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

const now = () => new Date().toISOString();

function profile(p: Partial<Profile> & Pick<Profile, 'id' | 'username' | 'display_name'>): Profile {
  return {
    bio: '',
    avatar_color: '#1f3a64',
    is_public: true,
    weight_kg: null,
    goal_calories: 2000,
    goal_protein: 100,
    goal_active_minutes: 150,
    goal_water: 8,
    created_at: now(),
    ...p,
  };
}

function seed(): DemoDB {
  const t = todayISO();
  const people = [
    profile({ id: 'demo-maya', username: 'maya.moves', display_name: 'Maya (example)', bio: 'Morning runner, weekend hiker.', avatar_color: '#2e5aa7' }),
    profile({ id: 'demo-jordan', username: 'jordanlifts', display_name: 'Jordan (example)', bio: 'Push, pull, legs, repeat.', avatar_color: '#4d7a62' }),
    profile({ id: 'demo-sam', username: 'sam.cooks', display_name: 'Sam (example)', bio: 'Meal prep Sundays and long walks.', avatar_color: '#7a6248' }),
  ];
  const act = (user_id: string, daysAgo: number, type: string, name: string, duration_min: number, distance_km: number | null, calories: number): Activity => ({
    id: uuid(), user_id, date: addDays(t, -daysAgo), type, name, duration_min, distance_km, calories, notes: '', exercises: [], shared: true, created_at: now(),
  });
  const activities = [
    act('demo-maya', 0, 'run', 'Sunrise 5K', 28, 5, 310),
    act('demo-jordan', 0, 'strength', 'Pull day', 55, null, 280),
    act('demo-sam', 1, 'walk', 'Lunch walk by the river', 40, 3.4, 150),
    act('demo-maya', 2, 'hike', 'Ridge trail', 120, 8.2, 620),
    act('demo-jordan', 3, 'strength', 'Leg day', 60, null, 330),
  ];
  return {
    sessionUserId: null,
    accounts: [],
    profiles: people,
    follows: [
      { id: uuid(), follower_id: 'demo-maya', following_id: 'demo-sam', created_at: now() },
      { id: uuid(), follower_id: 'demo-sam', following_id: 'demo-maya', created_at: now() },
    ],
    kudos: [],
    rows: { tasks: [], activities: activities as unknown as Record<string, unknown>[], meals: [], custom_workouts: [], day_notes: [] },
  };
}

function load(): DemoDB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as DemoDB;
  } catch {
    /* storage blocked: fall through to a fresh in-memory DB */
  }
  return seed();
}

export function createDemoBackend(): Backend {
  let db = load();
  const listeners = new Set<() => void>();

  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch {
      /* storage full or blocked: keep working in memory */
    }
  };
  const notify = () => listeners.forEach((cb) => cb());
  const me = () => {
    if (!db.sessionUserId) throw new Error('You are signed out. Sign in and try again.');
    return db.sessionUserId;
  };

  function startSession(email: string, username?: string) {
    const normalized = email.trim().toLowerCase();
    let account = db.accounts.find((a) => a.email === normalized);
    if (!account) {
      const userId = uuid();
      const base = (username || normalized.split('@')[0] || 'friend').toLowerCase().replace(/[^a-z0-9_.]/g, '');
      db.profiles.push(profile({ id: userId, username: base || 'friend', display_name: username || base || 'Friend' }));
      account = { email: normalized, userId };
      db.accounts.push(account);
      // Follow one example member so the feed isn't empty on day one.
      db.follows.push({ id: uuid(), follower_id: userId, following_id: 'demo-maya', created_at: now() });
      db.follows.push({ id: uuid(), follower_id: 'demo-maya', following_id: userId, created_at: now() });
    }
    db.sessionUserId = account.userId;
    save();
    notify();
  }

  return {
    mode: 'demo',

    async currentProfile() {
      return db.profiles.find((p) => p.id === db.sessionUserId) ?? null;
    },

    onAuthChange(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },

    async signUp(email, _password, username) {
      startSession(email, username);
      return { needsConfirmation: false };
    },

    async signIn(email) {
      startSession(email);
    },

    async signInWithProvider(provider) {
      // No real OAuth in demo mode: create a local account named after the provider.
      startSession(`${provider}-user@demo.local`, `${provider}_friend`);
    },

    async signOut() {
      db.sessionUserId = null;
      save();
      notify();
    },

    async linkedProviders() {
      return ['email'];
    },

    async linkProvider() {
      throw new Error('Connecting social accounts needs Supabase. See SETUP.md to turn it on.');
    },

    async updateProfile(patch) {
      const id = me();
      const i = db.profiles.findIndex((p) => p.id === id);
      db.profiles[i] = { ...db.profiles[i], ...patch, id };
      save();
      return db.profiles[i];
    },

    async list<T>(table: Table, range?: { from: string; to: string }) {
      const id = me();
      return db.rows[table]
        .filter((r) => r.user_id === id && (!range || ((r.date as string) >= range.from && (r.date as string) <= range.to)))
        .sort((a, b) => String(a.date ?? '').localeCompare(String(b.date ?? '')) || String(a.created_at).localeCompare(String(b.created_at))) as T[];
    },

    async insert<T>(table: Table, row: object) {
      const full = { id: uuid(), ...row, user_id: me(), created_at: now() };
      db.rows[table].push(full);
      save();
      return full as T;
    },

    async upsert<T>(table: Table, row: { id: string }) {
      const rows = db.rows[table];
      const i = rows.findIndex((r) => r.id === row.id);
      const full = { created_at: now(), ...(i >= 0 ? rows[i] : {}), ...row, user_id: me() };
      if (i >= 0) rows[i] = full;
      else rows.push(full);
      save();
      return full as T;
    },

    async update(table, id, patch) {
      const rows = db.rows[table];
      const i = rows.findIndex((r) => r.id === id && r.user_id === me());
      if (i >= 0) rows[i] = { ...rows[i], ...(patch as object) };
      save();
    },

    async remove(table, id) {
      const uid = me();
      db.rows[table] = db.rows[table].filter((r) => !(r.id === id && r.user_id === uid));
      save();
    },

    async searchProfiles(query) {
      const id = me();
      const q = query.trim().toLowerCase();
      return db.profiles.filter(
        (p) => p.id !== id && p.is_public && (!q || p.username.toLowerCase().includes(q) || p.display_name.toLowerCase().includes(q)),
      );
    },

    async getProfiles(ids) {
      return db.profiles.filter((p) => ids.includes(p.id));
    },

    async follows() {
      const id = me();
      return {
        following: db.follows.filter((f) => f.follower_id === id).map((f) => f.following_id),
        followers: db.follows.filter((f) => f.following_id === id).map((f) => f.follower_id),
      };
    },

    async follow(userId) {
      const id = me();
      if (!db.follows.some((f) => f.follower_id === id && f.following_id === userId)) {
        db.follows.push({ id: uuid(), follower_id: id, following_id: userId, created_at: now() });
        save();
      }
    },

    async unfollow(userId) {
      const id = me();
      db.follows = db.follows.filter((f) => !(f.follower_id === id && f.following_id === userId));
      save();
    },

    async feed() {
      const id = me();
      const following = new Set([id, ...db.follows.filter((f) => f.follower_id === id).map((f) => f.following_id)]);
      const acts = (db.rows.activities as unknown as Activity[])
        .filter((a) => a.shared && following.has(a.user_id))
        .sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at))
        .slice(0, 50);
      return acts.flatMap<FeedItem>((a) => {
        const p = db.profiles.find((x) => x.id === a.user_id);
        if (!p) return [];
        const k = db.kudos.filter((x) => x.activity_id === a.id);
        return [{ ...a, profile: p, kudos: k.length, kudoed: k.some((x) => x.user_id === id) }];
      });
    },

    async toggleKudos(activityId) {
      const id = me();
      const existing = db.kudos.find((k) => k.activity_id === activityId && k.user_id === id);
      db.kudos = existing
        ? db.kudos.filter((k) => k !== existing)
        : [...db.kudos, { id: uuid(), user_id: id, activity_id: activityId, created_at: now() }];
      save();
    },
  };
}
