const babel = require('@rollup/plugin-babel');
const { dts } = require('rollup-plugin-dts');
const typescript = require('rollup-plugin-typescript2');
const babelConfig = require('./babel.config.js');
const pkg = require('./package.json');

const extensions = ['.ts', '.js'];

/**
 * @typedef {import('rollup').ModuleFormat} Format
 */

/**
 * @param {string} output
 * @param {Format} format
 */
function createDeclaration(output, format) {
  return {
    input: './src/index.ts',
    output: { file: output, format },
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: tsc.compilerOptions.baseUrl,
          paths: tsc.compilerOptions.paths,
        },
      }),
    ],
  };
}

/**
 * @param {string} output
 * @param {Format} format
 */
function createBuild(output, format) {
  return {
    input: './src/index.ts',
    output: {
      file: pkg.main,
      format: 'cjs',
      sourcemap: false,
    },

    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        clean: true,
      }),
      babel({
        ...babelConfig,
        babelHelpers: 'bundled',
        extensions,
      }),
    ],
  };
}

/** @type {import('rollup').RollupOptions[]} */
module.exports = [
  {
    input: './src/index.ts',
    output: { file: pkg.types, format: 'cjs' },
    plugins: [
      dts({
        compilerOptions: {
          baseUrl: tsc.compilerOptions.baseUrl,
          paths: tsc.compilerOptions.paths,
        },
      }),
    ],
  },
  createBuild(pkg.main, 'cjs'),
  createBuild(pkg.module, 'esm'),
];
