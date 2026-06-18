# Build Progress

## Status: Phase 5 + P0/P1 complete ✅ — Phase 6 (auth + cloud sync) is next

---

## What's Done

### Phase 1 — Scaffolding ✅
- Next.js 16.2.6 + TypeScript + Tailwind v4 + App Router + `src/` dir
- pnpm with `shamefully-hoist=true` — flattens node_modules for webpack on Windows
- `--webpack` flag in dev/build scripts (Turbopack has a known pnpm+Windows bug)

### Phase 2 — Playground Core ✅
- `PlaygroundRoot` — SandpackProvider wrapper, theme-aware (follows app dark/light mode)
- `PlaygroundLayout` — GFE-inspired layout (instructions | editor + test results)
- `EditorPanel` — custom tab bar with friendly labels (Code, Test cases, Config)
- `PreviewPanel`, `TestResultsPanel`, `SolutionDrawer`
- Sandpack's built-in Run button as primary action
- Reset + Solution buttons in editor tab bar

### Phase 3 — Lesson System ✅
- Content loader — Supabase-first with disk fallback (`getAllTracksAsync`, `getTrackAsync`)
- Progress store (localStorage) — `markComplete`, `getProgress`, `getAllProgress`
- `LessonInstructions` — MDX renderer
- `LessonNav` — prev/next navigation
- `TrackProgress` — progress bar + lesson checklist

### Phase 4 — Wiring + UX ✅
- `LessonPlayground` — client wrapper, calls `markComplete` when tests pass
- Test runner — hidden entry file pattern (no injection into user files)
- `useSandpackConsole` log parsing for pass/fail detection
- Inter font + dark/light theme toggle in all headers
- Sandpack editor theme follows app theme (`sandpackDark` / `githubLight`)
- `LessonCompletedBadge` in lesson header

### Phase 5 — Polish, Content, i18n, Questions DB ✅

#### Atomic design refactor
- Reorganised `src/components/` into `atoms/` `molecules/` `organisms/` `providers/` `design-system/`
- All components colocated with their Storybook stories
- Storybook 10 configured with `CaseSensitivePathsPlugin` disabled + `symlinks: false` (pnpm/Windows fix)

#### i18n + RTL
- Modular i18n system: `src/lib/i18n/{en,ar,translations,types}.ts`
- `LocaleProvider` + `useTranslation()` hook, localStorage + cookie persistence
- Arabic (RTL) fully translated (~45 keys)
- Cairo Google Font via `--font-arabic` CSS variable
- Language toggle in all headers

#### Lesson content (20 lessons, 2 tracks)
- **JavaScript track** (10 lessons): Variables, Functions, Types, Interfaces, Arrays & Tuples, Union Types, Generics, Type Utilities, Classes, Async
- **React track** (10 lessons): JSX, Components, State, Effects, Props & Composition, Event Handling, Lists & Conditional Rendering, Custom Hooks, Context, Performance

#### Search
- `GET /api/lessons` — flat JSON of all lessons for client-side search
- `LessonSearch` — command-palette modal (Ctrl+K), keyboard navigation, grouped by track

#### Homepage
- GreatFrontend-style layout: hero, browser mockup, feature cards with CSS mockups
- Lesson bank section with track filter pills
- Company questions preview section
- Announcement banner, floating toast, live indicator

#### Test runner (fully resolved)
- `/__tests__.ts` — visible, read-only tab showing test requirements
- `buildVanillaTsRunner()` — namespace import from `./solution`
- React runner wraps test code in `setTimeout(1000ms)` for DOM queries
- Tests run ONLY on explicit button click — not on code edits

#### Interview questions + Supabase
- **Supabase project:** `ts-playground` (eu-central-1, free tier)
- `questions` table with RLS, full-text search via tsvector trigger, GIN indexes
- 158 questions in DB (100 LeetCode, 30 manual, 28 GreatFrontend)
- `playground_config` JSONB column for per-problem UI configuration
- `/questions` page with company/type/diculty/topic filters

#### Lessons in Supabase (NEW)
- `lessons` table with full schema (RLS, indexes, triggers)
- 20 lessons migrated from disk to Supabase
- `loader.ts` reads from Supabase first, falls back to disk
- All pages updated to async loader (`getAllTracksAsync`, `getTrackAsync`)

#### PlaygroundConfig system (NEW)
- `PlaygroundConfig` type: `showPreview`, `showConsole`, `showTests`, `testCodeVisible`, `autorun`, `starterFiles`, `solutionFiles`, `testFile`, `files`
- Per-file config: `label`, `editable`, `visible`
- Applied in `PlaygroundRoot` and `PlaygroundLayout`

