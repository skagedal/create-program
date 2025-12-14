/**
 * @fileoverview Handles CLI parsing and execution.
 */

import * as c from 'cmd-ts';
import { runCreateProgram, TestRunner } from './createProgram.js';

const testRunnerType: c.Type<string, TestRunner> = {
  async from(str) {
    if (str === 'jest' || str === 'nodejs') {
      return str;
    }
    throw new Error(`Invalid test runner: ${str}. Must be 'jest' or 'nodejs'.`);
  },
};

async function mainAsync() {
  const cmd = c.command({
    name: 'create-program',
    description: 'Create a new program',
    args: {
      path: c.option({
        long: 'path',
        type: c.string,
        description: 'the path to the directory where the program will be created',
        defaultValue: () => '.',
        defaultValueIsSerializable: true,
      }),
      name: c.option({
        long: 'name',
        description: 'the name of the program',
        type: c.optional(c.string),
      }),
      testRunner: c.option({
        long: 'test-runner',
        description: 'the test framework to use (jest or nodejs)',
        type: testRunnerType,
        defaultValue: () => 'jest' as TestRunner,
        defaultValueIsSerializable: true,
      }),
      quiet: c.flag({
        long: 'quiet',
        description: 'suppress output',
        defaultValue: () => false,
        defaultValueIsSerializable: true,
      }),
    },
    handler: async (args) => {
      await runCreateProgram(args);
    }
  })
  
  await c.run(cmd, process.argv.slice(2));
}

export function main() {
  mainAsync().then(() => {});
}
