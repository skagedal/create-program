import fs from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import * as path from 'path';
import { runCreateProgram } from '../main';

const resolveFromFixture = (relativePath: string) =>
    path.resolve(__dirname, '__fixtures__', relativePath);

const initFixture = async (fixtureName: string) => {
    const tmpDir = await fs.mkdtemp(join(tmpdir(), 'test-'));
    await fs.cp(resolveFromFixture(fixtureName), tmpDir, { recursive: true });
    return tmpDir;
}

async function readPackageJson(dir: string) {
    return JSON.parse(await fs.readFile(join(dir, 'package.json'), 'utf8'));
}

describe('main', () => {
    it('should write package name to package.json when no package.json', async () => {
        const dir = await initFixture('no-package-json');
        
        await runCreateProgram(dir);
        
        const packageJson = await readPackageJson(dir);
        expect(packageJson.name).toBe('hello-world');
    });

    it('should write package name to package.json when package.json exists but has no name', async () => {
        const dir = await initFixture('has-no-name');

        await runCreateProgram(dir);

        const packageJson = await readPackageJson(dir);
        expect(packageJson.name).toBe('hello-world');
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

    it('should add a main entry to package.json', async () => {
        const dir = await initFixture('has-no-name');

        await runCreateProgram(dir);

        const packageJson = await readPackageJson(dir);
        expect(packageJson.main).toBe('bin/index.mjs');
    });

    it('should add a bin entry to package.json', async () => {
        const dir = await initFixture('has-no-name');

        await runCreateProgram(dir);

        const packageJson = await readPackageJson(dir);
        expect(packageJson.bin).toBe('bin/index.mjs');
    });

});
