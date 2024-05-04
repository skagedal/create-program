import fs from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as path from 'path';
import { runCreateProgram } from '../src/createProgram.js';

const resolveFromFixture = (relativePath: string) =>
  path.resolve(__dirname, '__fixtures__', relativePath);

const createTempDir = async () => await fs.mkdtemp(join(tmpdir(), 'test-'));

const initFixture = async (fixtureName: string) => {
  const tmpDir = path.resolve(await createTempDir(), fixtureName);
  await fs.mkdir(tmpDir);
  await fs.cp(resolveFromFixture(fixtureName), tmpDir, { recursive: true });
  return tmpDir;
}

async function readPackageJson(dir: string) {
  return JSON.parse(await fs.readFile(join(dir, 'package.json'), 'utf8'));
}

describe('main', () => {
  it('should create the directory if it does not exist', async () => {
    const dir = path.resolve(await createTempDir(), 'one', 'two', 'three');
    
    await runCreateProgram(dir);
    
    const packageJson = await readPackageJson(dir);
    expect(packageJson.name).toBe('three');
  });
  
  it('should write package name to package.json when no package.json', async () => {
    const dir = await initFixture('no-package-json');
    
    await runCreateProgram(dir);
    
    const packageJson = await readPackageJson(dir);
    expect(packageJson.name).toBe('no-package-json');
  });
  
  it('should write package name to package.json when package.json exists but has no name', async () => {
    const dir = await initFixture('has-no-name');
    
    await runCreateProgram(dir);
    
    const packageJson = await readPackageJson(dir);
    expect(packageJson.name).toBe('has-no-name');
    expect(packageJson.dummy).toBe('retained-value');
  });
  
  it('should not overwrite existing name in package.json', async () => {
    const dir = await initFixture('has-only-name');
    
    await runCreateProgram(dir);
    
    const packageJson = await readPackageJson(dir);
    expect(packageJson.name).toBe('existing-name');
  });
  
  it('should create bin/index.mjs', async () => {
    const dir = await initFixture('has-no-name');
    
    await runCreateProgram(dir);
    
    const indexMjs = await fs.readFile(join(dir, 'bin', 'index.mjs'), 'utf8');
  expect(indexMjs).toMatch(/.*/);
});

it('should add relevant things to package.json', async () => {
  const dir = await initFixture('has-no-name');
  
  await runCreateProgram(dir);
  
  const packageJson = await readPackageJson(dir);
  expect(packageJson.main).toBe('bin/index.mjs');
  expect(packageJson.bin).toBe('bin/index.mjs');
  expect(packageJson.type).toBe('module');
  expect(Object.keys(packageJson.devDependencies)).toContain('typescript');
  expect(Object.keys(packageJson.devDependencies)).toContain('jest');
  expect(Object.keys(packageJson.devDependencies)).toContain('ts-jest');
  expect(Object.keys(packageJson.devDependencies)).toContain('@types/node');
  expect(Object.keys(packageJson.devDependencies)).toContain('@types/jest');
  expect(packageJson.scripts.test).toBe('jest');
});
});
