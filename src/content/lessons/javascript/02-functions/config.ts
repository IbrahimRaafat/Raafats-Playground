import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-02-functions',
  title: 'Functions',
  difficulty: 'beginner',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// Write and export a function named 'add'
// that takes two numbers and returns their sum
`,
  },
  solutionFiles: {
    'index.ts': `export function add(a: number, b: number): number {
  return a + b;
}
`,
  },
  testFile: `import { add } from './index';

const results: string[] = [];

if (typeof add !== 'function') {
  results.push('❌ add must be a function');
} else {
  if (add(1, 2) !== 3) results.push('❌ add(1, 2) should return 3, got: ' + add(1, 2));
  if (add(0, 0) !== 0) results.push('❌ add(0, 0) should return 0, got: ' + add(0, 0));
  if (add(-1, 1) !== 0) results.push('❌ add(-1, 1) should return 0, got: ' + add(-1, 1));
  if (add(10, 20) !== 30) results.push('❌ add(10, 20) should return 30, got: ' + add(10, 20));
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
