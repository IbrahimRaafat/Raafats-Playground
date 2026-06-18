-- 002_lessons.sql — Lessons table migration
-- Run in Supabase SQL editor or via migration

create table if not exists lessons (
  id                uuid primary key default gen_random_uuid(),
  track_slug        text not null,
  slug              text not null,
  title             text not null,
  description       text not null default '',
  difficulty        text not null check (difficulty in ('beginner', 'intermediate', 'advanced')),
  sort_order        integer not null default 0,
  mdx_content       text not null default '',
  sandpack_template text not null default 'vanilla-ts' check (sandpack_template in ('vanilla-ts', 'react-ts')),
  starter_files     jsonb not null default '{}',
  solution_files    jsonb not null default '{}',
  test_file         text not null default '',
  playground_config jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  unique (track_slug, slug)
);

create index if not exists lessons_track_order_idx on lessons (track_slug, sort_order);
create index if not exists lessons_difficulty_idx on lessons (difficulty);

-- Auto-update updated_at
create or replace function lessons_sync()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists lessons_sync_trigger on lessons;
create trigger lessons_sync_trigger
  before insert or update on lessons
  for each row execute function lessons_sync();

-- RLS
alter table lessons enable row level security;

drop policy if exists "public can read lessons" on lessons;
create policy "public can read lessons"
  on lessons for select
  using (true);
