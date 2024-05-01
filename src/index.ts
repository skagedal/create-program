
import fs from 'fs/promises'
import { join } from 'node:path';

type ProjectPackageJson = {
  name?: string;
  packageManager?: string;
}

async function readPackageJson(path: string): Promise<ProjectPackageJson | undefined> {
  try {
    const packageJson = await fs.readFile(join(path, 'package.json'), 'utf8');
    return JSON.parse(packageJson) as ProjectPackageJson;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return undefined;
    } else {
      throw error;
    }
  }
}

async function writePackageJson(path: string, packageJson: ProjectPackageJson) {
  await fs.writeFile(join(path, 'package.json'), JSON.stringify(packageJson, null, 2));
}

async function writeMain(path: string) {
  await fs.mkdir(join(path, 'bin'), { recursive: true });
  await fs.writeFile(join(path, 'bin', 'index.mjs'), 'console.log("Hello, world!")\n');
}

export async function runCreateProgram(path: string) {
  const originalPackageJson = await readPackageJson(path);
  const packageJson = {
    name: 'hello-world',
    packageManager: 'yarn@4.1.1',
    bin: 'bin/index.mjs',
    main: 'bin/index.mjs',
    type: 'module',
    devDependencies: {
      '@types/jest': '^29.5.12',
      '@types/node': '^20.12.7',
      'jest': '^29.7.0',
      'ts-jest': '^29.1.2',
      'typescript': '^5.4.5'
    },
    scripts: {
      test: 'jest'
    },
    ...originalPackageJson,
  };
  await writePackageJson(path, packageJson);
  await writeMain(path);
}

export async function main() {
  await runCreateProgram('.');
}
