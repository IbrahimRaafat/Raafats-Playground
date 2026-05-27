# Build Progress

## Status: Phase 4 in progress — paused mid-session

---

## What's Done

### Phase 1 — Scaffolding ✅
- Next.js 16.2.6 project created with TypeScript + Tailwind v4 + App Router + `src/` dir
- All dependencies installed:
  - `@codesandbox/sandpack-react` + `@codesandbox/sandpack-themes`
  - `react-resizable-panels` v4
  - `next-mdx-remote` v6
  - `gray-matter`
  - `lucide-react`
  - `shadcn` (with `@base-ui/react` components)
- **pnpm `.npmrc`**: `shamefully-hoist=true` — required for Turbopack/webpack to resolve packages on Windows
- **`package.json` scripts**: `dev` and `build` use `--webpack` flag (Turbopack has a known bug with pnpm + Windows + `src/` dir structure — see KNOWN_ISSUES.md)

### Phase 2 — Playground Core ✅
All files created and compile cleanly:
- `src/components/playground/playground-root.tsx` — SandpackProvider wrapper
- `src/components/playground/playground-layout.tsx` — resizable 3-pane layout using `react-resizable-panels` v4 (`Group`, `Panel`, `Separator`)
- `src/components/playground/editor-panel.tsx` — SandpackCodeEditor
- `src/components/playground/preview-panel.tsx` — SandpackPreview
- `src/components/playground/console-panel.tsx` — SandpackConsole
- `src/components/playground/toolbar.tsx` — Reset + Run Tests buttons with pass/fail badge

### Phase 3 — Lesson System ✅
- `src/lib/content/types.ts` — `LessonConfig`, `LessonMeta`, `Track` types
- `src/lib/content/loader.ts` — `getAllTracks()`, `getTrack()`, `getLessonMdx()`, `getLessonConfig()`
- `src/lib/progress/store.ts` — localStorage progress helpers
- `src/lib/sandpack/templates.ts` — default Sandpack file templates
- `src/components/lessons/lesson-instructions.tsx` — MDX renderer with difficulty badge
- `src/components/lessons/lesson-nav.tsx` — prev/next lesson navigation
- `src/components/lessons/track-progress.tsx` — progress bar + lesson checklist

### Routes ✅
- `src/app/layout.tsx` — root layout (dark mode forced, Geist fonts)
- `src/app/page.tsx` — landing page (in progress — see below)
- `src/app/playground/page.tsx` — free playground
- `src/app/learn/page.tsx` — track listing
- `src/app/learn/[track]/page.tsx` — track detail with lesson list
- `src/app/learn/[track]/[lesson]/page.tsx` — lesson page (editor + instructions)

### Lesson Content ✅
- `src/content/lessons/javascript/01-variables/` — lesson.mdx + config.ts
- `src/content/lessons/javascript/02-functions/` — lesson.mdx + config.ts
- `src/content/lessons/javascript/03-types/` — lesson.mdx + config.ts
- `src/content/lessons/react/01-jsx/` — lesson.mdx + config.ts
- `src/content/lessons/react/02-components/` — lesson.mdx + config.ts

### Build ✅
- `pnpm build` passes cleanly (webpack)
- All 6 routes compile: `/`, `/_not-found`, `/learn`, `/learn/[track]`, `/learn/[track]/[lesson]`, `/playground`

---

## What's In Progress / Blocked

### Runtime error on `/` (home page) — NOT YET FIXED
- **Error**: `invariant expected layout router to be mounted` from `OuterLayoutRouter`
- **Cause**: The shadcn `Button` component (from `@base-ui/react`) with `render={<Link />}` conflicts with Next.js router hydration
- **Fix in progress**: Replacing all `Button render={<Link>}` usages with plain styled `<Link>` components
- **Files being fixed**: `src/app/page.tsx` (partially updated), also need to update `lesson-nav.tsx`

---

## Next Steps

### Immediate (fix the runtime error)
1. Finish replacing `Button render={<Link>}` → plain styled `<Link>` in `src/app/page.tsx` (partially done)
2. Update `src/components/lessons/lesson-nav.tsx` — same fix
3. Reload browser and confirm `/` loads without error
4. Test `/playground` — verify editor + preview + console all render
5. Test `/learn` → `/learn/javascript` → `/learn/javascript/01-variables` full flow
6. Click "Run Tests" on a lesson — verify pass/fail output appears in console

### Phase 4 Remaining
7. `src/lib/progress/store.ts` is already written — wire it up: call `markComplete()` from toolbar when tests pass
8. Confirm progress dots show on track page after completing a lesson
9. Verify localStorage persists on page refresh
10. Test dark mode (already forced dark in layout — consider adding a toggle)
