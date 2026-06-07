# Adding Lessons

## File structure

Each lesson is a folder inside `src/content/lessons/<track>/<order-slug>/`:

```
src/content/lessons/
  javascript/
    01-variables/
      lesson.mdx
      config.ts
    02-functions/
      lesson.mdx
      config.ts
  react/
    01-jsx/
      lesson.mdx
      config.ts
```

No registration needed — the content loader auto-discovers lessons via `fs.readdirSync`.

---

## lesson.mdx

```mdx
---
title: "Variables"
description: "Learn how TypeScript extends JavaScript variable declarations."
difficulty: beginner
order: 1
---

## Introduction

Your prose goes here. Supports standard Markdown + JSX.

### Your task

Export a `const` named `greeting` with the value `"Hello, World!"`.
```

**Frontmatter fields:**

| Field | Type | Values |
|---|---|---|
| `title` | string | Displayed in nav and lesson list |
| `description` | string | Shown in track page and search |
| `difficulty` | string | `beginner` \| `intermediate` \| `advanced` |
| `order` | number | Sort order within the track (1, 2, 3…) |

---

## config.ts

```ts
import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'javascript-01-variables',        // unique, used as progress key
  title: 'Variables',
  difficulty: 'beginner',
  sandpackTemplate: 'vanilla-ts',       // 'vanilla-ts' | 'react-ts'
  starterFiles: {
    'index.ts': `// Your starter code here\n`,
  },
  solutionFiles: {
    'index.ts': `export const greeting = "Hello, World!"\n`,
  },
  testFile: `...`,                       // see Test file format below
}
```

**`sandpackTemplate`:**
- `vanilla-ts` — TypeScript only, entry is `index.ts`
- `react-ts` — React + TypeScript, entry is `App.tsx`

---

## Test file format

Tests run inside the Sandpack iframe. They use a simple `check()` helper and must log a summary line that the toolbar detects.

### Vanilla TypeScript test

```ts
// Import from the user's file
import { greeting } from './index'

function check(name: string, ok: boolean, hint?: string) {
  if (ok) console.log('✅ ' + name)
  else console.log('❌ ' + name + (hint ? ': ' + hint : ''))
}

let passed = 0, failed = 0

// Each check() call = one test case
check('greeting is exported', typeof greeting !== 'undefined', 'Did you export greeting?')
check('greeting equals Hello, World!', greeting === 'Hello, World!', `Got: ${greeting}`)

// Summary line — REQUIRED (toolbar reads this to set pass/fail status)
if (failed === 0) console.log('✅ All tests passed!')
else console.log(`❌ ${failed} test(s) failed`)
```

### React test (setTimeout for DOM)

React tests wrap everything in a `setTimeout` to wait for the component to mount:

```ts
setTimeout(() => {
  const heading = document.querySelector('h1')
  let passed = 0, failed = 0

  function check(name, ok, hint) {
    if (ok) { console.log('✅ ' + name); passed++ }
    else { console.log('❌ ' + name + (hint ? ': ' + hint : '')); failed++ }
  }

  check('<h1> is rendered', !!heading, 'Render an <h1> element')
  check('h1 text is correct', heading?.textContent?.trim() === 'Hello', `Got: ${heading?.textContent}`)

  if (failed === 0) console.log('✅ All tests passed!')
  else console.log(`❌ ${failed} test(s) failed`)
}, 300)
```

**Rules:**
- Always end with the summary line (`✅ All tests passed!` or `❌ N test(s) failed`)
- React tests must use `setTimeout(..., 300)` — DOM isn't ready immediately
- Do not use backticks inside the `testFile` template literal string in `config.ts` — they close the outer template. Use `"` or `'` for strings inside tests, or escape as `\``
- Keep test descriptions concise — they appear as rows in the TestResultsPanel

---

## Track slugs

| Track | Slug | Template |
|---|---|---|
| JavaScript / TypeScript | `javascript` | `vanilla-ts` |
| React | `react` | `react-ts` |

To add a new track, create a new folder under `src/content/lessons/` and add the track metadata to `src/lib/content/loader.ts` (`TRACK_META`).

---

## Checklist for a new lesson

- [ ] Create `src/content/lessons/<track>/<order-slug>/lesson.mdx` with frontmatter
- [ ] Create `src/content/lessons/<track>/<order-slug>/config.ts` with `config: LessonConfig`
- [ ] `id` in config is unique and kebab-case
- [ ] `order` in frontmatter matches the numeric prefix of the folder name
- [ ] `testFile` ends with the summary line
- [ ] No backticks inside `testFile` template literal
- [ ] Run `pnpm dev` and open the lesson — verify editor loads and tests pass on solution code
