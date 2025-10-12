# Just JSX

[![No Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://github.com/ge3224/just-jsx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/ge3224/just-jsx)

**Write JSX without React.** A minimal TypeScript library (~171 lines) that transforms JSX syntax into vanilla DOM operations. Zero dependencies, framework-free, designed to be copied directly into your codebase.

Perfect for building web UIs when you want JSX's declarative syntax but don't need React's complexity.

```tsx
const App = ({ name }) => (
  <div>
    <h1>Hello, {name}!</h1>
    <button onClick={() => alert('Clicked!')}>
      Click me
    </button>
  </div>
);

document.body.appendChild(<App name="World" />);
```

## Why Just JSX?

**JSX is great. React is optional.**

Just JSX gives you:
- ✅ Familiar JSX syntax for building UIs
- ✅ Direct DOM manipulation (no virtual DOM overhead)
- ✅ Full TypeScript support with proper type inference
- ✅ SVG elements work out of the box
- ✅ Small enough to audit in 10 minutes (~171 lines)
- ✅ No build-time or runtime dependencies

Use it when you want the ergonomics of JSX without committing to a framework.

## Quick Start

### 1. Copy the source

**Option A: Git Submodule** (recommended for tracking updates)
```bash
git submodule add https://github.com/ge3224/just-jsx.git vendor/just-jsx
cd vendor/just-jsx && git checkout v0.1.6
```

**Option B: Direct Copy** (simplest)
```bash
curl -o src/jsx.ts https://raw.githubusercontent.com/ge3224/just-jsx/v0.1.6/src/index.ts
```

### 2. Configure your build tool

Tell your compiler to use Just JSX instead of React:

**TypeScript** (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "createDomElement",
    "jsxFragmentFactory": "createDomFragment"
  }
}
```

**Vite** (`vite.config.ts`)
```ts
export default {
  esbuild: {
    jsxFactory: "createDomElement",
    jsxFragment: "createDomFragment"
  }
};
```

**SWC** (`.swcrc`)
```json
{
  "jsc": {
    "transform": {
      "react": {
        "pragma": "createDomElement",
        "pragmaFrag": "createDomFragment"
      }
    }
  }
}
```

### 3. Start writing JSX

```tsx
import { createDomElement, createDomFragment } from './vendor/just-jsx/src';

const greeting = <h1>Hello JSX!</h1>;
document.body.appendChild(greeting);
```

## Examples

### Components with Props

```tsx
type GreetingProps = { name: string; emoji?: string };

const Greeting = ({ name, emoji = '👋' }: GreetingProps) => (
  <div class="greeting">
    <h2>{emoji} Hi, {name}!</h2>
  </div>
);

document.body.appendChild(<Greeting name="Alice" emoji="🎉" />);
```

### Lists and Conditionals

```tsx
const TodoList = ({ items, showCompleted }) => (
  <ul>
    {items
      .filter(item => showCompleted || !item.done)
      .map(item => (
        <li class={item.done ? 'completed' : ''}>
          {item.text}
        </li>
      ))}
  </ul>
);

const todos = [
  { text: 'Learn JSX', done: true },
  { text: 'Build something', done: false }
];

document.body.appendChild(
  <TodoList items={todos} showCompleted={true} />
);
```

### Event Handlers

```tsx
const Counter = () => {
  let count = 0;
  const button = (
    <button onClick={() => {
      count++;
      button.textContent = `Count: ${count}`;
    }}>
      Count: 0
    </button>
  );
  return button;
};

document.body.appendChild(<Counter />);
```

### SVG Graphics

```tsx
const Icon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill={color} />
    <path d="M12 6v6l4 4" stroke="white" stroke-width="2" />
  </svg>
);

document.body.appendChild(<Icon size={48} color="blue" />);
```

### Fragments

Use fragments to return multiple elements without a wrapper:

```tsx
const Header = () => (
  <>
    <h1>Title</h1>
    <p>Subtitle</p>
  </>
);
```

## TypeScript Support

Full type safety with autocomplete for all HTML and SVG elements:

```tsx
import type { FunctionalComponent } from './vendor/just-jsx/src';

// Typed component props
type ButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
};

const Button: FunctionalComponent<ButtonProps> = ({
  label,
  variant = 'primary',
  onClick
}) => (
  <button
    class={`btn btn-${variant}`}
    onClick={onClick}
  >
    {label}
  </button>
);

// Type errors caught at compile time
<Button label="Click" variant="invalid" />  // ❌ Error
<Button label="Click" variant="primary" />  // ✅ OK
```

## How It Works

JSX is syntactic sugar. Build tools transform it into function calls:

```tsx
// You write:
<div class="box">
  <span>Hello</span>
</div>

// Build tool transforms to:
createDomElement('div', { class: 'box' },
  createDomElement('span', null, 'Hello')
)

