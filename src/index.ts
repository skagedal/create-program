import * as c from 'cmd-ts';
import { runCreateProgram } from './createProgram.js';

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
