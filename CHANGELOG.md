# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/ge3224/just-jsx/compare/v0.1.5...HEAD
[0.1.5]: https://github.com/ge3224/just-jsx/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/ge3224/just-jsx/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/ge3224/just-jsx/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/ge3224/just-jsx/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/ge3224/just-jsx/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ge3224/just-jsx/releases/tag/v0.1.0
