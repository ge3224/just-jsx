# Contributing to Just JSX

Contributions are welcome! If you see where this project can be improved - whether it's fixing a bug, handling an edge case, improving documentation, or enhancing tests - please feel free to contribute.

## Reporting Bugs

Found a bug? Please open an issue with:

- A clear description of the problem
- Steps to reproduce (ideally a minimal code example)
- What you expected vs. what actually happened
- Your environment (TypeScript version, Node version, OS, build tool)

## Submitting Changes

1. Fork the repo and create a branch from `main`
2. Install dependencies: `pnpm install`
3. Make your changes
4. Add tests if you're adding functionality
5. Run `pnpm test` and `pnpm type-check` to make sure everything passes
6. Commit with a clear message and submit a PR

## Code Style

- Write TypeScript with proper type annotations
- Follow the existing code style
- Keep it simple - this library has zero dependencies for a reason
- Optimize for readability and auditability (the whole library should be understandable in one sitting)

## Development

```bash
# Install
pnpm install

# Test
pnpm test              # run once
pnpm test:watch        # watch mode
pnpm test:coverage     # with coverage

# Benchmarks
pnpm bench             # performance benchmarks

# Build and type check
pnpm build
pnpm type-check

# Try examples
pnpm dev  # browser examples
```

## Philosophy

This is a **vendorable library** - designed to be copied directly into projects. When contributing, consider:

- **Zero dependencies** - Don't add external dependencies
- **Minimal code** - Every line should justify its existence
- **Type safety** - Full TypeScript support is essential
- **Edge cases** - Handle them, but document when we intentionally don't
- **No framework features** - This is JSX-to-DOM, not a framework

## Release Process (Maintainers)

### Before Releasing

1. **Update version number** in `package.json`

2. **Verify line count accuracy:**
   ```bash
   wc -l src/index.ts
   ```
   Update references in `README.md` if changed:
   - Line 8: Opening paragraph
   - Line 30: "Why Just JSX?" bullet point

3. **Update CHANGELOG.md:**
   - Add new version section with date
   - List all changes under appropriate categories (Added/Changed/Fixed/Removed)
   - Update comparison links at the bottom
   - Review commits since last release: `git log v0.1.X..HEAD --oneline`

4. **Update ROADMAP.md:**
   - Mark completed items as done
   - Add new version section if needed

5. **Verify imports in documentation:**
   - Ensure examples use `'./vendor/just-jsx'` (not `'./vendor/just-jsx/src'`)

6. **Run full test suite:**
   ```bash
   pnpm test
   pnpm type-check
   pnpm build
   pnpm test:dist
   ```

### Creating a Release

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "chore: prepare v0.1.X release"
   ```

2. **Create and push tag:**
   ```bash
   git tag v0.1.X
   git push origin main --tags
   ```

3. **GitHub Actions will automatically:**
   - Run tests and type checking
   - Build minified versions (IIFE, UMD, ES)
   - Build non-minified versions
   - Generate SHA256 checksums for all files
   - Create GitHub release with 10 artifacts:
     - `just-jsx.iife.min.js` + checksum
     - `just-jsx.iife.js` + checksum
     - `just-jsx.umd.min.js` + checksum
     - `just-jsx.umd.js` + checksum
     - `just-jsx-dist.tar.gz` + checksum

4. **Verify release:**
   - Check [releases page](https://github.com/ge3224/just-jsx/releases)
   - Verify all artifacts are present
   - Verify release notes are generated
   - Test downloading and using an artifact

### Dynamic Badges

The README uses dynamic badges that update automatically:
- **Version**: `https://img.shields.io/github/v/release/ge3224/just-jsx` (pulls from latest tag)
- **License**: `https://img.shields.io/github/license/ge3224/just-jsx` (pulls from LICENSE file)
- **CI Status**: `https://github.com/ge3224/just-jsx/actions/workflows/ci.yml/badge.svg` (shows build status)

No manual badge updates needed for releases!

## Questions?

Open an issue - I'm happy to discuss ideas and answer questions.
