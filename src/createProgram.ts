import * as fs from 'fs/promises'
import * as paths from 'node:path';

type ProjectPackageJson = {
  name?: string;
  packageManager?: string;
}

async function readPackageJson(path: string): Promise<ProjectPackageJson | undefined> {
  try {
    const packageJson = await fs.readFile(paths.join(path, 'package.json'), 'utf8');
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
  await fs.writeFile(paths.join(path, 'package.json'), JSON.stringify(packageJson, null, 2));
}

async function writeBin(path: string, packageName: string) {
  await fs.mkdir(paths.join(path, 'bin'), { recursive: true });
  await fs.writeFile(paths.join(path, 'bin', `${packageName}.mjs`),
`#!/usr/bin/env node

import { main } from '../build/src/index.js'
  
main();
`);
}

async function writeSourceFiles(path: string) {
  const src = paths.join(path, 'src');
  await fs.mkdir(src);

  await fs.writeFile(paths.join(src, 'greet.ts'),
`export interface Greetable {
  name: string
}

export function greet(greetable: Greetable) {
  return \`Hello, \${greetable.name}!\`
}
`);
  
  await fs.writeFile(paths.join(src, 'index.ts'), 
`import { greet } from './greet.js';

export function main() {
  console.log(greet({ name: 'world' }));
}
`)
}

async function writeTsConfig(path: string) {
  
}

export async function runCreateProgram(path: string) {
  await fs.mkdir(path, { recursive: true });
  const packageName = paths.basename(paths.resolve(path));
  const originalPackageJson = await readPackageJson(path);
  const packageJson = {
    name: packageName,
    bin: `bin/${packageName}.mjs`,
    main: 'build/index.js',
    type: 'module',
    devDependencies: {
      '@tsconfig/node21': '^21.0.3',
      '@types/jest': '^29.5.12',
      '@types/node': '^20.12.7',
      'jest': '^29.7.0',
      'ts-jest': '^29.1.2',
      'typescript': '^5.4.5'
    },
    scripts: {
      test: 'jest --coverage',
      build: 'tsc -p tsconfig.json',
    },
    ...originalPackageJson,
  };
  await writePackageJson(path, packageJson);
  await writeSourceFiles(path);
  await writeBin(path, packageName);
}
