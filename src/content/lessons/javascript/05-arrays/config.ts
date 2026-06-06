import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-05-arrays',
  title: 'Arrays & Tuples',
  difficulty: 'intermediate',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// 1. Export a 'scores' array of numbers (at least 3 values, mix above/below 80)
// 2. Export 'passing' — scores >= 80 derived with .filter()
// 3. Export 'range' as a [number, number] tuple: [min, max]
`,
  },
  solutionFiles: {
    'index.ts': `export const scores: number[] = [90, 75, 85, 60, 92];

export const passing = scores.filter(s => s >= 80);

export const range: [number, number] = [
  Math.min(...scores),
  Math.max(...scores),
];
`,
  },
  testFile: `import { scores, passing, range } from './index';

const results: string[] = [];

// scores
if (!Array.isArray(scores)) {
  results.push('❌ scores must be an array');
} else if (scores.length < 3) {
  results.push('❌ scores must contain at least 3 numbers');
} else if (!scores.every(s => typeof s === 'number')) {
  results.push('❌ every element in scores must be a number');
}

// passing
if (!Array.isArray(passing)) {
  results.push('❌ passing must be an array');
} else if (passing.some(s => s < 80)) {
  results.push('❌ passing must only contain scores >= 80');
} else {
  const expected = scores.filter(s => s >= 80);
  if (JSON.stringify(passing) !== JSON.stringify(expected)) {
    results.push('❌ passing must be derived from scores using .filter(s => s >= 80)');
  }
}

// range
if (!Array.isArray(range) || range.length !== 2) {
  results.push('❌ range must be a tuple [min, max]');
} else {
  const [min, max] = range;
  if (min !== Math.min(...scores)) results.push('❌ range[0] must be the minimum score');
  if (max !== Math.max(...scores)) results.push('❌ range[1] must be the maximum score');
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
