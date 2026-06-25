-- 003_user_progress.sql — User progress table migration
-- Run in Supabase SQL editor

create table if not exists user_progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  lesson_id    text not null,
  status       text not null check (status in ('completed', 'in-progress')),
  completed_at timestamptz,
  updated_at   timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index if not exists user_progress_user_idx on user_progress (user_id);

-- Enable RLS
alter table user_progress enable row level security;

-- Users can only read/write their own rows
create policy "Users can manage their own progress"
  on user_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-update updated_at on edit
create or replace function update_user_progress_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_progress_updated_at
  before update on user_progress
  for each row execute function update_user_progress_updated_at();
