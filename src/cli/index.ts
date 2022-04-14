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
// Commander Setup
const program = new Command();
// Config
program.version(__VERSION__);
// File Compiler
const compileFile = async (filePath: string): Promise<ExportList> => {
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
  console.log('================================================================');
  console.dir(compiled.output, { depth: null });
  // Return ExportList
  return compiled.exports;
};
// Tasks
program.argument('<file>', 'File to compile').action(async (filePath) => {
  // Compile
  await compileFile(filePath);
  // Link
});
// Start
program.parse(process.argv);
