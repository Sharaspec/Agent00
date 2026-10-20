import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

type Theme = 'light' | 'dark';
const THEME_KEY = 'daybloom-theme';

function readTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const RING_STYLE = { '--size': '92px', '--stroke': 11 } as CSSProperties;

const IDEAS = [
  { kind: 'planner', text: 'Block 25 minutes for the thing you keep pushing to tomorrow.' },
  { kind: 'workout', text: 'Try a 3-round ladder: 10 squats, 10 push-ups, 10 lunges.' },
  { kind: 'food', text: 'Eat one new-to-you vegetable today. Bonus points for purple.' },
  { kind: 'planner', text: 'Write tomorrow’s top three before you close the laptop.' },
  { kind: 'workout', text: 'Take the long way home. A 20-minute walk counts.' },
  { kind: 'food', text: 'Prep two lunches tonight and thank yourself on Thursday.' },
] as const;

function BloomMark({ className = 'brand-mark' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2">
        <circle cx="20" cy="9" r="7" fill="var(--c-planner)" />
        <circle cx="30.5" cy="16" r="7" fill="var(--brand)" />
        <circle cx="27" cy="28.5" r="7" fill="var(--c-food)" />
        <circle cx="13" cy="28.5" r="7" fill="var(--c-workout)" />
        <circle cx="9.5" cy="16" r="7" fill="var(--sun)" />
        <circle cx="20" cy="20" r="6" fill="var(--surface)" />
      </g>
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

function Squiggle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 24" fill="none" aria-hidden="true">
      <path d="M2 14c10-12 20 12 30 0s20-12 30 0 20 12 30 0 16-10 26-2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function Landing() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [shuffling, setShuffling] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
    setTheme(next);
  };

  const shuffleIdea = () => {
    if (shuffling) return;
    setShuffling(true);
    window.setTimeout(() => {
      setIdeaIndex((i) => (i + 1 + Math.floor(Math.random() * (IDEAS.length - 1))) % IDEAS.length);
    }, 280);
    window.setTimeout(() => setShuffling(false), 600);
  };

  const idea = IDEAS[ideaIndex];

  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="lp-nav">
        <Link to="/" className="brand" aria-label="Daybloom home">
          <BloomMark />
          <span>Daybloom</span>
        </Link>
        <nav className="lp-nav-actions" aria-label="Account">
          <button
            type="button"
            className="icon-btn outlined"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/app" className="btn btn-ghost lp-try">
            Try it now
          </Link>
          <Link to="/login" className="btn btn-ghost lp-login">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm lp-nav-cta">
            Start free
          </Link>
        </nav>
      </header>

      <main id="main">
        {/* ---------- Hero ---------- */}
        <section className="lp-hero" aria-labelledby="hero-title">
          <div className="lp-hero-copy">
            <p className="lp-eyebrow">
              <span className="pill-planner">Planner</span>
              <span className="pill-workout">Workouts</span>
              <span className="pill-food">Food diary</span>
            </p>
            <h1 id="hero-title" className="lp-title">
              <span className="lp-line">
                Plan your <mark className="hl hl-planner">day</mark>.
              </span>
              <span className="lp-line">
                Move your <mark className="hl hl-workout">body</mark>.
              </span>
              <span className="lp-line">
                Feed your <mark className="hl hl-food">bloom</mark>.
              </span>
            </h1>
            <p className="lp-lede">
              Daybloom is the cheerful little notebook for your whole day: to-dos, workouts and meals on
              one page, with friends cheering from the sidelines.
            </p>
            <div className="lp-cta-row">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start blooming, free
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
              <Link to="/login" className="btn btn-lg">
                I have an account
              </Link>
            </div>
            <ul className="lp-trust" aria-label="Highlights">
              <li>100% free, no trial</li>
              <li>No sign-up needed to try</li>
              <li>Light and dark mode</li>
              <li>Made for your phone</li>
            </ul>
          </div>

          <div className="lp-collage" aria-hidden="true">
            <div className="lp-blob lp-blob-a" />
            <div className="lp-blob lp-blob-b" />
            <Squiggle className="lp-squiggle" />

            {/* Planner sticker */}
            <div className="lp-sticker lp-s-planner">
              <div className="lp-s-head">
                <span className="pill-planner">Today</span>
                <span className="small muted">Tue, 8 Oct</span>
              </div>
              <ul className="lp-todo">
                <li className="done">
                  <span className="lp-check"><Check /></span>Morning pages
                </li>
                <li className="done">
                  <span className="lp-check"><Check /></span>Ship the slide deck
                </li>
                <li>
                  <span className="lp-check" />Call Grandma
                </li>
                <li>
                  <span className="lp-check" />Water the basil
                </li>
              </ul>
            </div>

            {/* Workout sticker */}
            <div className="lp-sticker lp-s-workout">
              <div className="lp-s-head">
                <span className="pill-workout">Leg day</span>
                <span className="small muted">45 min</span>
              </div>
              <div className="lp-ring-row">
                <div className="ring accent-workout" style={RING_STYLE}>
                  <svg viewBox="0 0 120 120">
                    <circle className="ring-track" cx="60" cy="60" r="50" />
                    <circle className="ring-fill" cx="60" cy="60" r="50" strokeDasharray="314.16" strokeDashoffset="88" />
                  </svg>
                  <div className="ring-label">
                    <span className="lp-ring-num">72%</span>
                  </div>
                </div>
                <div className="lp-sets">
                  <span><b>Squat</b> 4 x 8</span>
                  <span><b>RDL</b> 3 x 10</span>
                  <span><b>Lunge</b> 3 x 12</span>
                </div>
              </div>
            </div>

            {/* Food sticker */}
            <div className="lp-sticker lp-s-food">
              <div className="lp-s-head">
                <span className="pill-food">Fuel</span>
                <span className="small muted">1,640 / 2,100 kcal</span>
              </div>
              <div className="lp-macros">
                <div>
                  <span className="lp-macro-label">Protein</span>
                  <div className="progress sm progress-food"><div className="progress-bar" style={{ width: '78%' }} /></div>
                </div>
                <div>
                  <span className="lp-macro-label">Carbs</span>
                  <div className="progress sm progress-workout"><div className="progress-bar" style={{ width: '62%' }} /></div>
                </div>
                <div>
                  <span className="lp-macro-label">Fat</span>
                  <div className="progress sm progress-planner"><div className="progress-bar" style={{ width: '45%' }} /></div>
                </div>
              </div>
            </div>

            {/* Streak badge */}
            <div className="lp-streak">
              <span className="lp-streak-num">7</span>
              <span className="lp-streak-txt">day<br />streak</span>
            </div>
          </div>
        </section>

        {/* ---------- Jump right in (no account needed) ---------- */}
        <section className="lp-section lp-jump" aria-labelledby="jump-title">
          <div className="lp-section-head">
            <p className="eyebrow">No account needed</p>
            <h2 id="jump-title" className="lp-h2">
              Jump right in.
            </h2>
            <p className="muted lp-section-sub">
              Open your planner, log a workout or track a meal right now. Create a free account whenever you
              want to save it everywhere and share with friends.
            </p>
          </div>
          <div className="lp-jump-grid">
            <Link to="/app" className="lp-jump-card accent-planner">
              <span className="pill-planner">Planner</span>
              <span className="lp-jump-title">Plan today</span>
              <span className="lp-jump-text">Add tasks with times, check them off, and shuffle the idea generator.</span>
              <span className="lp-jump-go">Open planner →</span>
            </Link>
            <Link to="/app/workouts" className="lp-jump-card accent-workout">
              <span className="pill-workout">Workouts</span>
              <span className="lp-jump-title">Log a workout</span>
              <span className="lp-jump-text">Walks, runs, rides, lifts and more, or follow a ready-made plan.</span>
              <span className="lp-jump-go">Open workouts →</span>
            </Link>
            <Link to="/app/food" className="lp-jump-card accent-food">
              <span className="pill-food">Food log</span>
              <span className="lp-jump-title">Track a meal</span>
              <span className="lp-jump-text">Quick-add foods, healthy recipes, calories and macros.</span>
              <span className="lp-jump-go">Open food log →</span>
            </Link>
          </div>
          <p className="lp-free-note">
            <strong>Daybloom is completely free.</strong> No trial, no paid plan, no card. A free account lets you
            keep your data on every device and follow friends.
          </p>
        </section>

        {/* ---------- Three sections ---------- */}
        <section className="lp-section" aria-labelledby="three-title">
          <div className="lp-section-head">
            <p className="eyebrow">How it works</p>
            <h2 id="three-title" className="lp-h2">
              Three pages. <span className="lp-underline">One bloom.</span>
            </h2>
            <p className="muted lp-section-sub">
              Everything that makes a good day, in one place, colour-coded so you always know where you are.
            </p>
          </div>

          <div className="lp-features">
            <article className="lp-feature accent-planner">
              <div className="lp-feature-art lp-art-planner" aria-hidden="true">
                <div className="tabs lp-mini-tabs">
                  <span className="tab active">Day</span>
                  <span className="tab">Week</span>
                  <span className="tab">Month</span>
                  <span className="tab">Year</span>
                </div>
                <div className="lp-cal">
                  {Array.from({ length: 14 }).map((_, i) => (
                    <span key={i} className={i === 8 ? 'on' : i % 3 === 0 ? 'dot' : ''} />
                  ))}
                </div>
              </div>
              <h3>Planner</h3>
              <p className="muted">
                Plan today with times and categories, bring over what you didn’t finish, and watch your weeks, months and year fill up.
              </p>
              <span className="pill-planner">Day · Week · Month · Year</span>
            </article>

            <article className="lp-feature accent-workout">
              <div className="lp-feature-art lp-art-workout" aria-hidden="true">
                <div className="lp-bars">
                  {[40, 62, 50, 78, 66, 92, 70].map((h, i) => (
                    <span key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <h3>Workouts</h3>
              <p className="muted">
                Log walks, runs, rides and lifts in seconds, build your own routines, or pick one from a library of beginner to advanced plans.
              </p>
              <span className="pill-workout">Workouts · Routines · Streaks</span>
            </article>

            <article className="lp-feature accent-food">
              <div className="lp-feature-art lp-art-food" aria-hidden="true">
                <div className="lp-plate">
                  <span className="lp-plate-a" />
                  <span className="lp-plate-b" />
                  <span className="lp-plate-c" />
                </div>
              </div>
              <h3>Food diary</h3>
              <p className="muted">
                Add meals from a quick food list or healthy recipes, re-log your usuals in one tap, and keep an eye on calories and macros.
              </p>
              <span className="pill-food">Meals · Macros · Recipes</span>
            </article>
          </div>
        </section>

        {/* ---------- Idea generator ---------- */}
        <section className="lp-section lp-idea-section" aria-labelledby="idea-title">
          <div className="lp-idea-copy">
            <p className="eyebrow">Stuck? Shuffle.</p>
            <h2 id="idea-title" className="lp-h2">
              A fresh idea, <br />
              every single day.
            </h2>
            <p className="muted">
              The daily idea generator serves up tiny plans, workouts and recipes to break a rut. Try it.
            </p>
          </div>
          <div className={`idea-card ${idea.kind}${shuffling ? ' shuffle' : ''}`}>
            <span className="idea-card-label">Idea of the day</span>
            <p className="idea-text" aria-live="polite">
              {idea.text}
            </p>
            <div className="idea-actions">
              <button type="button" className="btn btn-primary" onClick={shuffleIdea}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
                </svg>
                Shuffle
              </button>
              <Link to="/signup" className="btn">
                Add to my day
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Friends ---------- */}
        <section className="lp-section lp-friends" aria-labelledby="friends-title">
          <div className="lp-friends-feed" aria-hidden="true">
            <div className="feed-item lp-feed-1">
              <span className="avatar c2">MA</span>
              <div className="feed-body">
                <div className="feed-head">
                  <span className="feed-name">Maya</span>
                  <span className="feed-meta">finished a workout · 5m</span>
                </div>
                <div className="feed-content">
                  New deadlift PB: <b>90 kg</b>. Legs are jelly.
                </div>
                <div className="feed-actions">
                  <span className="react-btn active">♥ Kudos · 12</span>
                </div>
              </div>
            </div>
            <div className="feed-item lp-feed-2">
              <span className="avatar c3">JO</span>
              <div className="feed-body">
                <div className="feed-head">
                  <span className="feed-name">Jonah</span>
                  <span className="feed-meta">hit a food goal · 1h</span>
                </div>
                <div className="feed-content">Five days of veg with every meal. Who am I?</div>
                <div className="feed-actions">
                  <span className="react-btn">♥ Kudos · 8</span>
                </div>
              </div>
            </div>
            <div className="feed-item lp-feed-3">
              <span className="avatar c1">PR</span>
              <div className="feed-body">
                <div className="feed-head">
                  <span className="feed-name">Priya</span>
                  <span className="feed-meta">30-day planner streak · 3h</span>
                </div>
                <div className="feed-content">One whole month of showing up.</div>
              </div>
            </div>
          </div>
          <div className="lp-friends-copy">
            <p className="eyebrow">Better together</p>
            <h2 id="friends-title" className="lp-h2">
              Bring your people.
            </h2>
            <p className="muted">
              Follow friends, share the wins you want to share, and send kudos when someone shows up. Your planner and food diary
              are only ever yours.
            </p>
            <ul className="lp-ticks">
              <li><span className="lp-check on"><Check /></span>Friend feed of workouts, streaks and goals</li>
              <li><span className="lp-check on"><Check /></span>Kudos on each other’s workouts</li>
              <li><span className="lp-check on"><Check /></span>Your food and plans stay private; you choose which workouts to share</li>
            </ul>
            <div className="avatar-stack lp-stack" aria-hidden="true">
              <span className="avatar c1">AK</span>
              <span className="avatar c2">LT</span>
              <span className="avatar c3">SR</span>
              <span className="avatar c4">+9</span>
            </div>
          </div>
        </section>

        {/* ---------- Final CTA ---------- */}
        <section className="lp-final" aria-labelledby="final-title">
          <BloomMark className="lp-final-mark" />
          <h2 id="final-title" className="lp-final-title">
            Tomorrow is a blank page.
            <br />
            Make it a good one.
          </h2>
          <div className="lp-cta-row lp-cta-center">
            <Link to="/signup" className="btn btn-sun btn-lg">
              Create my Daybloom
            </Link>
            <Link to="/login" className="btn btn-lg lp-final-login">
              Log in
            </Link>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <span className="brand lp-footer-brand">
          <BloomMark />
          Daybloom
        </span>
        <span className="small muted">Plan it, move it, taste it. Made with care.</span>
        <span className="spacer" />
        <nav className="row-sm small" aria-label="Footer">
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </nav>
      </footer>
    </div>
  );
}
