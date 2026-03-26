-- Tracks
create table tracks (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text
);

-- Timed sessions
create table timed_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  track_id uuid not null,
  status text not null default 'in_progress',
  started_at timestamp with time zone default now(),
  completed_at timestamp with time zone,
  duration_seconds integer,
  overall_score integer
);

-- Attempts
create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  track_id uuid not null,
  session_id uuid,
  prompt_title text,
  prompt_text text,
  user_answer text,
  result jsonb,
  created_at timestamp with time zone default now()
);

-- Indexes
create index on attempts(user_id);
create index on timed_sessions(user_id);