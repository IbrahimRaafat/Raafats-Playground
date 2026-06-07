/**
 * LeetCode scraper
 *
 * Fetches JavaScript/TypeScript/React tagged problems via the public GraphQL API.
 * Problem descriptions are not available without auth, so we store the slug and
 * a placeholder — the question can be enriched later or linked out to LeetCode.
 *
 * Company tags come from the community dataset:
 * https://github.com/hxu296/leetcode-company-wise-problems-2022
 */
import type { RawQuestion } from './types'

const GQL = 'https://leetcode.com/graphql'

const FRONTEND_TAGS = ['javascript', 'typescript', 'react', 'css', 'html', 'dom']

// Top companies in the community dataset that are relevant to frontend
const COMPANY_TAG_MAP: Record<string, string[]> = {}

type LeetCodeProblem = {
  questionFrontendId: string
  titleSlug: string
  title: string
  difficulty: string
  topicTags: { name: string; slug: string }[]
  isPaidOnly: boolean
}

function normalizeDifficulty(d: string): 'easy' | 'medium' | 'hard' {
  const lower = d.toLowerCase()
  if (lower === 'easy') return 'easy'
  if (lower === 'hard') return 'hard'
  return 'medium'
}

function inferTopic(tags: string[]): string {
  const lower = tags.map((t) => t.toLowerCase())
  if (lower.some((t) => t.includes('react'))) return 'React'
  if (lower.some((t) => t.includes('typescript'))) return 'TypeScript'
  if (lower.some((t) => t.includes('css'))) return 'CSS'
  if (lower.some((t) => t.includes('html') || t.includes('dom'))) return 'HTML/DOM'
  return 'JavaScript'
}

async function fetchLeetCodeProblems(): Promise<LeetCodeProblem[]> {
  const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          questionFrontendId
          titleSlug
          title
          difficulty
          topicTags { name slug }
          isPaidOnly
        }
      }
    }
  `

  const allProblems: LeetCodeProblem[] = []

  for (const tag of FRONTEND_TAGS) {
    try {
      const res = await fetch(GQL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
          Referer: 'https://leetcode.com',
        },
        body: JSON.stringify({
          query,
          variables: {
            categorySlug: '',
            limit: 200,
            skip: 0,
            filters: { tags: [tag] },
          },
        }),
      })

      const json = (await res.json()) as {
        data?: { problemsetQuestionList?: { questions: LeetCodeProblem[] } }
      }

      const problems = json?.data?.problemsetQuestionList?.questions ?? []
      allProblems.push(...problems)
    } catch (err) {
      console.warn(`LeetCode: failed to fetch tag "${tag}":`, err)
    }
  }

  // Deduplicate by titleSlug
  const seen = new Set<string>()
  return allProblems.filter((p) => {
    if (seen.has(p.titleSlug)) return false
    seen.add(p.titleSlug)
    return true
  })
}

async function fetchCompanyData(): Promise<Record<string, string[]>> {
  // Community dataset — maps problem slug → list of companies
  const slugToCompanies: Record<string, string[]> = {}

  // Top frontend-relevant companies
  const companies = [
    'google', 'meta', 'amazon', 'microsoft', 'netflix',
    'apple', 'airbnb', 'uber', 'twitter', 'linkedin',
  ]

  const displayName: Record<string, string> = {
    google: 'Google', meta: 'Meta', amazon: 'Amazon', microsoft: 'Microsoft',
    netflix: 'Netflix', apple: 'Apple', airbnb: 'Airbnb', uber: 'Uber',
    twitter: 'Twitter', linkedin: 'LinkedIn',
  }

  for (const company of companies) {
    try {
      const url =
        `https://raw.githubusercontent.com/hxu296/leetcode-company-wise-problems-2022/main/${company}.json`
      const res = await fetch(url)
      if (!res.ok) continue
      const data = (await res.json()) as Record<string, { title: string; titleSlug: string }[]>
      for (const problems of Object.values(data)) {
        for (const p of problems) {
          if (!slugToCompanies[p.titleSlug]) slugToCompanies[p.titleSlug] = []
          if (!slugToCompanies[p.titleSlug].includes(displayName[company])) {
            slugToCompanies[p.titleSlug].push(displayName[company])
          }
        }
      }
    } catch {
      console.warn(`LeetCode: failed to fetch company data for ${company}`)
    }
  }

  return slugToCompanies
}

export async function scrapeLeetCode(): Promise<RawQuestion[]> {
  console.log('LeetCode: fetching problems…')
  const [problems, companyMap] = await Promise.all([
    fetchLeetCodeProblems(),
    fetchCompanyData(),
  ])

  console.log(`LeetCode: found ${problems.length} problems`)

  return problems
    .filter((p) => !p.isPaidOnly)
    .map((p) => {
      const tagNames = p.topicTags.map((t) => t.name)
      return {
        source: 'leetcode',
        source_id: p.titleSlug,
        title: p.title,
        description: `Solve the "${p.title}" problem on LeetCode. See https://leetcode.com/problems/${p.titleSlug}/ for the full problem statement.`,
        type: 'coding' as const,
        difficulty: normalizeDifficulty(p.difficulty),
        topic: inferTopic(tagNames),
        companies: companyMap[p.titleSlug] ?? [],
        tags: tagNames,
        hint: undefined,
        starter_code: undefined,
        is_premium: false,
      }
    })
}
