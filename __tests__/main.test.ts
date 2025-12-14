import fs from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as paths from 'path';
import { runCreateProgram } from '../src/createProgram.js';

const resolveFromFixture = (relativePath: string) =>
  paths.resolve(__dirname, '__fixtures__', relativePath);

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
    expect(packageJson.name).toBe('three');
  });

  it('should write package name to package.json when no package.json', async () => {
    const path = await initFixture('no-package-json');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    expect(packageJson.name).toBe('no-package-json');
  });

  it('should write package name to package.json when package.json exists but has no name', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    expect(packageJson.name).toBe('has-no-name');
    expect(packageJson.dummy).toBe('retained-value');
  });

  it('should not overwrite existing name in package.json', async () => {
    const path = await initFixture('has-only-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    expect(packageJson.name).toBe('existing-name');
  });

  it('should create bin/has-no-name.mjs', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const indexMjs = await fs.readFile(join(path, 'bin', 'has-no-name.mjs'), 'utf8');
    expect(indexMjs).toMatch(/.*/);
  });

  it('should add relevant things to package.json', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});

    const packageJson = await readPackageJson(path);
    expect(packageJson.main).toBe('build/index.js');
    expect(packageJson.bin).toBe('bin/has-no-name.mjs');
    expect(packageJson.type).toBe('module');
    expect(Object.keys(packageJson.devDependencies)).toContain('typescript');
    expect(Object.keys(packageJson.devDependencies)).toContain('jest');
    expect(Object.keys(packageJson.devDependencies)).toContain('ts-jest');
    expect(Object.keys(packageJson.devDependencies)).toContain('@types/node');
    expect(Object.keys(packageJson.devDependencies)).toContain('@types/jest');
    expect(packageJson.scripts.test).toBe('jest');
  });

  it('should be fine when things already exist', async () => {
    const path = await initFixture('has-all-the-things');

    await runCreateProgram({path, testRunner: 'jest', quiet: true});
  });

  it('should configure nodejs test runner when selected', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    const packageJson = await readPackageJson(path);
    expect(packageJson.scripts.test).toBe('node --experimental-strip-types --test src/**/*.test.ts');
    expect(Object.keys(packageJson.devDependencies)).not.toContain('jest');
    expect(Object.keys(packageJson.devDependencies)).not.toContain('ts-jest');
    expect(Object.keys(packageJson.devDependencies)).not.toContain('@types/jest');
    expect(Object.keys(packageJson.devDependencies)).toContain('typescript');
    expect(Object.keys(packageJson.devDependencies)).toContain('@types/node');
  });

  it('should not create jest.config.mjs when using nodejs test runner', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    await expect(fs.access(join(path, 'jest.config.mjs'))).rejects.toThrow();
  });

  it('should create test file with node:test imports when using nodejs test runner', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    const testFile = await fs.readFile(join(path, 'src', 'greet.test.ts'), 'utf8');
    expect(testFile).toContain("import { describe, it } from 'node:test'");
    expect(testFile).toContain("import assert from 'node:assert'");
    expect(testFile).toContain('from "./greet.ts"');
  });

  it('should use .ts extension in imports when using nodejs test runner', async () => {
    const path = await initFixture('has-no-name');

    await runCreateProgram({path, testRunner: 'nodejs', quiet: true});

    const indexFile = await fs.readFile(join(path, 'src', 'index.ts'), 'utf8');
    expect(indexFile).toContain("from './greet.ts'");
  });
});

