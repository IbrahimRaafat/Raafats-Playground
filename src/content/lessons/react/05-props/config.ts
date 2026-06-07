import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-05-props',
  title: 'Props & Component Composition',
  difficulty: 'beginner',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `// Create a UserCard component with props: name, role, avatar? (optional)
// Render it twice in App with different values.

interface UserCardProps {
  name: string;
  role: string;
  avatar?: string;
}

function UserCard({ name, role, avatar }: UserCardProps) {
  return (
    <div>
      {/* Show avatar or initials, then name and role */}
    </div>
  );
}

export default function App() {
  return (
    <div>
      {/* Render UserCard twice */}
    </div>
  );
}
`,
  },
  solutionFiles: {
    'App.tsx': `interface UserCardProps {
  name: string;
  role: string;
  avatar?: string;
}

function UserCard({ name, role, avatar }: UserCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", marginBottom: "0.5rem" }}>
      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#3178c6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.875rem" }}>
        {avatar ? <img src={avatar} alt={name} style={{ width: "100%", borderRadius: "50%" }} /> : initials}
      </div>
      <div>
        <p style={{ fontWeight: "bold", margin: 0 }}>{name}</p>
        <p style={{ color: "#6b7280", fontSize: "0.875rem", margin: 0 }}>{role}</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 400 }}>
      <UserCard name="Alice Johnson" role="Frontend Engineer" />
      <UserCard name="Bob Smith" role="Product Designer" />
    </div>
  );
}
`,
  },
  testFile: `const cards = document.querySelectorAll('div > div');
const allText = document.body.innerText;

const results: string[] = [];

// Check that at least two distinct names appear in the DOM
const paragraphs = Array.from(document.querySelectorAll('p'));
const textContents = paragraphs.map(p => p.textContent?.trim() ?? '');

const hasName = textContents.some(t => t.length > 0 && isNaN(Number(t)));
if (!hasName) {
  results.push('❌ No name text found in <p> elements');
}

if (paragraphs.length < 4) {
  results.push('❌ Expected at least two UserCard instances (each with a name and role <p>)');
}

// Check there are at least 2 different name-like values
const uniqueTexts = new Set(textContents.filter(t => t.length > 2));
if (uniqueTexts.size < 2) {
  results.push('❌ The two UserCard instances appear to have the same content — use different props');
}

if (results.length === 0) {
  console.log('✅ All tests passed!');
} else {
  results.forEach(r => console.log(r));
}
`,
}
