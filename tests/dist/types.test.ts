/**
 * Test TypeScript declarations from dist output
 *
 * This file verifies that the generated .d.ts file provides correct types.
 * Run with: tsc --noEmit test-dist-types.ts
 */

import { createDomElement, createDomFragment, FunctionalComponent } from '../../dist/index.js';

// Test 1: FunctionalComponent type is exported and usable
const Greeting: FunctionalComponent<{ name: string }> = (props) => {
  const children = Array.isArray(props.children) ? props.children : [props.children];
  return createDomElement('div', null, `Hello, ${props.name}`, ...children);
};

// Test 2: createDomElement accepts string tags
const div = createDomElement('div', { id: 'test' }, 'Content');

// Test 3: createDomElement accepts functional components
const component = createDomElement(Greeting, { name: 'World' });

// Test 4: createDomFragment works
const fragment = createDomFragment(null,
  createDomElement('p', null, 'First'),
  createDomElement('p', null, 'Second')
);

// Test 5: Props are properly typed (this should NOT error)
const button = createDomElement('button', {
  disabled: true,
  onClick: (e: MouseEvent) => console.log(e),
  style: { color: 'red' }
}, 'Click me');

// Test 6: Children can be various types
const mixed = createDomElement('div', null,
  'text',
  123,
  createDomElement('span', null, 'nested'),
  null,
  undefined,
  false
);

console.log('TypeScript type checking passed!');
