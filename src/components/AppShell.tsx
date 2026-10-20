import { Link, NavLink, Outlet } from 'react-router-dom';
import { backend } from '../lib/backend';
import { useTheme } from '../lib/hooks';
import { useAuth } from '../lib/auth';
import BloomMark from './BloomMark';
import Icon from './Icon';
import { Avatar } from './ui';

const NAV = [
  { to: '/app', label: 'Today', icon: 'today', end: true, section: 'planner' },
  { to: '/app/workouts', label: 'Workouts', icon: 'workouts', section: 'workout' },
  { to: '/app/food', label: 'Food', icon: 'food', section: 'food' },
  { to: '/app/progress', label: 'Progress', icon: 'progress' },
  { to: '/app/friends', label: 'Friends', icon: 'friends' },
  { to: '/app/profile', label: 'Profile', icon: 'profile' },
];

export default function AppShell() {
  const { theme, toggle } = useTheme();
  const { profile, isGuest, loading, imported } = useAuth();
  const links = NAV.map((n) => (
    <NavLink key={n.to} to={n.to} end={n.end} data-section={n.section} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
      <span className="nav-icon"><Icon name={n.icon} /></span>
      <span>{n.label}</span>
    </NavLink>
  ));
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <aside className="sidebar">
        <NavLink to="/" className="brand">
          <BloomMark />
          Daybloom
        </NavLink>
        <nav className="stack-sm" aria-label="Main">{links}</nav>
        <div className="sidebar-footer">
          {backend.mode === 'demo' && <span className="badge badge-soft" title="Data is saved in this browser only">Demo mode</span>}
          <button className="btn btn-ghost btn-sm theme-toggle" onClick={toggle}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {isGuest && !loading && (
            <Link to="/signup" className="btn btn-primary btn-sm">Save my progress</Link>
          )}
          {profile && (
            <NavLink to="/app/profile" className="row-sm sidebar-user">
              <Avatar profile={profile} />
              <span className="small">@{profile.username}</span>
            </NavLink>
          )}
        </div>
      </aside>
      <main id="main" className="app-main">
        {isGuest && !loading && (
          <div className="guest-bar" role="note">
            <span>You're using Daybloom as a guest. Your entries are saved in this browser.</span>
            <Link to="/signup" className="btn btn-sm btn-primary">Create an account</Link>
          </div>
        )}
        {imported > 0 && (
          <div className="guest-bar" role="status">
            <span>Welcome! We moved {imported} guest entr{imported === 1 ? 'y' : 'ies'} into your account.</span>
          </div>
        )}
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">{links}</nav>
    </div>
  );
}
