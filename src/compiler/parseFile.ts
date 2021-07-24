// Import needed files
import * as fs from 'fs';
import * as path from 'path';
// Import types
import { Program, ProgramNode } from './Grammar/Types';
// Import Components
import { BriskError } from './Helpers/Errors';
import Parser from './Parser/Parser';
import Analyzer from './Stages/Analyzer';
import Verifier from './Stages/BriskVerifier';

const ParseFile = (filename: string): Program => {
  // Check if file exists
  const exists: boolean = fs.existsSync(filename);
  if (!exists) throw new Error(`${filename} does not exist`);
  // Determine info on the program
  const ProgramPath = path.parse(filename);
  // Read File
  const code: string = fs.readFileSync(filename, 'utf-8');
  // Parse the Code
  const parsed: ProgramNode = Parser(filename, code);
  if (parsed == undefined) BriskError('program is empty');
  // Analyze the Code
  const analyzed: Program = Analyzer(ProgramPath, parsed);
  // Verify Tree
  Verifier(analyzed);
  // Perform Module Linking
  return analyzed;
};

export default ParseFile;