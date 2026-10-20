import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Activity, Kudos, Profile } from '../data/types';
import type { Backend, FeedItem, OAuthProvider, Table } from './backend';

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export function createSupabaseBackend(url: string, key: string): Backend {
  const sb: SupabaseClient = createClient(url, key);
  const redirectTo = `${window.location.origin}/app`;

  async function uid(): Promise<string> {
    const { data } = await sb.auth.getUser();
    if (!data.user) throw new Error('You are signed out. Sign in and try again.');
    return data.user.id;
  }

  return {
    mode: 'supabase',

    async currentProfile() {
      const { data } = await sb.auth.getSession();
      const user = data.session?.user;
      if (!user) return null;
      const res = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (res.data) return res.data as Profile;
      // The database trigger normally creates the profile; create it here if it hasn't yet.
      const base = (user.user_metadata?.username || user.email?.split('@')[0] || 'friend') as string;
      const clean = base.toLowerCase().replace(/[^a-z0-9_.]/g, '').slice(0, 20) || 'friend';
      const username = `${clean}${Math.floor(Math.random() * 900 + 100)}`;
      return check(
        await sb
          .from('profiles')
          .insert({ id: user.id, username, display_name: user.user_metadata?.full_name || base })
          .select()
          .single(),
      ) as Profile;
    },

    onAuthChange(cb) {
      const { data } = sb.auth.onAuthStateChange(() => cb());
      return () => data.subscription.unsubscribe();
    },

    async signUp(email, password, username) {
      const res = await sb.auth.signUp({
        email,
        password,
        options: { data: { username }, emailRedirectTo: redirectTo },
      });
      if (res.error) throw new Error(res.error.message);
      return { needsConfirmation: !res.data.session };
    },

    async signIn(email, password) {
      const res = await sb.auth.signInWithPassword({ email, password });
      if (res.error) throw new Error(res.error.message);
    },

    async signInWithProvider(provider: OAuthProvider) {
      const res = await sb.auth.signInWithOAuth({ provider, options: { redirectTo } });
      if (res.error) throw new Error(res.error.message);
    },

    async signOut() {
      await sb.auth.signOut();
    },

    async linkedProviders() {
      const res = await sb.auth.getUserIdentities();
      if (res.error) return [];
      return res.data.identities.map((i) => i.provider);
    },

    async linkProvider(provider) {
      const res = await sb.auth.linkIdentity({ provider, options: { redirectTo: `${window.location.origin}/app/profile` } });
      if (res.error) throw new Error(res.error.message);
    },

    async updateProfile(patch) {
      const id = await uid();
      const { id: _ignore, created_at: _c, ...rest } = patch;
      return check(await sb.from('profiles').update(rest).eq('id', id).select().single()) as Profile;
    },

    async list<T>(table: Table, range?: { from: string; to: string }) {
      const id = await uid();
      let q = sb.from(table).select('*').eq('user_id', id);
      if (range) q = q.gte('date', range.from).lte('date', range.to);
      q = table === 'custom_workouts' ? q.order('created_at') : q.order('date').order('created_at');
      return check(await q) as T[];
    },

    async insert<T>(table: Table, row: object) {
      const id = await uid();
      return check(await sb.from(table).insert({ ...row, user_id: id }).select().single()) as T;
    },

    async upsert<T>(table: Table, row: object) {
      const id = await uid();
      return check(await sb.from(table).upsert({ ...row, user_id: id }).select().single()) as T;
    },

    async update(table, id, patch) {
      check(await sb.from(table).update(patch as object).eq('id', id));
    },

    async remove(table, id) {
      check(await sb.from(table).delete().eq('id', id));
    },

    async searchProfiles(query) {
      const me = await uid();
      const term = query.trim().replace(/[%_,()]/g, '');
      let q = sb.from('profiles').select('*').neq('id', me).eq('is_public', true).limit(20);
      if (term) q = q.or(`username.ilike.%${term}%,display_name.ilike.%${term}%`);
      return check(await q) as Profile[];
    },

    async getProfiles(ids) {
      if (!ids.length) return [];
      return check(await sb.from('profiles').select('*').in('id', ids)) as Profile[];
    },

    async follows() {
      const me = await uid();
      const rows = check(
        await sb.from('follows').select('follower_id, following_id').or(`follower_id.eq.${me},following_id.eq.${me}`),
      ) as { follower_id: string; following_id: string }[];
      return {
        following: rows.filter((r) => r.follower_id === me).map((r) => r.following_id),
        followers: rows.filter((r) => r.following_id === me).map((r) => r.follower_id),
      };
    },

    async follow(userId) {
      const me = await uid();
      check(await sb.from('follows').upsert({ follower_id: me, following_id: userId }, { onConflict: 'follower_id,following_id' }));
    },

    async unfollow(userId) {
      const me = await uid();
      check(await sb.from('follows').delete().eq('follower_id', me).eq('following_id', userId));
    },

    async feed() {
      const me = await uid();
      const { following } = await this.follows();
      const ids = [me, ...following];
      const acts = check(
        await sb
          .from('activities')
          .select('*')
          .in('user_id', ids)
          .eq('shared', true)
          .order('date', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(50),
      ) as Activity[];
      if (!acts.length) return [];
      const [profiles, kudos] = await Promise.all([
        this.getProfiles([...new Set(acts.map((a) => a.user_id))]),
        sb.from('kudos').select('*').in('activity_id', acts.map((a) => a.id)).then(check) as Promise<Kudos[]>,
      ]);
      const byId = new Map(profiles.map((p) => [p.id, p]));
      return acts
        .filter((a) => byId.has(a.user_id))
        .map<FeedItem>((a) => {
          const k = kudos.filter((x) => x.activity_id === a.id);
          return { ...a, profile: byId.get(a.user_id)!, kudos: k.length, kudoed: k.some((x) => x.user_id === me) };
        });
    },

    async toggleKudos(activityId) {
      const me = await uid();
      const existing = check(
        await sb.from('kudos').select('id').eq('activity_id', activityId).eq('user_id', me).maybeSingle(),
      ) as { id: string } | null;
      if (existing) check(await sb.from('kudos').delete().eq('id', existing.id));
      else check(await sb.from('kudos').insert({ activity_id: activityId, user_id: me }));
    },
  };
}
