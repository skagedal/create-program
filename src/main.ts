
import fs from 'fs/promises'

type ProjectPackageJson = {
  name: string;
}

async function readPackageJson(): Promise<ProjectPackageJson | undefined> {
  try {
    const packageJson = await fs.readFile('package.json', 'utf8');
    return JSON.parse(packageJson) as ProjectPackageJson;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return undefined;
    } else {
      throw error;
    }
  }
}

export async function main() {
    console.log('Reading package.json...');
    const packageJson = await readPackageJson();
    if (packageJson !== undefined) {
      console.log('Package name:', packageJson?.name);
    } else {
      console.log('No package.json found');
    }
}