import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-04-hooks',
  title: 'Effects with useEffect',
  difficulty: 'intermediate',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  // Use useEffect to sync document.title with count

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { useState, useEffect } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
`,
  },
  testFile: `const btn = Array.from(document.querySelectorAll('button'))
  .find(b => b.textContent?.trim() === 'Increment');
const p = document.querySelector('p');

if (!btn) {
  console.log('❌ No button with text "Increment" found');
} else if (!p) {
  console.log('❌ No <p> element to display count');
} else {
  const initial = Number(p.textContent?.trim());
  if (isNaN(initial)) {
    console.log('❌ <p> must display a number');
  } else if (!document.title.includes(String(initial))) {
    console.log('❌ document.title should reflect the initial count. Got: ' + document.title);
  } else {
    btn.click();
    // Give React time to re-render and run effects
    setTimeout(() => {
      const count = p.textContent?.trim();
      if (!document.title.includes(count)) {
        console.log('❌ After increment, document.title should contain "' + count + '". Got: ' + document.title);
      } else {
        btn.click();
        setTimeout(() => {
          const count2 = p.textContent?.trim();
          if (!document.title.includes(count2)) {
            console.log('❌ After second increment, title should contain "' + count2 + '". Got: ' + document.title);
          } else {
            console.log('✅ All tests passed!');
          }
        }, 100);
      }
    }, 100);
  }
}
`,
}
