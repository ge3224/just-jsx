# Roadmap

This document tracks known limitations, edge cases, and potential future improvements for Just JSX.

## Missing Features

### Documentation & Project Files
- [ ] **TypeScript JSX type definitions** - Add `JSX.IntrinsicElements` and `JSX.Element` type declarations
- [ ] **Type exports** - Export prop types and component types for TypeScript users
- [x] **CHANGELOG.md** - Version tracking and breaking changes documentation
- [ ] **CONTRIBUTING.md** - Guidelines for contributing to the project
- [ ] **LICENSE file** - MIT license file
- [x] **Examples directory** - Usage examples and recipes for common patterns
- [x] **CI/CD pipeline** - GitHub Actions for automated testing and builds

### Build & Distribution
- [ ] **Test dist output** - Verify built artifacts work correctly
- [ ] **Source maps** - Ensure proper debugging experience

## Edge Cases & Known Issues

### High Priority

#### ~~1. Null/Undefined Children Handling~~ ✓ Fixed in v0.1.0
**Status:** ✅ Resolved

`null`, `undefined`, `false`, and `true` children are now properly ignored (like React does).

**Location:** `src/index.ts:38-58` (`appendDomChild`)

```tsx
// Now works correctly
<div>{null}</div> // renders <div></div>
<div>{false && <span>Content</span>}</div> // renders <div></div>
```

#### ~~2. Property vs Attribute Handling~~ ✓ Fixed in v0.1.2
**Status:** ✅ Resolved

Properties like `value`, `checked`, `selected` are now set as DOM properties, not attributes. Comprehensive support for form elements, media elements, and content properties.

**Location:** `src/index.ts:146-172` (`PROPERTY_NAMES`, `setProp`)

```tsx
// Now works correctly
<input value="hello" checked={true} />
<label for="input-id">Name</label>
<select value="option2"><option value="option2">Two</option></select>
<input type="checkbox" indeterminate={true} />
<video muted={true} volume={0.5} currentTime={10} />
```

#### ~~3. Boolean Attributes~~ ✓ Fixed in v0.1.3
**Status:** ✅ Resolved

Boolean attributes like `disabled`, `hidden`, `readonly` now correctly handle `false` values by removing the attribute.

**Location:** `src/index.ts` (`setProp`)

```tsx
// Now works correctly
<button disabled={false}>Click me</button> // renders <button>Click me</button>
<input readonly={false} /> // renders <input>
```

#### ~~4. Style Object Support~~ ✓ Fixed in v0.1.3
**Status:** ✅ Resolved

Style objects are now properly converted to CSS strings with automatic camelCase to kebab-case conversion.

**Location:** `src/index.ts` (`setProp`)

```tsx
// Now works correctly
<div style={{color: 'red', fontSize: '14px'}} />
// renders: <div style="color: red; font-size: 14px">
```

### Medium Priority (All Resolved ✅)

#### ~~5. Functional Component Props Convention~~ ✓ Fixed in v0.1.3
**Status:** ✅ Resolved

Children are now passed as `props.children` following React/JSX conventions.

**Location:** `src/index.ts` (`h`)

```tsx
// Now uses standard convention
const Component = ({ children, ...props }) => { ... }
// Or
const Component = (props) => { return <div>{props.children}</div> }
```

#### ~~6. Event Listener Detection~~ ✓ Already Correct
**Status:** ✅ No changes needed

Event listener detection already uses function checking, not `name in window`. The implementation correctly identifies event handlers by checking if the prop name starts with "on" and the value is a function.

**Location:** `src/index.ts` (`setProp`)

#### ~~7. Number Children Type Support~~ ✓ Fixed in v0.1.3
**Status:** ✅ Resolved

Numbers are now properly supported in type signatures and handled correctly in rendering.

**Location:** `src/index.ts` (type definitions and `appendDomChild`)

```tsx
// Now fully supported
<div>{0}</div>
<span>{123.45}</span>
```

