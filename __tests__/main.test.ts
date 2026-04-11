import fs from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as paths from 'node:path';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { runCreateProgram } from '../src/createProgram.js';

// When compiled to build/__tests__/, fixtures live two levels up at __tests__/__fixtures__/
const resolveFromFixture = (relativePath: string) =>
  paths.resolve(import.meta.dirname, '../../__tests__/__fixtures__', relativePath);

const createTempDir = async () => await fs.mkdtemp(join(tmpdir(), 'test-'));

const initFixture = async (fixtureName: string) => {
  const tmpDir = paths.resolve(await createTempDir(), fixtureName);
  await fs.mkdir(tmpDir);
  await fs.cp(resolveFromFixture(fixtureName), tmpDir, { recursive: true });
  return tmpDir;
}

async function readPackageJson(dir: string) {
  return JSON.parse(await fs.readFile(join(dir, 'package.json'), 'utf8'));
}

describe('main', () => {
  it('should create the directory if it does not exist', async () => {
    const path = paths.resolve(await createTempDir(), 'one', 'two', 'three');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    assert.strictEqual(packageJson.name, 'three');
  });

  it('should write package name to package.json when no package.json', async () => {
    const path = await initFixture('no-package-json');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    assert.strictEqual(packageJson.name, 'no-package-json');
  });

  it('should write package name to package.json when package.json exists but has no name', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    assert.strictEqual(packageJson.name, 'has-no-name');
    assert.strictEqual(packageJson.dummy, 'retained-value');
  });

  it('should not overwrite existing name in package.json', async () => {
    const path = await initFixture('has-only-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    assert.strictEqual(packageJson.name, 'existing-name');
  });

  it('should create bin/has-no-name.mjs', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const indexMjs = await fs.readFile(join(path, 'bin', 'has-no-name.mjs'), 'utf8');
    assert.ok(indexMjs.length > 0);
  });

  it('should add relevant things to package.json', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    assert.strictEqual(packageJson.main, 'build/index.js');
    assert.strictEqual(packageJson.bin, 'bin/has-no-name.mjs');
    assert.strictEqual(packageJson.type, 'module');
    assert.ok(Object.keys(packageJson.devDependencies).includes('typescript'));
    assert.ok(Object.keys(packageJson.devDependencies).includes('jest'));
    assert.ok(Object.keys(packageJson.devDependencies).includes('ts-jest'));
    assert.ok(Object.keys(packageJson.devDependencies).includes('@types/node'));
    assert.ok(Object.keys(packageJson.devDependencies).includes('@types/jest'));
    assert.strictEqual(packageJson.scripts.test, 'jest');
  });

  it('should be fine when things already exist', async () => {
    const path = await initFixture('has-all-the-things');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});
  });

  it('should configure nodejs test runner when selected', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    const packageJson = await readPackageJson(path);
    assert.strictEqual(packageJson.scripts.test, 'node --experimental-strip-types --test src/**/*.test.ts');
    assert.ok(!Object.keys(packageJson.devDependencies).includes('jest'));
    assert.ok(!Object.keys(packageJson.devDependencies).includes('ts-jest'));
    assert.ok(!Object.keys(packageJson.devDependencies).includes('@types/jest'));
    assert.ok(Object.keys(packageJson.devDependencies).includes('typescript'));
    assert.ok(Object.keys(packageJson.devDependencies).includes('@types/node'));
  });

  it('should not create jest.config.mjs when using nodejs test runner', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    await assert.rejects(() => fs.access(join(path, 'jest.config.mjs')));
  });

  it('should create test file with node:test imports when using nodejs test runner', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    const testFile = await fs.readFile(join(path, 'src', 'greet.test.ts'), 'utf8');
    assert.ok(testFile.includes("import { describe, it } from 'node:test'"));
    assert.ok(testFile.includes("import assert from 'node:assert'"));
    assert.ok(testFile.includes('from "./greet.ts"'));
  });

  it('should use .ts extension in imports when using nodejs test runner', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    const indexFile = await fs.readFile(join(path, 'src', 'index.ts'), 'utf8');
    assert.ok(indexFile.includes("from './greet.ts'"));
  });
});
