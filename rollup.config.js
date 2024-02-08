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
    plugins: [dts()],
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
      file: output,
      format: format,
      sourcemap: false,
      name: format === 'umd' ? 'Observable' : undefined,
    },

    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
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
  createDeclaration(pkg.types, 'cjs'),
  createBuild(pkg.exports['.'].require, 'cjs'),
  createBuild(pkg.exports['.'].module, 'esm'),
  createBuild(pkg.exports['.'].browser, 'umd'),
];
