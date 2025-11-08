# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.10] - 2025-11-08

### Added
- TypeScript support for style objects with flexible property naming
  - New `StyleAttribute` type: `string | { [key: string]: string | number }`
  - Allows both kebab-case (`"z-index"`) and camelCase (`zIndex`) in style objects
  - Fixed TypeScript errors when using object styles with any CSS property name

### Changed
- Improved `DOMAttributes` type to explicitly include `style?: StyleAttribute`
- Updated `IntrinsicElements` to exclude native `style` property from HTMLElement types
- Source code line count from 218 to 222 lines

## [0.1.9] - 2025-11-07

### Added
- Ref support for accessing DOM elements
  - Exported `Ref<T>` type for type-safe refs (callback or object form)
  - Added `createRef<T>()` helper function
  - Support callback refs: `ref={(el) => ...}`
  - Support object refs: `ref={myRef}` where `myRef.current` gets the element
  - Refs are assigned after element creation but before return
  - Implementation adds only 12 lines, keeping total at 218 lines
- 7 new comprehensive tests for ref functionality (99 tests total)
- Documentation for refs in README with examples and API reference

### Changed
- Source code line count from 206 to 218 lines
- Updated 1 existing test to verify ref behavior instead of filtering

## [0.1.8] - 2025-11-02

### Fixed
- SVG attribute handling - improved handling for SVG-specific attributes
- Null safety in attribute setter - added null check before calling `value.toString()`
- Build configuration - fixed vite.config.ts for proper module output (UMD/IIFE support)

### Changed
- **Documentation overhaul:**
  - Updated README line count from ~195 to ~206 lines (reflects actual source size)
  - Restructured installation section to prioritize pre-built bundles (matches Switchback pattern)
  - Changed import paths from `'./vendor/just-jsx/src'` to `'./vendor/just-jsx'` (leverages package.json exports)
  - Added note explaining package.json exports configuration for un-compiled TypeScript
  - Updated badges to be dynamic (GitHub Release, License, CI status)
  - Removed static Test Coverage badge (covered by CI badge)
- **Release workflow improvements:**
  - Added multi-format release artifacts (IIFE and UMD, minified and non-minified)
  - Added SHA256 checksums for all release files
  - Added complete dist tarball with checksum
  - Total of 10 release artifacts per version (was 1)
- Package version bump to v0.1.8

### Added
- Comprehensive release artifact support in GitHub Actions workflow
- Dynamic badges for version, license, and CI status

## [0.1.7] - 2025-11-01

### Fixed
- TypeScript strict mode compatibility - relaxed children type constraints for stricter TypeScript configurations

## [0.1.6] - 2025-10-12

### Added
- Security Considerations section in README with safe coding patterns and CSP guidance
- Examples directory with recipes for advanced patterns
- Memory management recipe with 5 cleanup patterns (manual, AbortController, manager, lifecycle, hooks)
- TypeScript JSX type definitions (inline in source)
  - `JSX.IntrinsicElements` with full HTML/SVG element support
  - `JSX.Element` type for JSX expressions (includes primitives: string, number, boolean, null, undefined)
  - `FunctionalComponent<P>` type export for component authors
  - Type-safe props for all intrinsic elements
  - Proper children type inference
- MIT LICENSE file
- CONTRIBUTING.md with guidelines for contributors
- Dist output tests in `tests/dist/` directory
  - `runtime.test.mjs`: 10 runtime tests verifying built artifacts work correctly
  - `types.test.ts`: TypeScript type checking for dist declarations
  - `browser.test.html`: Manual browser testing file
  - New `pnpm test:dist` script
- Comprehensive test coverage for all edge cases
  - 34 new tests added (50 → 84 tests total)
  - 100% statement coverage
  - 100% branch coverage (improved from 92.18%)
  - 100% function coverage
  - Tests for array children (flat, nested, empty arrays)
  - Tests for style edge cases (empty object, mixed units)
  - Tests for special attributes (className, htmlFor, data-*, aria-*, role)
  - Tests for media element properties (video/audio muted, volume, currentTime, playbackRate)
  - Tests for content properties (innerHTML, textContent, innerText)
  - Tests for multiple event listeners and various event types
  - Tests for numeric/special prop values (0, empty string, NaN)
  - Tests for functional components edge cases (no children, undefined/null props)
  - Tests for fragment edge cases (empty, null/undefined/boolean children)
  - Tests for additional SVG elements (path, polygon, line, rect)
  - Tests for indeterminate checkbox property
  - Tests for namespace correction with manually constructed elements

