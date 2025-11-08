# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a scaffolding tool (`create-program`) that generates TypeScript Node.js projects with ESM, Jest testing, and build configuration. It's published as an npm initializer package (invoked via `npm create program@latest`).

## Common Commands

### Testing
```bash
npm test              # Run all tests with Jest
npm test -- <file>    # Run a specific test file
```

### Building
```bash
npm run build         # Compile TypeScript to build/ directory
```

### Development Workflow
After making changes, run both:
```bash
npm run build && npm test
```

### Testing the Tool Locally
To test the scaffolding tool in a temporary directory:
```bash
mkdir /tmp/test-project
npm run build
node bin/create-program.mjs --path /tmp/test-project
```

## Code Architecture

### Entry Point & CLI
- `bin/create-program.mjs`: Binary entry point (shebang script)
- `src/index.ts`: Exports `main()` function, sets up CLI parsing using `cmd-ts` library
- CLI options: `--path` (target directory), `--name` (project name), `--quiet` (suppress output)

### Core Scaffolding Logic
- `src/createProgram.ts`: Contains `runCreateProgram()` - the main orchestrator
  - Reads existing `package.json` if present, merges with generated config
  - Creates directory structure (`src/`, `bin/`)
  - Writes template files for generated projects
  - Modifies `.gitignore` to add `node_modules/`

### Template System
- `src/templateFiles.ts`: Exports string constants for all files written to generated projects
  - Includes: `tsconfig.json`, `jest.config.mjs`, bin runner, example source files
  - Templates create a basic "Hello, world" program with a `greet()` function

### Utilities
- `src/fileProcessing.ts`: Line-based file I/O utilities (`readLinesFromFile`, `writeLinesToFile`)

### Testing
- `__tests__/main.test.ts`: Integration tests using temporary directories
- `__tests__/__fixtures__/`: Fixture directories simulating various project states
  - Tests verify behavior with/without existing `package.json`, name preservation, etc.

### Build Configuration
- TypeScript builds from `src/` and `__tests__/` to `build/`
- Uses `@tsconfig/node21` as base config
- Outputs ES modules with source maps

### Important Patterns

**ESM Import Extensions**: All TypeScript imports use `.js` extension (not `.ts`) because the compiled output will be `.js`. This is required for ESM resolution. Example:
```typescript
import { greet } from './greet.js';  // Correct
```

**Package.json Merging**: When scaffolding into an existing directory, the tool merges generated fields with existing `package.json` using spread operator, preserving existing values where they exist (see `src/createProgram.ts:87`).

**Template Line Breaks**: Template strings in `templateFiles.ts` don't include final newlines - they're raw content without trailing whitespace.
