import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';

import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;
const name = pkg.name
  .replace(/^(@\S+\/)?(svelte-)?(\S+)/, '$3')
  .replace(/^\w/, (m) => m.toUpperCase())
  .replace(/-\w/g, (m) => m[1].toUpperCase());
1;

export default {
  input: 'src/Component.svelte',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: production,
    },
    {
      name,
      file: pkg.main,
      format: 'umd',
      sourcemap: production,
    },
  ],
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      compilerOptions: {
        dev: !production,
        cssHash: ({ hash, css }) => `s-${hash(css)}`,
      },
    }),
    scss(),
    resolve({ browser: true, dedupe: ['svelte'] }),
    commonjs(),
    typescript({ sourceMap: true }),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
