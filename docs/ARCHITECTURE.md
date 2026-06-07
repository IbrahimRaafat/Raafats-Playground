# Architecture

## Overview

TS Playground is a Next.js 16 App Router application. The core insight is that all code execution happens inside Sandpack's hosted Parcel bundler (running in an iframe), so the Next.js server never needs to compile or run user code.

---

## Component layers (atomic design)

```
atoms/          Smallest, stateless UI primitives
                Button, Badge, DifficultyBadge, ThemeToggle,
                LanguageToggle, LessonCompletedBadge, SiteFooter

molecules/      Composed from atoms, single responsibility
                Toolbar, LessonCard, TrackCard, BreadcrumbNav,
                LessonNav, LessonSearch

organisms/      Full page sections, may fetch data or manage state
                PlaygroundLayout, LessonPlayground, SiteNavbar,
                LessonInstructions, TestResultsPanel, TrackProgress,
                LessonSearch (modal)

providers/      React context providers
                ThemeProvider    — dark/light mode
                LocaleProvider   — i18n (en/ar)
                PlaygroundRoot   — SandpackProvider wrapper
```

**Rule:** lower layers never import from higher layers. Atoms know nothing about organisms.

---

## Data flow

### Lesson page

```
/learn/[track]/[lesson]/page.tsx  (server component)
  │
  ├─ getLessonMdx()        reads lesson.mdx from fs
  ├─ getLessonConfig()     imports config.ts from fs
  │
  └─ LessonPlayground      (client component)
       │
       ├─ PlaygroundRoot   (SandpackProvider)
       │    ├─ files: starterFiles + /__tests__.ts + /__test_runner__.ts
       │    └─ customSetup: { entry: '/__test_runner__.[t|tsx]' }
       │
       └─ PlaygroundLayout
            ├─ LessonInstructions  (MDX rendered prose)
            ├─ Toolbar             (Reset / Run Tests)
            ├─ EditorPanel         (SandpackCodeEditor)
            ├─ PreviewPanel        (SandpackPreview)
            └─ TestResultsPanel    (parses useSandpackConsole logs)
```

### Test runner architecture

The most important design decision in the codebase. Early versions injected test code directly into the user's `index.ts` — this caused race conditions in Vercel's hosted Parcel bundler.

**Current approach:**

1. `/__tests__.ts` — visible, read-only tab containing the test suite
2. `/__test_runner__.ts` (or `.tsx` for React) — hidden, set as Sandpack's `customSetup.entry`
3. Initial runner content: `import './index'\n` (vanilla-ts) or the React root render (react-ts)
4. When "Run Tests" is clicked, Toolbar overwrites the runner with the full test code
5. Sandpack detects the file change, re-bundles, and runs
6. Console logs are captured via `useSandpackConsole`
7. Toolbar parses logs for `✅ All tests passed` / `❌ N test(s) failed` summary lines

**Why this works:** The user's files are never modified. Re-bundling is triggered by changing only the hidden runner.

### Questions page

```
/questions/page.tsx  (server component, revalidate: 3600s)
  │
  └─ supabase.from('questions').select('*')
       │
       └─ QuestionsContent  (client component)
            filters: company | type | difficulty | topic
            expandable rows: theory shows answer, coding shows hint + starter code
```

---

## Key architectural decisions

### Sandpack over a self-hosted bundler

Sandpack offloads all compilation to CodeSandbox's infrastructure. No webpack/esbuild server needed. The trade-off is that cold-start bundling can take 5–15 seconds in Vercel's production environment — this is a known Sandpack limitation on hosted environments.

### react-resizable-panels v4

Uses `Group`, `Panel`, `Separator`, and `orientation` prop (not v3's `PanelGroup`, `PanelResizeHandle`, `direction`). The three-pane layout is: `[Instructions | Editor | Preview + Tests]` for lessons and `[Editor | Preview | Console]` for the free playground.

### `@base-ui/react` instead of `radix-ui`

`@base-ui/react` v1 uses a `render` prop instead of `asChild`. Do not use `asChild` — it does not exist. Use `render={<element />}` for custom rendering, or plain `<Link>` styled with Tailwind for navigation.

### pnpm + webpack (not Turbopack)

Turbopack has a bug on Windows with pnpm + `src/` layout (can't resolve `next/package.json`). All scripts use `--webpack`. `.npmrc` sets `shamefully-hoist=true` so pnpm flattens `node_modules` for webpack's resolver.

### localStorage progress (Phase 5)

No authentication in Phase 5. Lesson completion is tracked in `localStorage` under `ts-playground:progress`. Phase 6 will migrate this to Supabase with Google/Apple OAuth.

### Supabase for questions (Phase 5)

Questions are stored in Supabase and fetched server-side with 1-hour ISR revalidation. The `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe to expose — RLS policies allow only SELECT on non-premium questions for anonymous users. All writes require the service role key (used only in CI scrapers, never shipped to the client).

---

## i18n system

```
src/lib/i18n/
  types.ts         TranslationKey union type
  en.ts            English strings
  ar.ts            Arabic strings
  translations.ts  { en, ar } map

LocaleProvider     stores locale in localStorage + sets document.dir
useTranslation()   returns t(key) helper
```

RTL layout uses Tailwind's `rtl:` variant and logical properties (`ms-auto`, `me-6`, `ps-3`). No CSS direction hacks.

---

## Lesson content format

Each lesson lives in `src/content/lessons/<track>/<order-slug>/` and contains exactly two files:

- `lesson.mdx` — frontmatter (`title`, `description`, `difficulty`, `order`) + prose instructions
- `config.ts` — exports `config: LessonConfig` with `starterFiles`, `solutionFiles`, `testFile`

The content loader auto-discovers lessons via `fs.readdirSync` — no registration needed.

See [LESSONS.md](LESSONS.md) for the full format.
