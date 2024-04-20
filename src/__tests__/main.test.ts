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
    it('should write package name to package.json', async () => {
        const dir = await initFixture('no-package-json');
        
        await runCreateProgram(dir);
        
        const packageJson = await readPackageJson(dir);
        expect(packageJson.name).toBe('hello-world');
    });

    it('should not overwrite existing name in package.json', async () => {
        const dir = await initFixture('has-only-name');

        await runCreateProgram(dir);

        const packageJson = await readPackageJson(dir);
        expect(packageJson.name).toBe('existing-name');
    });
});

