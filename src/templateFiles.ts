/**
 * @fileoverview Includes the contents of various files included in the created program.
 */

export const binRunner = 
`#!/usr/bin/env node

import { main } from '../build/src/index.js'
  
main();
`;

export const indexTsJest =
`import { greet } from './greet.js';

export function main() {
  console.log(greet({ name: 'world' }));
}
`;

export const indexTsNodejs =
`import { greet } from './greet.ts';

export function main() {
  console.log(greet({ name: 'world' }));
}
`;

export const greetTs =
`export interface Greetable {
  name: string;
  isBirthday?: boolean;
}

export function greet(greetable: Greetable) {
  return \`Hello, \${greetable.name}!\`
}
`;

export const greetTestTsJest =
`import { greet } from "./greet.js";

describe('greeting', () => {
  it('should greet with name', () => {
    expect(greet({ name: 'world' })).toBe('Hello, world!');
  });

  it('should handle birthday greetings', () => {
    expect(greet({ name: 'world', isBirthday: true })).toBe('Happy birthday, world!');
  });
});
`;

export const greetTestTsNodejs =
`import { describe, it } from 'node:test';
import assert from 'node:assert';
import { greet } from "./greet.ts";

describe('greeting', () => {
  it('should greet with name', () => {
    assert.strictEqual(greet({ name: 'world' }), 'Hello, world!');
  });

  it('should handle birthday greetings', () => {
    assert.strictEqual(greet({ name: 'world', isBirthday: true }), 'Happy birthday, world!');
  });
});
`;

export const tsConfig =
`{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": [
    "@tsconfig/node24/tsconfig.json"
  ],
  "compilerOptions": {
    "outDir": "build",
    "rootDir": ".",
    "sourceMap": true
  },
  "include": ["src/**/*", "tests/**/*"]
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
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(m)?ts$',
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
