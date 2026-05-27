import type { SandpackTemplate } from '@/lib/content/types'

export const DEFAULT_TEMPLATES: Record<SandpackTemplate, Record<string, string>> = {
  'vanilla-ts': {
    'index.ts': `console.log('Hello, TypeScript!');\n`,
    'tsconfig.json': JSON.stringify(
      { compilerOptions: { strict: true, target: 'ES2020', module: 'ESNext' } },
      null,
      2
    ),
  },
  'react-ts': {
    'App.tsx': `export default function App() {
  return <h1>Hello, React!</h1>;
}
`,
    'index.tsx': `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`,
  },
}
