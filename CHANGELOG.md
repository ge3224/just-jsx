# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Core JSX pragma functions (`createDomElement`, `createDomFragment`)
- Zero-dependency vanilla TypeScript implementation
- SVG namespace support for inline SVG elements
- Event listener handling (props starting with "on")
- Functional component support
- Comprehensive test suite with vitest and jsdom (11 tests)
- TypeScript configuration with native JSX pragma support
- Vite build configuration
- README with installation and usage documentation
- ROADMAP documenting known edge cases and future improvements
- Support for git submodule and direct copy installation methods
- Documentation for TypeScript, Vite, and SWC build tool configurations

### Known Issues
- Null/undefined children are not filtered (renders "null", "undefined" as text)
- Properties like `className`, `value`, `checked` don't work correctly (setAttribute vs property)
- Boolean attributes like `disabled={false}` don't work as expected
- Style objects `style={{color: 'red'}}` are not supported
- Functional components receive children as second argument instead of `props.children`
- No TypeScript JSX type definitions (JSX.IntrinsicElements, etc.)

## [0.1.0] - TBD

Initial release (not yet published)

[Unreleased]: https://github.com/ge3224/just-jsx/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ge3224/just-jsx/releases/tag/v0.1.0
