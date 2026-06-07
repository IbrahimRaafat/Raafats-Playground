import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-08-custom-hooks',
  title: 'Custom Hooks',
  difficulty: 'intermediate',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { useState } from "react";

// Create useCounter hook here
function useCounter(initial = 0) {
  // implement: return { count, increment, decrement, reset }
}

export default function App() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { useState } from "react";

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
}

export default function App() {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", textAlign: "center" }}>
      <p style={{ fontSize: "3rem", fontWeight: "bold", margin: "0 0 1rem" }}>{count}</p>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        <button onClick={decrement}>Decrement</button>
        <button onClick={reset}>Reset</button>
        <button onClick={increment}>Increment</button>
      </div>
    </div>
  );
}
`,
  },
  testFile: `const btns = Array.from(document.querySelectorAll('button'));
const inc = btns.find(b => b.textContent?.trim() === 'Increment');
const dec = btns.find(b => b.textContent?.trim() === 'Decrement');
const rst = btns.find(b => b.textContent?.trim() === 'Reset');
const p = document.querySelector('p');

const results: string[] = [];

if (!inc) results.push('❌ No "Increment" button');
if (!dec) results.push('❌ No "Decrement" button');
if (!rst) results.push('❌ No "Reset" button');
if (!p) results.push('❌ No <p> to display count');

if (results.length === 0 && inc && dec && rst && p) {
  const init = Number(p.textContent?.trim());
  if (isNaN(init)) { results.push('❌ <p> must show a number'); }
  else {
    inc.click(); inc.click(); inc.click();
    const after3 = Number(p.textContent?.trim());
    if (after3 !== init + 3) results.push('❌ 3× Increment should add 3. Got: ' + after3);

    dec.click();
    const afterDec = Number(p.textContent?.trim());
    if (afterDec !== init + 2) results.push('❌ Decrement should subtract 1. Got: ' + afterDec);

    rst.click();
    const afterReset = Number(p.textContent?.trim());
    if (afterReset !== init) results.push('❌ Reset should return to initial value. Got: ' + afterReset);
  }
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
