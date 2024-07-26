import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';
const packageJson = require('./package.json');

export default {
  input: './src/components/pages/editor.tsx',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      name: 'odoc_editor_v2',
      inlineDynamicImports: true,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true,
      inlineDynamicImports: true,
    }
  ],
  plugins: [
    alias({
      entries: [
        { find: 'stream', replacement: 'readable-stream' }
      ]
    }),
    json(),
    external(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss(),
    terser()
  ],
  external: [
    ...Object.keys(packageJson.peerDependencies || {}),
    ...Object.keys(packageJson.dependencies || {})
  ]
};
