import { NavLink, Outlet } from 'react-router-dom';
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
  const { profile } = useAuth();
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
          <button className="btn btn-ghost btn-sm" onClick={toggle}>
            {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
          </button>
          {profile && (
            <NavLink to="/app/profile" className="row-sm sidebar-user">
              <Avatar profile={profile} />
              <span className="small">@{profile.username}</span>
            </NavLink>
          )}
        </div>
      </aside>
      <main id="main" className="app-main">
        <Outlet />
      </main>
      <nav className="tabbar" aria-label="Main">{links}</nav>
    </div>
  );
}
