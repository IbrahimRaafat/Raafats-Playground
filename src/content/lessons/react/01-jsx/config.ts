import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-01-jsx',
  title: 'JSX Basics',
  difficulty: 'beginner',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `export default function App() {
  // Update this component to return an <h1> that says "Hello, React!"
  return <div>Fix me!</div>;
}
`,
  },
  solutionFiles: {
    'App.tsx': `export default function App() {
  return <h1>Hello, React!</h1>;
}
`,
  },
  testFile: `// This test checks the rendered output via the DOM
const h1 = document.querySelector('h1');
if (!h1) {
  console.log('❌ No <h1> element found in the page');
} else if (h1.textContent?.trim() !== 'Hello, React!') {
  console.log('❌ <h1> text should be "Hello, React!", got:', h1.textContent);
} else {
  console.log('✅ All tests passed!');
}
`,
}
