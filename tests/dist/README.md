# Dist Output Tests

This directory contains tests that verify the built `dist/` artifacts work correctly.

## Files

### `runtime.test.mjs`

Node.js runtime tests for the built JavaScript output (`dist/index.js`).

- Uses jsdom to simulate a browser DOM environment
- Tests 10 core features:
  - Element creation
  - Props handling
  - Fragment creation
  - SVG namespace
  - Functional components
  - Event listeners
  - Style objects
  - Null/undefined children handling
  - Boolean attributes
  - Type exports

Run with: `node tests/dist/runtime.test.mjs`

### `types.test.ts`

TypeScript type checking tests for the generated declaration file (`dist/index.d.ts`).

- Verifies `FunctionalComponent<P>` type is exported and usable
- Tests type-safe props for intrinsic elements
- Ensures proper children type inference
- Validates JSX expression types (primitives, nodes, etc.)

Run with: `tsc --noEmit tests/dist/types.test.ts`

### `browser.test.html`

Manual browser test file for visual verification.

- Tests all core features in a real browser environment
- Useful for debugging and visual confirmation
- Can be served with any HTTP server

Run with: `python3 -m http.server` then open `http://localhost:8000/tests/dist/browser.test.html`

## Running All Tests

```bash
pnpm test:dist
```

This runs both the runtime tests and TypeScript type checking.
