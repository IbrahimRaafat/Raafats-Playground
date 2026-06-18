# Database

## Supabase project

| Setting | Value |
|---|---|
| Project name | ts-playground |
| Project ref | `vwfxobbxbgbozaouzzkj` |
| Region | eu-central-1 |
| URL | `https://vwfxobbxbgbozaouzzkj.supabase.co` |
| Plan | Free |

---

## Tables

### `questions`

Stores all interview questions — manually curated, scraped from LeetCode, BFE.dev, and GreatFrontend.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | auto-generated |
| `source` | text | `'manual'` \| `'leetcode'` \| `'bfe'` \| `'greatfrontend'` |
| `source_id` | text | original problem slug/ID from the source |
| `title` | text | |
| `description` | text | full problem statement |
| `type` | text | `'coding'` \| `'theory'` |
| `difficulty` | text | `'easy'` \| `'medium'` \| `'hard'` |
| `topic` | text | `'JavaScript'` \| `'TypeScript'` \| `'React'` \| `'CSS'` \| `'HTML/DOM'` |
| `companies` | text[] | e.g. `['Google', 'Meta']` |
| `tags` | text[] | LeetCode topic tags |
| `answer` | text | theory questions only |
| `hint` | text | coding questions: key insight |
| `starter_code` | text | coding questions: starter template |
| `is_premium` | boolean | default false; premium questions hidden from anonymous users |
| `playground_config` | jsonb | playground UI configuration (see below) |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | auto-updated by trigger |
| `search_vec` | tsvector | full-text search vector, auto-updated by trigger |

**Unique constraint:** `(source, source_id)` — prevents duplicate questions from the same source.

### `playground_config` JSONB schema

```json
{
  "showPreview": false,
  "showConsole": true,
  "showTests": true,
  "testCodeVisible": true,
  "autorun": false,
  "starterFiles": { "/index.ts": "export function debounce..." },
  "solutionFiles": { "/index.ts": "export function debounce(func, wait)..." },
  "testFile": "import { debounce } from './index'...",
  "files": {
    "/index.ts": { "label": "Code", "editable": true },
    "/styles.css": { "visible": false, "editable": false }
  }
}
```

| Field | Type | Default | Description |
|---|---|---|---|
| `showPreview` | boolean | false | Show preview panel (for React) |
| `showConsole` | boolean | true | Show console tab |
| `showTests` | boolean | true | Show tests tab |
| `testCodeVisible` | boolean | true | Show test code in editor tabs |
| `autorun` | boolean | false | Auto-run on code edits |
| `starterFiles` | object | - | Starter code files |
| `solutionFiles` | object | - | Solution code files |
| `testFile` | string | - | Test code to run |
| `files` | object | - | Per-file config (labels, editability, visibility) |

---

## Indexes

| Index | Type | Purpose |
|---|---|---|
| `questions_search_idx` | GIN on `search_vec` | full-text search |
| `questions_companies_idx` | GIN on `companies` | filter by company |
| `questions_tags_idx` | GIN on `tags` | filter by tag |
| `questions_type_difficulty_idx` | btree on `(type, difficulty, is_premium)` | filter queries |

---

## Triggers

### `questions_sync_trigger`

Fires `BEFORE INSERT OR UPDATE` on every row. Updates:
- `updated_at` → current timestamp
- `search_vec` → `to_tsvector('english', title || description || topic || tags)`

---

## Row Level Security (RLS)

RLS is enabled on the `questions` table.

| Policy | Role | Operation | Condition |
|---|---|---|---|
| `public can read free questions` | anon | SELECT | `is_premium = false` |
| `authenticated can read all questions` | authenticated | SELECT | always |

**Key point:** the `NEXT_PUBLIC_SUPABASE_ANON_KEY` (used in the Next.js app and browser) can only read non-premium questions. All writes require the `service_role` key, which is only used in CI scrapers and never shipped to the client.

---

## Migrations

Migrations are applied via the Supabase MCP or CLI. They are not stored as files in this repo yet — the full schema is documented here.

### Full schema (re-runnable)

```sql
create table if not exists questions (
  id                uuid primary key default gen_random_uuid(),
  source            text not null default 'manual',
  source_id         text,
  title             text not null,
  description       text not null,
  type              text not null check (type in ('coding', 'theory')),
  difficulty        text not null check (difficulty in ('easy', 'medium', 'hard')),
  topic             text,
  companies         text[] default '{}',
  tags              text[] default '{}',
  answer            text,
  hint              text,
  starter_code      text,
  is_premium        boolean default false,
  playground_config jsonb,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),
  search_vec        tsvector
);

create unique index if not exists questions_source_source_id_key
  on questions(source, source_id);

create index if not exists questions_search_idx
  on questions using gin(search_vec);

create index if not exists questions_companies_idx
  on questions using gin(companies);

create index if not exists questions_tags_idx
  on questions using gin(tags);

create index if not exists questions_type_difficulty_idx
  on questions(type, difficulty, is_premium);

create or replace function questions_sync()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  new.search_vec = to_tsvector('english',
    coalesce(new.title, '') || ' ' ||
    coalesce(new.description, '') || ' ' ||
    coalesce(new.topic, '') || ' ' ||
    coalesce(array_to_string(new.tags, ' '), '')
  );
  return new;
end;
$$;

create trigger questions_sync_trigger
  before insert or update on questions
  for each row execute function questions_sync();

alter table questions enable row level security;

create policy "public can read free questions"
  on questions for select
  using (is_premium = false);

create policy "authenticated can read all questions"
  on questions for select
  to authenticated
  using (true);
```

---

## Seeding manually curated questions

```bash
pnpm seed
```

This runs `scripts/seed-questions.ts` which reads from `src/lib/questions/data.ts` and upserts into Supabase. Safe to run multiple times — it upserts on `(source, source_id)`.

Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`. Note: the anon key is used here because a temporary INSERT policy is applied during seeding. For production data imports, use the service role key instead.

---

## Environment variables

| Variable | Where used | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Next.js app (client + server) | Safe to expose |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Next.js app (client + server) | Safe to expose — RLS prevents abuse |
| `SUPABASE_URL` | GitHub Actions scrapers | Same value as `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` | GitHub Actions scrapers only | **Never ship to client** — bypasses RLS |

---

## Future tables (Phase 6)

```sql
-- User progress (replacing localStorage)
create table user_progress (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users not null,
  lesson_id  text not null,
  completed  boolean default false,
  completed_at timestamptz,
  unique(user_id, lesson_id)
);
```
