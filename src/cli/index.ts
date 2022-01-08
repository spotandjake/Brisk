// Main Cli entry point
// Imports
import { Command } from 'commander';
import { promises as fs } from 'fs';
import compile from '../Compiler/index';
// Commander Setup
const program = new Command();
// Config
program.version('0.0.1'); // TODO: get this automatically from a config file
// Tasks
program
  .argument('<file>', 'File to compile')
  .action(async (file) => {
    console.log('files:', file);
    // TODO: resolve file to the proper directory
    // Compile
    const fileContent = await fs.readFile(file, 'utf8');
    const output = compile(fileContent, file);
    // Link
    // Module
    console.log(output);
    console.log('================================================================');
    console.dir(output, { depth: null });
  });
// Start
program.parse(process.argv);