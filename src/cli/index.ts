// Modules
import * as path from 'path';
import * as fs from 'fs';
import { Command } from './command/index';
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
  .command('compile <file>')
  .description('compile Brisk Program')
  .action((file: string) => {
    console.log('compiling');
    console.log(file);
  });
program
  .command('lsp <file>')
  .description('Run Brisk lsp')
  .action((file: string) => {
    console.log('lsp');
    console.log(file);
  });
program
  .command('run <file>')
  .description('run brisk file')
  .action(async (file: string) => {
    const compiled = await compile(path.join(process.cwd(), file), false, false);
    await fs.promises.writeFile(path.join(process.cwd(), file).replace(/\.[^.]+$/, '.wasm'), <Uint8Array>compiled);
    // Run the runner
    runner(path.join(process.cwd(), file).replace(/\.[^.]+$/, '.wasm'));
  });
program
  .command('wasmrun <file>')
  .description('run brisk file')
  .action(async (file: string) => {
    // Run the runner
    runner(path.join(process.cwd(), file));
  });
// default is compiler & run
// TODO: add flag to compile to wasm instead of wat
program
  .arguments('<file>')
  .action((file: string): any => compile(path.join(process.cwd(), file), true, true));
// Parse
program.parse(process.argv);