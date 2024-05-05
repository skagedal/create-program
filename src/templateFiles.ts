/**
 * @fileoverview Includes the contents of various fiels included in the created program.
 */

export const binRunner = 
`#!/usr/bin/env node

import { main } from '../build/src/index.js'
  
main();
`;

export const indexTs =
`import { greet } from './greet.js';

export function main() {
  console.log(greet({ name: 'world' }));
}
`;

export const greetTs =
`export interface Greetable {
  name: string
}

export function greet(greetable: Greetable) {
  return \`Hello, \${greetable.name}!\`
}
`;

export const tsConfig =
`{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": [
    "@tsconfig/node21/tsconfig.json"
  ],
  "compilerOptions": {
    "outDir": "build",
    "rootDir": ".",
    "sourceMap": true
  },
  "include": ["src/**/*", "__tests__/**/*"]
}
`;

export const tsConfigRelease =
`{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": false,
    "removeComments": true
  },
  "include": ["src/**/*"]
}
`;

export const jestConfig = 
`/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  testEnvironment: "node",
  preset: "ts-jest/presets/default-esm",
  transform: {
    '^.+\\.m?[tj]s?$': ['ts-jest', { useESM: true }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.(m)?js$': '$1',
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(m)?ts$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    'src/**/*.mts',
    '!src/**/*.d.ts',
    '!src/**/*.d.mts',
  ],
};

export default config;
`;
