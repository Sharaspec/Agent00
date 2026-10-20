import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import BloomMark from '../components/BloomMark';
import Icon from '../components/Icon';
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

function Check() {
  return <Icon name="check" size={14} strokeWidth={2.5} />;
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
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
          </button>
          <Link to="/app" className="btn btn-ghost lp-try">
            Try it now
          </Link>
          <Link to="/login" className="btn btn-ghost lp-login">
            Log in
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm lp-nav-cta">
            Sign up
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
              <span className="lp-line">Plan your day.</span>
              <span className="lp-line">Move your body.</span>
              <span className="lp-line">
                Feed your <span className="lp-accent">bloom</span>.
              </span>
            </h1>
            <p className="lp-lede">
              Daybloom is the cheerful little notebook for your whole day: to-dos, workouts and meals on
              one page, with friends cheering from the sidelines.
            </p>
            <div className="lp-cta-row">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start blooming
                <Icon name="arrow-right" size={18} />
              </Link>
              <Link to="/login" className="btn btn-lg">
                I have an account
              </Link>
            </div>
            <ul className="lp-trust" aria-label="Highlights">
              <li>No sign-up needed to try</li>
              <li>Light and dark mode</li>
              <li>Made for your phone</li>
            </ul>
          </div>

          <div className="lp-preview" aria-hidden="true">
            <div className="lp-preview-bar">
              <span className="lp-preview-dots"><i /><i /><i /></span>
              <span className="lp-preview-date">Tuesday, 8 October</span>
              <span className="lp-streak">
                <span className="lp-streak-num">7</span>
                <span className="lp-streak-txt">day streak</span>
              </span>
            </div>

            <div className="lp-preview-body">
              {/* Planner panel */}
              <div className="lp-sticker lp-s-planner">
                <div className="lp-s-head">
                  <span className="pill-planner">Today</span>
                  <span className="small muted">2 of 4 done</span>
                </div>
                <ul className="lp-todo">
                  <li className="done">
                    <span className="lp-check"><Check /></span>
                    <span className="lp-todo-time">07:30</span>Morning pages
                  </li>
                  <li className="done">
                    <span className="lp-check"><Check /></span>
                    <span className="lp-todo-time">10:00</span>Ship the slide deck
                  </li>
                  <li>
                    <span className="lp-check" />
                    <span className="lp-todo-time">17:30</span>Call Grandma
                  </li>
                  <li>
                    <span className="lp-check" />
                    <span className="lp-todo-time">19:00</span>Water the basil
                  </li>
                </ul>
              </div>

              <div className="lp-preview-side">
                {/* Workout panel */}
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

                {/* Food panel */}
                <div className="lp-sticker lp-s-food">
                  <div className="lp-s-head">
                    <span className="pill-food">Fuel</span>
                    <span className="small muted nums">1,640 / 2,100 kcal</span>
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
              </div>
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
              Open your planner, log a workout or track a meal right now. Create an account whenever you
              want to save it everywhere and share with friends.
            </p>
          </div>
          <div className="lp-jump-grid">
            <Link to="/app" className="lp-jump-card accent-planner">
              <span className="pill-planner">Planner</span>
              <span className="lp-jump-title">Plan today</span>
              <span className="lp-jump-text">Add tasks with times, check them off, and shuffle the idea generator.</span>
              <span className="lp-jump-go">Open planner <Icon name="arrow-right" size={16} /></span>
            </Link>
            <Link to="/app/workouts" className="lp-jump-card accent-workout">
              <span className="pill-workout">Workouts</span>
              <span className="lp-jump-title">Log a workout</span>
              <span className="lp-jump-text">Walks, runs, rides, lifts and more, or follow a ready-made plan.</span>
              <span className="lp-jump-go">Open workouts <Icon name="arrow-right" size={16} /></span>
            </Link>
            <Link to="/app/food" className="lp-jump-card accent-food">
              <span className="pill-food">Food log</span>
              <span className="lp-jump-title">Track a meal</span>
              <span className="lp-jump-text">Quick-add foods, healthy recipes, calories and macros.</span>
              <span className="lp-jump-go">Open food log <Icon name="arrow-right" size={16} /></span>
            </Link>
          </div>
          <p className="lp-account-note">
            <strong>Want to keep it?</strong> An account saves your data on every device and lets you follow
            friends.
          </p>
        </section>

        {/* ---------- Three sections ---------- */}
        <section className="lp-section" aria-labelledby="three-title">
          <div className="lp-section-head">
            <p className="eyebrow">How it works</p>
            <h2 id="three-title" className="lp-h2">
              Three pages. <span className="lp-soft">One bloom.</span>
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
                <Icon name="shuffle" size={18} />
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
                  <span className="react-btn active"><Icon name="heart" size={16} /> Kudos · 12</span>
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
                  <span className="react-btn"><Icon name="heart" size={16} /> Kudos · 8</span>
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
            <Link to="/signup" className="btn btn-lg lp-final-primary">
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
