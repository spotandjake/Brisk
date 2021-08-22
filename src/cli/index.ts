// Modules
import path from 'path';
import { Commander, Command } from './command/index';
// Import Components
import compile from '../v1/index';
import runner from '../runner/runner';
import compileV2 from '../Compiler/index';
// TODO: add flag to compile to wasm instead of wat
const resolvePath = (file: string) => path.join(process.cwd(), file);
const commands: Command[] = [
  {
    name: 'help',
    syntax: [
      '-h', '--help'
    ],
    description: 'display help for command',
    action: (commands: Command[]) => {
      const max_size = Math.max(...commands.map((cmd) => (Array.isArray(cmd.syntax) ? cmd.syntax.join(', '): cmd.syntax).length));
      console.log(
        `${'Usage: brisk [options] [command] <file>\n\n' +
        'Options:\n' +
        '  -h, --help     display help for command\n' +
        '  -v, --version  displays the current compiler version\n\n' +
        'Commands:'}${ 
          commands.map(({ syntax, description }: Command) => {
            const prefix = Array.isArray(syntax) ? syntax.join(', ') : syntax;
            return `  ${prefix}${' '.repeat(max_size - prefix.length)}  ${description}`;
          }).join('\n')}`
      );
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
    action: async (commands: Command[], options: string[], { file }: { file: string }) => await compileV2(resolvePath(file), {})
  },
  {
    name: 'compile',
    syntax: 'compile <file>',
    description: 'compile brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => compile(resolvePath(file), {})
  },
  {
    name: 'run',
    syntax: 'run <file>',
    description: 'compile & run brisk file',
    action: async (commands: Command[], options: string[], { file }: { file: string }) => runner(await compile(resolvePath(file), { wat: false }))
  },
  {
    name: 'wasmRun',
    syntax: 'wasmRun <file>',
    description: 'run a compiled brisk file',
    action: (commands: Command[], options: string[], { file }: { file: string }) => runner(resolvePath(file))
  }
];
Commander(commands)(process.argv);