# create-program

This is a scaffolding tool to create a simple [Node.js](https://nodejs.org/en) program written in [TypeScript](https://www.typescriptlang.org/), utilizing [ECMAScript Modules](https://nodejs.org/api/esm.html) (ESM) and using [Jest](https://jestjs.io/) as a test suite. The tool came out of my own frustration with setting all this up, and can be used for starting up simple command-line apps, or any Node.js app really.

(A "program" is what we used to call "apps" back in the day. And yeah, `create-app` was taken.)

## Usage

Create a directory for your project and run the following command in it:

```bash
npm create program@latest
```

Using `@latest` ensures that you get the latest version of the tool published on `npm`; otherwise `npm` may use whatever version it finds locally; which you may be fine with. I am skipping `@latest` in the following examples for brevity.

You can also specify the directory where it will be created.

```bash
npm create program --path ~/code/my-new-project
```

It will use the directory name as the project name, but you can specify a different name with the `--name` option.

```bash
npm create program --name name-of-my-new-project
```

For other options, run:

```bash
npm create program --help
```

## Alternative approaches

- The Node.js documentation has a [getting started](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript) page
  for how to set up a TypeScript project. There they mention the usage of the `--loader` flag, like `node --loader=ts-node/esm example.ts`,
  I have a working example [here](https://github.com/skagedal/scratchpad/tree/main/node-js-with-typescript-loader) – however, this prints a nasty warning that this flag is experimental and might be removed in the future. Instead, there is an `--import` flag that should be used. This is being discussed in [this issue](https://github.com/nodejs/node/issues/51196). I have a working example of how to get this variant working [here](https://github.com/skagedal/scratchpad/tree/main/node-js-with-register-tsesm).

  I am not sure if this kind of approach is really worth it, and the `ts-node` project seems to not be very actively maintained.

- [node-typescript-boilerplate](https://github.com/jsynowiec/node-typescript-boilerplate) is a nice
  and updated boilerplate project, which I took some inspiration from.
- [Using TypeScript Node.js with native ESM](https://gist.github.com/slavafomin/cd7a54035eff5dc1c7c2eff096b23b6b)
  is a good reference guide on how things should be set up.
- Other "project starter" kind of things are [here](https://github.com/dzharii/awesome-typescript?tab=readme-ov-file#typescript-project-starters).
- I have understood that other JavaScript runtimes like [Deno](https://deno.com/) and
  [Bun](https://bun.sh/) simplify a lot of this process, if you don't have the requirement of sticking with Node.js.
- Obviously, there are many "starter" kind of projects for more full fledged applications using a particular framework, like
  [create-react-app](https://create-react-app.dev/) (which I think is pretty much abandoned, though), [create-next-app](https://nextjs.org/docs/api-reference/create-next-app), [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) and so on. For CLI apps, you can also try [oclif](https://oclif.io/).
