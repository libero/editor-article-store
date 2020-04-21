import { terser } from 'rollup-plugin-terser';
import { default as copy } from 'rollup-plugin-copy';

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
    ],
    plugins: [
      copy({
        targets: [
          { src: 'resources/articles', dest: ['dist/debug', 'dist/release'] }
        ]
      })
    ]
  }
];
