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
        defaultValue: () => '.',
        defaultValueIsSerializable: true,
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
