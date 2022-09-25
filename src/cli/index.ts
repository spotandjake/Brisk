// Main Cli entry point
// Imports
import { ExportMap } from '../Compiler/Types/AnalyzerNodes';
import { Command } from 'commander';
import fs from 'fs';
import path from 'path';
import compile from '../Compiler/index';
import linkProgram from '../Linker/index';
import Runner from '../Runner/index';
import { BriskCustomError } from '../Compiler/Errors/Compiler';
//@ts-ignore
import { __VERSION__ } from '@brisk/config';
// Commander Setup
const program = new Command();
// Config
program.version(__VERSION__);
// Options
program.option('-v, --version', 'output CLI, Compiler and LSP versions');
// File Compiler
const compileFile = async (
  basePath: string,
  filePath: string
): Promise<{ output: Uint8Array; exports: ExportMap; compiledPath: string }> => {
  // Normalize File Path
  const _filePath = path.isAbsolute(filePath) ? filePath : path.resolve(basePath, filePath);
  // Read File
  const fileContent = await fs.promises.readFile(_filePath, 'utf8').catch(() => {
    return BriskCustomError('', 'Error', `No Such File ${filePath} Could Be Found At ${_filePath}`);
  });
  // Compile File
  const compiled = await compile(fileContent, path.dirname(_filePath), filePath, compileFile);
  // Generate Compiled Path
  const compiledPath = path.relative(
    basePath,
    path.join(
      path.dirname(_filePath),
      `${path.basename(_filePath, path.extname(_filePath))}.br.wasm`
    )
  );
  const outPath = path.resolve(basePath, compiledPath);
  // Save File
  await fs.promises.writeFile(outPath, compiled.output);
  // Return ExportList
  return {
    ...compiled,
    compiledPath: compiledPath,
  };
};
// Tasks
program
  .command('compile <file>')
  .description('Compile A Given Brisk File')
  .action(async (filePath: string) => {
    // Compile
    const { output } = await compileFile(process.cwd(), filePath);
    // Log Output
    console.log('================================================================');
    console.dir(output, { depth: null });
    // Link
  });
program.argument('<file>', 'File to compile').action(async (filePath: string) => {
  // Compile
  const { output, compiledPath } = await compileFile(process.cwd(), filePath);
  // Link The Program
  const linked = await linkProgram(output, compiledPath);
  await fs.promises.writeFile(compiledPath, linked);
  // Run
  Runner(linked);
});
// Start
program.parse(process.argv);