#### Admin dashboard (NEW)
- `/admin` — hub page with links to lessons and problems
- `/admin/problems` — CRUD form with playground config editor
- `/admin/lessons` — CRUD form with MDX content, starter/solution files, test file, playground config
- Supabase service role key for seed/migration scripts

#### Web scrapers + automation
- `scripts/scrapers/leetcode.ts` — GraphQL API + community company dataset
- `scripts/scrapers/bfe.ts` — HTML scrape (needs fixing, returned 0)
- `scripts/scrapers/greatfrontend.ts` — free problem list
- `scripts/scrape.ts` — orchestrator with `--source` flag, batched upserts
- `.github/workflows/scrape-questions.yml` — weekly Sunday 02:00 UTC cron + manual trigger

#### Documentation
- `README.md` — complete rewrite with stack, structure, quick start
- `docs/ARCHITECTURE.md` — component layers, data flow, key decisions
- `docs/LESSONS.md` — how to add lessons, config format, test format
- `docs/DATABASE.md` — schema, RLS, indexes, migrations, env vars
- `docs/SCRAPING.md` — sources, running locally, adding new sources
- `docs/DEPLOYMENT.md` — Vercel setup, env vars, build notes, ISR
- `docs/migrations/002_lessons.sql` — lessons table migration

### Routes ✅
- `/` — landing page (hero, lesson bank, company questions, tracks, features)
- `/playground` — free playground (vanilla-ts, manual run)
- `/learn` — track listing
- `/learn/[track]` — track detail with progress bar + lesson list
- `/learn/[track]/[lesson]` — lesson page (instructions + editor + test results)
- `/questions` — interview questions (Supabase-backed, 1h ISR)
- `/problems/[id]` — problem playground (loads from Supabase)
- `/admin` — admin dashboard hub
- `/admin/problems` — manage interview problems
- `/admin/lessons` — manage learning lessons
- `/api/lessons` — lesson search index (JSON)

---

## Session 6 Summary (this session)

### P0 items completed
1. ✅ **Editor tab labels** — Custom tab bar shows "Code", "Test cases", "Config" instead of filenames
2. ✅ **Test results visible** — Bottom panel always shows test results (no scrolling to find)
3. ✅ **Loading states** — "Bundling..." and "Running tests..." states in TestResultsPanel
4. ✅ **Console always accessible** — Console tab in bottom panel (unified with Tests)

### P1 items completed
5. ✅ **Solution reveal** — Solution button in editor tab bar opens read-only Sandpack editor overlay
6. ✅ **Keyboard shortcut visibility** — `⌘↵` hint on Run Tests button
7. ✅ **Animated badges** — Pass/fail badges animate in with fade-in

### Layout redesign (GFE-inspired)
- Left: Instructions panel (resizable via drag separator)
- Right: Editor on top + Test Results on bottom (resizable via drag separator)
- Sandpack's built-in Run button as primary action
- Reset + Solution buttons in editor tab bar
- Custom tab bar with friendly labels (Code, Test cases, Config)

### Supabase integration
- `playground_config` JSONB column on `questions` table
- `lessons` table with full schema, 20 lessons migrated
- `PlaygroundConfig` type for per-lesson/problem UI configuration
- Admin dashboard for managing both lessons and problems
- Loader reads from Supabase first, falls back to disk

---

## Phase 6 — Roadmap

### Auth + cloud progress sync
- Google + Apple OAuth via Supabase Auth
- Email/password sign-in
- Migrate localStorage progress records to Supabase `user_progress` table
- Merge local progress on first sign-in

### Questions improvements
- Fix BFE.dev scraper (HTML structure changed)
- Add LeetCode full descriptions (requires session cookie / manual enrichment)
- Community-submitted questions (form → Supabase, moderation queue)
- Premium questions tier (is_premium = true, gated behind auth)

### Platform
- User profiles page (streak, completed lessons, question history)
- Discussion threads per lesson/question
- Hint system (progressive hints, penalty points)
- Mobile-responsive playground layout
- Submission history with timestamps
- Leaderboard / streaks

### Deployment
- Vercel deployment with env vars
- ISR revalidation for `/questions`
- Vercel Analytics
- Preview deployments on PRs

---

## Improvement Plan (Remaining)

### P2 — Content
1. Fix test files for multi-file JS lessons (Arrays, Generics, etc.)
2. Add difficulty progression within tracks
3. TypeScript-specific track
4. Add hints to test failures (prominent styling)

### P3 — Platform
5. Auth + cloud progress (Phase 6)
6. Submission history
7. Leaderboard / streaks
8. Mobile layout
9. Vercel deployment checklist
