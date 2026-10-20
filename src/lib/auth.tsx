import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '../data/types';
import { backend } from './backend';

interface AuthState {
  profile: Profile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setProfile: (p: Profile) => void;
}

const AuthContext = createContext<AuthState>({
  profile: null,
  loading: true,
  refresh: async () => {},
  setProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setProfile(await backend.currentProfile());
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    return backend.onAuthChange(() => {
      refresh();
    });
  }, [refresh]);

  return <AuthContext.Provider value={{ profile, loading, refresh, setProfile }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