### Changed
- Optimized code size from 374 to 196 lines (48% reduction)
  - SVG tags converted to Set with comma-separated string (faster lookups)
  - Condensed property and boolean attribute declarations
  - Simplified conditionals and reduced verbose comments
  - Inlined simple functions
- Updated README to emphasize vendorability and ownership over React comparisons
- Source file now 196 lines with comprehensive type definitions
- `JSX.Element` type now includes primitive types for full JSX expression support
- `prepublishOnly` script now includes dist tests

## [0.1.5] - 2025-10-10

### Fixed
- Nested SVG namespace handling - complex SVG/HTML nesting now works correctly
  - `foreignObject` elements properly created in SVG namespace
  - HTML elements inside `foreignObject` use HTML namespace
  - SVG elements nested inside HTML (inside `foreignObject`) correctly use SVG namespace again
- SVG tag names array converted to lowercase to fix tag detection (e.g., `foreignObject` → `foreignobject`)

### Added
- Runtime namespace correction in `appendDomChild` function
- `fixNamespaceIfNeeded` helper function for automatic namespace fixing based on parent context
- 3 new tests for SVG namespace handling (44 tests total)

## [0.1.4] - 2025-10-09

### Fixed
- TypeScript compilation error in `appendDomChild` when handling number children
- Explicitly handle string and number types to avoid nodeType check on numbers

## [0.1.3] - 2025-10-09

### Fixed
- Boolean attributes (`disabled`, `readonly`, `required`, etc.) now correctly removed when set to `false`
- Style object support with kebab-case properties (following SolidJS convention)
- Functional components now use `props.children` convention (React/SolidJS style)

### Added
- Boolean attribute handling for 18 common attributes
- Style object to CSS string conversion with number-to-px support
- Console warning for camelCase style properties (helps React developers)
- Number children type support (`<div>{0}</div>`, `<span>{123.45}</span>`)
- Reserved props filtering (`key` and `ref` are now filtered out)
- 18 new tests (38 tests total)

### Changed
- Functional components signature: from `(props, children)` to `(props)` where children is in `props.children`
- `createDomFragment` now handles children from both `props.children` and spread arguments

## [0.1.2] - 2025-10-06

### Fixed
- Property vs Attribute handling - DOM properties like `value`, `checked`, `selected` are now correctly set as properties instead of attributes
- Form elements now work correctly (inputs, checkboxes, selects, textareas)

### Added
- Comprehensive DOM property support for form elements (`value`, `checked`, `selected`, `indeterminate`)
- Media element property support (`muted`, `volume`, `currentTime`, `playbackRate`)
- Content property support (`innerHTML`, `textContent`, `innerText`)
- 4 new tests for property handling (20 tests total)
- Children are now appended before props are set (fixes `<select value>` behavior)

### Changed
- Use `for` attribute on labels (following SolidJS convention) instead of React's `htmlFor`

## [0.1.1] - 2025-10-06

### Fixed
- Null/undefined children handling - `null`, `undefined`, `false`, and `true` children are now properly ignored (like React does)

### Added
- 5 new tests for null/undefined/boolean children handling (16 tests total)

## [0.1.0] - 2025-10-06

### Added
- Core JSX pragma functions (`createDomElement`, `createDomFragment`)
- Zero-dependency vanilla TypeScript implementation (~200 lines)
- SVG namespace support for inline SVG elements
- Event listener handling (props starting with "on")
- Functional component support
- Comprehensive test suite with vitest and jsdom (11 tests)
- TypeScript configuration with native JSX pragma support
- Vite build configuration
- README with installation and usage documentation
- ROADMAP documenting known edge cases and future improvements
- CHANGELOG for version tracking
- Support for git submodule and direct copy installation methods
- Documentation for TypeScript, Vite, and SWC build tool configurations

### Known Issues
- Properties like `className`, `value`, `checked` don't work correctly (setAttribute vs property)
- Boolean attributes like `disabled={false}` don't work as expected
- Style objects `style={{color: 'red'}}` are not supported
- Functional components receive children as second argument instead of `props.children`
- No TypeScript JSX type definitions (JSX.IntrinsicElements, etc.)

[Unreleased]: https://github.com/ge3224/just-jsx/compare/v0.1.10...HEAD
[0.1.10]: https://github.com/ge3224/just-jsx/compare/v0.1.9...v0.1.10
[0.1.9]: https://github.com/ge3224/just-jsx/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/ge3224/just-jsx/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/ge3224/just-jsx/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/ge3224/just-jsx/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/ge3224/just-jsx/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/ge3224/just-jsx/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/ge3224/just-jsx/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/ge3224/just-jsx/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/ge3224/just-jsx/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ge3224/just-jsx/releases/tag/v0.1.0
