import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-10-performance',
  title: 'Performance',
  difficulty: 'advanced',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { useMemo } from 'react'

// Create an ExpensiveList component that:
// - Accepts items: number[] and multiplier: number as props
// - Uses useMemo to compute items.map(n => n * multiplier)
// - Renders each result in a <li> inside a <ul>

export default function App() {
  return <ExpensiveList items={[1, 2, 3]} multiplier={10} />
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { useMemo } from 'react'

type Props = { items: number[]; multiplier: number }

function ExpensiveList({ items, multiplier }: Props) {
  const computed = useMemo(() => items.map((n) => n * multiplier), [items, multiplier])
  return (
    <ul>
      {computed.map((v, i) => <li key={i}>{v}</li>)}
    </ul>
  )
}

export default function App() {
  return <ExpensiveList items={[1, 2, 3]} multiplier={10} />
}
`,
  },
  testFile: `setTimeout(() => {
  const items = document.querySelectorAll('li')
  let passed = 0
  let failed = 0

  function check(name, ok, hint) {
    if (ok) { console.log('✅ ' + name); passed++ }
    else { console.log('❌ ' + name + (hint ? ': ' + hint : '')); failed++ }
  }

  check('A <ul> with <li> items is rendered', items.length > 0, 'Render <li> elements inside a <ul>')
  check('Correct number of items (3)', items.length === 3, 'Expected 3 <li> items, got ' + items.length)
  check('First item is 10 (1 * 10)', items[0]?.textContent?.trim() === '10', 'Got: ' + items[0]?.textContent?.trim())
  check('Second item is 20 (2 * 10)', items[1]?.textContent?.trim() === '20', 'Got: ' + items[1]?.textContent?.trim())
  check('Third item is 30 (3 * 10)', items[2]?.textContent?.trim() === '30', 'Got: ' + items[2]?.textContent?.trim())

  if (failed === 0) { console.log('✅ All tests passed!') }
  else { console.log('❌ ' + failed + ' test(s) failed') }
}, 300)
`,
}
