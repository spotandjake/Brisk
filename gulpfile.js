/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require('gulp');
const rollup = require('rollup');
const rollupTypescript = require('@rollup/plugin-typescript');
const eslint = require('gulp-eslint');
const { exec } = require('child_process');

gulp.task('build', async () => {
  // Compile Nearley
  exec('nearleyc ./src/compiler/Grammar/Brisk.ne -o ./src/compiler/Grammar/Brisk.ts');
  // Compile TypeScript
  const bundle = await rollup.rollup({
    input: './src/cli/index.ts',
    plugins: [
      rollupTypescript()
    ],
    external: [ 'commander', 'path', 'fs', 'nearley', 'moo', 'tslib' ]
  });

  await bundle.write({
    file: './dist/brisk.js',
    format: 'cjs',
    name: 'brisk',
    sourcemap: true
  });
});
gulp.task('lint', () => {
  return gulp.src(['src/**/*.{js,ts,json}'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});