import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-08-type-utilities',
  title: 'Type Utilities',
  difficulty: 'advanced',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

// 1. export type ProductPreview = Pick<Product, ...>
// 2. export type ProductUpdate = Partial<Product>
// 3. export type ProductWithoutDesc = Omit<Product, ...>
// 4. export function createPreview(p: Product): ProductPreview
`,
  },
  solutionFiles: {
    'index.ts': `interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export type ProductPreview = Pick<Product, "id" | "name">;

export type ProductUpdate = Partial<Product>;

export type ProductWithoutDesc = Omit<Product, "description">;

export function createPreview(p: Product): ProductPreview {
  return { id: p.id, name: p.name };
}
`,
  },
  testFile: `import { createPreview } from './index';

const results: string[] = [];

const product = { id: 1, name: "Widget", price: 9.99, description: "A fine widget" };

if (typeof createPreview !== 'function') {
  results.push('❌ createPreview must be a function');
} else {
  const preview = createPreview(product);
  if (typeof preview !== 'object' || preview === null) {
    results.push('❌ createPreview must return an object');
  } else {
    if (preview.id !== 1) results.push('❌ preview.id should be 1, got: ' + preview.id);
    if (preview.name !== "Widget") results.push('❌ preview.name should be "Widget", got: ' + preview.name);
    if ('price' in preview) results.push('❌ preview should NOT include price');
    if ('description' in preview) results.push('❌ preview should NOT include description');
  }
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
