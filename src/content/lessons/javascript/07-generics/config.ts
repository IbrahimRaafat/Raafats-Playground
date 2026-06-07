import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-07-generics',
  title: 'Generics',
  difficulty: 'intermediate',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// 1. Export identity<T>(value: T): T
// 2. Export last<T>(arr: T[]): T | undefined
// 3. Export filterTruthy<T>(arr: T[]): T[]
`,
  },
  solutionFiles: {
    'index.ts': `export function identity<T>(value: T): T {
  return value;
}

export function last<T>(arr: T[]): T | undefined {
  return arr[arr.length - 1];
}

export function filterTruthy<T>(arr: T[]): T[] {
  return arr.filter(Boolean) as T[];
}
`,
  },
  testFile: `import { identity, last, filterTruthy } from './index';

const results: string[] = [];

// identity
if (typeof identity !== 'function') {
  results.push('❌ identity must be a function');
} else {
  if (identity(42) !== 42) results.push('❌ identity(42) should return 42');
  if (identity('hi') !== 'hi') results.push('❌ identity("hi") should return "hi"');
  if (identity(true) !== true) results.push('❌ identity(true) should return true');
}

// last
if (typeof last !== 'function') {
  results.push('❌ last must be a function');
} else {
  if (last([1, 2, 3]) !== 3) results.push('❌ last([1,2,3]) should return 3');
  if (last(['a', 'b']) !== 'b') results.push('❌ last(["a","b"]) should return "b"');
  if (last([]) !== undefined) results.push('❌ last([]) should return undefined');
}

// filterTruthy
if (typeof filterTruthy !== 'function') {
  results.push('❌ filterTruthy must be a function');
} else {
  const r1 = filterTruthy([0, 1, 2, null, 3, undefined, false, 4]);
  if (JSON.stringify(r1) !== JSON.stringify([1, 2, 3, 4])) {
    results.push('❌ filterTruthy([0,1,2,null,3,undefined,false,4]) should return [1,2,3,4], got: ' + JSON.stringify(r1));
  }
  const r2 = filterTruthy(['', 'hello', '', 'world']);
  if (JSON.stringify(r2) !== JSON.stringify(['hello', 'world'])) {
    results.push('❌ filterTruthy of strings failed');
  }
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
