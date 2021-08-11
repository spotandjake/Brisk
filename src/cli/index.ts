// Modules
import path from 'path';
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
      const max_size = Math.max(...commands.map((cmd) => (Array.isArray(cmd.syntax) ? cmd.syntax.join(','): cmd.syntax).length));
      console.log([
        'Usage: brisk [options] [command] <file>',
        '',
        'Options:',
        '  -h, --help     display help for command',
        '  -v, --version  displays the current compiler version',
        '',
        'Commands:',
        ...commands.map(({ syntax, description }: Command) => {
          const prefix = Array.isArray(syntax) ? syntax.join(',') : syntax;
          return `  ${prefix}${' '.repeat(max_size - prefix.length)}  ${description}`;
        })
      ].join('\n'));
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
    action: (commands: Command[], options: string[], { file }: { file: string }) => compile(path.join(process.cwd(), file), {})
  },
  {
    name: 'compile',
    syntax: 'compile <file> [f]',
    description: 'compile brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => compile(path.join(process.cwd(), file), {})
  },
  {
    name: 'run',
    syntax: 'run <file>',
    description: 'compile & run brisk file',
    action: async (commands: Command[], options: string[], { file }: { file: string }) => runner(await compile(path.join(process.cwd(), file), { wat: false }))
  },
  {
    name: 'wasmRun',
    syntax: 'wasmRun <file>',
    description: 'run a compiled brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => runner(path.join(process.cwd(), file))
  }
];
Commander(commands)(process.argv);