import { Link } from 'react-router-dom';

/** Shown to guests on pages that need an account (friends, profile). */
export default function AccountPrompt({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="page stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>{title}</h1>
        </div>
      </header>
      <section className="card stack account-prompt">
        <p>{children}</p>
        <ul className="stack-sm small">
          <li>Everything you've logged as a guest moves into your account.</li>
          <li>Your planner and food diary stay private. You choose which workouts to share.</li>
        </ul>
        <div className="row">
          <Link to="/signup" className="btn btn-primary">Create an account</Link>
          <Link to="/login" className="btn btn-ghost">I have an account</Link>
        </div>
      </section>
    </div>
  );
}
