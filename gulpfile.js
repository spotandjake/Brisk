/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import crypto from 'crypto';
import gulp from 'gulp';
import * as rollup from 'rollup';
import rollupTypescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';
import progress from 'rollup-plugin-progress';
import eslint from 'gulp-eslint';
import pkg from 'pkg';
import { exec } from 'child_process';
const rollup_plugins = [
  rollupTypescript(),
  progress(),
  visualizer(),
];
const rollup_input_options = {
  external: [ 'path', 'fs', 'crypto', 'nearley', 'tslib', 'binaryen', '@iarna/toml' ],
};
const rollup_output_options = {
  format: 'es',
  compact: false,
  sourcemap: true,
  indent: '  ',
  preferConst: true,
};
gulp.task('build', async () => {
  // Compile Nearley
  exec('nearleyc ./src/compiler/Grammar/Brisk.ne -o ./src/compiler/Grammar/Brisk.ts');
  // Compile TypeScript
  const bundle = await rollup.rollup({
    input: './src/cli/index.ts',
    plugins: rollup_plugins,
    ...rollup_input_options
  });
  // Generate Checksum
  const { output:[outputCode] }= await bundle.generate({
    file: './dist/brisk.js',
    name: 'brisk',
    ...rollup_output_options
  });
  let code = outputCode.code;
  // Replace Compile Time Values
  code = code.replaceAll('BRISK$CHECKSUM', crypto.createHash('md5').update(code, 'utf8').digest('hex'));
  code = code.replaceAll('BRISK$COMPILEDATE', new Date().toDateString());
  code += '\n//# sourceMappingURL=brisk.js.map';
  // Write File
  await fs.promises.writeFile('./dist/brisk.js', code);
  // Write Source Map
  await fs.promises.writeFile('./dist/brisk.js.map', JSON.stringify(outputCode.map));
});
gulp.task('build-tests', async () => {
  // Compile TypeScript
  const bundle = await rollup.rollup({
    input: './src/unit testing/index.ts',
    plugins: rollup_plugins,
    ...rollup_input_options
  });
  await bundle.write({
    file: './dist/brisk-tests.js',
    name: 'brisk-tests',
    ...rollup_output_options
  });
  // Make Checksum
  // Write File
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
gulp.task('package', async () => {
  gulp.series('lint', 'build')();
  await pkg.exec(['./dist/brisk.js', '--target', 'node16', '--output', 'brisk.exe']);
});