import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AccountPrompt from './components/AccountPrompt';
import AppShell from './components/AppShell';
import { useAuth } from './lib/auth';
import Landing from './pages/Landing';
import AuthPage from './pages/AuthPage';
import Today from './pages/Today';
import Workouts from './pages/Workouts';
import Food from './pages/Food';
import Progress from './pages/Progress';
import Friends from './pages/Friends';
import ProfilePage from './pages/ProfilePage';

function RequireAccount({ children, title, why }: { children: ReactNode; title: string; why: string }) {
  const { profile, loading } = useAuth();
  if (loading) return <div className="page muted">Loading…</div>;
  if (!profile) return <AccountPrompt title={title}>{why}</AccountPrompt>;
  return <>{children}</>;
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  if (!loading && profile) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<PublicOnly><AuthPage mode="login" /></PublicOnly>} />
      <Route path="/signup" element={<PublicOnly><AuthPage mode="signup" /></PublicOnly>} />
      <Route path="/app" element={<AppShell />}>
        <Route index element={<Today />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="food" element={<Food />} />
        <Route path="progress" element={<Progress />} />
        <Route path="friends" element={<RequireAccount title="Bring your people" why="Create an account to follow friends, share workouts and give kudos."><Friends /></RequireAccount>} />
        <Route path="profile" element={<RequireAccount title="Make it yours" why="Create an account to set your goals, save your data across devices and connect your social accounts."><ProfilePage /></RequireAccount>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
