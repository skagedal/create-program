/**
 * @fileoverview Holds the main program creating functionality.
 */

import * as fs from 'fs/promises'
import * as paths from 'node:path';
import * as templateFiles from './templateFiles.js';
import { readLinesFromFile, writeLinesToFile } from './fileProcessing.js';

export interface CreateProgramOptions {
  path: string;
  name?: string;
  quiet: boolean;
}

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

async function modifyGitIgnore(path: string): Promise<void> {
  const gitIgnorePath = paths.join(path, '.gitignore');
  const lines = await readLinesFromFile(gitIgnorePath);
  if (lines.some((line) => line.match(/^\w*node_modules\/?\w*$/)))
    return;
  await writeLinesToFile(gitIgnorePath, [...lines, 'node_modules/']);
}

async function writeOtherConfigFiles(path: string) {
  await fs.writeFile(paths.join(path, 'tsconfig.json'), templateFiles.tsConfig);
  await fs.writeFile(paths.join(path, 'tsconfig.release.json'), templateFiles.tsConfigRelease);
  await fs.writeFile(paths.join(path, 'jest.config.mjs'), templateFiles.jestConfig);
}

async function writeBin(path: string, packageName: string) {
  await fs.mkdir(paths.join(path, 'bin'), { recursive: true });
  await fs.writeFile(paths.join(path, 'bin', `${packageName}.mjs`), templateFiles.binRunner);
}

async function writeSourceFiles(path: string) {
  const src = paths.join(path, 'src');
  await fs.mkdir(src, { recursive: true });

  await fs.writeFile(paths.join(src, 'greet.ts'), templateFiles.greetTs);
  await fs.writeFile(paths.join(src, 'greet.test.ts'), templateFiles.greetTestTs);
  await fs.writeFile(paths.join(src, 'index.ts'), templateFiles.indexTs);
}

export async function runCreateProgram({path, name, quiet }: CreateProgramOptions) {
  await fs.mkdir(path, { recursive: true });
  const packageName = name ?? paths.basename(paths.resolve(path));
  const originalPackageJson = await readPackageJson(path);
  const packageJson = {
    name: packageName,
    bin: `bin/${packageName}.mjs`,
    main: 'build/index.js',
    type: 'module',
    devDependencies: {
      '@tsconfig/node24': 'latest',
      '@types/jest': 'latest',
      '@types/node': 'latest',
      'jest': 'latest',
      'ts-jest': 'latest',
      'typescript': 'latest'
    },
    scripts: {
      test: 'jest',
      build: 'tsc -p tsconfig.json',
    },
    ...originalPackageJson,
  };
  await writePackageJson(path, packageJson);
  await writeSourceFiles(path);
  await modifyGitIgnore(path);
  await writeOtherConfigFiles(path);
  await writeBin(path, packageName);
  if (!quiet) {
    if (path === '.') {
      console.log('Program created, now run:');
    }
    if (path !== '.') {
      console.log(`Program created in ${path}, go there and run:`);
    }
    console.log('');
    console.log('   npm install');
    console.log('   npm run build');
    console.log(`   npm exec ${packageName}`);
  }
}
