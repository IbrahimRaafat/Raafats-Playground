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
  testFile: `import { greeting } from './index';

if (typeof greeting !== 'string') {
  console.log('❌ greeting must be a string, got:', typeof greeting);
} else if (greeting !== 'Hello, World!') {
  console.log('❌ Expected "Hello, World!" but got:', greeting);
} else {
  console.log('✅ All tests passed!');
}
`,
}
