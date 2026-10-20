import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { backend, type OAuthProvider } from '../lib/backend';
import { useAuth } from '../lib/auth';
import BloomMark from '../components/BloomMark';

const PROVIDERS: { id: OAuthProvider; label: string }[] = [
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'X (Twitter)' },
  { id: 'apple', label: 'Apple' },
];

export default function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const isSignup = mode === 'signup';
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (isSignup) {
        const { needsConfirmation } = await backend.signUp(email, password, username);
        if (needsConfirmation) {
          setInfo('Check your email for a confirmation link, then sign in.');
          return;
        }
      } else {
        await backend.signIn(email, password);
      }
      await refresh();
      nav('/app');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function oauth(p: OAuthProvider) {
    setError(null);
    try {
      await backend.signInWithProvider(p);
      if (backend.mode === 'demo') {
        await refresh();
        nav('/app');
      }
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card stack">
        <Link to="/" className="brand">
          <BloomMark />
          Daybloom
        </Link>
        <div>
          <h1>{isSignup ? 'Start your first bloom' : 'Welcome back'}</h1>
          <p className="muted">{isSignup ? 'Save your data on every device and share with friends. Anything you logged as a guest comes with you.' : 'Pick up where you left off.'}</p>
        </div>

        {backend.mode === 'demo' && (
          <div className="badge demo-note">
            Demo mode: any email works and your data stays in this browser. Add Supabase keys to turn on real accounts.
          </div>
        )}

        <div className="stack" style={{ gap: 8 }}>
          {PROVIDERS.map((p) => (
            <button key={p.id} type="button" className="btn btn-ghost provider-btn" onClick={() => oauth(p.id)}>
              Continue with {p.label}
            </button>
          ))}
        </div>

        <div className="divider small muted">or use email</div>

        <form className="stack" onSubmit={submit}>
          {isSignup && (
            <div className="field">
              <label className="label" htmlFor="username">Username</label>
              <input id="username" className="input" required minLength={3} maxLength={24} pattern="[A-Za-z0-9_.]+" title="Letters, numbers, dots and underscores" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
            </div>
          )}
          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          </div>
          <div className="field">
            <label className="label" htmlFor="password">Password</label>
            <input id="password" className="input" type="password" required minLength={backend.mode === 'demo' ? 1 : 8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignup ? 'new-password' : 'current-password'} />
          </div>
          {error && <div className="error-text" role="alert">{error}</div>}
          {info && <div className="badge" role="status">{info}</div>}
          <button className="btn btn-primary" disabled={busy}>
            {busy ? 'One moment…' : isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="small muted">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Sign in</Link> · <Link to="/app">Not now, continue as a guest</Link></>
          ) : (
            <>New here? <Link to="/signup">Create an account</Link> or <Link to="/app">keep going as a guest</Link></>
          )}
        </p>
      </div>
    </div>
  );
}
