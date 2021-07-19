// Modules
import * as path from 'path';
import * as fs from 'fs';
import { Commander, Command } from './command/index';
// Import Components
import compile from '../compiler/index';
import runner from '../runner/runner';
// TODO: add flag to compile to wasm instead of wat
const commands: Command[] = [
  {
    name: 'help',
    syntax: [
      '-h', '--help'
    ],
    description: 'display help for command',
    action: (commands: Command[]) => {
      console.log('Usage: brisk [options] [command] <file>');
      console.log('');
      console.log('Options:');
      console.log('  -h, --help     display help for command');
      console.log('  -h, --version  displays the current compiler version');
      console.log('');
      console.log('Commands:');
      console.log('');
      const max_size = Math.max(...commands.map((cmd) => (Array.isArray(cmd.syntax) ? cmd.syntax.join(','): cmd.syntax).length));
      commands.forEach((command: Command) => {
        const prefix = Array.isArray(command.syntax) ? command.syntax.join(','): command.syntax;
        console.log(`  ${prefix}${' '.repeat(max_size - prefix.length)}  ${command.description}`);
      });
    }
  },
  {
    name: 'version',
    syntax: [
      '-v', '--version'
    ],
    description: 'output the version number',
    action: () => console.log('0.0.4')
  },
  {
    name: 'main',
    syntax: '<file>',
    description: 'compiles the main brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => compile(path.join(process.cwd(), file), true, true)
  },
  {
    name: 'compile',
    syntax: 'compile <file> [f]',
    description: 'compile brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => console.log(`compile: ${file}`)
  },
  {
    name: 'run',
    syntax: 'run <file>',
    description: 'compile & run brisk file',
    action: async (commands: Command[], options: string[], { file }: { file: string }) => {
      const compiled = await compile(path.join(process.cwd(), file), false, false);
      await fs.promises.writeFile(path.join(process.cwd(), file).replace(/\.[^.]+$/, '.wasm'), <Uint8Array>compiled);
      // Run the runner
      runner(path.join(process.cwd(), file).replace(/\.[^.]+$/, '.wasm'));
    }
  },
  {
    name: 'wasmRun',
    syntax: 'wasmRun <file>',
    description: 'run a compiled brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => {
      // Run the runner
      runner(path.join(process.cwd(), file));
    }
  }
];

const parse = Commander(commands);
parse(process.argv);