import babel from 'rollup-plugin-babel';
import builtinModules from 'builtin-modules';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import typescriptRelativePaths from '@zerollup/ts-transform-paths';

const external = [
  ...builtinModules,
  '@saschazar/mdx-extended-loader',
  '@saschazar/mdx-extended-loader/parser',
  'fs-extra',
  'gray-matter',
  'globby',
  'param-case',
];

const globals = {};

const config = {
  external,
  input: 'src/index.ts',
  plugins: [
    nodeResolve(),
    commonjs({
      exclude: /node_modules/,
      sourceMap: false,
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      cacheRoot: '.cache',
      transformers: [service => typescriptRelativePaths(service.getProgram())],
    }),
    babel({ extensions: ['.ts'] }),
  ],
};

export default [
  {
    ...config,
    output: [
      {
        file: 'index.js',
        format: 'cjs',
        globals,
      },
    ],
  },
  {
    ...config,
    plugins: [...config.plugins, terser()],
    output: [
      {
        file: 'index.min.js',
        format: 'cjs',
        globals,
      },
    ],
  },
];
