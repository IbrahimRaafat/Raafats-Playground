# TS Playground

An interactive in-browser TypeScript and React learning platform. Write code, run auto-graded tests, and follow structured lessons — no setup required.

**Live:** [raafats-playground.vercel.app](https://raafats-playground.vercel.app)

---

## Features

- **In-browser editor** powered by Sandpack (CodeSandbox's hosted Parcel bundler)
- **24 structured lessons** across JavaScript and React tracks
- **Auto-graded tests** with per-test-case pass/fail results
- **Free playground** for experimenting without a lesson
- **Interview questions** — 150+ coding and theory questions from Google, Meta, Amazon, and more, backed by Supabase
- **Weekly scraping** from LeetCode, GreatFrontend, and BFE.dev via GitHub Actions
- **i18n** — English and Arabic (RTL) with a language toggle
- **Dark/light mode**
- **Lesson search** (Ctrl+K command palette)
- **Progress tracking** via localStorage (no sign-in required)

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, webpack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Editor/Runner | Sandpack (`@codesandbox/sandpack-react`) |
| Database | Supabase (PostgreSQL) |
| Deployment | Vercel |
| Component docs | Storybook 10 |

---

## Getting started

### Prerequisites

- Node.js 22+
- pnpm 10+

### Install

```bash
git clone https://github.com/IbrahimRaafat/Raafats-Playground.git
cd Raafats-Playground
pnpm install
```

### Environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://vwfxobbxbgbozaouzzkj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from Supabase dashboard>
```

### Run locally

```bash
pnpm dev        # http://localhost:3000
pnpm build      # production build
pnpm storybook  # component docs at http://localhost:6006
```

---

## Project structure

```
src/
  app/                          # Next.js App Router pages
    _components/                # Home page client components
    learn/                      # /learn routes + components
    playground/                 # /playground page
    questions/                  # /questions page + components
    api/lessons/                # lesson search JSON endpoint
  components/
    atoms/                      # Smallest UI primitives (Button, Badge, etc.)
    molecules/                  # Composed components (Toolbar, LessonCard, etc.)
    organisms/                  # Full sections (PlaygroundLayout, LessonSearch, etc.)
    providers/                  # Context providers (Theme, Locale, PlaygroundRoot)
    design-system/              # Design token stories
  content/
    lessons/
      javascript/               # 01-variables … 10-async
      react/                    # 01-jsx … 10-performance
  lib/
    content/                    # Lesson loader (fs, server-only)
    i18n/                       # en.ts / ar.ts translations
    progress/                   # localStorage progress store
    questions/                  # Static question bank (data.ts)
    sandpack/                   # Sandpack theme config
    supabase/                   # Supabase client + DbQuestion type
scripts/
  seed-questions.ts             # Seeds manual questions into Supabase
  scrape.ts                     # Orchestrates all scrapers
  scrapers/
    leetcode.ts                 # LeetCode GraphQL + community company data
    bfe.ts                      # BFE.dev HTML scrape
    greatfrontend.ts            # GreatFrontend free problems
.github/
  workflows/
    scrape-questions.yml        # Weekly scrape cron (Sunday 02:00 UTC)
```

---

## Documentation

| Document | Description |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Component layers, data flow, key decisions |
| [docs/LESSONS.md](docs/LESSONS.md) | How to add new lessons |
| [docs/DATABASE.md](docs/DATABASE.md) | Supabase schema, RLS, migrations |
| [docs/SCRAPING.md](docs/SCRAPING.md) | Scrapers, running locally, adding sources |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel setup, env vars, CI/CD |
| [KNOWN_ISSUES.md](KNOWN_ISSUES.md) | Workarounds for known bugs |
| [PROGRESS.md](PROGRESS.md) | Build phase history and roadmap |
