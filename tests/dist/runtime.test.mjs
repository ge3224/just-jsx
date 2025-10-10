/**
 * Test script for dist output
 *
 * Verifies that the built dist/index.js works correctly in a Node.js environment
 * with jsdom for DOM simulation.
 */

import { JSDOM } from 'jsdom';
import { createDomElement, createDomFragment } from '../../dist/index.js';

// Setup jsdom environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.Node = dom.window.Node;
global.DocumentFragment = dom.window.DocumentFragment;

console.log('🧪 Testing dist output...\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
    passed++;
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(`  Error: ${error.message}`);
    failed++;
  }
}

// Test 1: Simple element creation
test('Simple element creation', () => {
  const el = createDomElement('div', null, 'Hello');
  if (el.tagName !== 'DIV') throw new Error('Wrong tag name');
  if (el.textContent !== 'Hello') throw new Error('Wrong text content');
});

// Test 2: Element with props
test('Element with props', () => {
  const el = createDomElement('button', { disabled: true, class: 'btn' }, 'Click');
  if (!el.disabled) throw new Error('disabled prop not set');
  if (el.getAttribute('class') !== 'btn') throw new Error('class not set');
  if (el.textContent !== 'Click') throw new Error('Wrong text content');
});

// Test 3: Fragment creation
test('Fragment creation', () => {
  const frag = createDomFragment(null,
    createDomElement('p', null, 'First'),
    createDomElement('p', null, 'Second')
  );
  if (!(frag instanceof DocumentFragment)) throw new Error('Not a DocumentFragment');
  if (frag.childNodes.length !== 2) throw new Error('Wrong child count');
});

// Test 4: SVG namespace
test('SVG namespace', () => {
  const svg = createDomElement('svg', null,
    createDomElement('circle', { r: '10' })
  );
  if (svg.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('Wrong SVG namespace');
  if (svg.firstChild.namespaceURI !== 'http://www.w3.org/2000/svg') throw new Error('Wrong circle namespace');
});

// Test 5: Functional component
test('Functional component', () => {
  const Greeting = (props) => {
    return createDomElement('div', null, `Hello, ${props.name}`);
  };
  const el = createDomElement(Greeting, { name: 'World' });
  if (el.textContent !== 'Hello, World') throw new Error('Component failed');
});

// Test 6: Event listeners
test('Event listeners', () => {
  let clicked = false;
  const button = createDomElement('button', {
    onclick: () => { clicked = true; }
  }, 'Click');
  button.click();
  if (!clicked) throw new Error('Event listener not attached');
});

// Test 7: Style object
test('Style object', () => {
  const el = createDomElement('div', {
    style: { color: 'red', 'font-size': '14px' }
  });
  if (!el.getAttribute('style').includes('color: red')) throw new Error('Style not applied');
  if (!el.getAttribute('style').includes('font-size: 14px')) throw new Error('Style not applied');
});

// Test 8: Null/undefined children
test('Null/undefined children handling', () => {
  const el = createDomElement('div', null, null, undefined, false, true, 'Text');
  if (el.childNodes.length !== 1) throw new Error('Null values not filtered');
  if (el.textContent !== 'Text') throw new Error('Wrong text');
});

// Test 9: Boolean attributes
test('Boolean attributes', () => {
  const input = createDomElement('input', { disabled: false, required: true });
  if (input.hasAttribute('disabled')) throw new Error('disabled should be removed');
  if (!input.hasAttribute('required')) throw new Error('required should be set');
});

// Test 10: TypeScript types are exported
test('FunctionalComponent type exported', () => {
  // This test just verifies the import works
  if (typeof createDomElement !== 'function') throw new Error('createDomElement not exported');
  if (typeof createDomFragment !== 'function') throw new Error('createDomFragment not exported');
});

// Summary
console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✅ All dist output tests passed!');
}
