import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-03-state',
  title: 'State with useState',
  difficulty: 'beginner',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { useState } from "react";

export default function App() {
  // Add state here

  return (
    <div>
      {/* Display the count and add buttons */}
    </div>
  );
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{count}</p>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button onClick={() => setCount(prev => prev - 1)}>Decrement</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount(prev => prev + 1)}>Increment</button>
      </div>
    </div>
  );
}
`,
  },
  testFile: `const increment = Array.from(document.querySelectorAll('button'))
  .find(b => b.textContent?.trim() === 'Increment');
const decrement = Array.from(document.querySelectorAll('button'))
  .find(b => b.textContent?.trim() === 'Decrement');
const reset = Array.from(document.querySelectorAll('button'))
  .find(b => b.textContent?.trim() === 'Reset');
const p = document.querySelector('p');

const results: string[] = [];

if (!increment) results.push('❌ No button with text "Increment" found');
if (!decrement) results.push('❌ No button with text "Decrement" found');
if (!reset) results.push('❌ No button with text "Reset" found');
if (!p) results.push('❌ No <p> element found to display count');

if (results.length === 0 && increment && decrement && reset && p) {
  const initial = Number(p.textContent?.trim());
  if (isNaN(initial)) {
    results.push('❌ <p> must display a number, got: ' + p.textContent);
  } else {
    // test increment
    increment.click();
    const afterInc = Number(p.textContent?.trim());
    if (afterInc !== initial + 1) results.push('❌ Increment should add 1, got: ' + afterInc);

    // test decrement
    decrement.click();
    const afterDec = Number(p.textContent?.trim());
    if (afterDec !== initial) results.push('❌ Decrement should subtract 1');

    // test reset
    increment.click(); increment.click();
    reset.click();
    const afterReset = Number(p.textContent?.trim());
    if (afterReset !== 0) results.push('❌ Reset should set count to 0, got: ' + afterReset);
  }
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
