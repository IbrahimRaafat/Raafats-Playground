import type { LessonConfig } from '@/lib/content/types'

export const config: LessonConfig = {
  id: 'js-09-classes',
  title: 'Classes',
  difficulty: 'intermediate',
  sandpackTemplate: 'vanilla-ts',
  starterFiles: {
    'index.ts': `// Create a Rectangle class with width, height, area(), and perimeter()
// Export it as the default export

`,
  },
  solutionFiles: {
    'index.ts': `export default class Rectangle {
  constructor(public width: number, public height: number) {}

  area(): number {
    return this.width * this.height;
  }

  perimeter(): number {
    return 2 * (this.width + this.height);
  }
}
`,
  },
  testFile: `import Rectangle from './index'

let passed = 0
let failed = 0

function check(name: string, ok: boolean, hint?: string) {
  if (ok) { console.log('✅ ' + name); passed++ }
  else { console.log('❌ ' + name + (hint ? ': ' + hint : '')); failed++ }
}

const rect = new Rectangle(4, 5)
check('Rectangle can be instantiated', rect instanceof Rectangle, 'Export Rectangle as default export')
check('width is set correctly', rect.width === 4, 'Constructor should set this.width')
check('height is set correctly', rect.height === 5, 'Constructor should set this.height')
check('area() returns width * height', rect.area() === 20, 'Expected 4 * 5 = 20')
check('perimeter() returns 2*(w+h)', rect.perimeter() === 18, 'Expected 2*(4+5) = 18')

const rect2 = new Rectangle(3, 7)
check('area() works for other sizes', rect2.area() === 21, 'Expected 3 * 7 = 21')

if (failed === 0) { console.log('✅ All tests passed!') }
else { console.log('❌ ' + failed + ' test(s) failed') }
`,
}
