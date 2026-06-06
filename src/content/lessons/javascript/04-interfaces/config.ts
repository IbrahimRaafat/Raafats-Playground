import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-04-interfaces',
  title: 'Interfaces & Object Types',
  difficulty: 'beginner',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// Define an exported interface named 'User' with:
//   name: string
//   age: number
//   email?: string  (optional)
//
// Then export a 'user' object that satisfies the interface.
`,
  },
  solutionFiles: {
    'index.ts': `export interface User {
  name: string;
  age: number;
  email?: string;
}

export const user: User = {
  name: "Alice",
  age: 30,
};
`,
  },
  testFile: `import { user } from './index';
import type { User } from './index';

const results: string[] = [];

if (typeof user !== 'object' || user === null) {
  results.push('❌ user must be an exported object');
} else {
  if (typeof (user as any).name !== 'string') results.push('❌ user.name must be a string');
  if (typeof (user as any).age !== 'number') results.push('❌ user.age must be a number');
  if ('email' in (user as any) && typeof (user as any).email !== 'string') {
    results.push('❌ user.email must be a string when provided');
  }
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
