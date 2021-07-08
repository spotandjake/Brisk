// Modules
import * as path from 'path';
import { Command } from 'commander';
const program = new Command();

// Import Components
import compile from '../compiler/index';
import runner from '../runner/runner';
// cli info
program
  .version('0.0.3');
// Options
program
  .option('-v, --version', 'output CLI, Compiler and LSP versions');
// Commands
program
  .command('compile <file')
  .description('compile Brisk Program')
  .action((file: string) => {
    console.log('compiling');
    console.log(file);
  });
program
  .command('lsp <file')
  .description('Run Brisk lsp')
  .action((file: string) => {
    console.log('lsp');
    console.log(file);
  });
program
  .command('run <file')
  .description('run wasm file')
  .action((file: string) => {
    // Run the runner
    runner(path.join(process.cwd(), file));
  });
// default is compiler & run
// TODO: add flag to compile to wasm instead of wat
program
  .arguments('<file>')
  .action((file: string) => compile(path.join(process.cwd(), file)));
// Parse
program.parse(process.argv);