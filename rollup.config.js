import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import flow from 'rollup-plugin-flow'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
  output = { file: `dist/react-final-form-listeners.es.js`, format: 'es' }
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/react-final-form-listeners.umd.min.js`,
      format: 'umd'
    }
  } else {
    output = { file: `dist/react-final-form-listeners.umd.js`, format: 'umd' }
  }
} else if (cjs) {
  output = { file: `dist/react-final-form-listeners.cjs.js`, format: 'cjs' }
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default {
  input: 'src/index.js',
  output: Object.assign(
    {
      name: 'react-final-form-listeners',
      exports: 'named',
      globals: {
        react: 'React',
        'prop-types': 'PropTypes',
        'final-form': 'FinalForm',
        'react-final-form': 'ReactFinalForm'
      }
    },
    output
  ),
  external: ['react', 'prop-types', 'final-form', 'react-final-form'],
  plugins: [
    resolve({ jsnext: true, main: true }),
    flow(),
    commonjs({ include: 'node_modules/**' }),
    babel({
      exclude: 'node_modules/**',
      plugins: [['@babel/plugin-transform-runtime', { useESModules: !cjs }]],
      runtimeHelpers: true
    }),
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development'
          )
        })
      : null,
    minify ? uglify() : null
  ].filter(Boolean)
}
