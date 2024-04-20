
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

export async function runCreateProgram(path: string) {
  const originalPackageJson = await readPackageJson(path);
  const packageJson = {
    name: 'hello-world',
    packageManager: 'yarn@4.1.1',
    ...originalPackageJson,
  };
  await writePackageJson(path, packageJson);
}

export async function main() {
  await runCreateProgram('.');
}