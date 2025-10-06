# Roadmap

This document tracks known limitations, edge cases, and potential future improvements for Just JSX.

## Missing Features

### Documentation & Project Files
- [ ] **TypeScript JSX type definitions** - Add `JSX.IntrinsicElements` and `JSX.Element` type declarations
- [ ] **Type exports** - Export prop types and component types for TypeScript users
- [ ] **CHANGELOG.md** - Version tracking and breaking changes documentation
- [ ] **CONTRIBUTING.md** - Guidelines for contributing to the project
- [ ] **LICENSE file** - MIT license file
- [ ] **Examples directory** - Usage examples and common patterns (like simple-state)
- [ ] **CI/CD pipeline** - GitHub Actions for automated testing and builds

### Build & Distribution
- [ ] **Test dist output** - Verify built artifacts work correctly
- [ ] **Source maps** - Ensure proper debugging experience

## Edge Cases & Known Issues

### High Priority

#### 1. Null/Undefined Children Handling
**Current behavior:** `null`, `undefined`, `false`, `true` children create text nodes with "null", "undefined", etc.

**Expected behavior:** These should be ignored (like React does)

**Location:** `src/index.ts:38-52` (`appendDomChild`)

```tsx
// Current: renders "null"
<div>{null}</div>

// Should: render empty div
```

#### 2. Property vs Attribute Handling
**Current behavior:** All non-event props use `setAttribute()`

**Problem:** Properties like `className`, `htmlFor`, `value`, `checked` need to be set as properties, not attributes

**Location:** `src/index.ts:171-180`

```tsx
// Current: doesn't work correctly
<input value="hello" checked={true} />
<label htmlFor="input-id" className="label" />
```

#### 3. Boolean Attributes
**Current behavior:** Boolean attributes like `disabled="false"` still disable elements

**Expected behavior:** `false` values should remove the attribute

**Location:** `src/index.ts:178`

```tsx
// Current: still disabled
<button disabled={false}>Click me</button>
```

#### 4. Style Object Support
**Current behavior:** Style objects call `.toString()` and fail

**Expected behavior:** Convert style objects to CSS strings

```tsx
// Current: doesn't work
<div style={{color: 'red', fontSize: '14px'}} />

// Should work: <div style="color: red; font-size: 14px">
```

### Medium Priority

#### 5. Functional Component Props Convention
**Current behavior:** Children passed as second argument `tag(props, children)`

**Problem:** Inconsistent with React/JSX conventions where children are in `props.children`

**Location:** `src/index.ts:160`

```tsx
// Current signature
const Component = (props, children) => { ... }

// React convention
const Component = ({ children, ...props }) => { ... }
```

#### 6. Event Listener Detection
**Current behavior:** `name.toLowerCase() in window` check is fragile

**Problem:** Won't work for custom events or newer event types

**Better approach:** Check if value is a function

**Location:** `src/index.ts:172`

#### 7. Number Children Type Support
**Current behavior:** Numbers work at runtime but aren't in type signature

**Fix:** Update type signature to allow `number` in children

```tsx
// Currently typed incorrectly but works
<div>{0}</div>
<span>{123.45}</span>
```

#### 8. Key Prop Handling
**Current behavior:** `key` prop becomes an attribute

**Expected behavior:** Should be ignored/filtered out (used by frameworks for reconciliation)

```tsx
// Current: <div key="item-1">
<div key="item-1">Hello</div>

// Should: <div>
```

### Low Priority

#### 9. Nested SVG Namespace Handling
**Current behavior:** May not correctly handle SVG nested inside HTML inside SVG

**Investigation needed:** Test complex SVG/HTML nesting scenarios

#### 10. XSS Protection
**Current behavior:** No sanitization of attribute values

**Consideration:** Whether to add sanitization or document as user responsibility

**Note:** This is a low-level library - sanitization might be out of scope

#### 11. Memory Management
**Current behavior:** Event listeners are never cleaned up

**Limitation:** No component lifecycle/unmounting concept

**Consideration:** Document cleanup patterns or add utility functions

#### 12. Advanced Props
**Not supported:**
- `ref` - Direct DOM reference handling
- `dangerouslySetInnerHTML` - Raw HTML injection
- Synthetic events - Event normalization

**Decision needed:** Whether these are in scope for a minimal library

## Non-Goals

These features are intentionally **not** planned:

- ❌ **Virtual DOM** - Use real DOM directly
- ❌ **State management** - Use external libraries or vanilla JS
- ❌ **Component lifecycle** - Keep it simple, use vanilla patterns
- ❌ **Reconciliation/diffing** - Not a framework, just JSX-to-DOM
- ❌ **Server-side rendering** - Client-side only
- ❌ **Hot module replacement** - Build tool concern
- ❌ **React compatibility layer** - Not trying to be React

## Version Planning

### v0.1.1 (Next Release)
- Fix null/undefined children handling (#1)
- Fix property vs attribute handling (#2)
- Fix boolean attributes (#3)
- Add TypeScript JSX type definitions
- Add LICENSE file
- Add CONTRIBUTING.md

### v0.1.2
- Fix style object support (#4)
- Fix functional component props convention (#5)
- Improve event listener detection (#6)
- Add key prop filtering (#8)
- Add number children type support (#7)

### v0.1.3
- Add examples directory
- Test dist output
- Source maps verification
- CI/CD pipeline
- Comprehensive test coverage for all edge cases

### Future (v0.2.0+)
- Nested SVG namespace handling (#9)
- Memory management patterns/utilities (#11)
- Advanced prop handling (ref, dangerouslySetInnerHTML) - if needed
- XSS protection considerations - if needed

## Contributing

If you'd like to work on any of these issues, please:
1. Check if there's an existing issue/PR
2. Comment on the issue to claim it
3. Follow the patterns established in the codebase
4. Add tests for your changes
5. Update documentation as needed

## Feedback

Have suggestions or found an edge case not listed here? Please open an issue on GitHub.
