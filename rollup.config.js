import { terser } from 'rollup-plugin-terser';

export default [
  {
    input: 'dist/debug/index.js',
    external: [ 'express', 'fs', 'path' ],
    output: [
      {
        file: 'dist/release/bundle.min.js',
        format: "cjs",
        plugins: [terser()]
      }
    ]
  }
];
