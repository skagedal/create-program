#!/usr/bin/env node

import fs from 'fs/promises'

async function readPackageJson() {
  const packageJson = await fs.readFile('package.json', 'utf8');
  return JSON.parse(packageJson);
}

console.log('Greetings from create-program!');
console.log('Reading package.json...');
console.log(await readPackageJson());
