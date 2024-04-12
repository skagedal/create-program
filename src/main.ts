
import fs from 'fs/promises'

async function readPackageJson() {
  const packageJson = await fs.readFile('package.json', 'utf8');
  return JSON.parse(packageJson);
}

export async function main() {
    console.log('Reading package.json...');
    console.log(await readPackageJson());    
}