# Known Issues

## 1. Turbopack broken on Windows + pnpm (Next.js 16)

**Symptom**: `pnpm build` (Turbopack) fails with:
```
Error: Next.js inferred your workspace root, but it may not be correct.
We couldn't find the Next.js package (next/package.json) from the project directory: ...\src\app
```

**Root cause**: Turbopack on Windows doesn't correctly follow pnpm's virtual store symlinks, especially when the project uses a `src/` directory. Setting `turbopack.root` in `next.config.ts` does not fix it.

**Workaround applied**: `package.json` scripts use `--webpack` flag:
```json
"dev": "next dev --webpack",
"build": "next build --webpack"
```

**Also applied**: `.npmrc` with `shamefully-hoist=true` so pnpm flattens `node_modules` (required for webpack to resolve packages correctly too).

---

## 2. `@base-ui/react` Button `render` prop conflicts with Next.js Link hydration

**Symptom**: `invariant expected layout router to be mounted` runtime error when using:
```tsx
<Button render={<Link href="/" />}>Click</Button>
```

**Root cause**: `@base-ui/react` v1's `render` prop is incompatible with Next.js 16's App Router hydration when wrapping a `<Link>` component.

**Fix**: Use plain `<Link>` elements styled with Tailwind classes instead of wrapping them in Button. Reserve `<Button>` for non-navigation actions (Reset, Run Tests, etc.).

---

## 3. `react-resizable-panels` v4 API changes

In v4, the exported names changed:
- `PanelGroup` → `Group`
- `PanelResizeHandle` → `Separator`
- `direction` prop → `orientation` prop

Our `playground-layout.tsx` already uses the correct v4 API.

---

## 4. `react-resizable-panels` vertical Group doesn't render

**Symptom**: Using `Group orientation="vertical"` from `react-resizable-panels` causes the entire layout to collapse — no editor, no instructions, no bottom panel.

**Root cause**: The vertical `Group` component fails to render when nested inside a flex container with `h-full`. The horizontal `Group` works fine.

**Workaround**: The bottom panel (test results) uses CSS `flex` instead of `react-resizable-panels`. The horizontal `Group` for instructions/editor/preview still works. Vertical resizing is done with custom mousedown/mousemove handlers.

---

## 5. Sandpack's built-in Run button is redundant

**Symptom**: When `autorun` is false, Sandpack shows its own "Run" button in the preview area. Our toolbar also has a "Run" / "Run Tests" button.

**Current state**: We kept Sandpack's built-in Run button and removed our toolbar. Reset + Solution buttons are in the editor tab bar.

---

## 6. `react-resizable-panels` needs inline styles for layout

**Symptom**: Using Tailwind classes like `flex-1 min-h-0` on containers holding `Group` components sometimes causes layout collapse.

**Workaround**: The `PlaygroundLayout` uses inline styles (`display: flex`, `flex: 1`, `minHeight: 0`) for all flex containers. This is more reliable across browsers and avoids Tailwind compilation edge cases.
