import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-10-async',
  title: 'Async / Await',
  difficulty: 'intermediate',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// Export an async function named 'delay'
// Parameters: ms (number)
// Returns: Promise<string> that resolves with "done" after ms milliseconds

`,
  },
  solutionFiles: {
    'index.ts': `export async function delay(ms: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve('done'), ms);
  });
}
`,
  },
  testFile: `import { delay } from './index'

let passed = 0
let failed = 0

function check(name: string, ok: boolean, hint?: string) {
  if (ok) { console.log('✅ ' + name); passed++ }
  else { console.log('❌ ' + name + (hint ? ': ' + hint : '')); failed++ }
}

async function run() {
  check('delay is a function', typeof delay === 'function', 'Export a function named delay')

  const result = delay(10)
  check('delay returns a Promise', result instanceof Promise, 'The function must return a Promise')

  const value = await result
  check('Promise resolves with "done"', value === 'done', 'Expected the string "done", got: ' + value)

  const start = Date.now()
  await delay(50)
  const elapsed = Date.now() - start
  check('delay waits the correct time', elapsed >= 40, 'Expected at least 40ms delay, got: ' + elapsed + 'ms')

  if (failed === 0) { console.log('✅ All tests passed!') }
  else { console.log('❌ ' + failed + ' test(s) failed') }
}

run()
`,
}
