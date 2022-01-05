// Imports
import gulp from 'gulp';
import * as rollup from 'rollup';
import swc from 'rollup-plugin-swc';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import fs from 'fs';
// Configs
// Gulp Tasks
gulp.task('build', async () => {
  // Get the size of the original bundle
  const oldCode = fs.existsSync('./dist/brisk.js') ? await fs.promises.readFile('./dist/brisk.js', 'utf-8') : '';
  const previousStats = {
    chars: oldCode.length,
    lines: oldCode.split('\n').length,
    blanks: oldCode.split('\n').filter(n => n.trim() == '').length,
    comments: oldCode.split('\n').filter(n => n.trim().startsWith('//')).length
  };
  // Clean the original
  await gulp.series('clean')();
  // Build the Compiler
  const bundle = await rollup.rollup({
    input: './src/cli/index.ts',
    external: [ 'commander' ],
    plugins: [
      swc.default({
        jsc: {
          minify: {
            compress: true,
            mangle: true
          },
          parser: {
            syntax: 'typescript'
          },
          target: 'es2022'
        },
        minify: true,
        sourceMaps: true
      }),
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.json'],
        preferBuiltins: true,
        modulesOnly: true
      })
    ]
  });
  await bundle.write({
    file: './dist/brisk.js',
    format: 'es',
    name: 'brisk',
    compact: false,
    indent: '  ',
    preferConst: true,
    generatedCode: {
      constBindings: true,
      objectShorthand: true
    },
    sourcemap: true,
  });
  // Get new size
  const newCode = fs.existsSync('./dist/brisk.js') ? await fs.promises.readFile('./dist/brisk.js', 'utf-8') : '';
  const stats = {
    chars: newCode.length,
    lines: newCode.split('\n').length,
    blanks: newCode.split('\n').filter(n => n.trim() == '').length,
    comments: newCode.split('\n').filter(n => n.trim().startsWith('//')).length
  };
  console.table({
    previous: {
      ...previousStats,
      code: previousStats.lines-previousStats.blanks-previousStats.comments
    },
    current: {
      ...stats,
      code: stats.lines-stats.blanks-stats.comments
    },
    reduction: {
      chars: previousStats.chars-newCode.length,
      lines: previousStats.lines-newCode.split('\n').length,
      blanks: previousStats.blanks-newCode.split('\n').filter(n => n.trim() == '').length,
      comments: previousStats.comments-newCode.split('\n').filter(n => n.trim().startsWith('//')).length,
      code: (previousStats.lines-previousStats.blanks-previousStats.comments)-(stats.lines-stats.blanks-stats.comments)
    }
  });
});
gulp.task('clean', async () => {
  const folder = './dist';
  if (fs.existsSync(folder)) await fs.promises.rm(folder, { recursive: true });
  await fs.promises.mkdir(folder);
});