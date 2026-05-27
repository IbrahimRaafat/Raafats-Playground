import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-03-types',
  title: 'Types & Interfaces',
  difficulty: 'beginner',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// Define and export a type named 'Point' with x and y number fields
// Then export a 'distance' function that returns the distance between two Points
`,
  },
  solutionFiles: {
    'index.ts': `export type Point = { x: number; y: number };

export function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}
`,
  },
  testFile: `import { distance } from './index';
import type { Point } from './index';

const results: string[] = [];

const p1: Point = { x: 0, y: 0 };
const p2: Point = { x: 3, y: 4 };

const d = distance(p1, p2);
if (Math.abs(d - 5) > 0.001) {
  results.push('❌ distance({0,0}, {3,4}) should be 5, got: ' + d);
}

const same = distance(p1, p1);
if (same !== 0) {
  results.push('❌ distance of a point to itself should be 0, got: ' + same);
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
