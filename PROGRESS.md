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

#### Test runner (fully resolved — session 4)

**Architecture (final):**

| Template | Runner file | User's code | Trigger |
|----------|------------|-------------|---------|
| `react-ts` | `/index.tsx` (overrides template entry) | `/App.tsx` | `runSandpack()` |
| `vanilla-ts` | `/index.ts` (natural Parcel entry) | `/solution.ts` | `runSandpack()` |

- `/__tests__.ts` — visible, read-only tab showing test requirements
- `buildVanillaTsRunner()` — transforms `import { x } from './index'` → namespace import from `./solution` (`import * as __m_ns from './solution'`). Namespace import never throws for missing exports (unlike static named imports which SyntaxError at link time before any `console.log` fires).
- React runner wraps test code in `setTimeout(1000ms)` so React 19 concurrent renderer commits before DOM queries run.

**Root causes fixed this session:**
1. `customSetup.entry` silently ignored — Sandpack's `getFiles()` early-returns when `/package.json` already exists (vanilla-ts template provides it). Solution: use `/index.ts` directly (zero config).
2. No execution iframe — `SandpackPreview` must be mounted for code to run. Vanilla-ts layout had no `PreviewPanel`; added hidden `SandpackPreview` to `PlaygroundLayout`.
3. Auto-rerun on every keystroke — `autorun:false` blocks only the initial run; after `runSandpack()` the sandbox status becomes `"running"` and file changes trigger recompile. Solution: `recompileDelay:9_999_999` (≈167 min) when `autorun=false`. `runSandpack()` bypasses the timer entirely.

**Layout redesign (GFE-style):**
- Toolbar moved to **bottom bar**: Reset on left, Run Tests on right.
- **JS lessons**: 2-col layout (instructions | editor) + collapsible "Run tests / Console" drawer at bottom. Run Tests click auto-opens the drawer.
- **React lessons**: 3-col layout (instructions | editor | Browser/Console/Tests tabs). Run Tests click auto-switches to Tests tab. `PreviewPanel` stays mounted with `visibility:hidden` so the iframe is never destroyed on tab switch.
- Tests run ONLY on explicit button click — not on code edits.

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

---

## Improvement Plan (Priority Order)

### P0 — Fix / Polish (must-do before launch)

1. **Merge test-runner branch → main**
   The `fix/test-runner-vanilla-ts` branch has all session 4 fixes. Open a PR and merge.

2. **Verify all 10 JS lessons run correctly**
   Each lesson's `testFile` has different imports. Spot-check: Variables, Functions, Types, Generics, Classes, Async.

3. **Verify all 10 React lessons run correctly**
   The React runner relies on `setTimeout(1000ms)` for DOM queries. Test JSX, Components, State, Effects.

4. **Fix editor tab labels**
   Currently shows `solution.ts` and `__tests__.ts`. Should show **Code** and **Test cases** (like BFE.dev).
   - Option A: Rename the actual files (`Code.ts`, `TestCases.ts`) — may break imports inside test code.
   - Option B: Build a custom tab bar above `SandpackCodeEditor` that maps filenames to display names. Sandpack's `SandpackFileExplorer` supports custom file labels.

5. **Test results auto-persist across tab switch**
   When user switches from Tests → Browser → Tests in React layout, `TestResultsPanel` loses state (hidden via `display:none` but state is in React). Should be fine — verify.

6. **Loading state for first Run Tests click**
   First click after page load triggers a fresh Parcel bundle (~3–8s on CodeSandbox CDN). Add a loading message: "Bundling… (first run takes a moment)".

---

### P1 — UX Improvements

7. **Solution reveal**
   "View solution" button that shows the `solutionFiles` code in a diff view or overlay. Currently solution code is in config but never shown.

8. **Lesson completion UI**
   When all tests pass: animate the `LessonCompletedBadge`, show a "Next lesson →" prompt inside the test panel.

9. **Mark complete manually**
   Add a "Mark complete" button in the bottom bar (like BFE.dev). Currently completion only fires when tests pass — users who skip tests can't mark progress.

10. **Reset confirmation**
    Currently "Reset" silently discards all edits. Add a confirmation or undo buffer.

11. **Keyboard shortcuts visible**
    Show `Ctrl+Enter` hint next to the Run Tests button.

---

### P2 — Content

12. **Fix test files for multi-file JS lessons**
    Lessons 5–10 (Arrays, Generics, etc.) may have test files that import from `'./index'`. All imports are auto-transformed to `'./solution'` by `buildVanillaTsRunner()` — verify each one.

13. **Add difficulty progression within tracks**
    Some lessons jump too fast from beginner to intermediate concepts. Add 2–3 bridging exercises per track.

14. **TypeScript-specific track**
    A dedicated TS track (types, generics, utility types, decorators) separate from the JS track.

15. **Add hints to test failures**
    Test `check()` functions already pass `hint` strings. Surface them more prominently in `TestResultsPanel` (styled differently from just `reason` text).

---

### P3 — Platform

16. **Auth + cloud progress** (Phase 6 already planned)
    Google + Apple OAuth via Supabase. Migrate localStorage progress to `user_progress` table.

17. **Submission history**
    Store each "Run Tests" result with timestamp. Show "Submissions" tab in lesson panel.

18. **Leaderboard / streaks**
    Daily streak tracker. Show on user profile.

19. **Mobile layout**
    Currently unusable on small screens. A stacked single-column layout for mobile (instructions collapsed by default, editor full-width).

20. **Vercel deployment checklist**
    - Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel env vars.
    - Verify ISR revalidation works for `/questions` (1h TTL).
    - Enable Vercel Analytics.
    - Set up preview deployments on PRs.