// Just JSX executes:
const div = document.createElement('div');
div.setAttribute('class', 'box');
const span = document.createElement('span');
span.textContent = 'Hello';
div.appendChild(span);
return div;
```

**Key behaviors:**
- Props starting with `on` become event listeners: `onClick={fn}` → `addEventListener('click', fn)`
- `style` prop accepts objects: `style={{ color: 'red' }}` → `style="color: red"`
- Boolean attributes work correctly: `disabled={false}` removes the attribute
- SVG elements use the correct XML namespace automatically
- Form properties like `value` and `checked` are set as properties, not attributes

## Security

Just JSX **does not sanitize input**. Follow these guidelines:

**✅ Safe patterns:**
```tsx
// Text content is auto-escaped by the browser
<div>{userInput}</div>

// Use textContent for plain text
<div textContent={userInput} />

// Validate URLs before rendering
const isValidUrl = url.startsWith('https://') || url.startsWith('/');
<a href={isValidUrl ? url : '#'}>{text}</a>
```

**❌ Unsafe patterns:**
```tsx
// Never use innerHTML with untrusted content
<div innerHTML={userProvidedHtml} />

// Always validate href attributes
<a href={userInput}>Link</a>  // Potential javascript: URLs
```

**Defense in depth:**
1. Set [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) headers
2. Validate all user input on the server
3. Serve content over HTTPS only
4. Use browser's built-in escaping (text content, not innerHTML)

See the [Security section in README](README.md#security-considerations) for more details.

## Advanced Patterns

See the [examples/recipes](./examples/recipes) directory for:

- **[Memory Management](./examples/recipes/memory-management.tsx)** - Cleaning up event listeners and timers
- Component composition patterns
- Form handling and validation
- Async rendering techniques
- CSS-in-JS alternatives

## Limitations

Just JSX is intentionally minimal. It does **not** provide:

- ❌ State management (use vanilla JS or [Simple State](https://github.com/ge3224/simple-state))
- ❌ Component lifecycle hooks (use vanilla patterns)
- ❌ Virtual DOM diffing (direct DOM updates only)
- ❌ Server-side rendering
- ❌ Hot module replacement
- ❌ React compatibility layer

If you need these features, use React. Just JSX is for projects where simplicity and control matter more than ecosystem features.

## API Reference

### `createDomElement<P>(tag, props, ...children): JSX.Element`

Creates a DOM element or invokes a functional component.

**Parameters:**
- `tag`: HTML/SVG tag name (string) or functional component (function)
- `props`: Object with attributes, properties, and event handlers
- `children`: Zero or more child elements (elements, strings, numbers, or arrays)

**Returns:** DOM `Element`, `DocumentFragment`, or primitive (string/number/boolean/null/undefined)

**Special props:**
- `key` and `ref` are filtered out (reserved for future use)
- Props starting with `on` + function value → event listeners
- `style` as object → converted to CSS string
- Boolean attributes (`disabled`, `readonly`, etc.) → removed when `false`
- Specific props (`value`, `checked`, `selected`, `innerHTML`) → set as properties

### `createDomFragment(props, ...children): DocumentFragment`

Creates a DocumentFragment (for JSX fragments `<></>`).

**Parameters:**
- `props`: Unused (fragments don't have props, but can have `children` via spread)
- `children`: Child elements to include in fragment

**Returns:** `DocumentFragment` containing all children

### `FunctionalComponent<P>`

TypeScript type for functional components:

```tsx
type FunctionalComponent<P = {}> = (
  props: P & { children?: JSX.Element | JSX.Element[] }
) => JSX.Element;
```

## Version Management

Track versions using git tags:

```bash
# View available versions
git tag

# Use specific version (submodule)
cd vendor/just-jsx
git fetch --tags
git checkout v0.1.6
cd ../..
git add vendor/just-jsx
git commit -m "Upgrade just-jsx to v0.1.6"

# Use specific version (direct copy)
curl -o src/jsx.ts https://raw.githubusercontent.com/ge3224/just-jsx/v0.1.6/src/index.ts
```

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Performance

Just JSX is designed for direct DOM manipulation with minimal overhead. Run benchmarks locally:

```bash
pnpm install
pnpm bench
```

Key performance characteristics:
- **Element creation**: ~183k ops/sec for simple elements
- **List rendering**: ~8.4k ops/sec for 10 items, ~922 ops/sec for 100 items
- **SVG rendering**: ~40k ops/sec for simple SVG elements
- **Comparison to vanilla**: ~20-30% overhead vs raw `document.createElement`

The overhead comes from JSX conveniences (prop processing, event listeners, style objects). For performance-critical sections, you can always drop down to vanilla DOM.

See [benchmark/index.bench.tsx](./benchmark/index.bench.tsx) for detailed benchmarks including:
- Basic operations (create, props, children, fragments)
- Scaling tests (lists, nesting, wide children)
- Real-world scenarios (todo lists, tables, forms, card grids)
- SVG rendering
- Comparison with vanilla DOM

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

MIT © Jacob Benison

---

**Not on npm by design.** Just JSX is meant to be vendored (copied into your codebase). This gives you:
- Full control over updates
- No supply chain vulnerabilities
- Easy auditing (just read the file)
- Zero installation friction

Copy the code, read it, modify it, own it.
