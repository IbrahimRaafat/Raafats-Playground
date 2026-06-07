import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'react-09-context',
  title: 'React Context',
  difficulty: 'intermediate',
  sandpackTemplate: 'react-ts',
  starterFiles: {
    'App.tsx': `import { createContext, useContext } from 'react'

// 1. Create UserContext with type { name: string }
// 2. Provide { name: 'Alice' } at the App level
// 3. Create a Welcome component that reads the context and renders:
//    <p>Welcome, {name}!</p>

export default function App() {
  return <div>Build your context here</div>
}
`,
  },
  solutionFiles: {
    'App.tsx': `import { createContext, useContext } from 'react'

type User = { name: string }
const UserContext = createContext<User>({ name: '' })

function Welcome() {
  const { name } = useContext(UserContext)
  return <p>Welcome, {name}!</p>
}

export default function App() {
  return (
    <UserContext.Provider value={{ name: 'Alice' }}>
      <Welcome />
    </UserContext.Provider>
  )
}
`,
  },
  testFile: `setTimeout(() => {
  const p = document.querySelector('p')
  let passed = 0
  let failed = 0

  function check(name, ok, hint) {
    if (ok) { console.log('✅ ' + name); passed++ }
    else { console.log('❌ ' + name + (hint ? ': ' + hint : '')); failed++ }
  }

  check('A <p> element is rendered', !!p, 'Render a <p> inside the Welcome component')
  check('p contains "Welcome, Alice!"', p?.textContent?.trim() === 'Welcome, Alice!', 'Got: "' + p?.textContent?.trim() + '"')

  if (failed === 0) { console.log('✅ All tests passed!') }
  else { console.log('❌ ' + failed + ' test(s) failed') }
}, 300)
`,
}
