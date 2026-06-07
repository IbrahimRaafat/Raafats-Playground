import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-01-variables',
  title: 'Variables',
  difficulty: 'beginner',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// Declare an exported constant named 'greeting'
// with the value "Hello, World!"
`,
  },
  solutionFiles: {
    'index.ts': `export const greeting = "Hello, World!";
console.log(greeting);
`,
  },
  testFile: `import { greeting } from './index'

let passed = 0
let failed = 0

function check(name: string, ok: boolean, hint?: string) {
  if (ok) {
    console.log('✅ ' + name)
    passed++
  } else {
    console.log('❌ ' + name + (hint ? ': ' + hint : ''))
    failed++
  }
}

check(
  'greeting is exported',
  typeof greeting !== 'undefined',
  'Did you use: export const greeting = ...'
)

check(
  'greeting is a string',
  typeof greeting === 'string',
  'Expected type string, got ' + typeof greeting
)

check(
  'greeting equals "Hello, World!"',
  greeting === 'Hello, World!',
  'Got "' + greeting + '"'
)

if (failed === 0) {
  console.log('✅ All tests passed!')
} else {
  console.log('❌ ' + failed + ' test(s) failed')
}
`,
}
