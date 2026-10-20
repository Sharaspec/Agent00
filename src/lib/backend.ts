// One interface for all data access. Uses Supabase when VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY are set; otherwise falls back to a local demo backend
// that keeps everything in this browser's localStorage.
import type { Activity, Profile } from '../data/types';
import { createSupabaseBackend } from './supabaseBackend';
import { createDemoBackend } from './demoBackend';

export type Table = 'tasks' | 'activities' | 'meals' | 'custom_workouts' | 'day_notes';

export type OAuthProvider = 'google' | 'facebook' | 'twitter' | 'apple' | 'discord';

export interface DateRange {
  from: string; // inclusive YYYY-MM-DD
  to: string; // inclusive YYYY-MM-DD
}

export interface FeedItem extends Activity {
  profile: Profile;
  kudos: number;
  kudoed: boolean;
}

export interface FollowState {
  following: string[];
  followers: string[];
}

type NewRow<T> = Omit<T, 'id' | 'user_id' | 'created_at'> & { id?: string };

export interface Backend {
  mode: 'supabase' | 'demo';

  // Auth
  currentProfile(): Promise<Profile | null>;
  onAuthChange(cb: () => void): () => void;
  signUp(email: string, password: string, username: string): Promise<{ needsConfirmation: boolean }>;
  signIn(email: string, password: string): Promise<void>;
  signInWithProvider(provider: OAuthProvider): Promise<void>;
  signOut(): Promise<void>;
  linkedProviders(): Promise<string[]>;
  linkProvider(provider: OAuthProvider): Promise<void>;
  updateProfile(patch: Partial<Profile>): Promise<Profile>;

  // The signed-in user's own records
  list<T>(table: Table, range?: DateRange): Promise<T[]>;
  insert<T>(table: Table, row: NewRow<T>): Promise<T>;
  upsert<T>(table: Table, row: NewRow<T> & { id: string }): Promise<T>;
  update<T>(table: Table, id: string, patch: Partial<T>): Promise<void>;
  remove(table: Table, id: string): Promise<void>;

  // Social
  searchProfiles(query: string): Promise<Profile[]>;
  getProfiles(ids: string[]): Promise<Profile[]>;
  follows(): Promise<FollowState>;
  follow(userId: string): Promise<void>;
  unfollow(userId: string): Promise<void>;
  feed(): Promise<FeedItem[]>;
  toggleKudos(activityId: string): Promise<void>;
}

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const backend: Backend = url && key ? createSupabaseBackend(url, key) : createDemoBackend();