#### ~~8. Key and Ref Prop Handling~~ ✓ Fixed in v0.1.3
**Status:** ✅ Resolved

Both `key` and `ref` props are now properly filtered out and don't become attributes.

**Location:** `src/index.ts` (`setProp`)

```tsx
// Now works correctly
<div key="item-1">Hello</div> // renders <div>Hello</div>
<div ref={myRef}>Content</div> // renders <div>Content</div>
```

### Low Priority

#### ~~9. Nested SVG Namespace Handling~~ ✓ Fixed in v0.1.5
**Status:** ✅ Resolved

Complex SVG/HTML nesting scenarios now work correctly, including:
- `foreignObject` elements properly created in SVG namespace
- HTML elements inside `foreignObject` use HTML namespace
- SVG elements inside HTML (inside foreignObject) correctly use SVG namespace again

**Implementation:** Runtime namespace correction in `appendDomChild` function automatically fixes namespace mismatches based on parent context.

**Location:** `src/index.ts` (`fixNamespaceIfNeeded`, `appendDomChild`)

#### ~~10. XSS Protection~~ ✓ Documented in v0.1.6
**Status:** ✅ Documented (not implemented in library)

**Decision:** Sanitization is out of scope for this low-level library. Security is documented as user responsibility with guidance on:
- Browser security features (CSP, server-side validation)
- Safe coding patterns vs unsafe patterns
- Defense-in-depth strategies
- URL validation examples

**Location:** `README.md` (Security Considerations section)

#### ~~11. Memory Management~~ ✓ Documented in v0.1.6
**Status:** ✅ Documented (not implemented in library)

**Decision:** Lifecycle/cleanup is out of scope for this low-level library. Memory management patterns are documented in examples with multiple approaches:
- Manual cleanup with stored references
- AbortController (modern, recommended)
- CleanupManager class pattern
- Component lifecycle wrapper
- React-style hook pattern

**Location:** `examples/recipes/memory-management.tsx`

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

### ~~v0.1.1~~ ✅ Released
- ✅ Fix null/undefined children handling (#1)

### ~~v0.1.2~~ ✅ Released
- ✅ Fix property vs attribute handling (#2)
- ✅ Comprehensive DOM property support (form, media, content properties)
- ✅ Use `for` attribute on labels (SolidJS convention)

### ~~v0.1.3~~ ✅ Released
- ✅ Fix boolean attributes (#3)
- ✅ Fix style object support (#4)
- ✅ Fix functional component props convention (#5)
- ✅ Event listener detection (#6) - already implemented correctly
- ✅ Add number children type support (#7)
- ✅ Add key prop filtering (#8)

### ~~v0.1.4~~ ✅ Released
- ✅ Fix TypeScript compilation error with number children in appendDomChild

### ~~v0.1.5~~ ✅ Released
- ✅ Nested SVG namespace handling (#9)

### v0.1.6 (Next Release)
- [x] Code optimization (374 → 129 lines, 65% reduction)
- [x] XSS protection documentation (#10)
- [x] Memory management patterns documentation (#11)
- [x] Add examples directory with recipes
- [ ] Add TypeScript JSX type definitions
- [ ] Add LICENSE file
- [ ] Add CONTRIBUTING.md
- [ ] Test dist output
- [ ] Source maps verification
- [ ] Comprehensive test coverage for all edge cases

### Future (v0.2.0+)
- Advanced prop handling (dangerouslySetInnerHTML) - if needed
- Control flow components (For, Show, Switch/Match) - similar to SolidJS
  - Minimal, bare-metal implementations for common patterns
  - No virtual DOM reconciliation, just helpers for list rendering and conditionals
  - Keep it optional and lightweight

## Contributing

If you'd like to work on any of these issues, please:
1. Check if there's an existing issue/PR
2. Comment on the issue to claim it
3. Follow the patterns established in the codebase
4. Add tests for your changes
5. Update documentation as needed

## Feedback

Have suggestions or found an edge case not listed here? Please open an issue on GitHub.
