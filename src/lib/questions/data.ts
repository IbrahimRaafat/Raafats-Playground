export type Difficulty = 'easy' | 'medium' | 'hard'
export type QuestionType = 'coding' | 'theory'

export type Question = {
  id: string
  companies: string[]
  title: string
  description: string
  difficulty: Difficulty
  type: QuestionType
  topic: string
  answer?: string   // theory questions
  hint?: string     // coding questions — approach / key insight
  starterCode?: string
}

export const COMPANIES = [
  'Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix',
  'Apple', 'Airbnb', 'Uber', 'Twitter', 'LinkedIn',
] as const

export const COMPANY_COLORS: Record<string, string> = {
  Google:    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  Meta:      'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  Amazon:    'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  Microsoft: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300',
  Netflix:   'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  Apple:     'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
  Airbnb:    'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  Uber:      'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900',
  Twitter:   'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
  LinkedIn:  'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
}

export const questions: Question[] = [
  // ── CODING ───────────────────────────────────────────────────────────────

  {
    id: 'debounce',
    companies: ['Google', 'Meta', 'Airbnb'],
    title: 'Implement debounce()',
    description:
      'Write a debounce function that delays invoking a callback until after a given wait time has elapsed since the last call. It should return a new function that, when called repeatedly, only executes the original function once the user has stopped calling it for the specified milliseconds.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Use setTimeout and clearTimeout. Store the timer ID in a closure so each new call can cancel the previous one.',
    starterCode:
      'function debounce(fn, wait) {\n  // your implementation\n}\n\n// Example usage:\nconst log = debounce(() => console.log("called"), 300);\nlog(); log(); log(); // logs once after 300ms',
  },
  {
    id: 'throttle',
    companies: ['Amazon', 'LinkedIn'],
    title: 'Implement throttle()',
    description:
      'Write a throttle function that ensures a callback is called at most once per given time interval, no matter how many times it is triggered.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Track when the function was last called. If the elapsed time exceeds the limit, invoke it and update the timestamp.',
    starterCode:
      'function throttle(fn, limit) {\n  // your implementation\n}',
  },
  {
    id: 'flatten',
    companies: ['Google', 'Amazon', 'Microsoft'],
    title: 'Flatten a nested array',
    description:
      'Write a function flatten(arr, depth?) that flattens a nested array up to the specified depth (default: Infinity). Do not use Array.prototype.flat().',
    difficulty: 'easy',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Use recursion. For each element, if it is an array and depth > 0, recurse with depth - 1; otherwise push to the result.',
    starterCode:
      'function flatten(arr, depth = Infinity) {\n  // your implementation\n}',
  },
  {
    id: 'promise-all',
    companies: ['Meta', 'Netflix', 'Google'],
    title: 'Implement Promise.all()',
    description:
      'Implement your own version of Promise.all() that takes an array of promises and returns a single promise that resolves with an array of results, or rejects as soon as any promise rejects.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Keep a results array and a counter. Resolve when all promises have resolved. Reject immediately on the first rejection.',
    starterCode:
      'function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    // your implementation\n  });\n}',
  },
  {
    id: 'event-emitter',
    companies: ['Meta', 'Uber'],
    title: 'Implement an EventEmitter class',
    description:
      'Build a class with on(event, listener), off(event, listener), and emit(event, ...args) methods. Multiple listeners can be registered for the same event.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Store listeners in a Map<string, Set<Function>>. emit() calls all registered listeners for the event.',
    starterCode:
      'class EventEmitter {\n  on(event, listener) {}\n  off(event, listener) {}\n  emit(event, ...args) {}\n}',
  },
  {
    id: 'deep-clone',
    companies: ['Google', 'Amazon', 'Twitter'],
    title: 'Deep clone an object',
    description:
      'Write a deepClone(obj) function that returns a deep copy of a plain object/array. Handle nested objects, arrays, null, and primitive values. Do not use JSON.parse/JSON.stringify.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Check if the value is an array or object, then recurse. Handle null and primitives as base cases.',
    starterCode:
      'function deepClone(obj) {\n  // your implementation\n}',
  },
  {
    id: 'curry',
    companies: ['Google', 'Meta'],
    title: 'Implement curry()',
    description:
      'Write a curry() function that converts a function with multiple parameters into a series of unary functions. curry(add)(1)(2)(3) should equal add(1,2,3).',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Compare the number of accumulated arguments against fn.length. If enough, call fn; otherwise return another curried function.',
    starterCode:
      'function curry(fn) {\n  // your implementation\n}',
  },
  {
    id: 'use-local-storage',
    companies: ['Airbnb', 'Meta'],
    title: 'Build a useLocalStorage hook',
    description:
      'Create a React hook useLocalStorage<T>(key, initialValue) that behaves like useState but persists the value to localStorage. It should read the stored value on mount and write back on every update.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'React',
    hint: 'Initialise state lazily from localStorage. Use a useEffect (or state setter callback) to sync writes back to localStorage on every change.',
    starterCode:
      'function useLocalStorage(key, initialValue) {\n  // your implementation\n}',
  },
  {
    id: 'infinite-scroll',
    companies: ['Meta', 'Twitter', 'LinkedIn'],
    title: 'Build an infinite scroll list',
    description:
      'Create a React component that loads more items when the user scrolls near the bottom of the page. Use IntersectionObserver to detect when a sentinel element enters the viewport, then fetch the next page of data.',
    difficulty: 'hard',
    type: 'coding',
    topic: 'React',
    hint: 'Place a ref on a sentinel <div> at the bottom of the list. Use useEffect to attach an IntersectionObserver that triggers a load when it becomes visible.',
    starterCode:
      'function InfiniteList() {\n  // your implementation\n}',
  },
  {
    id: 'memoize',
    companies: ['Amazon', 'Google'],
    title: 'Implement memoize()',
    description:
      'Write a memoize(fn) higher-order function that caches the result of fn for a given set of arguments. Subsequent calls with the same arguments should return the cached result without re-executing fn.',
    difficulty: 'easy',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Use a Map where the key is JSON.stringify(args). For the first call, compute and store the result; on subsequent calls, return the cached value.',
    starterCode:
      'function memoize(fn) {\n  // your implementation\n}',
  },
  {
    id: 'pipe',
    companies: ['Google', 'Airbnb'],
    title: 'Implement pipe() / compose()',
    description:
      'Write a pipe(...fns) function that returns a new function which executes each function in sequence, passing the output of one as the input to the next. Also implement compose() which runs them right-to-left.',
    difficulty: 'easy',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Use Array.prototype.reduce. pipe uses reduce (left-to-right), compose uses reduceRight.',
    starterCode:
      'const pipe = (...fns) => (x) => /* reduce here */;\nconst compose = (...fns) => (x) => /* reduceRight here */;',
  },
  {
    id: 'use-previous',
    companies: ['Meta'],
    title: 'Build a usePrevious hook',
    description:
      'Create a React hook usePrevious<T>(value: T) that returns the previous render\'s value of the given variable.',
    difficulty: 'easy',
    type: 'coding',
    topic: 'React',
    hint: 'Store the value in a useRef. Update the ref inside a useEffect (which runs after the render), so during the current render the ref still holds the previous value.',
    starterCode:
      'function usePrevious(value) {\n  // your implementation\n}',
  },
  {
    id: 'virtual-list',
    companies: ['Meta', 'LinkedIn', 'Airbnb'],
    title: 'Implement a virtual list (windowing)',
    description:
      'Build a React component that renders only the items currently visible in the viewport from a potentially huge list (10 000+ items). Compute which items are in view based on the scroll position and item height.',
    difficulty: 'hard',
    type: 'coding',
    topic: 'React',
    hint: 'Track scrollTop with a scroll event listener. Compute startIndex = Math.floor(scrollTop / itemHeight) and endIndex = startIndex + visibleCount. Render only those items with top-padding to preserve scroll height.',
    starterCode:
      'function VirtualList({ items, itemHeight, containerHeight }) {\n  // your implementation\n}',
  },
  {
    id: 'typescript-generic-pick',
    companies: ['Microsoft', 'Google'],
    title: 'Implement Pick<T, K> from scratch',
    description:
      'Using only TypeScript mapped types and key remapping, implement your own version of the built-in Pick<T, K> utility type. Then use it to create a type UserPreview that picks id and name from a User type.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'TypeScript',
    hint: 'Use a mapped type: { [Key in K]: T[Key] }. Constrain K with extends keyof T.',
    starterCode:
      'type MyPick<T, K extends keyof T> = {\n  // your mapped type here\n};\n\ntype User = { id: number; name: string; email: string; age: number };\ntype UserPreview = MyPick<User, "id" | "name">;',
  },
  {
    id: 'fetch-with-retry',
    companies: ['Amazon', 'Netflix'],
    title: 'Fetch with automatic retry',
    description:
      'Write an async function fetchWithRetry(url, retries = 3) that fetches a URL and retries up to retries times on failure, with exponential backoff between attempts.',
    difficulty: 'medium',
    type: 'coding',
    topic: 'JavaScript',
    hint: 'Use a for loop with a try/catch. On failure, wait 2^attempt * 100ms before the next retry. Throw after all retries are exhausted.',
    starterCode:
      'async function fetchWithRetry(url, retries = 3) {\n  // your implementation\n}',
  },

  // ── THEORY ───────────────────────────────────────────────────────────────

  {
    id: 'theory-closures',
    companies: ['Google', 'Meta', 'Amazon'],
    title: 'Explain closures in JavaScript',
    description: 'What is a closure? Give a practical example of when you would use one.',
    difficulty: 'easy',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'A closure is a function that retains access to its lexical scope — the variables defined in the enclosing function — even after that outer function has returned.\n\nPractical uses:\n• Counter factory: const makeCounter = () => { let n = 0; return () => ++n; }\n• Data privacy: wrapping private state that cannot be accessed from outside\n• Partial application / currying: pre-filling arguments\n• Event handlers that capture loop variables (use let or a closure factory)',
  },
  {
    id: 'theory-event-loop',
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft'],
    title: 'Explain the JavaScript event loop',
    description: 'How does JavaScript handle asynchronous operations if it is single-threaded?',
    difficulty: 'medium',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'JavaScript runs on a single thread but delegates I/O and timers to the browser/Node APIs. When those operations complete, their callbacks are placed in the task queue (macrotask queue).\n\nThe event loop continuously checks: if the call stack is empty, it dequeues the next macrotask and pushes it onto the stack. Microtasks (Promise.then, queueMicrotask) run after every task and before the next one — draining the microtask queue completely each time.\n\nOrder per iteration: current call stack → all microtasks → one macrotask (setTimeout, I/O) → all microtasks again → render → next macrotask.',
  },
  {
    id: 'theory-ts-interface-type',
    companies: ['Microsoft', 'Google', 'Meta'],
    title: 'interface vs type in TypeScript',
    description: 'What are the key differences between interface and type aliases in TypeScript? When would you prefer one over the other?',
    difficulty: 'easy',
    type: 'theory',
    topic: 'TypeScript',
    answer:
      'Both can describe the shape of an object, but:\n\ninterface:\n• Can be merged (declaration merging) — useful for extending third-party types\n• Can extend other interfaces and classes\n• Better error messages in most cases\n\ntype:\n• Can represent unions, intersections, tuples, primitives, and template literal types\n• Cannot be re-opened for merging\n• More powerful for complex type-level programming\n\nGeneral rule: prefer interface for objects/classes (especially public APIs); use type for unions, utility types, and computed types.',
  },
  {
    id: 'theory-virtual-dom',
    companies: ['Meta', 'Netflix', 'Airbnb'],
    title: 'What is the virtual DOM and how does React use it?',
    description: 'Explain how Reacts virtual DOM works and why it was introduced.',
    difficulty: 'easy',
    type: 'theory',
    topic: 'React',
    answer:
      'The virtual DOM is a lightweight JavaScript representation of the actual DOM tree. React keeps a copy in memory and, on each state change, re-renders the component tree into a new virtual DOM snapshot.\n\nReconciliation: React diffs the new virtual DOM against the previous one using a heuristic algorithm (O(n) instead of O(n^3)). It then computes the minimal set of real DOM mutations and batches them into a single update.\n\nWhy it helps: direct DOM manipulation is slow. Batching and minimizing real DOM writes significantly improves performance in complex UIs. React 18 adds concurrent rendering on top of this, allowing work to be paused and resumed.',
  },
  {
    id: 'theory-event-delegation',
    companies: ['Meta', 'Google', 'Amazon'],
    title: 'What is event delegation?',
    description: 'Explain event delegation and describe a scenario where you would use it.',
    difficulty: 'easy',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'Event delegation is the technique of attaching a single event listener to a parent element instead of many listeners to each child. It relies on event bubbling — events fired on a child bubble up to the parent.\n\nInside the listener, event.target identifies which child was actually clicked.\n\nWhen to use it:\n• Long lists of items (e.g. a 1 000-item todo list) — avoids 1 000 separate listeners\n• Dynamically added elements — no need to re-attach listeners when new items are added\n• Memory efficiency — fewer listener objects\n\nExample: attach one click handler to a <ul> and check if event.target.matches("li") to act on individual list items.',
  },
  {
    id: 'theory-useeffect-vs-uselayouteffect',
    companies: ['Meta', 'Airbnb'],
    title: 'useEffect vs useLayoutEffect',
    description: 'What is the difference between useEffect and useLayoutEffect? When should you use each?',
    difficulty: 'medium',
    type: 'theory',
    topic: 'React',
    answer:
      'useEffect runs asynchronously after the browser has painted the screen. It does not block the visual update, making it the right choice for most side effects: data fetching, subscriptions, logging.\n\nuseLayoutEffect fires synchronously after all DOM mutations but before the browser paints. This makes it suitable for measuring DOM nodes or making DOM changes that must be in place before the user sees anything (e.g. positioning a tooltip based on its measured size).\n\nDefault to useEffect. Switch to useLayoutEffect only when you observe a visible flicker caused by a DOM change happening after paint.',
  },
  {
    id: 'theory-hooks-rules',
    companies: ['Meta', 'Netflix'],
    title: 'What are the rules of React hooks?',
    description: 'List the rules that must be followed when using React hooks and explain why each rule exists.',
    difficulty: 'easy',
    type: 'theory',
    topic: 'React',
    answer:
      '1. Only call hooks at the top level — never inside loops, conditions, or nested functions. React relies on the call order to match hooks to their stored state between renders. Any branching would cause mismatches.\n\n2. Only call hooks from React function components or custom hooks — not from regular JavaScript functions. This ensures hooks are always called in a React rendering context.\n\nThe eslint-plugin-react-hooks enforces both rules automatically.',
  },
  {
    id: 'theory-css-specificity',
    companies: ['Google', 'Airbnb', 'Twitter'],
    title: 'Explain CSS specificity',
    description: 'How does the browser decide which CSS rule wins when multiple rules target the same element?',
    difficulty: 'easy',
    type: 'theory',
    topic: 'CSS',
    answer:
      'Specificity is calculated as a three-part score (a, b, c):\n• a = number of ID selectors (#id)\n• b = number of class, attribute, and pseudo-class selectors (.class, [attr], :hover)\n• c = number of type selectors and pseudo-elements (div, ::before)\n\nHigher specificity wins. Inline styles beat all selectors. !important overrides everything (use sparingly).\n\nExamples:\n• div p → (0, 0, 2)\n• .nav a → (0, 1, 1)\n• #header → (1, 0, 0)\n\nWhen specificity is equal, the rule that appears later in the stylesheet wins (cascade order).',
  },
  {
    id: 'theory-var-let-const',
    companies: ['Amazon', 'Google', 'Meta'],
    title: 'var vs let vs const',
    description: 'What are the differences between var, let, and const in JavaScript?',
    difficulty: 'easy',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'var:\n• Function-scoped (or global if outside any function)\n• Hoisted and initialised to undefined\n• Can be re-declared and re-assigned\n• Creates temporal issues inside loops (classic closure-in-loop bug)\n\nlet:\n• Block-scoped\n• Hoisted but NOT initialised (temporal dead zone — accessing before declaration throws)\n• Can be re-assigned, cannot be re-declared in the same scope\n\nconst:\n• Block-scoped, temporal dead zone\n• Must be initialised at declaration, cannot be re-assigned\n• The binding is constant, not the value — object properties can still be mutated\n\nPrefer const by default. Use let when re-assignment is needed. Avoid var.',
  },
  {
    id: 'theory-promise',
    companies: ['Amazon', 'Google', 'Microsoft'],
    title: 'What is a Promise? How does it differ from async/await?',
    description: 'Explain the Promise API and how async/await is related to it.',
    difficulty: 'easy',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'A Promise is an object representing a value that may be available now, in the future, or never. It has three states: pending, fulfilled, or rejected.\n\nYou attach callbacks with .then(onFulfilled, onRejected) and .catch(onRejected). Promises are chainable and avoid callback hell.\n\nasync/await is syntactic sugar on top of Promises. An async function always returns a Promise. await pauses execution of the async function until the awaited Promise settles, then resumes with the resolved value — or throws on rejection (caught with try/catch).\n\nUnder the hood, await is equivalent to .then() — the runtime creates microtasks to resume the function. They are the same mechanism; async/await is just more readable.',
  },
  {
    id: 'theory-null-undefined',
    companies: ['Amazon', 'Google'],
    title: 'null vs undefined in JavaScript',
    description: 'What is the difference between null and undefined? When would you use each?',
    difficulty: 'easy',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'undefined: the default value for uninitialized variables, missing object properties, or function parameters that were not supplied. The runtime sets this automatically.\n\nnull: an explicit absence of value — a developer deliberately sets it to signal "no value here".\n\nKey differences:\n• typeof undefined === "undefined"; typeof null === "object" (historical bug)\n• null == undefined is true (loose equality), null === undefined is false\n• JSON.stringify omits undefined values but keeps null\n\nUsage convention: use undefined to mean "not yet set / does not exist"; use null to explicitly mark something as "intentionally empty".',
  },
  {
    id: 'theory-flexbox-grid',
    companies: ['Airbnb', 'Google', 'Twitter'],
    title: 'CSS Flexbox vs Grid — when to use each?',
    description: 'What are the key differences between Flexbox and CSS Grid, and which layout method should you choose in different situations?',
    difficulty: 'easy',
    type: 'theory',
    topic: 'CSS',
    answer:
      'Flexbox is one-dimensional — it lays items out along a single axis (row or column). It is ideal for distributing space among items in a line: navbars, button groups, centering a single element.\n\nCSS Grid is two-dimensional — it controls both rows and columns simultaneously. It is the right choice for page-level layouts, card grids, and any design where you need items to align in both dimensions at once.\n\nRule of thumb:\n• Component / widget internals → Flexbox\n• Page layout / grid of cards → Grid\n\nBoth can often achieve the same result, but Grid removes the need for wrapper elements when dealing with two-axis alignment.',
  },
  {
    id: 'theory-ts-generics',
    companies: ['Microsoft', 'Google', 'Meta'],
    title: 'Explain TypeScript generics',
    description: 'What are generics in TypeScript and why are they useful? Give a practical example.',
    difficulty: 'medium',
    type: 'theory',
    topic: 'TypeScript',
    answer:
      'Generics allow you to write reusable code that works with multiple types while preserving type safety. Instead of using any, you parameterise the type:\n\nfunction identity<T>(value: T): T { return value; }\nconst n = identity(42);    // T inferred as number\nconst s = identity("hi"); // T inferred as string\n\nCommon use-cases:\n• Generic data structures: Array<T>, Map<K,V>, Promise<T>\n• Utility functions: first<T>(arr: T[]): T\n• React components: useState<User | null>(null)\n• Constrained generics: function getKey<T, K extends keyof T>(obj: T, key: K): T[K]\n\nGenerics let the compiler track types through your code, catching mismatches at compile time instead of at runtime.',
  },
  {
    id: 'theory-weakmap',
    companies: ['Google', 'Meta'],
    title: 'What is a WeakMap and when would you use it?',
    description: 'Explain WeakMap and WeakSet in JavaScript and describe a real-world use case.',
    difficulty: 'medium',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      'A WeakMap is a collection of key-value pairs where keys must be objects (or registered symbols). Unlike Map, it holds weak references to its keys — if no other reference to the key object exists, the garbage collector can reclaim it, automatically removing the entry from the WeakMap.\n\nWeakMap is not iterable (no .size, no .keys(), no .forEach()).\n\nReal-world uses:\n• Storing private data associated with class instances without preventing garbage collection\n• Caching computed results keyed by DOM nodes — when the node is removed from the DOM and dereferenced, the cache entry is automatically freed\n• Framework internals: React/Vue use weak references to track component metadata\n\nWeakSet is the set equivalent — stores objects with weak references, useful for tracking which objects have been "visited" in an algorithm.',
  },
  {
    id: 'theory-equality',
    companies: ['Meta', 'Amazon'],
    title: 'Explain == vs === in JavaScript',
    description: 'What is the difference between loose equality (==) and strict equality (===)? When does type coercion occur?',
    difficulty: 'easy',
    type: 'theory',
    topic: 'JavaScript',
    answer:
      '=== (strict equality) checks both value AND type — no coercion. It returns true only if both operands are the same type and value.\n\n== (loose equality) performs type coercion before comparing:\n• If types differ, one side is converted: number vs string, boolean vs number, null/undefined, etc.\n• null == undefined is true; null === undefined is false\n• 0 == false is true; 0 === false is false\n• "" == false is true; "" === false is false\n\nAlways use === in production code — coercion rules are complex, lead to subtle bugs, and reduce readability. The only common exception: val == null checks for both null and undefined in one expression.',
  },
]
