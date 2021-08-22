import fs from 'fs';
import crypto from 'crypto';
import gulp from 'gulp';
import * as rollup from 'rollup';
import rollupTypescript from '@rollup/plugin-typescript';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import eslint from 'gulp-eslint';
import pkg from 'pkg';
import { exec } from 'child_process';
const rollup_plugins = [
  rollupTypescript({
    cacheDir: './dist/cache/'
  }),
  terser({
    compress: {
      passes: 3,
      module: true
    },
    format: {
      beautify: true,
      // max_line_len: 500,
      quote_style: 1, //Always Single
      indent_level: 2
    }
  }),
  progress(),
  visualizer(),
];
const rollup_input_options = {
  external: [ 'path', 'fs', 'crypto', 'nearley', 'tslib', 'binaryen', '@iarna/toml' ],
};
const rollup_output_options = {
  format: 'es',
  compact: true,
  sourcemap: true,
  indent: '  ',
  preferConst: true
};
gulp.task('build', async () => {
  // Compile Nearley
  exec('nearleyc ./src/Brisk/Compiler/FrontEnd/Parser/Brisk.ne -o ./src/Brisk/Compiler/FrontEnd/Parser/Brisk.ts');
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
  // OutPut Some Stats
  const oldCode = fs.existsSync('./dist/brisk.js') ? await fs.promises.readFile('./dist/brisk.js', 'utf-8') : '';
  const previousStats = {
    chars: oldCode.length,
    lines: oldCode.split('\n').length,
    blanks: oldCode.split('\n').filter(n => n.trim() == '').length,
    comments: oldCode.split('\n').filter(n => n.trim().startsWith('//')).length
  };
  const stats = {
    chars: code.length,
    lines: code.split('\n').length,
    blanks: code.split('\n').filter(n => n.trim() == '').length,
    comments: code.split('\n').filter(n => n.trim().startsWith('//')).length
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
      chars: previousStats.chars-code.length,
      lines: previousStats.lines-code.split('\n').length,
      blanks: previousStats.blanks-code.split('\n').filter(n => n.trim() == '').length,
      comments: previousStats.comments-code.split('\n').filter(n => n.trim().startsWith('//')).length,
      code: (previousStats.lines-previousStats.blanks-previousStats.comments)-(stats.lines-stats.blanks-stats.comments)
    }
  });
  // Write File
  await fs.promises.writeFile('./dist/brisk.js', code);
  // Write Source Map
  await fs.promises.writeFile('./dist/brisk.js.map', JSON.stringify(outputCode.map));
});
gulp.task('build-tests', async () => {
  // Compile TypeScript
  const bundle = await rollup.rollup({
    input: './src/tests/index.ts',
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
  await pkg.exec(['./dist/brisk.js', '--target', 'node16', '--output', './dist/brisk.exe']);
});
// Documentation Commands
gulp.task('fileTree', async () => {
  // Get the old map
  const oldMap = await fs.promises.readFile('./map.md', 'utf-8');
  // Gather the files
  const walk = async (dist, ignore) => {
    const fileList = await fs.promises.readdir(dist, { withFileTypes: true });
    const m = [];
    for (const f of fileList) {
      if (ignore.includes(f.name) && !f.isDirectory()) continue;
      if (ignore.includes(f.name) && f.isDirectory()) {
        m.push({
          name: f.name,
          content: [],
          type: 'Folder',
          state: 'Unknown'
        });
      } else if (f.isDirectory()) {
        m.push({
          name: f.name,
          content: await walk(`${dist}/${f.name}`, ignore),
          type: 'Folder',
          state: 'Unknown'
        });
      } else {
        m.push({
          name: f.name,
          content: [],
          type: 'File',
          state: 'Unknown'
        });
      }
    }
    return m.sort((a, b) => {
      if (a.type == 'Folder' && b.type == 'Folder') return a.name.localeCompare(b.name);
      else if (a.type == 'Folder' && b.type != 'Folder') return -1;
      else if (b.type == 'Folder' && a.type != 'Folder') return 1;
      else return a.name.localeCompare(b.name);
    });
  };
  const newMap = await walk('.', [ 'node_modules', 'dist', '.vscode', '.github', '.git', 'testing' ]);
  // Map Helpers
  const generateMap = (dir, options = { level: 0, indent: '   ', prefix: '' }) => {
    // Generate the map
    let output = '';
    dir.forEach((node, index) => {
      const last = index == dir.length-1;
      // Resolve State
      if (node.state == 'Addition') output += '+';
      else if (node.state == 'Subtraction') output += '-';
      else if (node.state == 'Unknown') output += ' ';
      // Resolve the structure
      output += `${options.prefix}${last ? '└──' : '├──'} ${node.name}\n`;
      if (node.type == 'Folder') {
        // Add the folder
        if (node.content.length == 0) node.content.push({ ...node, name: '', type: 'File'});
        output += generateMap(node.content, {
          ...options,
          level: options.level + 1,
          prefix: `${options.prefix}${last ? ' ' : '│'}${options.indent}`
        });
      }
    });
    return output;
  };
  const parseMap = (m, options = { diffs: false }) => {
    const lines = m.split('\n').filter(n => n);
    const tree = [];
    let i = 0;
    // Parse the map
    lines.forEach((line, index) => {
      if (i != index) return;
      const node = {
        name: '',
        content: [],
        type: 'File',
        state: 'Unknown'
      };
      if (options.diffs) { // Parse node diff
        const diff = line[0];
        if (diff == ' ') node.state = 'Unknown';
        else if (diff == '+') node.state = 'Addition';
        else if (diff == '-') node.state = 'Subtraction';
      }
      // Parse the Name
      node.name = (line.match(/(?<=├── |└── )[^\n]*/) ?? [ '' ])[0];
      // Parse the Type
      if (index != lines.length-1) {
        const nextLine = lines[index+1];
        const nextName = (nextLine.match(/(?<=├── |└── )[^\n]*/) ?? [ '' ])[0];
        if (nextLine.length-nextName.length > line.length-node.name.length) {
          const folderDepth = line.length-node.name.length;
          // Parse the contents
          let folderEnd = index;
          let n = 0;
          for (const nextLine of lines.slice(index+1)) {
            n++;
            const nextName = (nextLine.match(/(?<=├── |└── )[^\n]*/) ?? [ '' ])[0];
            folderEnd++;
            if (folderDepth >= nextLine.length-nextName.length) break;
            else if (n == lines.slice(index+1).length) folderEnd++;
          }
          const folderContent = lines.slice(index+1, folderEnd).join('\n');
          node.content = parseMap(folderContent, options);
          node.type = 'Folder';
          i = folderEnd;
        } else i = index+1;
      }
      // Push node to tree
      tree.push(node);
    });
    return tree.sort((a, b) => {
      if (a.type == 'Folder' && b.type == 'Folder') return a.name.localeCompare(b.name);
      else if (a.type == 'Folder' && b.type != 'Folder') return -1;
      else if (b.type == 'Folder' && a.type != 'Folder') return 1;
      else return a.name.localeCompare(b.name);
    });
  };
  // Parse the old map
  const _OldTree = parseMap(oldMap, { diffs: true });
  // Compare the maps
  const compareTree = (a, b) => {
    a.forEach((node) => {
      let found = false;
      let foundNode = null;
      b.forEach((_node) => {
        if (
          _node.name.trim() == node.name.trim() &&
          _node.type == node.type
        ) {
          found = true;
          foundNode = _node;
        }
      });
      if (!found) {
        if (node.state != 'Subtraction') node.state = 'Unknown';
        if (node.type == 'Folder') node.content = compareTree(node.content, []);
      } else if (found) {
        node.state = 'Addition';
        if (node.type == 'Folder') node.content = compareTree(node.content, foundNode.content);
      }
      if (node.type == 'Folder' && node.content.length == 1 && node.content[0].name.trim() == '')
        node.content[0].state = node.state;
    });
    b.forEach((node) => {
      let found = false;
      a.forEach((_node) => {
        if (
          _node.name.trim() == node.name.trim() &&
          _node.type == node.type
        ) {
          found = true;
        }
      });
      if (!found) {
        node.state = 'Subtraction';
        if (node.type == 'Folder') a.unshift(node);
        else a.push(node);
      }
    });
    return a;
  };
  // Generate the new map
  const _DifferenceMap = generateMap(compareTree(newMap, _OldTree));
  // Color the printed output
  _DifferenceMap.split('\n').forEach((line) => {
    let out = '';
    switch(line[0]) {
      case '+':
        out = '\x1b[1m\x1b[32m';
        break;
      case '-':
        out = '\x1b[1m\x1b[31m';
        break;
      case ' ':
        break;
    }
    console.log(`${out}${line.slice(1)}\x1b[0m`);
  });
});