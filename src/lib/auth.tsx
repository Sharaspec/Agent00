import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Profile } from '../data/types';
import { backend } from './backend';
import { GUEST_PROFILE, migrateGuestData, setSignedIn } from './data';

interface AuthState {
  /** The signed-in person's profile, or null for guests. */
  profile: Profile | null;
  /** The profile to use for goals and display: the real one, or guest defaults. */
  me: Profile;
  isGuest: boolean;
  loading: boolean;
  /** Set after sign-in when guest entries were moved into the new account. */
  imported: number;
  refresh: () => Promise<void>;
  setProfile: (p: Profile) => void;
}

const AuthContext = createContext<AuthState>({
  profile: null,
  me: GUEST_PROFILE,
  isGuest: true,
  loading: true,
  imported: 0,
  refresh: async () => {},
  setProfile: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(0);

  const refresh = useCallback(async () => {
    let p: Profile | null = null;
    try {
      p = await backend.currentProfile();
    } catch {
      p = null;
    }
    setSignedIn(!!p);
    if (p) {
      try {
        const n = await migrateGuestData(p);
        if (n) setImported(n);
      } catch {
        /* keep the guest data for another try on the next sign-in */
      }
    }
    setProfile(p);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    return backend.onAuthChange(() => {
      refresh();
    });
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ profile, me: profile ?? GUEST_PROFILE, isGuest: !profile, loading, imported, refresh, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
