// Imports
import gulp from 'gulp';
import * as rollup from 'rollup';
import swc from './rollup-plugins/swc/index.js';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { wasm } from '@rollup/plugin-wasm';
import fs from 'fs';
import path from 'path';
// Configs
const compileTypeScriptFile = async (name, input, output, debug) => {
  // Read Configuration
  const config = JSON.parse(await fs.promises.readFile('./package.json', 'utf8'));
  // Compile
  const bundle = await rollup.rollup({
    input: input,
    external: ['commander', 'chevrotain', 'fs', '@jest/globals', 'wasi'],
    plugins: [
      wasm({
        targetEnv: 'auto-inline',
      }),
      swc({
        jsc: {
          minify: {
            mangle: true,
          },
          parser: {
            syntax: 'typescript',
          },
          target: 'es2022',
          transform: {
            constModules: {
              globals: {
                '@brisk/config': {
                  __DEBUG__: `${debug}`,
                  __VERSION__: `'${config.version}'`,
                },
              },
            },
          },
        },
        minify: true,
        sourceMaps: true,
      }),
      nodeResolve({
        extensions: ['.js', '.ts', '.mjs', '.json'],
        preferBuilitns: true,
        modulesOnly: true,
      }),
    ],
  });
  await bundle.write({
    file: output,
    format: 'es',
    name: name,
    compact: false,
    indent: '  ',
    generatedCode: {
      constBindings: true,
      objectShorthand: true,
    },
    sourcemap: true,
  });
};
// Gulp Tasks
gulp.task('build', async () => {
  // Get the size of the original bundle
  const oldCode = fs.existsSync('./dist/brisk.js')
    ? await fs.promises.readFile('./dist/brisk.js', 'utf-8')
    : '';
  const previousStats = {
    chars: oldCode.length,
    lines: oldCode.split('\n').length,
    blanks: oldCode.split('\n').filter((n) => n.trim() == '').length,
    comments: oldCode.split('\n').filter((n) => n.trim().startsWith('//')).length,
  };
  // Clean the original
  const folder = './dist';
  if (fs.existsSync(folder)) await fs.promises.rm(folder, { recursive: true });
  await fs.promises.mkdir(folder);
  // Build the Compiler
  await compileTypeScriptFile('brisk', './src/cli/index.ts', './dist/brisk.js', true);
  // Get new size
  const newCode = fs.existsSync('./dist/brisk.js')
    ? await fs.promises.readFile('./dist/brisk.js', 'utf-8')
    : '';
  const stats = {
    chars: newCode.length,
    lines: newCode.split('\n').length,
    blanks: newCode.split('\n').filter((n) => n.trim() == '').length,
    comments: newCode.split('\n').filter((n) => n.trim().startsWith('//')).length,
  };
  console.table({
    previous: {
      ...previousStats,
      code: previousStats.lines - previousStats.blanks - previousStats.comments,
    },
    current: {
      ...stats,
      code: stats.lines - stats.blanks - stats.comments,
    },
    reduction: {
      chars: previousStats.chars - newCode.length,
      lines: previousStats.lines - newCode.split('\n').length,
      blanks: previousStats.blanks - newCode.split('\n').filter((n) => n.trim() == '').length,
      comments:
        previousStats.comments -
        newCode.split('\n').filter((n) => n.trim().startsWith('//')).length,
      code:
        previousStats.lines -
        previousStats.blanks -
        previousStats.comments -
        (stats.lines - stats.blanks - stats.comments),
    },
  });
});
gulp.task('mock', async () => {
  // Clean the original
  const folder = './__tests__/dist';
  if (fs.existsSync(folder)) await fs.promises.rm(folder, { recursive: true });
  await fs.promises.mkdir(folder);
  // Build the Compiler
  await compileTypeScriptFile(
    'Brisk-Test-Data',
    './__tests__/Data.ts',
    './__tests__/dist/Data.js',
    false
  );
});
gulp.task('injectExtension', async () => {
  const extPath = path.join(
    process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'],
    '/.vscode/extensions/briskSupport'
  );
  // Move Extension To Extension Land
  if (fs.existsSync(extPath)) {
    await fs.promises.rm(extPath, { recursive: true });
  }
  await fs.promises.cp('./extension/', extPath, {
    recursive: true,
    force: true,
  });
});
