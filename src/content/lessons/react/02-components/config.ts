import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-02-components',
  title: 'Props & Components',
  difficulty: 'beginner',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `// Create a Greeting component that accepts a 'name' prop
// and renders <p>Hello, {name}!</p>
// Then render <Greeting name="React" /> from App

export default function App() {
  return <div>Add your Greeting component here</div>;
}
`,
  },
  solutionFiles: {
    'App.tsx': `type GreetingProps = { name: string };

function Greeting({ name }: GreetingProps) {
  return <p>Hello, {name}!</p>;
}

export default function App() {
  return <Greeting name="React" />;
}
`,
  },
  testFile: `const p = document.querySelector('p');
if (!p) {
  console.log('❌ No <p> element found');
} else if (p.textContent?.trim() !== 'Hello, React!') {
  console.log('❌ <p> should contain "Hello, React!", got:', p.textContent);
} else {
  console.log('✅ All tests passed!');
}
`,
}
