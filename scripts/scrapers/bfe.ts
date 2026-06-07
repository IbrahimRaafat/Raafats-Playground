/**
 * BFE.dev scraper
 *
 * Scrapes the public problem list from https://bigfrontend.dev/problem
 * All problems are free and include title, description, and difficulty.
 */
import type { RawQuestion } from './types'

const BASE = 'https://bigfrontend.dev'

type BFEListItem = {
  id: number
  title: string
  slug: string
  difficulty: string
}

function normalizeDifficulty(d: string): 'easy' | 'medium' | 'hard' {
  const lower = d.toLowerCase()
  if (lower === 'easy') return 'easy'
  if (lower === 'hard') return 'hard'
  return 'medium'
}

function extractText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function fetchProblemList(): Promise<BFEListItem[]> {
  const res = await fetch(`${BASE}/problem`)
  const html = await res.text()

  const items: BFEListItem[] = []

  // Extract problem rows — BFE renders as a table with data attributes or structured HTML
  // Pattern: /problems/<id>/<slug>
  const linkRe = /href="\/problem\/(\d+)\/([^"]+)"/g
  const diffRe = /difficulty[^>]*>([^<]+)</gi

  const links = [...html.matchAll(linkRe)]
  const diffs = [...html.matchAll(diffRe)]

  for (let i = 0; i < links.length; i++) {
    const id = parseInt(links[i][1])
    const slug = links[i][2]
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    const diff = diffs[i]?.[1]?.trim() ?? 'medium'
    items.push({ id, title, slug, difficulty: diff })
  }

  return items
}

async function fetchProblemDetail(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/problem/${slug}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    })
    const html = await res.text()

    // Problem description is usually inside a .description or article tag
    const match = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
      ?? html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)

    if (match) return extractText(match[1]).slice(0, 1000)
    return null
  } catch {
    return null
  }
}

export async function scrapeBFE(): Promise<RawQuestion[]> {
  console.log('BFE.dev: fetching problem list…')

  let items: BFEListItem[] = []
  try {
    items = await fetchProblemList()
  } catch (err) {
    console.warn('BFE.dev: failed to fetch problem list:', err)
    return []
  }

  console.log(`BFE.dev: found ${items.length} problems, fetching details…`)

  const results: RawQuestion[] = []

  // Fetch details with concurrency limit to avoid rate limiting
  const CONCURRENCY = 5
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY)
    const details = await Promise.all(
      batch.map((item) => fetchProblemDetail(`${item.id}/${item.slug}`))
    )

    for (let j = 0; j < batch.length; j++) {
      const item = batch[j]
      const description =
        details[j] ??
        `Implement the "${item.title}" function. See https://bigfrontend.dev/problem/${item.id}/${item.slug} for the full problem statement.`

      results.push({
        source: 'bfe',
        source_id: String(item.id),
        title: item.title,
        description,
        type: 'coding',
        difficulty: normalizeDifficulty(item.difficulty),
        topic: 'JavaScript',
        companies: [],
        tags: [],
        is_premium: false,
      })
    }

    // Polite delay between batches
    if (i + CONCURRENCY < items.length) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  console.log(`BFE.dev: scraped ${results.length} problems`)
  return results
}
