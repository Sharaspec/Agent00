import { useCallback, useEffect, useRef, useState } from 'react';
import { type DateRange, type Table } from './backend';
import { useAuth } from './auth';
import { data } from './data';

/** Loads the signed-in user's rows from a table and reloads on demand. */
export function useRows<T>(table: Table, range?: DateRange) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const from = range?.from;
  const to = range?.to;
  const req = useRef(0);
  const { profile, loading: authLoading } = useAuth();
  const owner = profile?.id ?? 'guest';

  const reload = useCallback(async () => {
    if (authLoading) return;
    const id = ++req.current;
    try {
      const result = await data.list<T>(table, from && to ? { from, to } : undefined);
      if (id === req.current) {
        setRows(result);
        setError(null);
      }
    } catch (e) {
      if (id === req.current) setError((e as Error).message);
    } finally {
      if (id === req.current) setLoading(false);
    }
    // owner: reload when someone signs in or out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, from, to, owner, authLoading]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { rows, setRows, loading, error, reload };
}

export function useTheme() {
  const read = () => {
    const attr = document.documentElement.dataset.theme;
    if (attr === 'light' || attr === 'dark') return attr;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const [theme, setThemeState] = useState<'light' | 'dark'>(read);
  const setTheme = (t: 'light' | 'dark') => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem('daybloom-theme', t);
    } catch {
      /* ignore */
    }
    setThemeState(t);
  };
  return { theme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') };
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number>();
  const show = useCallback((m: string) => {
    setMessage(m);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), 2600);
  }, []);
  return { message, show };
}
