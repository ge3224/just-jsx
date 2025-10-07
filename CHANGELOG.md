# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/ge3224/just-jsx/compare/v0.1.2...HEAD
[0.1.2]: https://github.com/ge3224/just-jsx/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/ge3224/just-jsx/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/ge3224/just-jsx/releases/tag/v0.1.0
