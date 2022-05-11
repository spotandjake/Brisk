// Main Cli entry point
// Imports
import { Command } from 'commander';
import { promises as fs } from 'fs';
import path from 'path';
import compile from '../Compiler/index';
import { BriskCustomError } from '../Compiler/Errors/Compiler';
import { ExportList } from '../Compiler/Types/Types';
//@ts-ignore
import { __VERSION__ } from '@brisk/config';
// TODO: Remove this because it is just for testing
import testCompile from '../wasmBuilder/index';
// Commander Setup
const program = new Command();
// Config
program.version(__VERSION__);
// File Compiler
const compileFile = async (filePath: string): Promise<{ output: string; exports: ExportList }> => {
  // Normalize File Path
  const _filePath = path.resolve(process.cwd(), filePath);
  // Read File
  const fileContent = await fs.readFile(_filePath, 'utf8').catch((err) => {
    BriskCustomError('', 'Error', `No Such File ${filePath} Could Be Found At ${_filePath}`);
    process.exit(1);
  });
  // Compile File
  const compiled = await compile(fileContent, filePath, compileFile);
  // Save File
  // Return ExportList
  return compiled;
};
// Tasks
program.argument('<file>', 'File to compile').action(async (filePath) => {
  // Compile
  const { output } = await compileFile(filePath);
  // Log Output
  console.log('================================================================');
  console.dir(output, { depth: null });
  // Link
});
program.command('compileTest').action(async () => {
  await testCompile();
});
// Start
program.parse(process.argv);
