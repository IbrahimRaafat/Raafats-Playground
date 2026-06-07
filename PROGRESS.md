# Build Progress

## Status: Phase 5 complete ✅ — ready for Phase 6 (auth + cloud sync)

---

## What's Done

### Phase 1 — Scaffolding ✅
- Next.js 16.2.6 + TypeScript + Tailwind v4 + App Router + `src/` dir
- pnpm with `shamefully-hoist=true` — flattens node_modules for webpack on Windows
- `--webpack` flag in dev/build scripts (Turbopack has a known pnpm+Windows bug)

### Phase 2 — Playground Core ✅
- `playground-root.tsx` — SandpackProvider, theme-aware (follows app dark/light mode)
- `playground-layout.tsx` — resizable 3-pane layout (instructions | editor | preview+console)
- `editor-panel.tsx`, `preview-panel.tsx`, `console-panel.tsx`, `toolbar.tsx`
- Toolbar: Reset, Run (free playground), Run Tests (lessons), pass/fail badge
- Ctrl+Enter keyboard shortcut to run / run tests

### Phase 3 — Lesson System ✅
- Content loader (`getAllTracks`, `getTrack`, `getLessonMdx`, `getLessonConfig`)
- Progress store (localStorage) — `markComplete`, `getProgress`, `getAllProgress`
- `lesson-instructions.tsx` — MDX renderer
- `lesson-nav.tsx` — prev/next navigation
- `track-progress.tsx` — progress bar + lesson checklist

### Phase 4 — Wiring + UX ✅
- `lesson-playground.tsx` — client wrapper, calls `markComplete` when tests pass
- Test runner — inline injection into entry file, reads results via `useSandpackConsole`
- MDX frontmatter stripped before render (`matter(raw).content` in loader)
- Inter font (Google Fonts)
- Dark/light theme toggle — `ThemeProvider` + `ThemeToggle` in all headers
- Sandpack editor theme follows app theme (`sandpackDark` / `githubLight`)
- Free playground: `vanilla-ts` + `autorun: false` + Run button for fast initial load
- Progress key bug fixed (`trackSlug/lessonSlug` composite key)
- LessonCard completion state wired (reads progress store)
- `LessonCompletedBadge` in lesson header

### Phase 5 — Polish + i18n + Content + Search ✅

#### Atomic design refactor
- Reorganised `src/components/` into `atoms/` `molecules/` `organisms/` `providers/` `design-system/`
- All components colocated with their Storybook stories
- Storybook 10 configured with `CaseSensitivePathsPlugin` disabled + `symlinks: false` (pnpm/Windows fix)

#### i18n + RTL
- Modular i18n system: `src/lib/i18n/{en,ar,translations,types}.ts`
- `LocaleProvider` + `useTranslation()` hook, localStorage + cookie persistence
- Arabic (RTL) fully translated (~45 keys)
- Cairo Google Font via `--font-arabic` CSS variable, applied via `[dir="rtl"]` selector
- Language toggle button in all headers
- Directional icon fixes: `rtl:scale-x-[-1]` on chevrons; `ms-auto` for logical alignment

#### Lesson content
- **JavaScript track** (8 lessons): Variables, Functions, Types, Interfaces, Arrays & Tuples, Union Types, Generics, Type Utilities
- **React track** (8 lessons): JSX, Components, State (useState), Effects (useEffect), Props & Composition, Event Handling, Lists & Conditional Rendering, Custom Hooks

#### Search
- `GET /api/lessons` — flat JSON of all lessons for client-side search
- `LessonSearch` — command-palette modal (Ctrl+K), keyboard navigation, grouped by track, difficulty badges
- Integrated into `BreadcrumbNav` (all inner pages) and home page nav

#### Storybook stories
- Atoms: Button, Badge, DifficultyBadge, ThemeToggle, LanguageToggle
- Molecules: LessonCard, TrackCard, BreadcrumbNav, LessonNav, Toolbar
- Organisms: TrackProgress, LessonSearch
- Design system: Design Tokens

### Routes ✅
- `/` — landing page (hero, tracks, features, what-you-learn)
- `/playground` — free playground (vanilla-ts, manual run)
- `/learn` — track listing
- `/learn/[track]` — track detail with progress bar + lesson list
- `/learn/[track]/[lesson]` — lesson page (instructions + editor + preview + console)
- `/api/lessons` — lesson search index (JSON)

---

## Phase 6 — Next Steps

### Auth + cloud progress sync
- Google + Apple OAuth via Supabase Auth
- Supabase custom email/password sign-in
- Migrate localStorage progress records to Supabase user table
- Merge progress on first sign-in (local → cloud)
- See `memory/project_auth_plan.md` for full plan
