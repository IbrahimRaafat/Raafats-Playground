@AGENTS.md

# TS Playground — Claude Context

## What this project is
A modular in-browser TypeScript/React learning playground built with Next.js 16 App Router. Users can write TS/React code with live preview, run auto-graded tests, and follow structured lessons. Designed to grow into a full learning platform.

## Key architectural decisions
- **Execution**: Sandpack (hosted bundler by CodeSandbox) — no self-hosted bundler needed
- **Editor**: Sandpack's built-in CodeMirror editor (lighter than Monaco, seamlessly integrated)
- **Panels**: `react-resizable-panels` v4 — uses `Group`/`Panel`/`Separator` and `orientation` prop (not v3's `PanelGroup`/`PanelResizeHandle`/`direction`)
- **UI**: shadcn with `@base-ui/react` — NO `asChild` prop; use `render={<element />}` or just plain `<Link>` for navigation
- **Content**: MDX files for lesson prose, TypeScript config files for starter/solution/test code
- **Progress**: localStorage (no auth in v1)

## Critical config
- `.npmrc`: `shamefully-hoist=true` — pnpm must flatten node_modules or webpack/Turbopack can't resolve packages on Windows
- `package.json` scripts use `--webpack` — Turbopack has a bug with pnpm + Windows + `src/` layout (see KNOWN_ISSUES.md)
- `next.config.ts`: `transpilePackages` includes sandpack, next-mdx-remote, react-resizable-panels

## Dev commands
```bash
pnpm dev        # starts on http://localhost:3000
pnpm build      # production build
```

## Folder structure (key paths)
```
src/
  app/                          # Next.js App Router pages
  components/
    playground/                 # Sandpack editor/preview/console/toolbar/layout
    lessons/                    # Lesson instructions, nav, progress UI
    ui/                         # shadcn components (auto-generated, don't edit)
  content/lessons/
    javascript/01-variables/    # lesson.mdx + config.ts
    javascript/02-functions/
    javascript/03-types/
    react/01-jsx/
    react/02-components/
  lib/
    content/loader.ts           # reads lesson files via fs (server-only)
    content/types.ts            # LessonConfig, Track, LessonMeta types
    progress/store.ts           # localStorage helpers (client-only, 'use client')
    sandpack/templates.ts       # default Sandpack file templates
```

## Adding a new lesson
1. Create `src/content/lessons/<track>/<order-slug>/lesson.mdx` with frontmatter:
   ```
   ---
   title: "..."
   description: "..."
   difficulty: beginner | intermediate | advanced
   order: <number>
   ---
   ```
2. Create `src/content/lessons/<track>/<order-slug>/config.ts` exporting `config: LessonConfig`
3. No registration needed — loader auto-discovers via `fs.readdirSync`

## Current state
See `PROGRESS.md` for detailed build status and next steps.
See `KNOWN_ISSUES.md` for workarounds applied.
