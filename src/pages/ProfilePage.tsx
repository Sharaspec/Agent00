import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Toast } from '../components/ui';
import type { Profile } from '../data/types';
import { useAuth } from '../lib/auth';
import { backend, type OAuthProvider } from '../lib/backend';
import { useTheme, useToast } from '../lib/hooks';
import Icon from '../components/Icon';

const COLORS = ['#1f3a64', '#2e5aa7', '#3c5a73', '#4a6b8a', '#2d6670', '#4d7a62', '#5a5f73', '#7a6248'];

const CONNECTIONS: { id: OAuthProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'apple', label: 'Apple' },
];

export default function ProfilePage() {
  const { profile, setProfile } = useAuth();
  const { theme, toggle } = useTheme();
  const nav = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<Profile | null>(profile);
  const [linked, setLinked] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => setForm(profile), [profile]);
  useEffect(() => {
    backend.linkedProviders().then(setLinked).catch(() => setLinked([]));
  }, []);

  if (!form) return null;
  const set = (patch: Partial<Profile>) => setForm({ ...form, ...patch });
  const num = (v: string) => (v === '' ? 0 : Number(v));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const updated = await backend.updateProfile({
        username: form.username.trim().toLowerCase(),
        display_name: form.display_name.trim(),
        bio: form.bio,
        avatar_color: form.avatar_color,
        is_public: form.is_public,
        weight_kg: form.weight_kg,
        goal_calories: form.goal_calories,
        goal_protein: form.goal_protein,
        goal_active_minutes: form.goal_active_minutes,
        goal_water: form.goal_water,
      });
      setProfile(updated);
      toast.show('Profile saved');
    } catch (err) {
      toast.show((err as Error).message.includes('duplicate') ? 'That username is taken. Try another.' : (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function connect(p: OAuthProvider) {
    try {
      await backend.linkProvider(p);
    } catch (err) {
      toast.show((err as Error).message);
    }
  }

  return (
    <div className="page stack">
      <header className="page-header">
        <div className="row" style={{ alignItems: 'center' }}>
          <Avatar profile={form} large />
          <div>
            <p className="eyebrow">Profile</p>
            <h1>{form.display_name || 'You'}</h1>
            <p className="muted small">@{form.username}</p>
          </div>
        </div>
      </header>

      <form className="grid-2" onSubmit={save}>
        <section className="card stack" aria-labelledby="about-title">
          <h2 id="about-title" className="card-title">About you</h2>
          <div className="field">
            <label className="label" htmlFor="p-name">Display name</label>
            <input id="p-name" className="input" required maxLength={40} value={form.display_name} onChange={(e) => set({ display_name: e.target.value })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="p-user">Username</label>
            <input id="p-user" className="input" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_.]+" value={form.username} onChange={(e) => set({ username: e.target.value })} />
          </div>
          <div className="field">
            <label className="label" htmlFor="p-bio">Bio</label>
            <textarea id="p-bio" className="textarea" rows={2} maxLength={160} value={form.bio} onChange={(e) => set({ bio: e.target.value })} placeholder="Morning walker, Sunday meal-prepper…" />
          </div>
          <div className="field">
            <span className="label">Avatar color</span>
            <div className="row-sm">
              {COLORS.map((c) => (
                <button key={c} type="button" className={`swatch${form.avatar_color === c ? ' active' : ''}`} style={{ background: c }} aria-label={`Color ${c}`} aria-pressed={form.avatar_color === c} onClick={() => set({ avatar_color: c })} />
              ))}
            </div>
          </div>
          <label className="check-row small">
            <input type="checkbox" className="checkbox" checked={form.is_public} onChange={(e) => set({ is_public: e.target.checked })} />
            Let people find me in search
          </label>
        </section>

        <section className="card stack" aria-labelledby="goals-title">
          <h2 id="goals-title" className="card-title">Goals</h2>
          <p className="small muted">Defaults follow WHO guidance: 150 active minutes a week and strength work twice a week.</p>
          <div className="grid-2 tight">
            <div className="field">
              <label className="label" htmlFor="g-cal">Calories / day</label>
              <input id="g-cal" className="input" type="number" min="800" max="6000" value={form.goal_calories} onChange={(e) => set({ goal_calories: num(e.target.value) })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="g-pro">Protein g / day</label>
              <input id="g-pro" className="input" type="number" min="0" max="400" value={form.goal_protein} onChange={(e) => set({ goal_protein: num(e.target.value) })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="g-min">Active min / week</label>
              <input id="g-min" className="input" type="number" min="0" max="3000" value={form.goal_active_minutes} onChange={(e) => set({ goal_active_minutes: num(e.target.value) })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="g-water">Water glasses / day</label>
              <input id="g-water" className="input" type="number" min="0" max="30" value={form.goal_water} onChange={(e) => set({ goal_water: num(e.target.value) })} />
            </div>
            <div className="field">
              <label className="label" htmlFor="g-kg">Weight (kg)</label>
              <input id="g-kg" className="input" type="number" min="20" max="400" step="0.1" value={form.weight_kg ?? ''} onChange={(e) => set({ weight_kg: e.target.value ? Number(e.target.value) : null })} />
              <span className="hint">Used only to estimate workout calories.</span>
            </div>
          </div>
          <button className="btn btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save profile'}</button>
        </section>
      </form>

      <div className="grid-2">
        <section className="card stack" aria-labelledby="conn-title">
          <h2 id="conn-title" className="card-title">Connected accounts</h2>
          <p className="small muted">Connect accounts to sign in with them. Instagram doesn't offer sign-in for personal accounts, so share to it from the Friends tab instead.</p>
          <ul className="list">
            {CONNECTIONS.map((c) => {
              const on = linked.includes(c.id);
              return (
                <li key={c.id} className="list-item">
                  <span className="list-item-title">{c.label}</span>
                  {on ? <span className="badge badge-success">Connected</span> : <button className="btn btn-ghost btn-sm" onClick={() => connect(c.id)}>Connect</button>}
                </li>
              );
            })}
          </ul>
          {backend.mode === 'demo' && <p className="small muted">You're in demo mode. Connecting accounts needs Supabase; see SETUP.md.</p>}
        </section>

        <section className="card stack" aria-labelledby="settings-title">
          <h2 id="settings-title" className="card-title">Settings</h2>
          <div className="row-between">
            <span>Appearance</span>
            <button className="btn btn-ghost btn-sm" onClick={toggle}><Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
              {theme === 'dark' ? 'Switch to light' : 'Switch to dark'}</button>
          </div>
          <div className="row-between">
            <span>Storage</span>
            <span className="small muted">{backend.mode === 'demo' ? 'This browser only (demo)' : 'Synced to your account'}</span>
          </div>
          <button
            className="btn btn-danger"
            onClick={async () => {
              await backend.signOut();
              nav('/');
            }}
          >
            Sign out
          </button>
        </section>
      </div>
      <Toast message={toast.message} />
    </div>
  );
}
