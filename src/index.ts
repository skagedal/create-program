import c from 'cmd-ts';
import fs from 'fs/promises'
import paths from 'node:path';

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

async function writeMain(path: string) {
  await fs.mkdir(paths.join(path, 'bin'), { recursive: true });
  await fs.writeFile(paths.join(path, 'bin', 'index.mjs'), 'console.log("Hello, world!")\n');
}

export async function runCreateProgram(path: string) {
  await fs.mkdir(path, { recursive: true });
  const packageName = paths.basename(paths.resolve(path));
  const originalPackageJson = await readPackageJson(path);
  const packageJson = {
    name: packageName,
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

async function mainAsync() {
  const cmd = c.command({
    name: 'create-program',
    description: 'Create a new program',
    args: {
      path: c.option({
        long: 'path',
        type: c.string
      })
    },
    handler: async (args) => {
      await runCreateProgram(args.path);
    }
  })

  await c.run(cmd, process.argv.slice(2));
}

export function main() {
  mainAsync().then(() => {});
}
