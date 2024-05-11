import * as fs from 'fs/promises'
import * as paths from 'node:path';
import * as templateFiles from './templateFiles.js';

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
