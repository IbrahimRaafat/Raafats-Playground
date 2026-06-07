# Build Progress

## Status: Phase 5 complete ✅ — Phase 6 (auth + cloud sync) is next

---

## What's Done

### Phase 1 — Scaffolding ✅
- Next.js 16.2.6 + TypeScript + Tailwind v4 + App Router + `src/` dir
- pnpm with `shamefully-hoist=true` — flattens node_modules for webpack on Windows
- `--webpack` flag in dev/build scripts (Turbopack has a known pnpm+Windows bug)

### Phase 2 — Playground Core ✅
- `PlaygroundRoot` — SandpackProvider wrapper, theme-aware (follows app dark/light mode)
- `PlaygroundLayout` — resizable 3-pane layout (instructions | editor | preview+console)
- `EditorPanel`, `PreviewPanel`, `ConsolePanel`, `Toolbar`
- Toolbar: Reset, Run (free playground), Run Tests (lessons), pass/fail badge
- Ctrl+Enter keyboard shortcut to run / run tests

### Phase 3 — Lesson System ✅
- Content loader (`getAllTracks`, `getTrack`, `getLessonMdx`, `getLessonConfig`)
- Progress store (localStorage) — `markComplete`, `getProgress`, `getAllProgress`
- `LessonInstructions` — MDX renderer
- `LessonNav` — prev/next navigation
- `TrackProgress` — progress bar + lesson checklist

### Phase 4 — Wiring + UX ✅
- `LessonPlayground` — client wrapper, calls `markComplete` when tests pass
- Test runner — hidden `/__test_runner__` entry file pattern (no injection into user files)
- `useSandpackConsole` log parsing for pass/fail detection
- Inter font + dark/light theme toggle in all headers
- Sandpack editor theme follows app theme (`sandpackDark` / `githubLight`)
- Free playground: `vanilla-ts` + `autorun: false` + Run button for fast initial load
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

#### Lesson content (24 lessons total)
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
- **Hidden runner pattern:** user files never modified; `/__tests__.ts` visible read-only tab so users can see test requirements
- `TestResultsPanel` parses ✅/❌ console logs and shows per-test-case rows
- **Performance fix (session 3):** Runner pre-populated at lesson init; "Run Tests" calls `sandpack.runSandpack()` (~instant refresh) instead of a full re-bundle (~5–15s).
- **Spinner fix (session 3):** `TestResultsPanel` self-manages loading state; removed external prop chain that caused permanent stuck spinner on rapid clicks.
- **React runner fix (session 4):** `react-ts` runner now overrides `/index.tsx` (the template's actual Sandpack entry) instead of creating a second `/__test_runner__.tsx`. The template already has its own `createRoot()` in `index.tsx`; a second `createRoot()` on the same `#root` element throws in React 18/19 and kills the runner before any output is produced. DOM test code is wrapped in `setTimeout(1000ms)` to let React 19's concurrent renderer commit and paint before `document.querySelector` calls run. `customSetup.entry` removed for react-ts (no longer needed).
- **Vanilla-ts runner fix (session 4):** Runner lives in `/index.ts` (Sandpack's natural Parcel entry — no entry overrides). User's editable code lives in `/solution.ts`. `buildVanillaTsRunner()` transforms test imports from `./index` to namespace imports from `./solution` (`import * as __m_ns from './solution'`). Namespace import never throws for missing/incomplete exports — a static named import (`import { x }`) would SyntaxError at module link time before any `console.log` runs. Root cause of all prior failures: Sandpack's `getFiles()` early-returns when `/package.json` already exists (provided by the vanilla-ts template), silently ignoring `customSetup.entry` — so any approach that depended on overriding the entry point was doomed. Using `/index.ts` directly as the runner needs zero Sandpack customization.

#### Interview questions + Supabase
- **Supabase project:** `ts-playground` (eu-central-1, free tier)
- `questions` table with RLS, full-text search via tsvector trigger, GIN indexes
- 30 manually curated questions (15 coding, 15 theory) seeded
- `/questions` page with company/type/difficulty/topic filters, expandable answers
- Questions link added to site navbar and homepage
- `SiteNavbar` + `SiteFooter` components used on `/playground` and `/questions`

#### Web scrapers + automation
- `scripts/scrapers/leetcode.ts` — GraphQL API + community company dataset
- `scripts/scrapers/bfe.ts` — HTML scrape (needs fixing, returned 0)
- `scripts/scrapers/greatfrontend.ts` — free problem list
- `scripts/scrape.ts` — orchestrator with `--source` flag, batched upserts
- `.github/workflows/scrape-questions.yml` — weekly Sunday 02:00 UTC cron + manual trigger
- **Result:** 158 questions in DB (100 LeetCode, 30 manual, 28 GreatFrontend)

#### Documentation
- `README.md` — complete rewrite with stack, structure, quick start
- `docs/ARCHITECTURE.md` — component layers, data flow, key decisions
- `docs/LESSONS.md` — how to add lessons, config format, test format
- `docs/DATABASE.md` — schema, RLS, indexes, migrations, env vars
- `docs/SCRAPING.md` — sources, running locally, adding new sources
- `docs/DEPLOYMENT.md` — Vercel setup, env vars, build notes, ISR

### Routes ✅
- `/` — landing page (hero, lesson bank, company questions, tracks, features)
- `/playground` — free playground (vanilla-ts, manual run)
- `/learn` — track listing
- `/learn/[track]` — track detail with progress bar + lesson list
- `/learn/[track]/[lesson]` — lesson page (instructions + editor + preview + console)
- `/questions` — interview questions (Supabase-backed, 1h ISR)
- `/api/lessons` — lesson search index (JSON)

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
