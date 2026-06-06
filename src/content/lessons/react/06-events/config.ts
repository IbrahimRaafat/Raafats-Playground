import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-06-events',
  title: 'Event Handling',
  difficulty: 'beginner',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Add value to items and clear input
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Type something..."
      />
      <button type="submit">Add</button>
      <p>You typed: {value}</p>
      <ul>
        {/* render items here */}
      </ul>
    </form>
  );
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { useState } from "react";

export default function App() {
  const [value, setValue] = useState("");
  const [items, setItems] = useState<string[]>([]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!value.trim()) return;
    setItems(prev => [...prev, value.trim()]);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 400 }}>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Type something..."
          style={{ flex: 1, padding: "0.4rem 0.6rem", border: "1px solid #d1d5db", borderRadius: "0.375rem" }}
        />
        <button type="submit">Add</button>
      </div>
      <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>You typed: {value}</p>
      <ul style={{ paddingLeft: "1.25rem" }}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </form>
  );
}
`,
  },
  testFile: `const input = document.querySelector('input');
const btn = Array.from(document.querySelectorAll('button')).find(b => b.type === 'submit' || b.textContent?.trim() === 'Add');
const p = document.querySelector('p');
const ul = document.querySelector('ul');

const results: string[] = [];

if (!input) results.push('❌ No <input> element found');
if (!btn) results.push('❌ No submit button found');
if (!p) results.push('❌ No <p> to show "You typed:" text');
if (!ul) results.push('❌ No <ul> to show submitted items');

if (results.length === 0 && input && btn && p && ul) {
  // Test live feedback
  const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
  nativeInputSetter?.call(input, 'hello');
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));

  setTimeout(() => {
    if (!p.textContent?.includes('hello')) {
      results.push('❌ <p> should show "You typed: hello" after typing. Got: ' + p.textContent);
    }

    // Submit and check list
    btn.click();
    setTimeout(() => {
      const items = ul.querySelectorAll('li');
      if (items.length === 0) {
        results.push('❌ No <li> items found after submitting');
      } else if (![...items].some(li => li.textContent?.includes('hello'))) {
        results.push('❌ Submitted item "hello" not found in list');
      }

      if (results.length === 0) {
        console.log('✅ All tests passed!');
      } else {
        results.forEach(r => console.log(r));
      }
    }, 100);
  }, 100);
}
`,
}
