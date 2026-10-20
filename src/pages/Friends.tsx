import { useCallback, useEffect, useState } from 'react';
import ShareButtons from '../components/ShareButtons';
import { Avatar, Empty, Toast } from '../components/ui';
import { activityType } from '../data/activityTypes';
import type { Profile } from '../data/types';
import { useAuth } from '../lib/auth';
import { backend, type FeedItem, type FollowState } from '../lib/backend';
import { friendlyDate } from '../lib/dates';
import { useToast } from '../lib/hooks';
import { fmt } from '../lib/stats';
import Icon from '../components/Icon';

type Tab = 'feed' | 'friends' | 'find';

export default function Friends() {
  const { profile } = useAuth();
  const [tab, setTab] = useState<Tab>('feed');
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [follows, setFollows] = useState<FollowState>({ following: [], followers: [] });
  const [people, setPeople] = useState<Profile[]>([]);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const load = useCallback(async () => {
    try {
      const [f, fs] = await Promise.all([backend.feed(), backend.follows()]);
      setFeed(f);
      setFollows(fs);
      setPeople(await backend.getProfiles([...new Set([...fs.following, ...fs.followers])]));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (tab !== 'find') return;
    const t = window.setTimeout(() => backend.searchProfiles(query).then(setResults).catch((e) => setError(e.message)), 250);
    return () => window.clearTimeout(t);
  }, [query, tab]);

  const isFollowing = (id: string) => follows.following.includes(id);
  const followsMe = (id: string) => follows.followers.includes(id);

  async function toggleFollow(p: Profile) {
    if (isFollowing(p.id)) {
      await backend.unfollow(p.id);
      toast.show(`Unfollowed ${p.display_name}`);
    } else {
      await backend.follow(p.id);
      toast.show(followsMe(p.id) ? `You and ${p.display_name} are now friends` : `Following ${p.display_name}`);
    }
    load();
  }

  async function kudos(item: FeedItem) {
    setFeed((f) => f.map((x) => (x.id === item.id ? { ...x, kudoed: !x.kudoed, kudos: x.kudos + (x.kudoed ? -1 : 1) } : x)));
    await backend.toggleKudos(item.id);
  }

  const friends = people.filter((p) => isFollowing(p.id) && followsMe(p.id));
  const followingOnly = people.filter((p) => isFollowing(p.id) && !followsMe(p.id));
  const followersOnly = people.filter((p) => !isFollowing(p.id) && followsMe(p.id));

  const personRow = (p: Profile) => (
    <li key={p.id} className="list-item">
      <Avatar profile={p} />
      <div className="list-item-body">
        <span className="list-item-title">{p.display_name}</span>
        <span className="list-item-meta">@{p.username}{p.bio ? ` · ${p.bio}` : ''}</span>
      </div>
      <button className={`btn btn-sm ${isFollowing(p.id) ? 'btn-ghost' : 'btn-primary'}`} onClick={() => toggleFollow(p)}>
        {isFollowing(p.id) ? 'Following' : followsMe(p.id) ? 'Follow back' : 'Follow'}
      </button>
    </li>
  );

  return (
    <div className="page stack">
      <header className="page-header">
        <div>
          <p className="eyebrow">Friends</p>
          <h1>Better together</h1>
        </div>
      </header>

      <div className="row-between">
        <div className="tabs" role="tablist" aria-label="Friends sections">
          {(
            [
              ['feed', 'Feed'],
              ['friends', `People (${people.length})`],
              ['find', 'Find people'],
            ] as [Tab, string][]
          ).map(([k, label]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={`tab${tab === k ? ' active' : ''}`} onClick={() => setTab(k)}>
              {label}
            </button>
          ))}
        </div>
        <div className="row-sm small muted nums">
          <span>{follows.following.length} following</span>
          <span>·</span>
          <span>{follows.followers.length} follower{follows.followers.length === 1 ? '' : 's'}</span>
          <span>·</span>
          <span>{friends.length} friend{friends.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      {error && <div className="error-text" role="alert">{error}</div>}

      {tab === 'feed' && (
        <div className="grid-2">
          <section className="stack" aria-label="Activity feed">
            {feed.length === 0 ? (
              <Empty title="Your feed is quiet">Follow people to see their workouts here, and share yours from the Workouts tab.</Empty>
            ) : (
              feed.map((item) => (
                <article key={item.id} className="card feed-item">
                  <Avatar profile={item.profile} />
                  <div className="feed-body">
                    <div className="feed-head">
                      <span className="feed-name">{item.user_id === profile?.id ? 'You' : item.profile.display_name}</span>
                      <span className="feed-meta">{friendlyDate(item.date)} · {activityType(item.type).label}</span>
                    </div>
                    <div className="feed-content">
                      <strong>{item.name}</strong>
                      <div className="small muted nums">
                        {item.duration_min} min{item.distance_km ? ` · ${fmt(item.distance_km, 1)} km` : ''} · {fmt(item.calories)} kcal
                      </div>
                      {item.notes && <p className="small">{item.notes}</p>}
                    </div>
                    <div className="feed-actions">
                      <button className={`react-btn${item.kudoed ? ' active' : ''}`} aria-pressed={item.kudoed} onClick={() => kudos(item)}>
                        <Icon name="heart" size={16} />
                        Kudos{item.kudos ? ` · ${item.kudos}` : ''}
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
          <section className="card stack" aria-labelledby="invite-title">
            <h2 id="invite-title" className="card-title">Invite friends</h2>
            <p className="small muted">Share Daybloom on your social apps. Friends who join can follow you by username.</p>
            {profile && (
              <ShareButtons text={`I'm planning my days, workouts and meals on Daybloom. Follow me: @${profile.username}`} onToast={toast.show} />
            )}
            <p className="small muted">How following works: anyone can follow you and see the workouts you choose to share. When you follow each other, you're friends.</p>
          </section>
        </div>
      )}

      {tab === 'friends' && (
        <div className="grid-3">
          {[
            ['Friends', friends, 'Follow someone who follows you to become friends.'],
            ['Following', followingOnly, 'People you follow who haven’t followed back yet.'],
            ['Followers', followersOnly, 'People who follow you. Follow back to be friends.'],
          ].map(([title, list, hint]) => (
            <section key={title as string} className="card stack">
              <h2 className="card-title">{title as string}</h2>
              {(list as Profile[]).length ? <ul className="list">{(list as Profile[]).map(personRow)}</ul> : <p className="small muted">{hint as string}</p>}
            </section>
          ))}
        </div>
      )}

      {tab === 'find' && (
        <section className="card stack">
          <div className="field">
            <label className="label" htmlFor="people-search">Search by name or username</label>
            <input id="people-search" className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. maya" />
          </div>
          {results.length ? <ul className="list">{results.map(personRow)}</ul> : <p className="muted small">No one found yet. Invite them from the Feed tab.</p>}
        </section>
      )}
      <Toast message={toast.message} />
    </div>
  );
}
