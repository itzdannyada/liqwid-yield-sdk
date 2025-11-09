const babel = require('@rollup/plugin-babel');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const url = require('@rollup/plugin-url');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');
const postcss = require('rollup-plugin-postcss');

const config = {
  input: 'src/widget/index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      exports: 'named',
      sourcemap: true
    },
    {
      file: 'dist/liqwid-yield-widget.umd.js',
      format: 'umd',
      name: 'LiqwidYieldWidget',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-dom/client': 'ReactDOM'
      },
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      preferBuiltins: false
    }),
    url({
      include: ['**/*.avif', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
      limit: 500 * 1024, // 500KB limit for inlining (increased to handle larger images)
      emitFiles: false // Don't emit separate files, always inline as base64
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx']
    }),
    commonjs({
      transformMixedEsModules: true
    }),
    // Inject CSS into JS instead of extracting it
    postcss({
      extract: false, // This injects CSS into the JS bundle
      inject: true,   // Automatically inject styles into <head>
      minimize: true
    }),
    terser(),
    // Copy type definitions after build
    {
      name: 'copy-types',
      writeBundle() {
        const fs = require('fs');
        const path = require('path');
        try {
          fs.copyFileSync(
            path.join(__dirname, 'src/widget/index.d.ts'),
            path.join(__dirname, 'dist/index.d.ts')
          );
          console.log('✅ Type definitions copied to dist/index.d.ts');
        } catch (err) {
          console.warn('⚠️ Could not copy type definitions:', err.message);
        }
      }
    }
  ],
  external: ['react', 'react-dom', 'react-dom/client']
};

module.exports = config;