import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-07-lists',
  title: 'Lists & Conditional Rendering',
  difficulty: 'beginner',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const initialTodos: Todo[] = [
  // Add at least 3 todos here (mix of done: true and done: false)
];

export default function App() {
  const [todos] = useState<Todo[]>(initialTodos);
  const [showDoneOnly, setShowDoneOnly] = useState(false);

  const visible = showDoneOnly ? todos.filter(t => t.done) : todos;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={showDoneOnly}
          onChange={e => setShowDoneOnly(e.target.checked)}
        />
        {" "}Show completed only
      </label>
      <ul>
        {visible.map(todo => (
          <li key={todo.id}>
            {/* Show text, strike through if done */}
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const initialTodos: Todo[] = [
  { id: 1, text: "Learn TypeScript", done: true },
  { id: 2, text: "Build a React app", done: true },
  { id: 3, text: "Learn generics", done: false },
  { id: 4, text: "Deploy to Vercel", done: false },
];

export default function App() {
  const [todos] = useState<Todo[]>(initialTodos);
  const [showDoneOnly, setShowDoneOnly] = useState(false);

  const visible = showDoneOnly ? todos.filter(t => t.done) : todos;

  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 400 }}>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={showDoneOnly}
          onChange={e => setShowDoneOnly(e.target.checked)}
        />
        Show completed only
      </label>
      <ul style={{ paddingLeft: "1.25rem", lineHeight: 2 }}>
        {visible.map(todo => (
          <li key={todo.id} style={{ textDecoration: todo.done ? "line-through" : "none", color: todo.done ? "#9ca3af" : "inherit" }}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
`,
  },
  testFile: `const checkbox = document.querySelector('input[type="checkbox"]');
const ul = document.querySelector('ul');

const results: string[] = [];

if (!checkbox) results.push('❌ No checkbox found (for "Show completed only")');
if (!ul) results.push('❌ No <ul> found');

if (results.length === 0 && checkbox && ul) {
  const allItems = ul.querySelectorAll('li');
  if (allItems.length < 3) {
    results.push('❌ Need at least 3 todo items, found: ' + allItems.length);
  }

  // Check that checking the checkbox filters the list
  const totalCount = allItems.length;
  checkbox.click();
  setTimeout(() => {
    const filteredItems = ul.querySelectorAll('li');
    if (filteredItems.length === 0) {
      results.push('❌ No items shown when "Show completed only" is checked — make sure at least one todo has done: true');
    } else if (filteredItems.length >= totalCount) {
      results.push('❌ Filtering did not reduce the list — make sure some todos have done: false');
    }

    // Uncheck and verify all items return
    checkbox.click();
    setTimeout(() => {
      const unfiltered = ul.querySelectorAll('li');
      if (unfiltered.length !== totalCount) {
        results.push('❌ Unchecking should restore all items');
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
