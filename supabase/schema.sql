-- ============================================
-- GymBro Database Schema
-- Paste this into Supabase SQL Editor and run
-- ============================================

-- Exercise library (shared across all users)
create table exercises (
  id text primary key,
  name text not null,
  force text,
  level text,
  mechanic text,
  equipment text,
  category text,
  primary_muscles text[] not null default '{}',
  secondary_muscles text[] default '{}',
  instructions text[] default '{}',
  images text[] default '{}'
);

-- Workouts (a single gym session)
create table workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text,
  date date not null default current_date,
  created_at timestamptz not null default now()
);

-- Exercises within a workout (ordered)
create table workout_exercises (
  id uuid primary key default gen_random_uuid(),
  workout_id uuid references workouts on delete cascade not null,
  exercise_id text references exercises not null,
  "order" integer not null default 0
);

-- Individual sets (weight + reps)
create table sets (
  id uuid primary key default gen_random_uuid(),
  workout_exercise_id uuid references workout_exercises on delete cascade not null,
  set_number integer not null,
  weight numeric not null default 0,
  reps integer not null default 0,
  completed boolean not null default true
);

-- ============================================
-- Row Level Security
-- ============================================

-- Exercises are readable by everyone
alter table exercises enable row level security;
create policy "Exercises are public" on exercises
  for select using (true);

-- Users can only access their own workouts
alter table workouts enable row level security;
create policy "Users manage own workouts" on workouts
  for all using (auth.uid() = user_id);

-- Users can only access exercises in their own workouts
alter table workout_exercises enable row level security;
create policy "Users manage own workout exercises" on workout_exercises
  for all using (
    workout_id in (select id from workouts where user_id = auth.uid())
  );

-- Users can only access sets in their own workouts
alter table sets enable row level security;
create policy "Users manage own sets" on sets
  for all using (
    workout_exercise_id in (
      select we.id from workout_exercises we
      join workouts w on w.id = we.workout_id
      where w.user_id = auth.uid()
    )
  );

-- ============================================
-- Indexes for performance
-- ============================================
create index idx_workouts_user_id on workouts (user_id);
create index idx_workouts_date on workouts (date);
create index idx_workout_exercises_workout_id on workout_exercises (workout_id);
create index idx_sets_workout_exercise_id on sets (workout_exercise_id);
create index idx_exercises_name on exercises using gin (to_tsvector('english', name));
