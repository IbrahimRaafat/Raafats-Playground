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
