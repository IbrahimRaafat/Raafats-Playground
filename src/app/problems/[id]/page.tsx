import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase/client'
import type { DbQuestion } from '@/lib/supabase/client'
import type { PlaygroundConfig, SandpackTemplate } from '@/lib/content/types'
import { ProblemPlayground } from './_components/problem-playground'
import { BreadcrumbNav } from '@/components/molecules/breadcrumb-nav/breadcrumb-nav'
import { ThemeToggle } from '@/components/atoms/theme-toggle/theme-toggle'
import { LanguageToggle } from '@/components/atoms/language-toggle/language-toggle'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const { data } = await supabase
    .from('questions')
    .select('title')
    .eq('id', id)
    .single()

  return { title: data ? `${data.title} — TS Playground` : 'Not found' }
}

async function getProblem(id: string): Promise<DbQuestion | null> {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data
}

function buildStarterFiles(problem: DbQuestion): Record<string, string> {
  const config = problem.playground_config
  if (config?.starterFiles) return config.starterFiles

  if (problem.starter_code) {
    return { '/index.ts': problem.starter_code }
  }

  return { '/index.ts': `// ${problem.title}\n// Write your solution here\n` }
}

function buildSolutionFiles(problem: DbQuestion): Record<string, string> | undefined {
  const config = problem.playground_config
  if (config?.solutionFiles) return config.solutionFiles
  return undefined
}

function buildTestFile(problem: DbQuestion): string | undefined {
  const config = problem.playground_config
  return undefined
}

function resolveTemplate(problem: DbQuestion): SandpackTemplate {
  const config = problem.playground_config
  return 'vanilla-ts'
}

export default async function ProblemPage({ params }: Props) {
  const { id } = await params
  const problem = await getProblem(id)
  if (!problem) notFound()

  const playgroundConfig: PlaygroundConfig = {
    showPreview: false,
    showConsole: true,
    showTests: true,
    testCodeVisible: true,
    autorun: false,
    ...problem.playground_config,
  }

  const starterFiles = buildStarterFiles(problem)
  const solutionFiles = buildSolutionFiles(problem)
  const testFile = buildTestFile(problem)
  const template = resolveTemplate(problem)

  return (
    <div className="h-screen flex flex-col">
      <BreadcrumbNav
        items={[
          { label: 'Problems', href: '/questions' },
          { label: problem.title },
        ]}
        actions={<><ThemeToggle /><LanguageToggle /></>}
      />

      <div className="flex-1 min-h-0">
        <div className="h-full">
          <ProblemPlayground
            problemId={problem.id}
            title={problem.title}
            description={problem.description}
            sandpackTemplate={template}
            starterFiles={starterFiles}
            solutionFiles={solutionFiles}
            testFile={testFile}
            playgroundConfig={playgroundConfig}
          />
        </div>
      </div>
    </div>
  )
}
