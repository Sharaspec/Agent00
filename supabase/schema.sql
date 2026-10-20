-- Daybloom database schema for Supabase.
-- Run once in Supabase: SQL Editor → New query → paste → Run.
-- Row Level Security keeps each person's planner, food and notes private.
-- Workouts are visible to followers only when marked "shared".

create extension if not exists pgcrypto;

-- Profiles ------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique check (username ~ '^[a-z0-9_.]{3,24}$'),
  display_name text not null default '',
  bio text not null default '' check (char_length(bio) <= 160),
  avatar_color text not null default '#d6336c',
  is_public boolean not null default true,
  weight_kg numeric,
  goal_calories int not null default 2000,
  goal_protein int not null default 100,
  goal_active_minutes int not null default 150,
  goal_water int not null default 8,
  created_at timestamptz not null default now()
);

-- Create a profile automatically when someone signs up (email or social login).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  base text;
  candidate text;
begin
  base := lower(regexp_replace(
    coalesce(new.raw_user_meta_data ->> 'username', new.raw_user_meta_data ->> 'user_name', split_part(new.email, '@', 1), 'friend'),
    '[^a-zA-Z0-9_.]', '', 'g'));
  if char_length(base) < 3 then base := base || 'bloom'; end if;
  base := left(base, 20);
  candidate := base;
  while exists (select 1 from public.profiles where username = candidate) loop
    candidate := base || floor(random() * 9000 + 1000)::text;
  end loop;
  insert into public.profiles (id, username, display_name)
  values (new.id, candidate, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'username', base));
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Personal records ------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  title text not null check (char_length(title) <= 200),
  time text,
  category text not null default 'plan',
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  type text not null,
  name text not null check (char_length(name) <= 120),
  duration_min numeric not null check (duration_min > 0),
  distance_km numeric,
  calories int not null default 0,
  notes text not null default '',
  exercises jsonb not null default '[]',
  shared boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  meal text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  name text not null check (char_length(name) <= 120),
  servings numeric not null default 1,
  calories numeric not null default 0,
  protein numeric not null default 0,
  carbs numeric not null default 0,
  fat numeric not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.custom_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  kind text not null,
  exercises jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- One row per person per day; the app uses "<user_id>_<date>" as the id.
create table if not exists public.day_notes (
  id text primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  water int not null default 0,
  mood int check (mood between 1 and 5),
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- Social -------------------------------------------------------------------------
create table if not exists public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (follower_id, following_id),
  check (follower_id <> following_id)
);

create table if not exists public.kudos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_id uuid not null references public.activities (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, activity_id)
);

create index if not exists tasks_user_date on public.tasks (user_id, date);
create index if not exists activities_user_date on public.activities (user_id, date);
create index if not exists meals_user_date on public.meals (user_id, date);
create index if not exists custom_workouts_user on public.custom_workouts (user_id);
create index if not exists follows_following on public.follows (following_id);
create index if not exists kudos_activity on public.kudos (activity_id);
create index if not exists kudos_user on public.kudos (user_id);

-- Row Level Security --------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.activities enable row level security;
alter table public.meals enable row level security;
alter table public.custom_workouts enable row level security;
alter table public.day_notes enable row level security;
alter table public.follows enable row level security;
alter table public.kudos enable row level security;

-- Signed-in people can see profiles (needed for search, feeds and follower lists).
drop policy if exists "profiles readable" on public.profiles;
create policy "profiles readable" on public.profiles for select to authenticated using (true);
drop policy if exists "profiles insert own" on public.profiles;
create policy "profiles insert own" on public.profiles for insert to authenticated with check (id = (select auth.uid()));
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Private tables: owner only.
do $$
declare t text;
begin
  foreach t in array array['tasks', 'meals', 'custom_workouts', 'day_notes'] loop
    execute format('drop policy if exists "own rows" on public.%I', t);
    execute format('create policy "own rows" on public.%I for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()))', t);
  end loop;
end $$;

-- Activities: owner has full access; followers can read shared ones.
drop policy if exists "activities read own or shared by followed" on public.activities;
create policy "activities read own or shared by followed" on public.activities for select to authenticated
  using (
    user_id = (select auth.uid())
    or (shared and exists (select 1 from public.follows f where f.follower_id = (select auth.uid()) and f.following_id = activities.user_id))
  );
drop policy if exists "activities insert own" on public.activities;
create policy "activities insert own" on public.activities for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "activities update own" on public.activities;
create policy "activities update own" on public.activities for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "activities delete own" on public.activities;
create policy "activities delete own" on public.activities for delete to authenticated using (user_id = (select auth.uid()));

-- Follows: you see your own connections, and you can only follow or unfollow as yourself.
drop policy if exists "follows read own" on public.follows;
create policy "follows read own" on public.follows for select to authenticated
  using (follower_id = (select auth.uid()) or following_id = (select auth.uid()));
drop policy if exists "follows insert self" on public.follows;
create policy "follows insert self" on public.follows for insert to authenticated with check (follower_id = (select auth.uid()));
drop policy if exists "follows delete self" on public.follows;
create policy "follows delete self" on public.follows for delete to authenticated using (follower_id = (select auth.uid()));

-- Kudos: visible when the activity is visible to you; give or remove only your own.
drop policy if exists "kudos read" on public.kudos;
create policy "kudos read" on public.kudos for select to authenticated
  using (exists (select 1 from public.activities a where a.id = kudos.activity_id));
drop policy if exists "kudos insert own" on public.kudos;
create policy "kudos insert own" on public.kudos for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.activities a where a.id = kudos.activity_id));
drop policy if exists "kudos delete own" on public.kudos;
create policy "kudos delete own" on public.kudos for delete to authenticated using (user_id = (select auth.uid()));
