import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-06-union-types',
  title: 'Union Types & Narrowing',
  difficulty: 'intermediate',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// 1. Export a function 'formatValue(val: string | number)':
//    - if string → return val.toUpperCase()
//    - if number → return val * 2
//
// 2. Export a type alias 'Status' = "active" | "inactive" | "pending"
`,
  },
  solutionFiles: {
    'index.ts': `export function formatValue(val: string | number): string | number {
  if (typeof val === "string") {
    return val.toUpperCase();
  }
  return val * 2;
}

export type Status = "active" | "inactive" | "pending";
`,
  },
  testFile: `import { formatValue } from './index';

const results: string[] = [];

if (typeof formatValue !== 'function') {
  results.push('❌ formatValue must be a function');
} else {
  const r1 = formatValue("hello");
  if (r1 !== "HELLO") results.push('❌ formatValue("hello") should return "HELLO", got: ' + r1);

  const r2 = formatValue("world");
  if (r2 !== "WORLD") results.push('❌ formatValue("world") should return "WORLD", got: ' + r2);

  const r3 = formatValue(5);
  if (r3 !== 10) results.push('❌ formatValue(5) should return 10, got: ' + r3);

  const r4 = formatValue(0);
  if (r4 !== 0) results.push('❌ formatValue(0) should return 0, got: ' + r4);

  const r5 = formatValue(-3);
  if (r5 !== -6) results.push('❌ formatValue(-3) should return -6, got: ' + r5);
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
