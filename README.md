# Just JSX

[![No Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](https://github.com/ge3224/just-jsx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A vendorable vanilla TypeScript JSX parser with zero dependencies. Just ~200 lines of type-safe DOM rendering, built to be copied into your project—framework-agnostic and audit-friendly.

Built for projects where vanilla TypeScript makes sense and stability beats ecosystem churn.

## Features

- **Zero dependencies**: No supply chain risk, no transitive dependencies
- **Framework-agnostic**: Works with any build tool that supports JSX (SWC, Babel, TypeScript)
- **DOM rendering**: JSX components and fragments that compile to real DOM elements
- **SVG support**: First-class support for inline SVG elements
- **Type-safe**: Full TypeScript support with proper type inference
- **Audit-friendly**: Small enough to actually read and understand (~200 lines)

## Installation

### Git Submodule

```bash
git submodule add https://github.com/ge3224/just-jsx.git
```

```typescript
import { createDomElement, createDomFragment } from './just-jsx/src/index';
```

Pin to a version:
```bash
cd just-jsx && git checkout v0.1.0
```

### Direct Copy

Copy `src/index.ts` into your project.

```typescript
import { createDomElement, createDomFragment } from './just-jsx';
```

### npm

Not planned. Vendoring is the point.

## Usage

### Configure Your Build Tool

The JSX pragma functions need to be configured in your build tool. Here are examples for common setups:

#### SWC (recommended)

Add to your `.swcrc`:

```json
{
  "jsc": {
    "parser": {
      "syntax": "typescript",
      "tsx": true
    },
    "transform": {
      "react": {
        "pragma": "createDomElement",
        "pragmaFrag": "createDomFragment",
        "runtime": "classic"
      }
    }
  }
}
```

#### TypeScript

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "createDomElement",
    "jsxFragmentFactory": "createDomFragment"
  }
}
```

### Basic Example

```tsx
import { createDomElement, createDomFragment } from './just-jsx';

// Simple element
const greeting = <p>Hello, world!</p>;
document.body.appendChild(greeting);

// Component with props
const Greeting = ({ name }: { name: string }) => {
  return <h1>Hello, {name}!</h1>;
};

document.body.appendChild(<Greeting name="Alice" />);
```

### Fragments

```tsx
const List = () => {
  return (
    <>
      <p>Item 1</p>
      <p>Item 2</p>
      <p>Item 3</p>
    </>
  );
};

document.body.appendChild(<List />);
```

### Event Handlers

```tsx
const Button = () => {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <button onClick={handleClick}>Click me</button>;
};

document.body.appendChild(<Button />);
```

### SVG Support

```tsx
const Icon = () => {
  return (
    <svg width="100" height="100">
      <circle
        cx="50"
        cy="50"
        r="40"
        stroke="green"
        stroke-width="4"
        fill="yellow"
      />
    </svg>
  );
};

document.body.appendChild(<Icon />);
```

## API

### `createDomElement(tag, props, ...children)`

Pragma function for processing JSX elements.

- **tag**: HTML tag name (string) or functional component
- **props**: Object containing attributes and event handlers
- **children**: Child nodes (DOM nodes or strings)

Returns a DOM element or the result of invoking a functional component.

### `createDomFragment(_props, ...children)`

Pragma function for processing JSX fragments (`<></>`).

- **_props**: Unused (fragments don't have props)
- **children**: Child nodes to include in the DocumentFragment

Returns a DocumentFragment containing the children.

## How It Works

Just JSX provides two pragma functions that your build tool uses to transform JSX:

1. **createDomElement**: Converts JSX elements like `<div>Hello</div>` into `document.createElement('div')` calls
2. **createDomFragment**: Converts JSX fragments like `<></>` into `new DocumentFragment()` calls

The library handles:
- Creating DOM elements with the correct namespace (HTML vs SVG)
- Setting attributes and properties
- Attaching event listeners (any prop starting with "on")
- Appending children (text nodes, elements, arrays)
- Invoking functional components

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Build
pnpm build

# Type check
pnpm type-check
```

## Versioning

This project uses [Semantic Versioning](https://semver.org/). All releases are tagged with git tags (e.g., `v0.1.0`, `v0.2.0`).

### Pinning to a Specific Version

When using as a git submodule, you can pin to a specific version:

```bash
# Add submodule
git submodule add https://github.com/ge3224/just-jsx.git

# Pin to specific version
cd just-jsx
git checkout v0.1.0
cd ..
git add just-jsx
git commit -m "Pin just-jsx to v0.1.0"
```

### Upgrading Versions

To upgrade to a newer version:

```bash
cd just-jsx
git fetch --tags
git checkout v0.2.0  # or whatever version you want
cd ..
git add just-jsx
git commit -m "Upgrade just-jsx to v0.2.0"
```

## License

MIT
