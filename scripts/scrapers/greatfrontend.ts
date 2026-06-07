/**
 * GreatFrontend scraper
 *
 * Scrapes the public problem metadata from GreatFrontend.
 * Only free/public problems are included. Full descriptions require a subscription.
 * We store the title, difficulty, topic, and a link to the original problem.
 */
import type { RawQuestion } from './types'

const BASE = 'https://www.greatfrontend.com'

// Known public free JS/TS coding questions on GreatFrontend (slug → metadata)
// These are the problems that appear on their public listing page without login.
const FREE_JS_PROBLEMS = [
  { slug: 'debounce', title: 'Debounce', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'throttle', title: 'Throttle', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'curry', title: 'Curry', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'flatten', title: 'Flatten', difficulty: 'easy', topic: 'JavaScript' },
  { slug: 'deep-clone', title: 'Deep Clone', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'promise-all', title: 'Promise.all', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'promise-any', title: 'Promise.any', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'promise-allsettled', title: 'Promise.allSettled', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'memoize', title: 'Memoize', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'memoize-ii', title: 'Memoize II', difficulty: 'hard', topic: 'JavaScript' },
  { slug: 'get-value', title: 'Get Value', difficulty: 'easy', topic: 'JavaScript' },
  { slug: 'set-value', title: 'Set Value', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'classnames', title: 'Classnames', difficulty: 'easy', topic: 'JavaScript' },
  { slug: 'event-emitter', title: 'Event Emitter', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'deep-equal', title: 'Deep Equal', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'type-utilities', title: 'Type Utilities', difficulty: 'medium', topic: 'TypeScript' },
  { slug: 'array-methods', title: 'Array Methods', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'function-bind', title: 'Function.prototype.bind', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'function-call', title: 'Function.prototype.call', difficulty: 'easy', topic: 'JavaScript' },
  { slug: 'json-stringify', title: 'JSON Stringify', difficulty: 'medium', topic: 'JavaScript' },
  { slug: 'json-parse', title: 'JSON Parse', difficulty: 'hard', topic: 'JavaScript' },
]

const FREE_UI_PROBLEMS = [
  { slug: 'todo-list', title: 'Todo List', difficulty: 'easy', topic: 'React' },
  { slug: 'tabs', title: 'Tabs', difficulty: 'easy', topic: 'React' },
  { slug: 'accordion', title: 'Accordion', difficulty: 'easy', topic: 'React' },
  { slug: 'modal-dialog', title: 'Modal Dialog', difficulty: 'medium', topic: 'React' },
  { slug: 'progress-bar', title: 'Progress Bar', difficulty: 'easy', topic: 'CSS' },
  { slug: 'holy-grail-layout', title: 'Holy Grail Layout', difficulty: 'easy', topic: 'CSS' },
  { slug: 'responsive-navbar', title: 'Responsive Navbar', difficulty: 'medium', topic: 'CSS' },
]

type ProblemMeta = {
  slug: string
  title: string
  difficulty: string
  topic: string
}

async function fetchDescription(category: string, slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/questions/${category}/${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const html = await res.text()

    // Try to grab the description section
    const match = html.match(/<div[^>]*class="[^"]*prose[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    if (!match) return null

    return match[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200)
  } catch {
    return null
  }
}

function normalizeDifficulty(d: string): 'easy' | 'medium' | 'hard' {
  if (d === 'easy') return 'easy'
  if (d === 'hard') return 'hard'
  return 'medium'
}

async function scrapeList(category: string, problems: ProblemMeta[]): Promise<RawQuestion[]> {
  const results: RawQuestion[] = []
  const CONCURRENCY = 3

  for (let i = 0; i < problems.length; i += CONCURRENCY) {
    const batch = problems.slice(i, i + CONCURRENCY)
    const descriptions = await Promise.all(
      batch.map((p) => fetchDescription(category, p.slug))
    )

    for (let j = 0; j < batch.length; j++) {
      const p = batch[j]
      const desc =
        descriptions[j] ??
        `Implement ${p.title}. See ${BASE}/questions/${category}/${p.slug} for the full problem statement.`

      results.push({
        source: 'greatfrontend',
        source_id: `${category}/${p.slug}`,
        title: p.title,
        description: desc,
        type: 'coding',
        difficulty: normalizeDifficulty(p.difficulty),
        topic: p.topic,
        companies: [],
        tags: [],
        is_premium: false,
      })
    }

    if (i + CONCURRENCY < problems.length) {
      await new Promise((r) => setTimeout(r, 400))
    }
  }

  return results
}

export async function scrapeGreatFrontend(): Promise<RawQuestion[]> {
  console.log('GreatFrontend: scraping free problems…')

  const [jsProblems, uiProblems] = await Promise.all([
    scrapeList('javascript', FREE_JS_PROBLEMS),
    scrapeList('user-interface', FREE_UI_PROBLEMS),
  ])

  const all = [...jsProblems, ...uiProblems]
  console.log(`GreatFrontend: scraped ${all.length} problems`)
  return all
}
