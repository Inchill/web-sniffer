import dts from 'rollup-plugin-dts'
import typescript from 'rollup-plugin-typescript2'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from './package.json' assert { type: 'json' }
import terser from '@rollup/plugin-terser'
import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: path.resolve(__dirname, `./dist/${pkg.name}.esm.js`),
        format: 'es',
        name: 'WebSniffer'
      },
      {
        file: path.resolve(__dirname, `./dist/${pkg.name}.cjs.js`),
        format: 'cjs',
        name: 'WebSniffer'
      }
    ],
    plugins: [typescript(), terser({
      format: {
        beautify: true,
        braces: true
      }
    }),]
  },
  {
    input: './src/index.ts',
    output: {
      file: path.resolve(__dirname, `./dist/${pkg.name}.js`),
      format: 'umd',
      name: 'WebSniffer'
    },
    plugins: [nodeResolve(), typescript(), babel({
      exclude: /node_modules/,
      extensions: ['.js', '.ts'],
      babelHelpers: 'runtime',
      plugins: [['@babel/plugin-transform-runtime']]
    })]
  },
  {
    input: './src/index.ts',
    output: {
      file: path.resolve(__dirname, `./dist/${pkg.name}.min.js`),
      format: 'umd',
      name: 'WebSniffer'
    },
    plugins: [
      nodeResolve(),
      typescript(),
      terser(),
      babel({
        exclude: /node_modules/,
        extensions: ['.js', '.ts'],
        babelHelpers: 'runtime',
        plugins: [['@babel/plugin-transform-runtime']]
      })
    ]
  },
  {
    input: './src/types/index.ts',
    output: {
      file: path.resolve(__dirname, `./dist/${pkg.name}.d.ts`),
      format: 'es'
    },
    plugins: [dts()]
  }
]
