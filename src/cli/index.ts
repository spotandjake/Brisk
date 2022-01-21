// Main Cli entry point
// Imports
import { Command } from 'commander';
import { promises as fs } from 'fs';
import compile from '../Compiler/index';
//@ts-ignore
import { __VERSION__ } from '@brisk/config';
// Commander Setup
const program = new Command();
// Config
program.version(__VERSION__);
// Tasks
program.argument('<file>', 'File to compile').action(async (file) => {
  // Compile
  const fileContent = await fs.readFile(file, 'utf8');
  const output = compile(fileContent, file);
  // Link
  // Module
  console.log('================================================================');
  console.dir(output, { depth: null });
});
// Start
program.parse(process.argv);
